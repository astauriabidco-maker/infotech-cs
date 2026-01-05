import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FavoriteService } from '../../core/services/favorite.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  private favoriteService = inject(FavoriteService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  isLoading = signal(true);
  favorites = computed(() => this.favoriteService.favorites());
  currentUser = computed(() => this.authService.currentUser());

  ngOnInit(): void {
    const user = this.currentUser();
    if (!user) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/favorites' } });
      return;
    }

    this.favoriteService.getFavorites().subscribe({
      next: () => this.isLoading.set(false),
      error: () => this.isLoading.set(false)
    });
  }

  removeFavorite(productId: number): void {
    const user = this.currentUser();
    if (user) {
      this.favoriteService.removeFavorite(productId, user.id).subscribe();
    }
  }

  addToCart(productId: number): void {
    const user = this.currentUser();
    if (!user) return;

    // TODO: Récupérer le vrai listingId
    const cartItem = {
      listingId: 1,
      quantity: 1,
      price: 699
    };

    this.cartService.addToCart(user.id, cartItem).subscribe({
      next: () => {
        alert('Produit ajouté au panier !');
        this.removeFavorite(productId);
      }
    });
  }
}
