import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!isAdmin(session)) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const { status } = await req.json();
  const booking = await prisma.booking.update({ where: { id: params.id }, data: { status } });
  return NextResponse.json(booking);
}