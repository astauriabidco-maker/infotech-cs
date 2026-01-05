import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ListingService } from '../../../core/services/listing.service';
import { ProductAdminService } from '../../../core/services/product-admin.service';
import { ImageService } from '../../../core/services/image.service';
import { UserService } from '../../../core/services/user.service';
import { SellerProfileService } from '../../../core/services/seller-profile.service';
import { CategoryService } from '../../../core/services/category.service';
import { Listing } from '../../../core/models/listing.model';
import { Category } from '../../../core/models/category.model';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-seller-products',
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './seller-products.component.html',
  styleUrls: ['./seller-products.component.scss']
})
export class SellerProductsComponent implements OnInit {
  isLoading = signal(true);
  listings = signal<Listing[]>([]);
  categories = signal<Category[]>([]);
  
  // Modal ajout produit
  showAddModal = signal(false);
  
  // Formulaire produit
  newProduct = {
    title: '',
    brand: '',
    model: '',
    condition: 'Excellent',
    description: '',
    categoryId: null as number | null,
    price: 0,
    quantity: 1,
    conditionNote: ''
  };

  // Upload d'images
  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  isUploading = signal(false);

  conditions = ['Neuf', 'Excellent', 'Très bon état', 'Bon état', 'Correct'];

  constructor(
    private listingService: ListingService,
    private productAdminService: ProductAdminService,
    private imageService: ImageService,
    private userService: UserService,
    private sellerProfileService: SellerProfileService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkSellerProfile();
  }

  /**
   * Vérifier si le profil vendeur existe
   * Si non, rediriger vers la page de setup
   */
  private checkSellerProfile() {
    this.sellerProfileService.getMyProfile().subscribe({
      next: () => {
        // Le profil existe, charger les données
        this.loadCategories();
        this.loadListings();
      },
      error: () => {
        // Le profil n'existe pas, rediriger vers setup
        alert('Vous devez d\'abord créer votre profil vendeur');
        this.router.navigate(['/seller/setup']);
      }
    });
  }

  /**
   * Charger les catégories disponibles
   */
  private loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (error) => {
        console.error('Erreur chargement catégories:', error);
      }
    });
  }

  private loadListings() {
    this.isLoading.set(true);
    this.listingService.getMyListings().subscribe({
      next: (listings) => {
        this.listings.set(listings);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erreur chargement listings:', error);
        this.isLoading.set(false);
      }
    });
  }

  openAddModal() {
    this.showAddModal.set(true);
  }

  closeAddModal() {
    this.showAddModal.set(false);
    this.resetForm();
  }

  private resetForm() {
    this.newProduct = {
      title: '',
      brand: '',
      model: '',
      condition: 'Excellent',
      description: '',
      categoryId: null,
      price: 0,
      quantity: 1,
      conditionNote: ''
    };
    this.selectedFiles = [];
    this.imagePreviews = [];
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      this.selectedFiles = files;

      // Générer les aperçus
      this.imagePreviews = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer?.files) {
      const files = Array.from(event.dataTransfer.files);
      this.selectedFiles = files;

      // Générer les aperçus
      this.imagePreviews = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  removeImage(index: number) {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  async createProduct() {
    if (!this.newProduct.title || !this.newProduct.brand || !this.newProduct.model) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (this.selectedFiles.length === 0) {
      alert('Veuillez ajouter au moins une image');
      return;
    }

    this.isUploading.set(true);

    try {
      // 1. Créer le produit
      const productRequest: any = {
        title: this.newProduct.title,
        brand: this.newProduct.brand,
        model: this.newProduct.model,
        condition: this.newProduct.condition,
        description: this.newProduct.description
      };

      // Ajouter categoryId seulement s'il est sélectionné
      if (this.newProduct.categoryId) {
        productRequest.categoryId = this.newProduct.categoryId;
      }

      const product = await this.productAdminService.createProduct(productRequest).toPromise();

      if (!product) {
        throw new Error('Erreur lors de la création du produit');
      }

      // 2. Upload les images sur Cloudinary
      await this.imageService.uploadMultipleProductImages(
        product.id,
        this.selectedFiles,
        this.newProduct.title
      ).toPromise();

      // 3. Obtenir le profil vendeur
      const profile = await this.userService.getMyProfile().toPromise();
      
      if (!profile?.sellerInfo) {
        throw new Error('Profil vendeur introuvable');
      }

      // 4. Créer le listing
      const listingRequest = {
        productId: product.id,
        sellerProfileId: profile.sellerInfo.sellerId,
        price: this.newProduct.price,
        quantity: this.newProduct.quantity,
        conditionNote: this.newProduct.conditionNote
      };

      await this.listingService.createListing(listingRequest).toPromise();

      // 5. Recharger les listings
      this.loadListings();
      this.closeAddModal();
      alert('Produit créé avec succès !');

    } catch (error) {
      console.error('Erreur création produit:', error);
      alert('Erreur lors de la création du produit');
    } finally {
      this.isUploading.set(false);
    }
  }

  deleteListing(id: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }

    this.listingService.deleteListing(id).subscribe({
      next: () => {
        this.loadListings();
        alert('Produit supprimé avec succès');
      },
      error: (error) => {
        console.error('Erreur suppression:', error);
        alert('Erreur lors de la suppression');
      }
    });
  }
}
