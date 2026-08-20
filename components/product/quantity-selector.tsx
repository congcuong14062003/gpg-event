'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function QuantitySelector({
  value,
  onIncrement,
  onDecrement,
  onChange,
  size = 'md',
  className,
}: QuantitySelectorProps) {
  const btnSize = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border border-border bg-background',
        className
      )}
    >
      <button
        type="button"
        onClick={onDecrement}
        disabled={value <= 1}
        className={cn(
          'flex items-center justify-center rounded-l-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent',
          btnSize
        )}
        aria-label="Giảm số lượng"
      >
        <Minus className={iconSize} />
      </button>
      <input
        type="number"
        value={value}
        min={1}
        onChange={(e) => {
          const v = parseInt(e.target.value, 10);
          if (onChange && Number.isInteger(v) && v > 0) onChange(v);
        }}
        className={cn(
          'w-10 border-0 bg-transparent text-center text-sm font-semibold text-foreground focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
          size === 'sm' && 'py-1'
        )}
        aria-label="Số lượng"
      />
      <button
        type="button"
        onClick={onIncrement}
        className={cn(
          'flex items-center justify-center rounded-r-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground',
          btnSize
        )}
        aria-label="Tăng số lượng"
      >
        <Plus className={iconSize} />
      </button>
    </div>
  );
}
