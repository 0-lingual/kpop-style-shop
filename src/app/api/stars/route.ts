import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { Gender } from "@prisma/client"

export async function GET() {
  try {
    const stars = await prisma.star.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(stars)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch stars" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, gender, imageUrl } = body as {
      name: string
      gender: Gender
      imageUrl?: string
    }

    if (!name || !gender) {
      return NextResponse.json({ error: "name and gender are required" }, { status: 400 })
    }

    const star = await prisma.star.create({
      data: { name, gender, imageUrl },
    })
    return NextResponse.json(star, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create star" }, { status: 500 })
  }
}
