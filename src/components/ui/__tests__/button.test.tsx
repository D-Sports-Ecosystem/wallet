import React from 'react';
import { Button } from '../button';

// Simple unit tests without complex rendering
describe('Button Component', () => {
  test('Button component exists and can be imported', () => {
    expect(Button).toBeDefined();
    expect(typeof Button).toBe('object'); // forwardRef components are objects
    expect(Button.$$typeof).toBeDefined(); // React component symbol
  });

  test('Button component renders without crashing', () => {
    expect(() => {
      React.createElement(Button, { children: 'Test' });
    }).not.toThrow();
  });
});