import React from 'react';
import { Card } from '../types';
import classNames from 'classnames';

interface CardDisplayProps {
  card: Card | null;
  size?: 'sm' | 'md' | 'lg';
  placeholder?: string;
  onClick?: () => void;
  highlight?: boolean;
}

export const CardDisplay: React.FC<CardDisplayProps> = ({ 
  card, 
  size = 'md', 
  placeholder, 
  onClick,
  highlight = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-12 text-sm',
    md: 'w-12 h-16 text-lg',
    lg: 'w-16 h-24 text-2xl',
  };

  if (!card) {
    return (
      <div 
        onClick={onClick}
        className={classNames(
          sizeClasses[size],
          "rounded bg-gray-800 border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-500 cursor-pointer hover:border-poker-gold transition-colors",
          highlight ? "border-poker-gold bg-gray-800/50" : ""
        )}
      >
        {placeholder || '+'}
      </div>
    );
  }

  // const isRed = card.suit === 'h' || card.suit === 'd'; // Make diamonds red for standard look, or follow theme
  // Let's stick to the 4-color deck idea from CardSelector for better readability
  const suitColor = {
    'h': 'text-red-500',
    'd': 'text-blue-400',
    'c': 'text-green-500',
    's': 'text-purple-500',
  }[card.suit];

  const suitSymbol = {
    'h': '♥',
    'd': '♦',
    'c': '♣',
    's': '♠',
  }[card.suit];

  return (
    <div 
      onClick={onClick}
      className={classNames(
        sizeClasses[size],
        "rounded bg-gray-200 flex flex-col items-center justify-center font-bold leading-none cursor-pointer shadow-md relative",
        suitColor,
        highlight ? "ring-2 ring-poker-gold ring-offset-2 ring-offset-black" : ""
      )}
    >
      <span className="absolute top-1 left-1 text-[0.8em]">{card.rank}</span>
      <span className="text-[1.5em]">{suitSymbol}</span>
    </div>
  );
};
