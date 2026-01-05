export interface Order {
  id: number;
  buyerId: number;
  createdAt: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  listingId: number;
  productTitle: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  buyerId: number;
  items: OrderItemRequest[];
}

export interface OrderItemRequest {
  listingId: number;
  quantity: number;
}

export type OrderStatus = 'CREATED' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
