import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock data for now - replace with actual database queries
    const stats = {
      orders: 3,
      revenue: 7450,
      customers: 5,
      products: 3
    }
    
    return NextResponse.json(stats)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}