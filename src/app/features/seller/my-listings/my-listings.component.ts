import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ListingService } from '../../../core/services/listing.service';
import { Listing } from '../../../core/models/listing.model';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './my-listings.component.html',
  styleUrl: './my-listings.component.scss'
})
export class MyListingsComponent implements OnInit {
  private listingService = inject(ListingService);

  listings = signal<Listing[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadMyListings();
  }

  loadMyListings(): void {
    this.isLoading.set(true);
    this.listingService.getMyListings().subscribe({
      next: (data) => {
        this.listings.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  deleteListing(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      return;
    }

    this.listingService.deleteListing(id).subscribe({
      next: () => {
        alert('Offre supprimée avec succès');
        this.loadMyListings();
      },
      error: () => {
        alert('Erreur lors de la suppression');
      }
    });
  }

  getStatusBadgeClass(listing: Listing): string {
    if (!listing.active) return 'status-inactive';
    if (listing.quantity === 0) return 'status-out-of-stock';
    if (listing.quantity <= 5) return 'status-low-stock';
    return 'status-active';
  }

  getStatusText(listing: Listing): string {
    if (!listing.active) return 'Désactivé';
    if (listing.quantity === 0) return 'Rupture de stock';
    if (listing.quantity <= 5) return 'Stock faible';
    return 'Actif';
  }

  getActiveListingsCount(): number {
    return this.listings().filter(l => l.active).length;
  }

  getTotalStock(): number {
    return this.listings().reduce((sum, l) => sum + l.quantity, 0);
  }
}
