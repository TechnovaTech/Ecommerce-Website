"use client"

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface LiveStockIndicatorProps {
  productId: string
  currentStock: number
}

export default function LiveStockIndicator({ productId, currentStock }: LiveStockIndicatorProps) {
  const [stock, setStock] = useState(currentStock)
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable')
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    const handleStockUpdate = (event: CustomEvent) => {
      const { productId: updatedProductId, newStock, oldStock } = event.detail
      
      if (updatedProductId === productId) {
        setStock(newStock)
        setLastUpdate(new Date())
        
        if (newStock > oldStock) {
          setTrend('up')
        } else if (newStock < oldStock) {
          setTrend('down')
        } else {
          setTrend('stable')
        }
        
        // Reset trend after 3 seconds
        setTimeout(() => setTrend('stable'), 3000)
      }
    }

    window.addEventListener('stock-update', handleStockUpdate as EventListener)
    return () => window.removeEventListener('stock-update', handleStockUpdate as EventListener)
  }, [productId])

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp size={12} className="text-green-500" />
      case 'down': return <TrendingDown size={12} className="text-red-500" />
      default: return <Minus size={12} className="text-gray-400" />
    }
  }

  const getStockColor = () => {
    if (stock === 0) return 'text-red-600'
    if (stock < 5) return 'text-orange-600'
    return 'text-green-600'
  }

  return (
    <div className="flex items-center gap-1">
      <span className={`text-sm font-medium ${getStockColor()}`}>
        Stock: {stock}
      </span>
      {getTrendIcon()}
      {lastUpdate && (
        <span className="text-xs text-gray-400 ml-1">
          {lastUpdate.toLocaleTimeString()}
        </span>
      )}
    </div>
  )
}