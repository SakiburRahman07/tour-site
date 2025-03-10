import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { registrationId, amount, paymentMethod, description } = body;

    // Create the transaction record with PENDING status
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        paymentMethod,
        description,
        registrationId,
        status: 'PENDING' // Set initial status as PENDING
      }
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Transaction error:', error);
    return NextResponse.json(
      { error: 'Failed to process transaction' },
      { status: 500 }
    );
  }
}

// Get all pending transactions
export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        status: 'PENDING'
      },
      include: {
        tourRegistration: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
} 