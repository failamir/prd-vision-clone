import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './button';

describe('Button component', () => {
    it('renders correctly with given text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
    });

    it('handles click events', async () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click me</Button>);

        // Simulate user interaction correctly
        const user = userEvent.setup();
        const button = screen.getByRole('button', { name: /click me/i });

        await user.click(button);
        expect(handleClick).toHaveBeenCalledOnce();
    });

    it('can be disabled', () => {
        render(<Button disabled>Disabled Button</Button>);
        const button = screen.getByRole('button', { name: /disabled button/i });
        expect(button).toBeDisabled();
    });
});
