import { Product } from './types';

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    description: 'Noise-cancelling over-ear headphones with 30-hour battery life',
    price: 129.99,
    image: '/images/headphones.jpg',
    category: 'Electronics',
    stock: 25
  },
  {
    id: 2,
    name: 'Smart Watch Pro',
    description: 'Fitness tracker with heart rate monitor and GPS',
    price: 249.99,
    image: '/images/smartwatch.jpg',
    category: 'Electronics',
    stock: 15
  },
  {
    id: 3,
    name: 'Organic Coffee Beans',
    description: 'Premium arabica beans, 1kg package',
    price: 24.99,
    image: '/images/coffee.jpg',
    category: 'Food & Beverage',
    stock: 100
  },
  {
    id: 4,
    name: 'Yoga Mat Premium',
    description: 'Non-slip, eco-friendly yoga mat with carrying strap',
    price: 39.99,
    image: '/images/yogamat.jpg',
    category: 'Fitness',
    stock: 40
  },
  {
    id: 5,
    name: 'Desk Lamp with Wireless Charger',
    description: 'LED desk lamp with USB ports and wireless charging pad',
    price: 59.99,
    image: '/images/desklamp.jpg',
    category: 'Home & Office',
    stock: 30
  },
  {
    id: 6,
    name: 'Backpack Waterproof',
    description: '30L capacity waterproof backpack with laptop compartment',
    price: 79.99,
    image: '/images/backpack.jpg',
    category: 'Travel',
    stock: 20
  }
];