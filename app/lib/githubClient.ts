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

/**
 * Transform GitHub repository data to project format
 */
export function transformRepoToProject(repo: GitHubRepo): Project {
  // Get image URL from topics or use language-based default
  const imageUrl = getProjectImage(repo)
  
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

/**
 * Get project image based on language or topics
 */
function getProjectImage(repo: GitHubRepo): string {
  // For now, return a solid black image or dark themed image
  // You can replace this with your preferred project images
  return '/assets/software.jpg' // Using the dark software.jpg image for all projects
  
  // Check for specific topics
  const topics = repo.topics || []
  
  if (topics.includes('ai') || topics.includes('machine-learning') || topics.includes('ml')) {
    return '/assets/software.jpg'
  }
  if (topics.includes('blockchain') || topics.includes('web3')) {
    return '/assets/software.jpg'
  }
  if (topics.includes('iot') || topics.includes('hardware')) {
    return '/assets/hardware.jpg'
  }
  
  // Fallback to language-based images
  const language = repo.language?.toLowerCase()
  
  switch (language) {
    case 'javascript':
    case 'typescript':
      return '/assets/software.jpg'
    case 'python':
      return '/assets/software.jpg'
    case 'java':
      return '/assets/software.jpg'
    case 'go':
      return '/assets/software.jpg'
    case 'rust':
      return '/assets/software.jpg'
    case 'c++':
    case 'c':
      return '/assets/software.jpg'
    default:
      return '/assets/software.jpg'
  }
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
    const projects = filteredRepos.map(transformRepoToProject)
    
    // Sort by creation date (newest first)
    return projects.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  } catch (error) {
    console.error('Error getting software projects:', error)
    return []
  }
}
