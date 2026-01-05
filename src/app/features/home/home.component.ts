import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CategoryService } from '../../core/services/category.service';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ProductCardComponent, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  featuredProducts: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  isLoading = true;

  // Search
  searchQuery = '';
  showSuggestions = false;
  searchSuggestions: string[] = [];

  // Filter
  selectedCategoryId: number | null = null;

  ngOnInit(): void {
    // Scroll to top when landing on home page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.loadData();
  }

  loadData(): void {
    this.productService.getProducts({ page: 0, size: 20 }).subscribe({
      next: (data) => {
        this.featuredProducts = data.content;
        this.filteredProducts = data.content;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });

    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data
    });
  }

  // Search Methods
  onSearchInput(): void {
    if (this.searchQuery.length >= 2) {
      this.showSuggestions = true;
      this.generateSuggestions();
    } else {
      this.showSuggestions = false;
    }
  }

  generateSuggestions(): void {
    // Générer des suggestions basées sur les produits
    const query = this.searchQuery.toLowerCase();
    const suggestions = new Set<string>();

    this.featuredProducts.forEach(product => {
      if (product.title.toLowerCase().includes(query)) {
        suggestions.add(product.title);
      }
      if (product.brand?.toLowerCase().includes(query)) {
        suggestions.add(product.brand);
      }
    });

    this.searchSuggestions = Array.from(suggestions).slice(0, 5);
  }

  selectSuggestion(suggestion: string): void {
    this.searchQuery = suggestion;
    this.showSuggestions = false;
    this.searchProducts();
  }

  searchProducts(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], {
        queryParams: { search: this.searchQuery }
      });
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.showSuggestions = false;
    this.filteredProducts = this.featuredProducts;
  }

  // Category Filter
  filterByCategory(categoryId: number): void {
    this.selectedCategoryId = categoryId;
    this.router.navigate(['/products'], {
      queryParams: { categoryId: categoryId }
    });
  }

  resetCategory(): void {
    this.selectedCategoryId = null;
    this.filteredProducts = this.featuredProducts;
  }

  getSelectedCategoryName(): string {
    const category = this.categories.find(c => c.id === this.selectedCategoryId);
    return category?.name || '';
  }

  getCategoryEmoji(categoryName: string): string {
    const emojis: Record<string, string> = {
      'Smartphones': '📱',
      'Ordinateurs': '💻',
      'Tablettes': '📱',
      'Audio': '🎧',
      'Photo': '📷',
      'Gaming': '🎮',
      'Montres': '⌚',
      'Télévision': '📺',
      'Accessoires': '🔌'
    };
    return emojis[categoryName] || '📦';
  }
}
