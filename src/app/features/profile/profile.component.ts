import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '../../core/models/user-profile.model';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  userService = inject(UserService);
  authService = inject(AuthService);

  profile = signal<UserProfile | null>(null);
  isLoading = signal(true);
  isEditing = signal(false);
  showPasswordModal = signal(false);

  // Form data
  displayName = signal('');
  shopName = signal('');
  shopDescription = signal('');
  contactEmail = signal('');

  // Password change
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.userService.getMyProfile().subscribe({
      next: (data) => {
        this.profile.set(data);
        this.displayName.set(data.displayName || '');
        if (data.sellerInfo) {
          this.shopName.set(data.sellerInfo.shopName || '');
          this.shopDescription.set(data.sellerInfo.description || '');
          this.contactEmail.set(data.sellerInfo.contactEmail || '');
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  toggleEdit(): void {
    this.isEditing.set(!this.isEditing());
  }

  saveProfile(): void {
    const request: UpdateProfileRequest = {
      displayName: this.displayName()
    };

    if (this.profile()?.sellerInfo) {
      request.sellerProfile = {
        shopName: this.shopName(),
        description: this.shopDescription(),
        contactEmail: this.contactEmail()
      };
    }

    this.userService.updateProfile(request).subscribe({
      next: (updated) => {
        this.profile.set(updated);
        this.isEditing.set(false);
        alert('Profil mis à jour avec succès');
      },
      error: (err) => alert('Erreur: ' + (err.error?.message || 'Impossible de mettre à jour le profil'))
    });
  }

  openPasswordModal(): void {
    this.showPasswordModal.set(true);
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  closePasswordModal(): void {
    this.showPasswordModal.set(false);
  }

  changePassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    if (this.newPassword.length < 6) {
      alert('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    const request: ChangePasswordRequest = {
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    };

    this.userService.changePassword(request).subscribe({
      next: () => {
        alert('Mot de passe changé avec succès');
        this.closePasswordModal();
      },
      error: (err) => alert('Erreur: ' + (err.error?.message || 'Impossible de changer le mot de passe'))
    });
  }

  deleteAccount(): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      return;
    }

    if (!confirm('DERNIÈRE CONFIRMATION : Toutes vos données seront définitivement supprimées.')) {
      return;
    }

    this.userService.deleteAccount().subscribe({
      next: () => {
        alert('Votre compte a été supprimé');
        this.authService.logout();
      },
      error: (err) => alert('Erreur: ' + (err.error?.message || 'Impossible de supprimer le compte'))
    });
  }

  hasRole(role: string): boolean {
    return this.profile()?.roles.includes(role) || false;
  }
}
