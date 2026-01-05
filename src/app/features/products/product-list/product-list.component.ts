import { Component, OnInit, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { Product, ProductFilters } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { ProductCardComponent } from '../../../shared/product-card/product-card.component';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProductCardComponent, HeaderComponent, FooterComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {
  productService = inject(ProductService);
  categoryService = inject(CategoryService);
  route = inject(ActivatedRoute);

  products: Product[] = [];
  categories: Category[] = [];
  brands: string[] = [];
  conditions: string[] = [];

  filters: ProductFilters = {
    page: 0,
    size: 12
  };

  totalPages = 0;
  totalElements = 0;
  isLoading = true;
  showFilters = false;
  showBackToTop = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Show button after scrolling 300px
    this.showBackToTop = window.pageYOffset > 300;
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadBrands();
    this.loadConditions();
    
    this.route.queryParams.subscribe(params => {
      if (params['categoryId']) {
        this.filters.categoryId = +params['categoryId'];
      }
      if (params['search']) {
        this.filters.search = params['search'];
      }
      this.loadProducts();
    });
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts(this.filters).subscribe({
      next: (data) => {
        this.products = data.content;
        this.totalPages = data.totalPages;
        this.totalElements = data.totalElements;
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data) => this.categories = data
    });
  }

  loadBrands(): void {
    this.productService.getBrands().subscribe({
      next: (data) => this.brands = data
    });
  }

  loadConditions(): void {
    this.productService.getConditions().subscribe({
      next: (data) => this.conditions = data
    });
  }

  onFilterChange(): void {
    this.filters.page = 0;
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.filters.page = page;
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  clearFilters(): void {
    this.filters = {
      page: 0,
      size: 12
    };
    this.loadProducts();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
}
