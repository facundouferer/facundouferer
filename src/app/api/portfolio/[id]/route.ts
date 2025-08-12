import { NextResponse } from 'next/server';
import { conectionDB } from '@/libs/mongodb';
import { getCurrentUser } from '@/libs/auth';
import { Portfolio } from '@/models/portfolio';

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    await conectionDB();
    const portfolio = await Portfolio.findById(id);
    if (!portfolio) {
      return NextResponse.json(
        { message: "Portfolio item not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(portfolio);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    await conectionDB();

    const updatedPortfolio = await Portfolio.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedPortfolio) {
      return NextResponse.json(
        { message: "Portfolio item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedPortfolio);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params;
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    await conectionDB();
    const deletedPortfolio = await Portfolio.findByIdAndDelete(id);

    if (!deletedPortfolio) {
      return NextResponse.json(
        { message: "Portfolio item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Portfolio item deleted successfully" });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
