import connectDB from '@/lib/mongodb';
import Beer from '@/app/models/beer';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const id = req.nextUrl.pathname.split('/').pop();
    if (!id) return NextResponse.json({}, { status: 200 });
    const event = await Beer.findOne({ _id: id })
    return NextResponse.json(event);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: ["Unable to retrieve beer from Id"], error }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const id = req.nextUrl.pathname.split('/').pop();
    if (!id) return NextResponse.json({ msg: ["beer id is required"] }, { status: 400 });

    const json = await req.json();
    const beer = await Beer.findOne({ _id: id });
    if (!beer) return NextResponse.json({ msg: ["Beer not found"] }, { status: 500 });

    Object.entries(json).forEach(([key, value]) => {
      if (value != null) beer[key] = value;
    });
    
    await beer.save();
    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: ["Unable to update beer"], error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const id = req.nextUrl.pathname.split('/').pop();
    if (!id) return NextResponse.json({ msg: ["beer id is required"] }, { status: 400 });
    const beer = await Beer.deleteOne({ _id: id });
    if (beer.deletedCount === 1)
      return new NextResponse(null, { status: 204 });
    else {
      return NextResponse.json({ msg: ["0 beers deleted"] }, { status: 400 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ msg: ["Unable to delete beer"], error }, { status: 500 });
  }
}
