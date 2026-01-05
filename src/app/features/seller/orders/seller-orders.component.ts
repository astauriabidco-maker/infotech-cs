import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-seller-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './seller-orders.component.html',
  styleUrl: './seller-orders.component.scss'
})
export class SellerOrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  isLoading = signal(true);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    // TODO: Créer un endpoint backend GET /api/seller/orders
    // Pour l'instant, on utilise l'endpoint user qui retournera toutes les commandes
    // Le backend devrait filtrer les commandes contenant au moins un listing du vendeur
    this.orderService.getUserOrders().subscribe({
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
    return this.orders().reduce((sum, order) => sum + order.total, 0);
  }

  getPendingOrdersCount(): number {
    return this.orders().filter(o => o.status === 'CREATED' || o.status === 'PAID').length;
  }

  getShippedOrdersCount(): number {
    return this.orders().filter(o => o.status === 'SHIPPED' || o.status === 'COMPLETED').length;
  }
}
