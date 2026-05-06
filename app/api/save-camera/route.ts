import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { pos, target } = data

    const formatVec = (v: { x: number, y: number, z: number }) => 
      `new THREE.Vector3(${v.x.toFixed(4)}, ${v.y.toFixed(4)}, ${v.z.toFixed(4)})`
    
    const line = `  {\n    pos: ${formatVec(pos)},\n    target: ${formatVec(target)},\n  },\n`

    const filePath = path.join(process.cwd(), 'camera_path.txt')
    fs.appendFileSync(filePath, line)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
