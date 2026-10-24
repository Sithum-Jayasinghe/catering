import { describe, it, expect } from 'vitest'

// ── Pure utility / business-logic tests (no DOM required) ─────────────────

describe('Currency formatting', () => {
  const formatLKR = (amount: number) =>
    new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR' }).format(amount)

  it('formats a positive amount', () => {
    const result = formatLKR(1500)
    expect(result).toContain('1,500')
  })

  it('formats zero', () => {
    const result = formatLKR(0)
    expect(result).toContain('0')
  })
})

describe('Date helpers', () => {
  it('detects an expired date correctly', () => {
    const isExpired = (date: Date) => date < new Date()
    expect(isExpired(new Date('2000-01-01'))).toBe(true)
    expect(isExpired(new Date('2099-01-01'))).toBe(false)
  })

  it('calculates days until expiry', () => {
    const daysUntil = (date: Date) => {
      const diff = date.getTime() - Date.now()
      return Math.ceil(diff / (1000 * 60 * 60 * 24))
    }
    const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    expect(daysUntil(future)).toBeGreaterThan(5)
    expect(daysUntil(future)).toBeLessThanOrEqual(7)
  })
})

describe('Stock status logic', () => {
  type StockStatus = 'OK' | 'Low' | 'Critical' | 'OutOfStock'

  const getStockStatus = (qty: number, reorderLevel: number): StockStatus => {
    if (qty <= 0) return 'OutOfStock'
    if (qty <= reorderLevel * 0.5) return 'Critical'
    if (qty <= reorderLevel) return 'Low'
    return 'OK'
  }

  it('returns OK when quantity is above reorder level', () => {
    expect(getStockStatus(100, 20)).toBe('OK')
  })

  it('returns Low when at the reorder level', () => {
    expect(getStockStatus(20, 20)).toBe('Low')
  })

  it('returns Critical when below 50% of reorder level', () => {
    expect(getStockStatus(9, 20)).toBe('Critical')
  })

  it('returns OutOfStock when quantity is 0', () => {
    expect(getStockStatus(0, 20)).toBe('OutOfStock')
  })
})

describe('Pagination helpers', () => {
  const totalPages = (total: number, pageSize: number) =>
    Math.ceil(total / pageSize)

  it('calculates total pages correctly', () => {
    expect(totalPages(100, 10)).toBe(10)
    expect(totalPages(101, 10)).toBe(11)
    expect(totalPages(0, 10)).toBe(0)
  })
})
