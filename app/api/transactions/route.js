import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { registrationId, amount, paymentMethod, note, description, status } = body;

    // Create the transaction with the provided status or default to 'PENDING'
    const transaction = await prisma.transaction.create({
      data: {
        registrationId,
        amount,
        paymentMethod,
        note,
        description,
        status: status || 'PENDING', // Use provided status or default to 'PENDING'
        paymentDate: new Date(),
      },
    });

    // If the status is APPROVED, update the registration's paid amount immediately
    if (status === 'APPROVED') {
      // Get the registration
      const registration = await prisma.tourRegistration.findUnique({
        where: { id: registrationId },
      });

      if (registration) {
        // Update the paid amount and due amount
        const newPaidAmount = registration.paidAmount + amount;
        const newDueAmount = registration.totalAmount - newPaidAmount;

        await prisma.tourRegistration.update({
          where: { id: registrationId },
          data: {
            paidAmount: newPaidAmount,
            dueAmount: newDueAmount,
          },
        });
      }
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
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