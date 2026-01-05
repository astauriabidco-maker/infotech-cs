export interface UserProfile {
  id: number;
  email: string;
  displayName: string;
  roles: string[];
  createdAt: string;
  enabled: boolean;
  sellerInfo?: SellerInfo;
}

export interface SellerInfo {
  sellerId: number;
  shopName: string;
  description: string;
  contactEmail: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
  sellerProfile?: SellerProfileUpdate;
}

export interface SellerProfileUpdate {
  shopName?: string;
  description?: string;
  contactEmail?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UserStats {
  totalUsers: number;
  totalSellers: number;
  totalAdmins: number;
  enabledUsers: number;
  disabledUsers: number;
}

export interface SellerStats {
  sellerId: number;
  shopName: string;
  totalListings: number;
}
