export interface CartItem {
  id: number;
  listingId: number;
  productTitle: string;
  productBrand: string;
  price: number;
  quantity: number;
  sellerShopName: string;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  total: number;
  itemCount: number;
}
