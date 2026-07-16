import { supabase } from './supabaseClient'

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  topics: string[]
  stargazers_count: number
  forks_count: number
  created_at: string
  updated_at: string
  pushed_at: string
  owner: {
    login: string
    avatar_url: string
  }
}

export interface Project {
  id: string
  title: string
  description: string
  imageUrl: string
  github_url: string
  demo_url: string | null
  language: string | null
  stars: number
  forks: number
  topics: string[]
  created_at: string
}

/**
 * Fetch repositories from a GitHub user or organization
 * @param username - GitHub username or organization name
 * @param token - Optional GitHub token for higher rate limits
 */
export async function fetchGitHubRepos(
  username: string,
  token?: string
): Promise<GitHubRepo[]> {
  const headers: HeadersInit = {
    'Accept': 'application/vnd.github.v3+json',
  }
  
  if (token) {
    headers['Authorization'] = `token ${token}`
  }

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
      { headers, next: { revalidate: 3600 } } // Cache for 1 hour
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }

    const repos: GitHubRepo[] = await response.json()
    return repos
  } catch (error) {
    console.error('Error fetching GitHub repos:', error)
    throw error
  }
}

// Normalize a repo/file name for matching: lowercase, strip anything that
// isn't a letter or digit, so "World-Editor", "worldeditor.png" and
// "World_Editor.jpg" all resolve to the same key.
function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

let softwareImageMapPromise: Promise<Map<string, string>> | null = null

/**
 * Look up uploaded software project images in the shared Supabase "projects"
 * storage bucket. Images should be named after their repo (extension and
 * separators don't matter, e.g. "Worldeditor.png" matches repo "world-editor").
 * Repos without a matching upload fall back to the generated gradient.
 */
function getSoftwareImageMap(): Promise<Map<string, string>> {
  if (softwareImageMapPromise) return softwareImageMapPromise

  softwareImageMapPromise = (async () => {
    const map = new Map<string, string>()
    if (!supabase) return map

    try {
      const { data, error } = await supabase.storage.from('software_images').list()
      if (error || !data) return map

      for (const file of data) {
        const baseName = file.name.replace(/\.[^.]+$/, '')
        const { data: urlData } = supabase.storage.from('software_images').getPublicUrl(file.name)
        map.set(normalizeName(baseName), urlData.publicUrl)
      }
    } catch (error) {
      console.error('Error listing software project images:', error)
    }

    return map
  })()

  return softwareImageMapPromise
}

/**
 * Transform GitHub repository data to project format
 */
export async function transformRepoToProject(repo: GitHubRepo): Promise<Project> {
  const imageMap = await getSoftwareImageMap()
  const uploadedImage = imageMap.get(normalizeName(repo.name))
  const imageUrl = uploadedImage || getProjectImage(repo)

  return {
    id: repo.id.toString(),
    title: repo.name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    description: repo.description || 'No description available',
    imageUrl,
    github_url: repo.html_url,
    demo_url: repo.homepage || null,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    topics: repo.topics || [],
    created_at: repo.created_at,
  }
}

// Dark, on-brand gradient pairs to pick from — avoids relying on external
// screenshot services (e.g. GitHub's OG images), which render a bright
// white card with baked-in text that clashes with the site's dark theme.
const GRADIENT_PALETTES: [string, string][] = [
  ['#0b0f1a', '#0f3a4d'],
  ['#0e0b1a', '#2a1240'],
  ['#0f0a0a', '#3d1414'],
  ['#0d0c08', '#3a2e08'],
  ['#0a0f08', '#12331a'],
  ['#12081a', '#3a1230'],
  ['#080f0f', '#0d3330'],
  ['#0f0b08', '#3a1f0a'],
]

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

/**
 * Get a unique, deterministic image per repository. Instead of fetching a
 * screenshot from an external service (unreliable and visually inconsistent
 * with this site's dark theme), we render a small SVG gradient card as a
 * data URI, seeded by the repo name so each project keeps a stable look.
 */
function getProjectImage(repo: GitHubRepo): string {
  const seed = hashString(repo.name)
  const [from, to] = GRADIENT_PALETTES[seed % GRADIENT_PALETTES.length]
  const initial = repo.name.charAt(0).toUpperCase()

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${from}" />
          <stop offset="100%" stop-color="${to}" />
        </linearGradient>
      </defs>
      <rect width="600" height="400" fill="url(#g)" />
      <text x="50%" y="58%" text-anchor="middle" font-family="Arial, sans-serif"
        font-size="180" font-weight="bold" fill="rgba(255,255,255,0.12)">${initial}</text>
    </svg>
  `.trim()

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/**
 * Filter repositories based on criteria
 */
export function filterSoftwareRepos(repos: GitHubRepo[]): GitHubRepo[] {
  return repos.filter(repo => {
    // Exclude forks by default (can be configured)
    if (repo.full_name.includes('/') && repo.owner.login !== repo.full_name.split('/')[0]) {
      return false
    }
    
    // You can add more filtering logic here
    // For example, filter by topics, language, etc.
    
    return true
  })
}

/**
 * Get software projects from GitHub
 */
export async function getSoftwareProjects(
  username: string,
  token?: string
): Promise<Project[]> {
  try {
    const repos = await fetchGitHubRepos(username, token)
    const filteredRepos = filterSoftwareRepos(repos)
    const projects = await Promise.all(filteredRepos.map(transformRepoToProject))

    // Sort by creation date (newest first)
    return projects.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  } catch (error) {
    console.error('Error getting software projects:', error)
    return []
  }
}
