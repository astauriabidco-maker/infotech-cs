import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);

  order = signal<Order | null>(null);
  isLoading = signal(true);
  errorMessage = signal<string>('');

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrderDetail(+orderId);
    }
  }

  loadOrderDetail(orderId: number): void {
    this.isLoading.set(true);
    this.orderService.getOrder(orderId).subscribe({
      next: (order) => {
        this.order.set(order);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la commande:', error);
        this.errorMessage.set('Impossible de charger les détails de la commande');
        this.isLoading.set(false);
      }
    });
  }

  getOrderNumber(): string {
    const order = this.order();
    if (!order) return '';
    return order.orderNumber || `INF-${order.id.toString().padStart(4, '0')}`;
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'CREATED': 'Créée',
      'PAID': 'Payée',
      'SHIPPED': 'Expédiée',
      'COMPLETED': 'Terminée',
      'CANCELLED': 'Annulée'
    };
    return labels[status] || status;
  }

  getStatusBadgeClass(status: string): string {
    return {
      'CREATED': 'badge-warning',
      'PAID': 'badge-info',
      'SHIPPED': 'badge-primary',
      'COMPLETED': 'badge-success',
      'CANCELLED': 'badge-danger'
    }[status] || 'badge-secondary';
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }
}
