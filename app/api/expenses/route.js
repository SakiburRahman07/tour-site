import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const VALID_CATEGORIES = ['TRANSPORT', 'FOOD', 'ACCOMMODATION', 'ACTIVITIES', 'OTHERS'];

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { description, amount, category, note, createdAt } = body;

    if (!description || !amount) {
      return NextResponse.json(
        { error: 'Description and amount are required' },
        { status: 400 }
      );
    }

    if (!VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        description,
        amount,
        category,
        note: note || null,
        createdAt: createdAt ? new Date(createdAt) : new Date(),
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Error creating expense:', error);
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    );
  }
} 