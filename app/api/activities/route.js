import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: {
        time: 'asc'
      }
    });
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.description || !data.time || !data.location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the activity
    const activity = await prisma.activity.create({
      data: {
        title: data.title,
        description: data.description,
        time: new Date(data.time),
        location: data.location,
        status: 'UPCOMING'
      }
    });

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error creating activity:', error);
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    );
  }
} 