import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { Gender } from "@prisma/client"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const star = await prisma.star.findUnique({
      where: { id },
      include: {
        products: {
          include: { images: true },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { products: true },
        },
      },
    })
    if (!star) {
      return NextResponse.json({ error: "Star not found" }, { status: 404 })
    }
    return NextResponse.json(star)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch star" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, gender, imageUrl } = body as {
      name?: string
      gender?: Gender
      imageUrl?: string
    }

    const star = await prisma.star.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(gender !== undefined && { gender }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
    })
    return NextResponse.json(star)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update star" }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.star.delete({ where: { id } })
    return NextResponse.json({ message: "Star deleted" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete star" }, { status: 500 })
  }
}
