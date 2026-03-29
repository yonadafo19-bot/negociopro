/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Input from '../common/Input'

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Search: () => <svg data-testid="search-icon" />,
  Mail: () => <svg data-testid="mail-icon" />,
}))

describe('Input Component', () => {
  describe('renderizado básico', () => {
    it('debe renderizar input correctamente', () => {
      const { container } = render(<Input />)
      const input = container.querySelector('input')
      expect(input).toBeInTheDocument()
    })

    it('debe tener clases base correctas', () => {
      const { container } = render(<Input />)
      const input = container.querySelector('input')
      expect(input).toHaveClass('w-full')
      expect(input).toHaveClass('px-4')
      expect(input).toHaveClass('py-2')
      expect(input).toHaveClass('border-2')
    })

    it('debe ser accesible como input', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })
  })

  describe('label', () => {
    it('debe mostrar label cuando se proporciona', () => {
      render(<Input label="Email" />)
      expect(screen.getByText('Email')).toBeInTheDocument()
    })

    it('no debe mostrar label cuando no se proporciona', () => {
      const { container } = render(<Input />)
      expect(container.querySelector('label')).not.toBeInTheDocument()
    })

    it('debe asociar label con input', () => {
      render(<Input label="Name" />)
      const label = screen.getByText('Name')
      const input = screen.getByRole('textbox')
      expect(label.tagName).toBe('LABEL')
    })
  })

  describe('estados de error', () => {
    it('debe mostrar mensaje de error cuando se proporciona', () => {
      render(<Input error="Este campo es requerido" />)
      expect(screen.getByText('Este campo es requerido')).toBeInTheDocument()
    })

    it('debe tener estilos de error cuando hay error', () => {
      const { container } = render(<Input error="Error message" />)
      const input = container.querySelector('input')
      expect(input).toHaveClass('border-red-500')
      expect(input).toHaveClass('focus:border-red-500')
      expect(input).toHaveClass('focus:ring-red-500')
    })

    it('debe tener estilos normales cuando no hay error', () => {
      const { container } = render(<Input />)
      const input = container.querySelector('input')
      expect(input).toHaveClass('border-gray-300')
      expect(input).toHaveClass('focus:border-primary-500')
    })

    it('no debe mostrar helperText cuando hay error', () => {
      render(<Input error="Error" helperText="Helper text" />)
      expect(screen.getByText('Error')).toBeInTheDocument()
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument()
    })
  })

  describe('helper text', () => {
    it('debe mostrar helperText cuando se proporciona', () => {
      render(<Input helperText="Ingresa tu email" />)
      expect(screen.getByText('Ingresa tu email')).toBeInTheDocument()
    })

    it('no debe mostrar helperText cuando hay error', () => {
      render(<Input error="Error" helperText="Helper text" />)
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument()
    })

    it('debe tener estilos correctos para helperText', () => {
      render(<Input helperText="Helper text" />)
      const helper = screen.getByText('Helper text')
      expect(helper).toHaveClass('text-sm')
      expect(helper).toHaveClass('text-gray-500')
    })
  })

  describe('iconos', () => {
    it('debe mostrar icono cuando se proporciona', () => {
      const MockSearchIcon = () => <svg data-testid="search-icon" />
      render(<Input icon={MockSearchIcon} />)
      expect(screen.getByTestId('search-icon')).toBeInTheDocument()
    })

    it('debe agregar padding izquierdo cuando hay icono', () => {
      const MockSearchIcon = () => <svg data-testid="search-icon" />
      const { container } = render(<Input icon={MockSearchIcon} />)
      const input = container.querySelector('input')
      expect(input).toHaveClass('pl-11')
    })

    it('no debe tener padding extra cuando no hay icono', () => {
      const { container } = render(<Input />)
      const input = container.querySelector('input')
      expect(input).not.toHaveClass('pl-11')
    })

    it('debe posicionar icono correctamente', () => {
      const MockMailIcon = () => <svg data-testid="mail-icon" />
      render(<Input icon={MockMailIcon} />)
      expect(screen.getByTestId('mail-icon')).toBeInTheDocument()
    })
  })

  describe('estados disabled', () => {
    it('debe estar deshabilitado cuando disabled=true', () => {
      const { container } = render(<Input disabled />)
      const input = container.querySelector('input')
      expect(input).toBeDisabled()
    })

    it('debe tener estilos de disabled', () => {
      const { container } = render(<Input disabled />)
      const input = container.querySelector('input')
      expect(input).toHaveClass('disabled:bg-gray-100')
      expect(input).toHaveClass('disabled:cursor-not-allowed')
    })
  })

  describe('eventos', () => {
    it('debe llamar a onChange cuando el usuario escribe', async () => {
      const user = userEvent.setup()
      const handleChange = vi.fn()

      const { container } = render(<Input onChange={handleChange} />)
      const input = container.querySelector('input')

      await user.type(input, 'Hello')

      expect(handleChange).toHaveBeenCalled()
    })

    it('debe actualizar el valor del input', async () => {
      const user = userEvent.setup()

      const { container } = render(<Input />)
      const input = container.querySelector('input')

      await user.type(input, 'Test value')

      expect(input.value).toBe('Test value')
    })

    it('debe llamar a onFocus cuando recibe foco', async () => {
      const user = userEvent.setup()
      const handleFocus = vi.fn()

      const { container } = render(<Input onFocus={handleFocus} />)
      const input = container.querySelector('input')

      await user.click(input)

      expect(handleFocus).toHaveBeenCalled()
    })

    it('debe llamar a onBlur cuando pierde foco', async () => {
      const user = userEvent.setup()
      const handleBlur = vi.fn()

      const { container } = render(<Input onBlur={handleBlur} />)
      const input = container.querySelector('input')

      await user.click(input)
      await user.tab() // Move focus away

      expect(handleBlur).toHaveBeenCalled()
    })
  })

  describe('props adicionales', () => {
    it('debe aceptar type personalizado', () => {
      const { container } = render(<Input type="email" />)
      const input = container.querySelector('input')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('debe aceptar placeholder', () => {
      render(<Input placeholder="Enter your name" />)
      expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument()
    })

    it('debe aceptar value controlado', () => {
      const { container } = render(<Input value="Test value" />)
      const input = container.querySelector('input')
      expect(input.value).toBe('Test value')
    })

    it('debe aceptar name attribute', () => {
      const { container } = render(<Input name="email" />)
      const input = container.querySelector('input')
      expect(input).toHaveAttribute('name', 'email')
    })

    it('debe aceptar required attribute', () => {
      const { container } = render(<Input required />)
      const input = container.querySelector('input')
      expect(input).toBeRequired()
    })

    it('debe aceptar maxLength', () => {
      const { container } = render(<Input maxLength={10} />)
      const input = container.querySelector('input')
      expect(input).toHaveAttribute('maxlength', '10')
    })
  })

  describe('clases personalizadas', () => {
    it('debe aceptar className personalizado para el input', () => {
      const { container } = render(<Input className="custom-input-class" />)
      const input = container.querySelector('input')
      expect(input).toHaveClass('custom-input-class')
    })

    it('debe aceptar containerClassName personalizado', () => {
      const { container } = render(<Input containerClassName="custom-container-class" />)
      const containerDiv = container.querySelector('.custom-container-class')
      expect(containerDiv).toBeInTheDocument()
    })

    it('debe mantener clases base con className personalizado', () => {
      const { container } = render(<Input className="custom-class" />)
      const input = container.querySelector('input')
      expect(input).toHaveClass('w-full')
      expect(input).toHaveClass('custom-class')
    })
  })

  describe('forward ref', () => {
    it('debe forward ref al elemento input', () => {
      const ref = { current: null }

      render(<Input ref={ref} />)

      expect(ref.current).toBeInstanceOf(HTMLInputElement)
    })

    it('debe permitir acceder a métodos del input vía ref', () => {
      const ref = { current: null }

      render(<Input ref={ref} />)

      ref.current?.focus()

      expect(ref.current).toHaveFocus()
    })
  })

  describe('accesibilidad', () => {
    it('debe tener estilos de error cuando hay error', () => {
      const { container } = render(<Input error="Error message" />)
      const input = container.querySelector('input')
      expect(input).toHaveClass('border-red-500')
    })

    it('debe aceptar aria-describedby', () => {
      const { container } = render(<Input aria-describedby="helper-text" />)
      const input = container.querySelector('input')
      expect(input).toHaveAttribute('aria-describedby', 'helper-text')
    })

    it('debe aceptar aria-label', () => {
      const { container } = render(<Input aria-label="Email input" />)
      const input = container.querySelector('input')
      expect(input).toHaveAttribute('aria-label', 'Email input')
    })
  })

  describe('estilos visuales', () => {
    it('debe tener transición suave', () => {
      const { container } = render(<Input />)
      const input = container.querySelector('input')
      expect(input).toHaveClass('transition-all')
      expect(input).toHaveClass('duration-200')
    })

    it('debe tener focus ring', () => {
      const { container } = render(<Input />)
      const input = container.querySelector('input')
      expect(input).toHaveClass('focus:outline-none')
      expect(input).toHaveClass('focus:ring-2')
    })

    it('debe tener bordes redondeados', () => {
      const { container } = render(<Input />)
      const input = container.querySelector('input')
      expect(input).toHaveClass('rounded-kawaii')
    })
  })
})
