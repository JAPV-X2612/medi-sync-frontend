import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from './Badge'

describe('Badge', () => {
  it('should render children text', () => {
    render(<Badge>Confirmed</Badge>)
    expect(screen.getByText('Confirmed')).toBeInTheDocument()
  })

  it('should apply slate variant classes by default', () => {
    render(<Badge>Pending</Badge>)
    expect(screen.getByText('Pending').className).toContain('bg-slate-100')
  })

  it('should apply green variant classes when variant is green', () => {
    render(<Badge variant="green">Active</Badge>)
    expect(screen.getByText('Active').className).toContain('bg-emerald-50')
  })

  it('should apply red variant classes when variant is red', () => {
    render(<Badge variant="red">Cancelled</Badge>)
    expect(screen.getByText('Cancelled').className).toContain('bg-red-50')
  })

  it('should apply amber variant classes when variant is amber', () => {
    render(<Badge variant="amber">Pending</Badge>)
    expect(screen.getByText('Pending').className).toContain('bg-amber-50')
  })

  it('should render dot indicator when dot prop is true', () => {
    const { container } = render(<Badge dot variant="green">Online</Badge>)
    const dot = container.querySelector('.rounded-full.w-1\\.5')
    expect(dot).toBeInTheDocument()
  })

  it('should not render dot indicator when dot prop is false', () => {
    const { container } = render(<Badge>Offline</Badge>)
    const dot = container.querySelector('.w-1\\.5')
    expect(dot).not.toBeInTheDocument()
  })

  it('should apply additional className when provided', () => {
    render(<Badge className="mt-2">Label</Badge>)
    expect(screen.getByText('Label').className).toContain('mt-2')
  })
})
