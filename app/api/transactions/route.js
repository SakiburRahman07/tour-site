import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { registrationId, amount, paymentMethod, description, note, status } = body;

    // Validate required fields
    if (!registrationId || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // First check if the registration exists
    const registration = await prisma.tourRegistration.findUnique({
      where: { id: registrationId },
    });

    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    // Create the transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount: parseFloat(amount),
        paymentMethod,
        description: description || `Payment via ${paymentMethod}`,
        note: note || null,
        status: status || 'PENDING',
        registrationId,
      },
    });

    // If the transaction is approved, update the registration's paidAmount
    if (status === 'APPROVED') {
      await prisma.tourRegistration.update({
        where: { id: registrationId },
        data: {
          paidAmount: {
            increment: parseFloat(amount)
          }
        }
      });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Transaction creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create transaction' },
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