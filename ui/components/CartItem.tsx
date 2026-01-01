'use client';

import { Trash2, Minus, Plus } from 'lucide-react';
import Image from 'next/image';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

export default function CartItem({
  id,
  name,
  price,
  quantity,
  image,
  stock,
  onRemove,
  onUpdateQuantity,
}: CartItemProps) {
  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(id, quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < stock) {
      onUpdateQuantity(id, quantity + 1);
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200">
      <div className="relative h-20 w-20 flex-shrink-0">
        <Image
          src={image || '/images/placeholder.jpg'}
          alt={name}
          fill
          className="object-cover rounded-md"
          sizes="80px"
        />
      </div>

      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{name}</h3>
        <p className="text-lg font-bold text-gray-900 mt-1">
          ${(price * quantity).toFixed(2)}
        </p>
        <p className="text-sm text-gray-500">${price.toFixed(2)} each</p>
      </div>

      <div className="flex flex-col items-end space-y-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="h-4 w-4" />
          </button>
          
          <span className="w-12 text-center font-medium">{quantity}</span>
          
          <button
            onClick={handleIncrease}
            disabled={quantity >= stock}
            className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={() => onRemove(id)}
          className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}