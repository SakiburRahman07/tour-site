import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request) {
  try {
    const data = await request.json();
    const { totalAmount } = data;

    if (!totalAmount || isNaN(totalAmount)) {
      return NextResponse.json(
        { error: 'Invalid total amount' },
        { status: 400 }
      );
    }

    // Update all registrations
    await prisma.tourRegistration.updateMany({
      data: {
        totalAmount: totalAmount,
        dueAmount: {
          set: prisma.raw(`"totalAmount" - "paidAmount"`)
        }
      }
    });

    return NextResponse.json({ message: 'Total amount updated successfully' });
  } catch (error) {
    console.error('Error updating total amount:', error);
    return NextResponse.json(
      { error: 'Error updating total amount' },
      { status: 500 }
    );
  }
} 