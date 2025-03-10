import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    // If this is an approval request (only status is being updated)
    if (data.status && Object.keys(data).length === 1) {
      const registration = await prisma.tourRegistration.update({
        where: { id: parseInt(id) },
        data: { status: data.status }
      });
      return NextResponse.json(registration);
    }

    // For full registration updates, check phone number uniqueness
    if (data.phone) {
      const existingRegistration = await prisma.tourRegistration.findFirst({
        where: {
          phone: data.phone,
          id: {
            not: parseInt(id)
          }
        }
      });

      if (existingRegistration) {
        return NextResponse.json(
          { error: 'এই মোবাইল নম্বরটি ইতিমধ্যে ব্যবহৃত হয়েছে' },
          { status: 400 }
        );
      }
    }

    // Proceed with the full update
    const registration = await prisma.tourRegistration.update({
      where: { id: parseInt(id) },
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        status: data.status,
      },
    });

    return NextResponse.json(registration);
  } catch (error) {
    console.error('Error updating registration:', error);
    return NextResponse.json(
      { error: 'রেজিস্ট্রেশন আপডেট করতে সমস্যা হয়েছে' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.tourRegistration.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json(
      { error: 'Error deleting registration' },
      { status: 500 }
    );
  }
} 