import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const registrationId = parseInt(params.id);

    const transactions = await prisma.transaction.findMany({
      where: {
        registrationId
      },
      orderBy: {
        paymentDate: 'desc'
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

// Update transaction
export async function PATCH(request, { params }) {
  try {
    const body = await request.json();
    const { amount, paymentMethod, note, status } = body;
    const id = parseInt(params.id);

    // Get the old transaction to compare
    const oldTransaction = await prisma.transaction.findUnique({
      where: { id },
      include: { tourRegistration: true }
    });

    // Update the transaction
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        amount,
        paymentMethod,
        note,
        status
      },
    });

    // Update the registration's paid amount if status changed or amount changed
    if (oldTransaction && 
        (oldTransaction.status !== status || oldTransaction.amount !== amount)) {
      const registration = await prisma.tourRegistration.findUnique({
        where: { id: oldTransaction.registrationId }
      });

      if (registration) {
        let paidAmount = registration.paidAmount;

        // Remove old amount if it was approved
        if (oldTransaction.status === 'APPROVED') {
          paidAmount -= oldTransaction.amount;
        }

        // Add new amount if it's approved
        if (status === 'APPROVED') {
          paidAmount += amount;
        }

        // Update registration
        await prisma.tourRegistration.update({
          where: { id: oldTransaction.registrationId },
          data: {
            paidAmount,
            dueAmount: registration.totalAmount - paidAmount
          }
        });
      }
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

// Delete transaction
export async function DELETE(request, { params }) {
  try {
    const id = parseInt(params.id);

    // Get the transaction before deleting
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { tourRegistration: true }
    });

    if (!transaction) {
      return NextResponse.json(
        { error: 'Transaction not found' },
        { status: 404 }
      );
    }

    // Delete the transaction
    await prisma.transaction.delete({
      where: { id }
    });

    // Update registration's paid amount if the transaction was approved
    if (transaction.status === 'APPROVED') {
      const registration = await prisma.tourRegistration.findUnique({
        where: { id: transaction.registrationId }
      });

      if (registration) {
        const newPaidAmount = registration.paidAmount - transaction.amount;
        await prisma.tourRegistration.update({
          where: { id: transaction.registrationId },
          data: {
            paidAmount: newPaidAmount,
            dueAmount: registration.totalAmount - newPaidAmount
          }
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
} 