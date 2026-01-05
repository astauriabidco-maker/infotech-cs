export interface Listing {
  id: number;
  productId: number;
  productTitle: string;
  productBrand: string;
  images: string[];
  sellerId: number;
  sellerShopName: string;
  price: number;
  quantity: number;
  conditionNote: string;
  active: boolean;
}

/**
 * DTO pour créer un nouveau listing (admin/seller)
 */
export interface CreateListingRequest {
  productId: number;
  sellerProfileId: number;
  price: number;
  quantity: number;
  conditionNote?: string;
}

/**
 * DTO pour modifier un listing existant
 */
export interface UpdateListingRequest {
  price?: number;
  quantity?: number;
  conditionNote?: string;
  active?: boolean;
}
