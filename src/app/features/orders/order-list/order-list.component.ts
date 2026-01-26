import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { AuthService } from '../../../core/services/auth.service';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit {
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);

  orders = signal<Order[]>([]);
  isLoading = signal(true);
  currentUser = computed(() => this.authService.currentUser());

  ngOnInit(): void {
    const user = this.currentUser();
    if (!user) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/orders' } });
      return;
    }

    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'CREATED': 'badge-warning',
      'PAID': 'badge-info',
      'SHIPPED': 'badge-primary',
      'COMPLETED': 'badge-success',
      'CANCELLED': 'badge-error'
    };
    return classes[status] || 'badge-secondary';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'CREATED': 'En attente',
      'PAID': 'Payée',
      'SHIPPED': 'Expédiée',
      'COMPLETED': 'Livrée',
      'CANCELLED': 'Annulée'
    };
    return labels[status] || status;
  }

  getOrderNumber(order: Order): string {
    return order.orderNumber || `INF-${order.id.toString().padStart(4, '0')}`;
  }
}
