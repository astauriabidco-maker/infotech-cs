export interface Product {
  id: number;
  title: string;
  brand: string;
  model: string;
  condition: string;
  description: string;
  categoryName: string;
  images: string[];
}

export interface ProductFilters {
  search?: string;
  categoryId?: number;
  brand?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
  sort?: string;
}

/**
 * DTO pour la création d'un produit (admin/seller)
 */
export interface CreateProductRequest {
  title: string;
  description?: string;
  brand: string;
  model: string;
  condition: string;
  categoryId?: number;
}

/**
 * DTO pour la modification d'un produit
 */
export interface UpdateProductRequest {
  title?: string;
  description?: string;
  brand?: string;
  model?: string;
  condition?: string;
  categoryId?: number;
}

/**
 * Représentation d'une image produit
 */
export interface ProductImage {
  id: number;
  url: string;
  altText?: string;
}

/**
 * Réponse de l'upload d'une image
 */
export interface UploadImageResponse {
  id: number;
  url: string;
  altText?: string;
  productId: number;
}
