import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  try {
    const id = parseInt(await params.id);
    const body = await request.json();
    
    // Update registration with the provided data
    const updatedRegistration = await prisma.tourRegistration.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updatedRegistration);
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update registration' },
      { status: 500 }
    );
  }
} 