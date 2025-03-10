import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    const activity = await prisma.activity.update({
      where: { id: parseInt(id) },
      data: { status: data.status },
    });
    
    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json(
      { error: 'Error updating activity' },
      { status: 500 }
    );
  }
} 