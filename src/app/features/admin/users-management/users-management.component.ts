import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { UserProfile } from '../../../core/models/user-profile.model';
import { Page } from '../../../core/models/page.model';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './users-management.component.html',
  styleUrl: './users-management.component.scss'
})
export class UsersManagementComponent implements OnInit {
  adminService = inject(AdminService);

  users = signal<UserProfile[]>([]);
  totalPages = signal(0);
  currentPage = signal(0);
  totalElements = signal(0);
  isLoading = signal(true);
  search = signal('');
  selectedUser = signal<UserProfile | null>(null);
  showRoleModal = signal(false);
  showDeleteModal = signal(false);

  availableRoles = ['ROLE_USER', 'ROLE_SELLER', 'ROLE_ADMIN'];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(page: number = 0): void {
    this.isLoading.set(true);
    this.adminService.getAllUsers(page, 20, this.search()).subscribe({
      next: (data: Page<UserProfile>) => {
        this.users.set(data.content);
        this.totalPages.set(data.totalPages);
        this.currentPage.set(data.number);
        this.totalElements.set(data.totalElements);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onSearch(): void {
    this.loadUsers(0);
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.loadUsers(page);
    }
  }

  openRoleModal(user: UserProfile): void {
    this.selectedUser.set(user);
    this.showRoleModal.set(true);
  }

  closeRoleModal(): void {
    this.showRoleModal.set(false);
    this.selectedUser.set(null);
  }

  toggleRole(role: string): void {
    const user = this.selectedUser();
    if (!user) return;

    if (user.roles.includes(role)) {
      this.removeRole(user.id, role);
    } else {
      this.addRole(user.id, role);
    }
  }

  addRole(userId: number, role: string): void {
    this.adminService.addRole(userId, role).subscribe({
      next: (updated) => {
        this.updateUserInList(updated);
        alert(`Rôle ${role} ajouté avec succès`);
      },
      error: (err) => alert('Erreur: ' + (err.error?.message || 'Impossible d\'ajouter le rôle'))
    });
  }

  removeRole(userId: number, role: string): void {
    this.adminService.removeRole(userId, role).subscribe({
      next: (updated) => {
        this.updateUserInList(updated);
        alert(`Rôle ${role} retiré avec succès`);
      },
      error: (err) => alert('Erreur: ' + (err.error?.message || 'Impossible de retirer le rôle'))
    });
  }

  toggleUserStatus(user: UserProfile): void {
    if (user.enabled) {
      this.adminService.disableUser(user.id).subscribe({
        next: () => {
          user.enabled = false;
          alert('Utilisateur désactivé');
        }
      });
    } else {
      this.adminService.enableUser(user.id).subscribe({
        next: () => {
          user.enabled = true;
          alert('Utilisateur réactivé');
        }
      });
    }
  }

  openDeleteModal(user: UserProfile): void {
    this.selectedUser.set(user);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.selectedUser.set(null);
  }

  confirmDelete(): void {
    const user = this.selectedUser();
    if (!user) return;

    this.adminService.deleteUser(user.id).subscribe({
      next: () => {
        this.loadUsers(this.currentPage());
        this.closeDeleteModal();
        alert('Utilisateur supprimé avec succès');
      },
      error: (err) => alert('Erreur: ' + (err.error?.message || 'Impossible de supprimer'))
    });
  }

  private updateUserInList(updated: UserProfile): void {
    const index = this.users().findIndex(u => u.id === updated.id);
    if (index !== -1) {
      const newUsers = [...this.users()];
      newUsers[index] = updated;
      this.users.set(newUsers);
      if (this.selectedUser()?.id === updated.id) {
        this.selectedUser.set(updated);
      }
    }
  }

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ROLE_ADMIN': return 'badge-error';
      case 'ROLE_SELLER': return 'badge-warning';
      case 'ROLE_USER': return 'badge-primary';
      default: return 'badge-gray';
    }
  }
}
