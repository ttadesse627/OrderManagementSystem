import { randomUUID } from 'crypto';
import { Order} from '../types/order';
import { User} from '../types/auth';
import { Product, ProductResponse} from '../types/product';

export const mockProducts: ProductResponse[] = [
  {
    id: '3e03b1f4-8f4e-4c2a-9d6a-1c2b3d4e5f60',
    name: 'Wireless Bluetooth Headphones',
    price: 129.99,
    imageUrl: `${process.env.NEXT_PUBLIC_API_URL}/uplaods/'3e03b1f4-8f4e-4c2a-9d6a-1c2b3d4e5f60/ecommerce.jpg'`,
    category: 'Electronics',
    stockQuantity: 25
  },
  {
    id: '3e03b1f4-8f4e-4c2a-9d6a-1c2b3d4e5f60',
    name: 'Smart Watch Pro',
    description: 'Fitness tracker with heart rate monitor and GPS',
    price: 249.99,
    image: '/images/smartwatch.jpg',
    category: 'Electronics',
    stock: 15
  },
  {
    id: '3e03b1f4-8f4e-4c2a-9d6a-1c2b3d4e5f60',
    name: 'Organic Coffee Beans',
    description: 'Premium arabica beans, 1kg package',
    price: 24.99,
    image: '/images/coffee.jpg',
    category: 'Food & Beverage',
    stock: 100
  },
  {
    id: '3e03b1f4-8f4e-4c2a-9d6a-1c2b3d4e5f60',
    name: 'Yoga Mat Premium',
    description: 'Non-slip, eco-friendly yoga mat with carrying strap',
    price: 39.99,
    image: '/images/yogamat.jpg',
    category: 'Fitness',
    stock: 40
  },
  {
    id: '3e03b1f4-8f4e-4c2a-9d6a-1c2b3d4e5f60',
    name: 'Desk Lamp with Wireless Charger',
    description: 'LED desk lamp with USB ports and wireless charging pad',
    price: 59.99,
    image: '/images/desklamp.jpg',
    category: 'Home & Office',
    stock: 30
  },
  {
    id: '3e03b1f4-8f4e-4c2a-9d6a-1c2b3d4e5f60',
    name: 'Backpack Waterproof',
    description: '30L capacity waterproof backpack with laptop compartment',
    price: 79.99,
    image: '/images/backpack.jpg',
    category: 'Travel',
    stock: 20
  }
];


// Mock users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '2',
    name: 'Seller User',
    email: 'seller@example.com',
    role: 'seller',
    phone: '+1234567890',
    address: '123 Seller St, NY',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
  },
  {
    id: '3',
    name: 'Customer User',
    email: 'customer@example.com',
    role: 'customer',
    phone: '+1987654321',
    address: '456 Customer Ave, CA',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-13T00:00:00Z',
  },
];

// Mock orders
export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    customerId: '3',
    customer: {
      id: '3',
      name: 'Customer User',
      email: 'customer@example.com',
    },
    items: [
      { id: '1', productId: '1', productName: 'Wireless Headphones', quantity: 1, price: 129.99, total: 129.99 },
      { id: '2', productId: '2', productName: 'Phone Case', quantity: 2, price: 19.99, total: 39.98 },
    ],
    totalAmount: 169.97,
    shippingAddress: '123 Main St, New York, NY 10001',
    status: 'delivered',
    paymentStatus: 'paid',
    paymentMethod: 'Credit Card',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    customerId: '3',
    customer: {
      id: '3',
      name: 'Customer User',
      email: 'customer@example.com',
    },
    items: [
      { id: '3', productId: '3', productName: 'Smart Watch', quantity: 1, price: 199.99, total: 199.99 },
    ],
    totalAmount: 199.99,
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90001',
    status: 'processing',
    paymentStatus: 'paid',
    paymentMethod: 'PayPal',
    createdAt: '2024-01-14T15:45:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
  },
];

// Mock login function
export const mockLogin = (email: string, password: string) => {
  const user = mockUsers.find(u => u.email === email);
  
  if (!user || password !== 'password123') {
    throw new Error('Invalid credentials');
  }

  return {
    user,
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  };
};

// Mock register function
export const mockRegister = (data: any) => {
  const newUser: User = {
    id: randomUUID(),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    role: data.role || 'Customer',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  mockUsers.push(newUser);

  return {
    user: newUser,
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  };
};