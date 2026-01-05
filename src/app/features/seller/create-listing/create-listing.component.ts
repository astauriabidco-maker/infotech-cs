import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ListingService } from '../../../core/services/listing.service';
import { ProductService } from '../../../core/services/product.service';
import { AuthService } from '../../../core/services/auth.service';
import { Product } from '../../../core/models/product.model';
import { CreateListingRequest } from '../../../core/models/listing.model';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-create-listing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './create-listing.component.html',
  styleUrl: './create-listing.component.scss'
})
export class CreateListingComponent implements OnInit {
  private fb = inject(FormBuilder);
  private listingService = inject(ListingService);
  private productService = inject(ProductService);
  private authService = inject(AuthService);
  private router = inject(Router);

  listingForm!: FormGroup;
  products = signal<Product[]>([]);
  isLoading = signal(false);
  searchQuery = signal('');

  ngOnInit(): void {
    this.initForm();
    this.loadProducts();
  }

  initForm(): void {
    this.listingForm = this.fb.group({
      productId: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      conditionNote: ['']
    });
  }

  loadProducts(): void {
    this.productService.getProducts({ page: 0, size: 100 }).subscribe({
      next: (response) => {
        this.products.set(response.content);
      }
    });
  }

  searchProducts(): void {
    if (this.searchQuery().length >= 2) {
      this.productService.getProducts({ 
        search: this.searchQuery(),
        page: 0, 
        size: 20 
      }).subscribe({
        next: (response) => {
          this.products.set(response.content);
        }
      });
    } else {
      this.loadProducts();
    }
  }

  onProductSelect(productId: number): void {
    this.listingForm.patchValue({ productId });
  }

  onSubmit(): void {
    if (this.listingForm.invalid) {
      Object.keys(this.listingForm.controls).forEach(key => {
        this.listingForm.get(key)?.markAsTouched();
      });
      return;
    }

    const user = this.authService.currentUser();
    if (!user) {
      alert('Vous devez être connecté');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.isLoading.set(true);

    const request: CreateListingRequest = {
      productId: this.listingForm.value.productId,
      sellerProfileId: user.id, // Supposant que l'ID utilisateur = ID vendeur
      price: this.listingForm.value.price,
      quantity: this.listingForm.value.quantity,
      conditionNote: this.listingForm.value.conditionNote || undefined
    };

    this.listingService.createListing(request).subscribe({
      next: (listing) => {
        this.isLoading.set(false);
        alert(`Listing créé avec succès ! ID: ${listing.id}`);
        this.router.navigate(['/seller/listings']);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Erreur:', err);
        alert('Erreur lors de la création du listing');
      }
    });
  }

  getSelectedProduct(): Product | undefined {
    const productId = this.listingForm.get('productId')?.value;
    return this.products().find(p => p.id === productId);
  }
}
