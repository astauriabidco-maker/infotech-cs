/**
 * Composant pour la configuration initiale du profil vendeur
 */

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SellerProfileService } from '../../../core/services/seller-profile.service';
import { UserService } from '../../../core/services/user.service';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-seller-setup',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './seller-setup.component.html',
  styleUrls: ['./seller-setup.component.scss']
})
export class SellerSetupComponent implements OnInit {
  isLoading = signal(false);
  isSaving = signal(false);
  profileExists = signal(false);
  userEmail = signal('');

  setupForm = {
    shopName: '',
    description: '',
    contactEmail: ''
  };

  constructor(
    private sellerProfileService: SellerProfileService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    this.checkExistingProfile();
  }

  private loadUserInfo() {
    this.userService.getMyProfile().subscribe({
      next: (profile) => {
        this.userEmail.set(profile.email);
        this.setupForm.contactEmail = profile.email;
      },
      error: (error) => {
        console.error('Erreur chargement profil utilisateur:', error);
      }
    });
  }

  private checkExistingProfile() {
    this.isLoading.set(true);
    this.sellerProfileService.getMyProfile().subscribe({
      next: (profile) => {
        // Le profil existe déjà, pré-remplir le formulaire
        this.profileExists.set(true);
        this.setupForm.shopName = profile.shopName;
        this.setupForm.description = profile.description || '';
        this.setupForm.contactEmail = profile.contactEmail;
        this.isLoading.set(false);
      },
      error: () => {
        // Le profil n'existe pas, c'est normal
        this.profileExists.set(false);
        this.isLoading.set(false);
      }
    });
  }

  createProfile() {
    if (!this.setupForm.shopName || !this.setupForm.contactEmail) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.isSaving.set(true);

    this.sellerProfileService.createProfile(this.setupForm).subscribe({
      next: () => {
        alert('Profil vendeur créé avec succès !');
        this.router.navigate(['/seller/dashboard']);
      },
      error: (error) => {
        console.error('Erreur création profil:', error);
        alert('Erreur lors de la création du profil vendeur');
        this.isSaving.set(false);
      }
    });
  }

  updateProfile() {
    if (!this.setupForm.shopName || !this.setupForm.contactEmail) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.isSaving.set(true);

    this.sellerProfileService.updateProfile(this.setupForm).subscribe({
      next: () => {
        alert('Profil vendeur mis à jour avec succès !');
        this.router.navigate(['/seller/dashboard']);
      },
      error: (error) => {
        console.error('Erreur mise à jour profil:', error);
        alert('Erreur lors de la mise à jour du profil vendeur');
        this.isSaving.set(false);
      }
    });
  }

  cancel() {
    this.router.navigate(['/profile']);
  }
}
