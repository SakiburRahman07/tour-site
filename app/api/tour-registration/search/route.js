import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');

  try {
    // Get the registration
    const registration = await prisma.tourRegistration.findUnique({
      where: { phone },
      include: {
        transactions: true,
      },
    });

    if (!registration) {
      return new Response(JSON.stringify(null), { status: 404 });
    }

    // Get total expenses
    const expenses = await prisma.expense.findMany();
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Get total registrations
    const totalRegistrations = await prisma.tourRegistration.count({
      where: {
        status: 'APPROVED'
      }
    });

    // Calculate per person expense
    const perPersonExpense = totalRegistrations > 0 ? totalExpense / totalRegistrations : 0;

    // Calculate total paid amount
    const paidAmount = registration.transactions
      .filter(t => t.status === 'APPROVED')
      .reduce((sum, t) => sum + t.amount, 0);

    // Determine if they owe money or are owed money
    const balance = paidAmount - perPersonExpense;

    return new Response(JSON.stringify({
      ...registration,
      perPersonExpense,
      paidAmount,
      balance,
    }));

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
} 