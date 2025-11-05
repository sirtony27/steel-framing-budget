import { BudgetItem } from '@/lib/types/database.types'

export interface ProjectTotals {
  totalCost: number
  profitAmount: number
  finalPrice: number
  costByCategory: Record<string, number>
  itemsByType: Record<string, number>
}

export function calculateProjectTotals(
  items: BudgetItem[],
  profitMarginPercentage: number
): ProjectTotals {
  const totalCost = items.reduce((sum, item) => sum + item.total_cost, 0)
  const profitAmount = totalCost * (profitMarginPercentage / 100)
  const finalPrice = totalCost + profitAmount

  return {
    totalCost,
    profitAmount,
    finalPrice,
    costByCategory: groupCostsByCategory(items),
    itemsByType: groupCostsByType(items),
  }
}

export function groupCostsByCategory(items: BudgetItem[]): Record<string, number> {
  return items.reduce((acc, item) => {
    const categoryId = item.category_id
    if (!acc[categoryId]) {
      acc[categoryId] = 0
    }
    acc[categoryId] += item.total_cost
    return acc
  }, {} as Record<string, number>)
}

export function groupCostsByType(items: BudgetItem[]): Record<string, number> {
  return items.reduce((acc, item) => {
    const type = item.item_type
    if (!acc[type]) {
      acc[type] = 0
    }
    acc[type] += item.total_cost
    return acc
  }, {} as Record<string, number>)
}

export function calculateItemTotal(quantity: number, unitCost: number): number {
  return quantity * unitCost
}

export function calculateProfitMargin(cost: number, price: number): number {
  if (cost === 0) return 0
  return ((price - cost) / cost) * 100
}

export function calculatePriceFromMargin(cost: number, marginPercentage: number): number {
  return cost * (1 + marginPercentage / 100)
}
