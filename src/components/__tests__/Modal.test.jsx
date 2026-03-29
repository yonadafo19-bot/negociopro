/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from '../common/Modal'

describe('Modal Component', () => {
  beforeEach(() => {
    // Reset body overflow before each test
    document.body.style.overflow = 'unset'
  })

  afterEach(() => {
    // Cleanup after each test
    document.body.style.overflow = 'unset'
  })

  describe('renderizado básico', () => {
    it('no debe renderizar nada cuando isOpen=false', () => {
      const { container } = render(
        <Modal isOpen={false} onClose={vi.fn()}>
          <p>Modal content</p>
        </Modal>
      )

      expect(container.firstChild).toBe(null)
    })

    it('debe renderizar cuando isOpen=true', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Modal content</p>
        </Modal>
      )

      expect(screen.getByText('Modal content')).toBeInTheDocument()
    })

    it('debe mostrar el backdrop', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )

      const backdrop = container.querySelector('.fixed.inset-0')
      expect(backdrop).toBeInTheDocument()
      expect(backdrop).toHaveClass('bg-black/50')
      expect(backdrop).toHaveClass('backdrop-blur-sm')
    })
  })

  describe('header', () => {
    it('debe mostrar el título cuando se proporciona', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test Title">
          <p>Content</p>
        </Modal>
      )

      expect(screen.getByText('Test Title')).toBeInTheDocument()
    })

    it('debe mostrar el botón de cerrar por defecto', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Title">
          <p>Content</p>
        </Modal>
      )

      const closeButton = screen.getByLabelText('Cerrar modal')
      expect(closeButton).toBeInTheDocument()
    })

    it('no debe mostrar el botón de cerrar cuando showCloseButton=false', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Title" showCloseButton={false}>
          <p>Content</p>
        </Modal>
      )

      expect(screen.queryByLabelText('Cerrar modal')).not.toBeInTheDocument()
    })

    it('debe renderizar header con título y botón de cerrar', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()} title="Test Title">
          <p>Content</p>
        </Modal>
      )

      const header = container.querySelector('.border-b')
      expect(header).toBeInTheDocument()
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByLabelText('Cerrar modal')).toBeInTheDocument()
    })
  })

  describe('contenido', () => {
    it('debe renderizar children correctamente', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </Modal>
      )

      expect(screen.getByText('Paragraph 1')).toBeInTheDocument()
      expect(screen.getByText('Paragraph 2')).toBeInTheDocument()
    })

    it('debe tener padding en el área de contenido', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )

      const contentContainer = container.querySelector('.p-6:nth-child(2)')
      expect(contentContainer).toBeInTheDocument()
    })
  })

  describe('tamaños', () => {
    it('debe renderizar con tamaño sm', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()} size="sm">
          <p>Content</p>
        </Modal>
      )

      const modal = container.querySelector('.bg-white')
      expect(modal).toHaveClass('max-w-md')
    })

    it('debe renderizar con tamaño md (default)', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()} size="md">
          <p>Content</p>
        </Modal>
      )

      const modal = container.querySelector('.bg-white')
      expect(modal).toHaveClass('max-w-lg')
    })

    it('debe renderizar con tamaño lg', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()} size="lg">
          <p>Content</p>
        </Modal>
      )

      const modal = container.querySelector('.bg-white')
      expect(modal).toHaveClass('max-w-2xl')
    })

    it('debe renderizar con tamaño xl', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()} size="xl">
          <p>Content</p>
        </Modal>
      )

      const modal = container.querySelector('.bg-white')
      expect(modal).toHaveClass('max-w-4xl')
    })

    it('debe renderizar con tamaño full', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()} size="full">
          <p>Content</p>
        </Modal>
      )

      const modal = container.querySelector('.bg-white')
      expect(modal).toHaveClass('max-w-full')
      expect(modal).toHaveClass('mx-4')
    })
  })

  describe('cierre del modal', () => {
    it('debe llamar a onClose al hacer click en el botón de cerrar', () => {
      const handleClose = vi.fn()

      render(
        <Modal isOpen={true} onClose={handleClose} title="Title">
          <p>Content</p>
        </Modal>
      )

      const closeButton = screen.getByLabelText('Cerrar modal')
      fireEvent.click(closeButton)

      expect(handleClose).toHaveBeenCalledTimes(1)
    })

    it('debe llamar a onClose al hacer click en el backdrop', () => {
      const handleClose = vi.fn()

      const { container } = render(
        <Modal isOpen={true} onClose={handleClose}>
          <p>Content</p>
        </Modal>
      )

      const backdrop = container.firstChild
      fireEvent.click(backdrop)

      expect(handleClose).toHaveBeenCalledTimes(1)
    })

    it('no debe llamar a onClose al hacer click dentro del modal', () => {
      const handleClose = vi.fn()

      const { container } = render(
        <Modal isOpen={true} onClose={handleClose}>
          <p>Content</p>
        </Modal>
      )

      const modal = container.querySelector('.bg-white')
      fireEvent.click(modal)

      expect(handleClose).not.toHaveBeenCalled()
    })

    it('debe cambiar el overflow del body cuando se abre', () => {
      const { rerender } = render(
        <Modal isOpen={false} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )

      expect(document.body.style.overflow).toBe('unset')

      rerender(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )

      expect(document.body.style.overflow).toBe('hidden')
    })

    it('debe restaurar el overflow del body cuando se cierra', () => {
      const { rerender, unmount } = render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )

      expect(document.body.style.overflow).toBe('hidden')

      rerender(
        <Modal isOpen={false} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )

      expect(document.body.style.overflow).toBe('unset')
    })

    it('debe restaurar el overflow al desmontar', () => {
      const { unmount } = render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )

      expect(document.body.style.overflow).toBe('hidden')

      unmount()

      expect(document.body.style.overflow).toBe('unset')
    })
  })

  describe('clases personalizadas', () => {
    it('debe aceptar className personalizado', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()} className="custom-modal-class">
          <p>Content</p>
        </Modal>
      )

      const modal = container.querySelector('.bg-white')
      expect(modal).toHaveClass('custom-modal-class')
    })

    it('debe mantener clases base con className personalizado', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()} className="custom-class">
          <p>Content</p>
        </Modal>
      )

      const modal = container.querySelector('.bg-white')
      expect(modal).toHaveClass('bg-white')
      expect(modal).toHaveClass('rounded-kawaii-xl')
      expect(modal).toHaveClass('custom-class')
    })
  })

  describe('accesibilidad', () => {
    it('debe tener aria-label en el botón de cerrar', () => {
      render(
        <Modal isOpen={true} onClose={vi.fn()} title="Title">
          <p>Content</p>
        </Modal>
      )

      const closeButton = screen.getByLabelText('Cerrar modal')
      expect(closeButton).toBeInTheDocument()
    })

    it('debe tener el z-index correcto', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )

      const backdrop = container.firstChild
      expect(backdrop).toHaveClass('z-50')
    })
  })

  describe('estilos visuales', () => {
    it('debe tener esquinas redondeadas', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )

      const modal = container.querySelector('.bg-white')
      expect(modal).toHaveClass('rounded-kawaii-xl')
    })

    it('debe tener sombra', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )

      const modal = container.querySelector('.bg-white')
      expect(modal).toHaveClass('shadow-2xl')
    })

    it('debe tener scroll vertical cuando el contenido es largo', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <div style={{ height: '2000px' }}>
            Tall content
          </div>
        </Modal>
      )

      const modal = container.querySelector('.bg-white')
      expect(modal).toHaveClass('max-h-[90vh]')
      expect(modal).toHaveClass('overflow-y-auto')
    })
  })

  describe('comportamiento del backdrop', () => {
    it('debe tener efecto de blur', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )

      const backdrop = container.firstChild
      expect(backdrop).toHaveClass('backdrop-blur-sm')
    })

    it('debe ser semi-transparente', () => {
      const { container } = render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )

      const backdrop = container.firstChild
      expect(backdrop).toHaveClass('bg-black/50')
    })
  })

  describe('renderizado condicional', () => {
    it('debe desmontar completamente cuando isOpen cambia de true a false', () => {
      const { rerender, container } = render(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()

      rerender(
        <Modal isOpen={false} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )

      expect(container.firstChild).toBe(null)
    })

    it('debe montar cuando isOpen cambia de false a true', () => {
      const { rerender } = render(
        <Modal isOpen={false} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )

      expect(screen.queryByText('Content')).not.toBeInTheDocument()

      rerender(
        <Modal isOpen={true} onClose={vi.fn()}>
          <p>Content</p>
        </Modal>
      )

      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })
})
