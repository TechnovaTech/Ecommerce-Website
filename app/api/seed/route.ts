import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Mock seed data creation - replace with actual database operations
    console.log('Creating sample data...')
    
    // Simulate data creation delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return NextResponse.json({ 
      message: 'Sample data created successfully',
      success: true 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create sample data' },
      { status: 500 }
    )
  }
}