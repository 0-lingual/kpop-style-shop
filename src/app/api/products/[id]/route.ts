import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { ImageType } from "@prisma/client"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        star: true,
        images: { orderBy: { order: "asc" } },
      },
    })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }
    return NextResponse.json(product)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { name, description, price, starId, images } = body as {
      name?: string
      description?: string
      price?: number
      starId?: string
      images?: { url: string; type: ImageType; order: number }[]
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price }),
        ...(starId !== undefined && { starId }),
        ...(images !== undefined && {
          images: {
            deleteMany: {},
            create: images.map((img) => ({
              url: img.url,
              type: img.type,
              order: img.order,
            })),
          },
        }),
      },
      include: {
        star: true,
        images: { orderBy: { order: "asc" } },
      },
    })
    return NextResponse.json(product)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ message: "Product deleted" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
