import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const total = await prisma.expense.aggregate({
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json({
      total: total._sum.amount || 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch total expenses' },
      { status: 500 }
    );
  }
} 