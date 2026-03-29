/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../common/Button'

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Search: () => <svg data-testid="search-icon" />,
  Plus: () => <svg data-testid="plus-icon" />,
}))

describe('Button Component', () => {
  describe('renderizado básico', () => {
    it('debe renderizar el texto del botón', () => {
      render(<Button>Click me</Button>)
      expect(screen.getByText('Click me')).toBeInTheDocument()
    })

    it('debe renderizar con las clases base', () => {
      const { container } = render(<Button>Test</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('inline-flex')
      expect(button).toHaveClass('items-center')
      expect(button).toHaveClass('justify-center')
    })

    it('debe estar habilitado por defecto', () => {
      const { container } = render(<Button>Test</Button>)
      const button = container.querySelector('button')
      expect(button).not.toBeDisabled()
    })
  })

  describe('variantes', () => {
    it('debe renderizar variante primary', () => {
      const { container } = render(<Button variant="primary">Primary</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('bg-primary-500')
      expect(button).toHaveClass('text-white')
    })

    it('debe renderizar variante secondary', () => {
      const { container } = render(<Button variant="secondary">Secondary</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('bg-secondary-500')
    })

    it('debe renderizar variante accent', () => {
      const { container } = render(<Button variant="accent">Accent</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('bg-accent-500')
    })

    it('debe renderizar variante success', () => {
      const { container } = render(<Button variant="success">Success</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('bg-green-500')
    })

    it('debe renderizar variante danger', () => {
      const { container } = render(<Button variant="danger">Danger</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('bg-red-500')
    })

    it('debe renderizar variante outline', () => {
      const { container } = render(<Button variant="outline">Outline</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('border-2')
      expect(button).toHaveClass('border-primary-500')
      expect(button).toHaveClass('text-primary-500')
    })

    it('debe renderizar variante ghost', () => {
      const { container } = render(<Button variant="ghost">Ghost</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('text-gray-700')
      expect(button).toHaveClass('hover:bg-gray-100')
    })
  })

  describe('tamaños', () => {
    it('debe renderizar tamaño sm', () => {
      const { container } = render(<Button size="sm">Small</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('px-3')
      expect(button).toHaveClass('py-1.5')
      expect(button).toHaveClass('text-sm')
    })

    it('debe renderizar tamaño md (default)', () => {
      const { container } = render(<Button size="md">Medium</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('px-4')
      expect(button).toHaveClass('py-2')
      expect(button).toHaveClass('text-base')
    })

    it('debe renderizar tamaño lg', () => {
      const { container } = render(<Button size="lg">Large</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('px-6')
      expect(button).toHaveClass('py-3')
      expect(button).toHaveClass('text-lg')
    })

    it('debe renderizar tamaño xl', () => {
      const { container } = render(<Button size="xl">Extra Large</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('px-8')
      expect(button).toHaveClass('py-4')
      expect(button).toHaveClass('text-xl')
    })
  })

  describe('estados', () => {
    it('debe estar deshabilitado cuando disabled=true', () => {
      const { container } = render(<Button disabled>Disabled</Button>)
      const button = container.querySelector('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:opacity-50')
      expect(button).toHaveClass('disabled:cursor-not-allowed')
    })

    it('debe mostrar spinner de carga cuando loading=true', () => {
      const { container } = render(<Button loading>Loading</Button>)
      const button = container.querySelector('button')
      expect(button).toBeDisabled()
      expect(screen.getByText('Procesando...')).toBeInTheDocument()
      expect(button.querySelector('svg.animate-spin')).toBeInTheDocument()
    })

    it('debe mostrar texto normal cuando no está cargando', () => {
      render(<Button loading={false}>Not Loading</Button>)
      expect(screen.getByText('Not Loading')).toBeInTheDocument()
      expect(screen.queryByText('Procesando...')).not.toBeInTheDocument()
    })

    it('debe estar deshabilitado cuando loading=true', () => {
      const { container } = render(<Button loading>Test</Button>)
      const button = container.querySelector('button')
      expect(button).toBeDisabled()
    })
  })

  describe('iconos', () => {
    it('debe renderizar icono cuando se proporciona', () => {
      // Create a mock icon component
      const MockSearchIcon = () => <svg data-testid="search-icon" />

      const { container } = render(<Button icon={MockSearchIcon}>Search</Button>)
      expect(container.querySelector('svg')).toBeInTheDocument()
      expect(screen.getByTestId('search-icon')).toBeInTheDocument()
    })

    it('debe mostrar icono y texto cuando loading=false', () => {
      const MockPlusIcon = () => <svg data-testid="plus-icon" />
      render(<Button icon={MockPlusIcon} loading={false}>Add</Button>)
      expect(screen.getByText('Add')).toBeInTheDocument()
      expect(screen.getByTestId('plus-icon')).toBeInTheDocument()
    })

    it('debe mostrar spinner en lugar de icono cuando loading=true', () => {
      const MockPlusIcon = () => <svg data-testid="plus-icon" />
      render(<Button icon={MockPlusIcon} loading>Add</Button>)
      expect(screen.queryByTestId('plus-icon')).not.toBeInTheDocument()
      expect(screen.getByText('Procesando...')).toBeInTheDocument()
    })
  })

  describe('eventos', () => {
    it('debe llamar a onClick cuando se hace click', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()

      render(<Button onClick={handleClick}>Click me</Button>)

      await user.click(screen.getByText('Click me'))
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('no debe llamar a onClick cuando está deshabilitado', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()

      render(<Button onClick={handleClick} disabled>Disabled</Button>)

      await user.click(screen.getByText('Disabled'))
      expect(handleClick).not.toHaveBeenCalled()
    })

    it('no debe llamar a onClick cuando está cargando', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()

      render(<Button onClick={handleClick} loading>Loading</Button>)

      await user.click(screen.getByText('Procesando...'))
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('clases personalizadas', () => {
    it('debe aceptar className personalizado', () => {
      const { container } = render(<Button className="custom-class">Test</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('custom-class')
    })

    it('debe mantener clases base con className personalizado', () => {
      const { container } = render(<Button className="custom-class">Test</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('inline-flex')
      expect(button).toHaveClass('custom-class')
    })
  })

  describe('accesibilidad', () => {
    it('debe ser accesible como botón', () => {
      render(<Button>Test</Button>)
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('debe pasar props adicionales', () => {
      const { container } = render(<Button aria-label="Close button">X</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveAttribute('aria-label', 'Close button')
    })

    it('debe pasar type personalizado', () => {
      const { container } = render(<Button type="submit">Submit</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveAttribute('type', 'submit')
    })
  })

  describe('estilos visuales', () => {
    it('debe tener transición suave', () => {
      const { container } = render(<Button>Test</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('transition-all')
      expect(button).toHaveClass('duration-200')
    })

    it('debe tener focus ring', () => {
      const { container } = render(<Button variant="primary">Test</Button>)
      const button = container.querySelector('button')
      expect(button).toHaveClass('focus:outline-none')
      expect(button).toHaveClass('focus:ring-2')
      expect(button).toHaveClass('focus:ring-offset-2')
    })
  })
})
