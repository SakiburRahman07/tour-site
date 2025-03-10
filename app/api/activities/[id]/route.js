import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    
    // Create update data object
    const updateData = {
      title: data.title,
      description: data.description,
      location: data.location,
    };

    // Handle time update if provided
    if (data.time) {
      try {
        const dateObj = new Date(data.time);
        if (!isNaN(dateObj.getTime())) {
          updateData.time = dateObj.toISOString();
        }
      } catch (error) {
        console.error('Date parsing error:', error);
      }
    }

    // Handle status update if provided
    if (data.status) {
      updateData.status = data.status;
    }

    // Update the activity
    const activity = await prisma.activity.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error updating activity:', error);
    return NextResponse.json(
      { error: 'Failed to update activity' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    await prisma.activity.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json(
      { error: 'Error deleting activity' },
      { status: 500 }
    );
  }
} 