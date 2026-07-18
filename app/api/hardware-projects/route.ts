import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

function slugify(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function GET() {
  const filePath = path.join(process.cwd(), 'hardware.txt')
  const raw = await readFile(filePath, 'utf-8')

  const blocks = raw
    .split(/\r?\n\r?\n+/)
    .map((block) => block.trim())
    .filter(Boolean)

  const projects = blocks.map((block, index) => {
    const lines = block.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    const title = lines[0] || `Project ${index + 1}`
    const description = lines.slice(1).join(' ')
    return {
      id: slugify(title) || String(index),
      title,
      description,
    }
  })

  return NextResponse.json(projects)
}
