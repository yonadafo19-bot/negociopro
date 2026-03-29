/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card, {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../common/Card'

describe('Card Component', () => {
  describe('Card principal', () => {
    it('debe renderizar children correctamente', () => {
      render(
        <Card>
          <p>Card content</p>
        </Card>
      )

      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('debe tener clases base correctas', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild

      expect(card).toHaveClass('bg-white')
      expect(card).toHaveClass('rounded-kawaii-lg')
      expect(card).toHaveClass('border-2')
      expect(card).toHaveClass('border-gray-200')
    })

    it('debe tener sombra por defecto', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild

      expect(card).toHaveClass('shadow-kawaii')
    })

    it('no debe tener sombra cuando shadow=false', () => {
      const { container } = render(<Card shadow={false}>Content</Card>)
      const card = container.firstChild

      expect(card).not.toHaveClass('shadow-kawaii')
    })

    it('no debe tener efecto hover por defecto', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild

      expect(card).not.toHaveClass('hover:shadow-kawaii-lg')
    })

    it('debe tener efecto hover cuando hover=true', () => {
      const { container } = render(<Card hover={true}>Content</Card>)
      const card = container.firstChild

      expect(card).toHaveClass('hover:shadow-kawaii-lg')
      expect(card).toHaveClass('transition-shadow')
      expect(card).toHaveClass('duration-200')
    })

    it('debe aceptar className personalizado', () => {
      const { container } = render(<Card className="custom-class">Content</Card>)
      const card = container.firstChild

      expect(card).toHaveClass('custom-class')
    })

    it('debe pasar props adicionales', () => {
      const { container } = render(<Card data-testid="test-card">Content</Card>)
      const card = container.firstChild

      expect(card).toHaveAttribute('data-testid', 'test-card')
    })
  })

  describe('paddings', () => {
    it('debe tener padding md por defecto', () => {
      const { container } = render(<Card>Content</Card>)
      const card = container.firstChild

      expect(card).toHaveClass('p-6')
    })

    it('debe tener padding none cuando se especifica', () => {
      const { container } = render(<Card padding="none">Content</Card>)
      const card = container.firstChild

      expect(card).not.toHaveClass('p-4')
      expect(card).not.toHaveClass('p-6')
    })

    it('debe tener padding sm cuando se especifica', () => {
      const { container } = render(<Card padding="sm">Content</Card>)
      const card = container.firstChild

      expect(card).toHaveClass('p-4')
    })

    it('debe tener padding md cuando se especifica', () => {
      const { container } = render(<Card padding="md">Content</Card>)
      const card = container.firstChild

      expect(card).toHaveClass('p-6')
    })

    it('debe tener padding lg cuando se especifica', () => {
      const { container } = render(<Card padding="lg">Content</Card>)
      const card = container.firstChild

      expect(card).toHaveClass('p-8')
    })

    it('debe tener padding xl cuando se especifica', () => {
      const { container } = render(<Card padding="xl">Content</Card>)
      const card = container.firstChild

      expect(card).toHaveClass('p-10')
    })
  })

  describe('CardHeader', () => {
    it('debe renderizar children correctamente', () => {
      render(<CardHeader>Header content</CardHeader>)
      expect(screen.getByText('Header content')).toBeInTheDocument()
    })

    it('debe tener margen inferior', () => {
      const { container } = render(<CardHeader>Header</CardHeader>)
      const header = container.firstChild

      expect(header).toHaveClass('mb-4')
    })

    it('debe aceptar className personalizado', () => {
      const { container } = render(<CardHeader className="custom-class">Header</CardHeader>)
      const header = container.firstChild

      expect(header).toHaveClass('custom-class')
    })
  })

  describe('CardTitle', () => {
    it('debe renderizar children correctamente', () => {
      render(<CardTitle>Card Title</CardTitle>)
      expect(screen.getByText('Card Title')).toBeInTheDocument()
    })

    it('debe ser un elemento h3', () => {
      const { container } = render(<CardTitle>Title</CardTitle>)
      const title = container.querySelector('h3')

      expect(title).toBeInTheDocument()
    })

    it('debe tener estilos de título', () => {
      const { container } = render(<CardTitle>Title</CardTitle>)
      const title = container.querySelector('h3')

      expect(title).toHaveClass('text-xl')
      expect(title).toHaveClass('font-bold')
      expect(title).toHaveClass('text-gray-900')
    })

    it('debe aceptar className personalizado', () => {
      const { container } = render(<CardTitle className="custom-class">Title</CardTitle>)
      const title = container.querySelector('h3')

      expect(title).toHaveClass('custom-class')
    })
  })

  describe('CardDescription', () => {
    it('debe renderizar children correctamente', () => {
      render(<CardDescription>Description text</CardDescription>)
      expect(screen.getByText('Description text')).toBeInTheDocument()
    })

    it('debe ser un elemento p', () => {
      const { container } = render(<CardDescription>Description</CardDescription>)
      const description = container.querySelector('p')

      expect(description).toBeInTheDocument()
    })

    it('debe tener estilos de descripción', () => {
      const { container } = render(<CardDescription>Description</CardDescription>)
      const description = container.querySelector('p')

      expect(description).toHaveClass('text-sm')
      expect(description).toHaveClass('text-gray-600')
      expect(description).toHaveClass('mt-1')
    })

    it('debe aceptar className personalizado', () => {
      const { container } = render(<CardDescription className="custom-class">Description</CardDescription>)
      const description = container.querySelector('p')

      expect(description).toHaveClass('custom-class')
    })
  })

  describe('CardContent', () => {
    it('debe renderizar children correctamente', () => {
      render(<CardContent>Content text</CardContent>)
      expect(screen.getByText('Content text')).toBeInTheDocument()
    })

    it('debe ser un div', () => {
      const { container } = render(<CardContent>Content</CardContent>)
      const content = container.querySelector('div')

      expect(content).toBeInTheDocument()
    })

    it('debe aceptar className personalizado', () => {
      const { container } = render(<CardContent className="custom-class">Content</CardContent>)
      const content = container.querySelector('div')

      expect(content).toHaveClass('custom-class')
    })

    it('no debe tener estilos por defecto', () => {
      const { container } = render(<CardContent>Content</CardContent>)
      const content = container.querySelector('div')

      // No debería tener clases de utilidad específicas aparte de las personalizadas
      expect(content.className).toBe('')
    })
  })

  describe('CardFooter', () => {
    it('debe renderizar children correctamente', () => {
      render(<CardFooter>Footer content</CardFooter>)
      expect(screen.getByText('Footer content')).toBeInTheDocument()
    })

    it('debe tener borde superior', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>)
      const footer = container.firstChild

      expect(footer).toHaveClass('border-t')
      expect(footer).toHaveClass('border-gray-200')
    })

    it('debe tener padding superior', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>)
      const footer = container.firstChild

      expect(footer).toHaveClass('pt-4')
    })

    it('debe tener margen superior', () => {
      const { container } = render(<CardFooter>Footer</CardFooter>)
      const footer = container.firstChild

      expect(footer).toHaveClass('mt-4')
    })

    it('debe aceptar className personalizado', () => {
      const { container } = render(<CardFooter className="custom-class">Footer</CardFooter>)
      const footer = container.firstChild

      expect(footer).toHaveClass('custom-class')
    })
  })

  describe('composición completa', () => {
    it('debe renderizar una tarjeta completa con todos los componentes', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Título de la Tarjeta</CardTitle>
            <CardDescription>Descripción de la tarjeta</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Contenido principal de la tarjeta</p>
          </CardContent>
          <CardFooter>
            <p>Acciones de la tarjeta</p>
          </CardFooter>
        </Card>
      )

      expect(screen.getByText('Título de la Tarjeta')).toBeInTheDocument()
      expect(screen.getByText('Descripción de la tarjeta')).toBeInTheDocument()
      expect(screen.getByText('Contenido principal de la tarjeta')).toBeInTheDocument()
      expect(screen.getByText('Acciones de la tarjeta')).toBeInTheDocument()

      const card = container.firstChild
      expect(card).toHaveClass('bg-white')
      expect(card).toHaveClass('rounded-kawaii-lg')
    })

    it('debe mantener la jerarquía correcta de elementos', () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      )

      const card = container.firstChild
      const header = card.querySelector('.mb-4')
      const title = header?.querySelector('h3')

      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('text-xl')
      expect(title).toHaveClass('font-bold')
    })
  })

  describe('eventos y accesibilidad', () => {
    it('debe aceptar onClick handler', async () => {
      const handleClick = vi.fn()

      const { container } = render(
        <Card onClick={handleClick} data-testid="card">
          Content
        </Card>
      )

      const card = container.firstChild
      card.click()

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('debe pasar props de accesibilidad', () => {
      const { container } = render(
        <Card role="article" aria-label="Card content">
          Content
        </Card>
      )

      const card = container.firstChild
      expect(card).toHaveAttribute('role', 'article')
      expect(card).toHaveAttribute('aria-label', 'Card content')
    })

    it('debe aceptar data attributes', () => {
      const { container } = render(
        <Card data-id="123" data-type="test">
          Content
        </Card>
      )

      const card = container.firstChild
      expect(card).toHaveAttribute('data-id', '123')
      expect(card).toHaveAttribute('data-type', 'test')
    })
  })

  describe('renderizado condicional', () => {
    it('debe renderizar correctamente con contenido condicional', () => {
      const { container, rerender } = render(
        <Card>
          {false && <p>Should not show</p>}
          <p>Should show</p>
        </Card>
      )

      expect(screen.getByText('Should show')).toBeInTheDocument()
      expect(screen.queryByText('Should not show')).not.toBeInTheDocument()

      rerender(
        <Card>
          {true && <p>Now showing</p>}
          <p>Still showing</p>
        </Card>
      )

      expect(screen.getByText('Now showing')).toBeInTheDocument()
      expect(screen.getByText('Still showing')).toBeInTheDocument()
    })
  })

  describe('estilos avanzados', () => {
    it('debe mantener animación de hover con transición', () => {
      const { container } = render(<Card hover>Content</Card>)
      const card = container.firstChild

      expect(card).toHaveClass('transition-shadow')
      expect(card).toHaveClass('duration-200')
    })

    it('debe combinar múltiples estilos correctamente', () => {
      const { container } = render(
        <Card hover shadow={false} padding="lg" className="custom">
          Content
        </Card>
      )
      const card = container.firstChild

      expect(card).toHaveClass('p-8')
      expect(card).toHaveClass('hover:shadow-kawaii-lg')
      expect(card).not.toHaveClass('shadow-kawaii')
      expect(card).toHaveClass('custom')
    })
  })
})
