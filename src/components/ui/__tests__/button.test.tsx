import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';

describe('Button Component', () => {
  test('renders correctly with children', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(<Button className="custom-class">Test Button</Button>);
    const button = screen.getByText('Test Button');
    expect(button).toHaveClass('custom-class');
  });

  test('handles onClick events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    const button = screen.getByText('Click Me');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('supports disabled state', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByText('Disabled Button');
    expect(button).toHaveAttribute('disabled');
  });

  test('applies variant styles', () => {
    render(<Button variant="destructive">Destructive Button</Button>);
    const button = screen.getByText('Destructive Button');
    expect(button).toHaveClass('bg-destructive');
  });

  test('applies size styles', () => {
    render(<Button size="sm">Small Button</Button>);
    const button = screen.getByText('Small Button');
    expect(button).toHaveClass('h-9');
  });
});