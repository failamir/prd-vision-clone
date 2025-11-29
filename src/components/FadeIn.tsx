import React from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps {
    children: React.ReactNode;
    className?: string;
    delay?: number; // delay in milliseconds
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export const FadeIn: React.FC<FadeInProps> = ({
    children,
    className,
    delay = 0,
    direction = 'up'
}) => {
    const getDirectionClass = () => {
        switch (direction) {
            case 'up': return 'slide-in-from-bottom-8';
            case 'down': return 'slide-in-from-top-8';
            case 'left': return 'slide-in-from-right-8';
            case 'right': return 'slide-in-from-left-8';
            default: return '';
        }
    };

    return (
        <div
            className={cn(
                "animate-in fade-in duration-700",
                getDirectionClass(),
                className
            )}
            style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
        >
            {children}
        </div>
    );
};
