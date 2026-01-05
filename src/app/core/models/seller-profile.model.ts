/**
 * Modèle de profil vendeur
 */

export interface SellerProfile {
  id: number;
  shopName: string;
  description: string;
  contactEmail: string;
  userId: number;
  userEmail: string;
}

export interface CreateSellerProfileRequest {
  shopName: string;
  description: string;
  contactEmail: string;
}
