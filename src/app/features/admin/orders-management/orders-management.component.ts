import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent, FormsModule],
  templateUrl: './orders-management.component.html',
  styleUrl: './orders-management.component.scss'
})
export class OrdersManagementComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  isLoading = signal(true);
  searchQuery = signal('');
  selectedStatus = signal<string>('all');

  // Filtrer les commandes basé sur la recherche et le statut
  filteredOrders = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.selectedStatus();
    let filtered = this.orders();

    // Filtrer par statut
    if (status !== 'all') {
      filtered = filtered.filter(order => order.status === status);
    }

    // Filtrer par recherche
    if (query) {
      filtered = filtered.filter(order => {
        const orderNumber = order.orderNumber || `INF-${order.id.toString().padStart(4, '0')}`;
        return orderNumber.toLowerCase().includes(query);
      });
    }

    return filtered;
  });

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    // Utilise l'endpoint admin pour récupérer TOUTES les commandes de la plateforme
    this.orderService.getAdminOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    const statusMap: Record<string, string> = {
      'CREATED': 'status-pending',
      'PAID': 'status-processing',
      'SHIPPED': 'status-shipped',
      'COMPLETED': 'status-completed',
      'CANCELLED': 'status-cancelled'
    };
    return statusMap[status] || 'status-pending';
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'CREATED': 'Créée',
      'PAID': 'Payée',
      'SHIPPED': 'Expédiée',
      'COMPLETED': 'Terminée',
      'CANCELLED': 'Annulée'
    };
    return statusMap[status] || status;
  }

  getTotalRevenue(): number {
    return this.filteredOrders().reduce((sum, order) => sum + order.total, 0);
  }

  getOrdersByStatus(status: string): number {
    return this.filteredOrders().filter(o => o.status === status).length;
  }

  getOrderNumber(order: Order): string {
    return order.orderNumber || `INF-${order.id.toString().padStart(4, '0')}`;
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  changeStatusFilter(status: string): void {
    this.selectedStatus.set(status);
  }
}
