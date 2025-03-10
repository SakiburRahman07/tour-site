import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();

    // Format the time string to include seconds
    const timeString = data.time + ':00';  // Add seconds to make it complete ISO format

    // Format the data properly before updating
    const updateData = {
      title: data.title,
      description: data.description,
      location: data.location,
      time: new Date(timeString).toISOString(), // Convert to proper ISO string
    };

    const activity = await prisma.activity.update({
      where: { id: parseInt(id) },
      data: updateData,
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