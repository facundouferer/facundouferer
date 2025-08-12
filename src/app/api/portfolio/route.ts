import { NextRequest, NextResponse } from 'next/server'
import { Portfolio } from '@/models/portfolio'
import { conectionDB } from '@/libs/mongodb'
import { getCurrentUser } from '@/libs/auth'

export async function GET() {
  try {
    await conectionDB()
    const portfolios = await Portfolio.find().sort({ createdAt: -1 })
    return NextResponse.json(portfolios)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json(
      { message: 'An unknown error occurred' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    await conectionDB()
    const newPortfolio = new Portfolio(body)
    const savedPortfolio = await newPortfolio.save()

    return NextResponse.json(savedPortfolio)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      )
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
