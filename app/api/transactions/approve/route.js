import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { transactionId, action } = body; // action can be 'APPROVED' or 'REJECTED'

    if (!transactionId || !action) {
      return NextResponse.json(
        { error: 'Transaction ID and action are required' },
        { status: 400 }
      );
    }

    // Start a transaction with timeout and retry options
    const result = await prisma.$transaction(
      async (tx) => {
        // Get the transaction
        const transaction = await tx.transaction.findUnique({
          where: { id: transactionId },
          include: { tourRegistration: true }
        });

        if (!transaction) {
          throw new Error('Transaction not found');
        }

        if (transaction.status !== 'PENDING') {
          throw new Error('Transaction is not pending');
        }

        // Update transaction status
        const updatedTransaction = await tx.transaction.update({
          where: { id: transactionId },
          data: { status: action }
        });

        // If approved, update the registration payment details
        if (action === 'APPROVED') {
          const newPaidAmount = transaction.tourRegistration.paidAmount + transaction.amount;
          const newDueAmount = transaction.tourRegistration.totalAmount - newPaidAmount;

          await tx.tourRegistration.update({
            where: { id: transaction.registrationId },
            data: {
              paidAmount: newPaidAmount,
              dueAmount: newDueAmount
            }
          });
        }

        return updatedTransaction;
      },
      {
        maxWait: 10000, // maximum time to wait for transaction to start
        timeout: 15000, // maximum time for the transaction to finish
        isolationLevel: 'Serializable' // highest isolation level for consistency
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Approval error:', error);
    
    // More specific error handling
    if (error.code === 'P2028') {
      return NextResponse.json(
        { error: 'Transaction timeout. Please try again.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to process approval' },
      { status: 500 }
    );
  }
} 