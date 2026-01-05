import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'products/:id/passport',
    loadComponent: () => import('./features/products/digital-passport/digital-passport.component').then(m => m.DigitalPassportComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./features/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./features/favorites/favorites.component').then(m => m.FavoritesComponent)
  },
  {
    path: 'orders',
    loadComponent: () => import('./features/orders/order-list/order-list.component').then(m => m.OrderListComponent)
  },
  {
    path: 'orders/confirmation',
    loadComponent: () => import('./features/orders/order-confirmation/order-confirmation.component').then(m => m.OrderConfirmationComponent)
  },
  {
    path: 'orders/:id',
    loadComponent: () => import('./features/orders/order-detail/order-detail.component').then(m => m.OrderDetailComponent)
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'admin/users',
    loadComponent: () => import('./features/admin/users-management/users-management.component').then(m => m.UsersManagementComponent)
  },
  {
    path: 'seller/setup',
    loadComponent: () => import('./features/seller/setup/seller-setup.component').then(m => m.SellerSetupComponent)
  },
  {
    path: 'seller/dashboard',
    loadComponent: () => import('./features/seller/dashboard/seller-dashboard.component').then(m => m.SellerDashboardComponent)
  },
  {
    path: 'seller/products',
    loadComponent: () => import('./features/seller/products/seller-products.component').then(m => m.SellerProductsComponent)
  },
  {
    path: 'seller/listings',
    loadComponent: () => import('./features/seller/my-listings/my-listings.component').then(m => m.MyListingsComponent)
  },
  {
    path: 'seller/listings/create',
    loadComponent: () => import('./features/seller/create-listing/create-listing.component').then(m => m.CreateListingComponent)
  },
  {
    path: 'seller/orders',
    loadComponent: () => import('./features/seller/orders/seller-orders.component').then(m => m.SellerOrdersComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
