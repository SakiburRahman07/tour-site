import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status ? { status } : {};

    const registrations = await prisma.tourRegistration.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(registrations);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch registrations' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, address, date } = body;

    if (!name || !phone || !address || !date) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if phone number already exists
    const existingRegistration = await prisma.tourRegistration.findUnique({
      where: { phone },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'PHONE_EXISTS' },
        { status: 400 }
      );
    }

    const registration = await prisma.tourRegistration.create({
      data: {
        name,
        phone,
        address,
        date: new Date(date),
        totalAmount: 4500,
        paidAmount: 0,
        dueAmount: 4500,
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create registration' },
      { status: 500 }
    );
  }
} 