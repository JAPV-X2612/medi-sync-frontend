import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from './Button'

vi.mock('./Icon', () => ({
  default: ({ name }) => <span data-testid="icon">{name}</span>,
}))

vi.mock('./Spinner', () => ({
  default: ({ size }) => <span data-testid="spinner" data-size={size} />,
}))

describe('Button', () => {
  it('should render children text', () => {
    render(<Button>Book Appointment</Button>)
    expect(screen.getByText('Book Appointment')).toBeInTheDocument()
  })

  it('should call onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Confirm</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Confirm</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should not call onClick when disabled', () => {
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Confirm</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('should show spinner and be disabled when loading', () => {
    render(<Button loading>Confirm</Button>)
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should render icon when provided and not loading', () => {
    render(<Button icon="calendar_month">Book</Button>)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('should not render icon when loading', () => {
    render(<Button icon="calendar_month" loading>Book</Button>)
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument()
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('should apply primary variant classes by default', () => {
    render(<Button>Primary</Button>)
    expect(screen.getByRole('button').className).toContain('bg-blue-600')
  })

  it('should apply outline variant classes when variant is outline', () => {
    render(<Button variant="outline">Outline</Button>)
    expect(screen.getByRole('button').className).toContain('border-blue-600')
  })

  it('should apply danger variant classes when variant is danger', () => {
    render(<Button variant="danger">Cancel</Button>)
    expect(screen.getByRole('button').className).toContain('text-red-600')
  })
})
