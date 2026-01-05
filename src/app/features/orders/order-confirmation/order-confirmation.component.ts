import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { EmailService } from '../../../core/services/email.service';
import { AuthService } from '../../../core/services/auth.service';
import { Order } from '../../../core/models/order.model';
import { HeaderComponent } from '../../../shared/header/header.component';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.scss'
})
export class OrderConfirmationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private emailService = inject(EmailService);
  private authService = inject(AuthService);

  order = signal<Order | null>(null);
  isLoading = signal<boolean>(true);
  orderNumber = signal<string>('');
  emailSending = signal<boolean>(false);

  ngOnInit(): void {
    const orderId = this.route.snapshot.queryParamMap.get('orderId');
    
    if (!orderId) {
      // Si pas d'orderId, rediriger vers les commandes
      this.router.navigate(['/orders']);
      return;
    }

    this.loadOrder(Number(orderId));
    this.generateOrderNumber(Number(orderId));
  }

  private loadOrder(orderId: number): void {
    this.orderService.getOrder(orderId).subscribe({
      next: (order) => {
        this.order.set(order);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.router.navigate(['/orders']);
      }
    });
  }

  private generateOrderNumber(orderId: number): void {
    // Générer un numéro de commande formaté (style Back Market)
    const timestamp = new Date().getTime();
    const formatted = `INF-${timestamp.toString().slice(-6)}-${orderId.toString().padStart(4, '0')}`;
    this.orderNumber.set(formatted);
  }

  getEstimatedDeliveryDate(): string {
    // Date estimée : J+3 à J+7 jours ouvrés
    const today = new Date();
    const minDate = new Date(today);
    const maxDate = new Date(today);
    
    minDate.setDate(today.getDate() + 3);
    maxDate.setDate(today.getDate() + 7);
    
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    
    return `Entre le ${minDate.toLocaleDateString('fr-FR', options)} et le ${maxDate.toLocaleDateString('fr-FR', options)}`;
  }

  downloadInvoice(): void {
    alert('Téléchargement de la facture (fonctionnalité à implémenter avec le backend)');
  }

  sendConfirmationEmail(): void {
    const currentOrder = this.order();
    const user = this.authService.currentUser();
    
    if (!currentOrder || !user) {
      alert('Impossible d\'envoyer l\'email. Veuillez réessayer.');
      return;
    }

    this.emailSending.set(true);
    
    this.emailService.sendOrderConfirmation(
      currentOrder, 
      user.email, 
      this.orderNumber()
    ).subscribe({
      next: () => {
        this.emailSending.set(false);
        alert('✅ Email de confirmation envoyé avec succès !');
      },
      error: (error) => {
        this.emailSending.set(false);
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        alert('❌ Erreur lors de l\'envoi de l\'email. Veuillez réessayer.');
      }
    });
  }
}
