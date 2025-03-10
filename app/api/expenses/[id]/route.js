import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const expense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: {
        description: data.description,
        amount: parseFloat(data.amount),
        category: data.category,
        note: data.note || null,
        createdAt: new Date(data.createdAt),
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error('Error updating expense:', error);
    return NextResponse.json(
      { error: 'Error updating expense' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.expense.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    return NextResponse.json(
      { error: 'Error deleting expense' },
      { status: 500 }
    );
  }
} 