import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { Gender, ImageType } from "@prisma/client"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const starId = searchParams.get("starId") ?? undefined
    const gender = searchParams.get("gender") as Gender | null
    const sort = searchParams.get("sort") ?? "newest"

    const orderBy =
      sort === "price_asc"
        ? { price: "asc" as const }
        : sort === "price_desc"
          ? { price: "desc" as const }
          : { createdAt: "desc" as const }

    const products = await prisma.product.findMany({
      where: {
        ...(starId && { starId }),
        ...(gender && { star: { gender } }),
      },
      include: {
        star: true,
        images: { orderBy: { order: "asc" } },
      },
      orderBy,
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, description, price, starId, images } = body as {
      name: string
      description?: string
      price: number
      starId: string
      images: { url: string; type: ImageType; order: number }[]
    }

    if (!name || price === undefined || !starId) {
      return NextResponse.json(
        { error: "name, price, and starId are required" },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        starId,
        images: {
          create: images?.map((img) => ({
            url: img.url,
            type: img.type,
            order: img.order,
          })) ?? [],
        },
      },
      include: {
        star: true,
        images: { orderBy: { order: "asc" } },
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
