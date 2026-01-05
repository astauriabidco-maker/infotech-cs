import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { EmailService } from '../../core/services/email.service';
import { HeaderComponent } from '../../shared/header/header.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { CreateOrderRequest } from '../../core/models/order.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  private fb = inject(FormBuilder);
  private cartService = inject(CartService);
  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private emailService = inject(EmailService);
  private router = inject(Router);

  currentStep = signal<'shipping' | 'payment' | 'confirmation'>('shipping');
  isProcessing = signal(false);
  orderCompleted = signal(false);
  orderNumber = signal<string>('');

  currentUser = computed(() => this.authService.currentUser());
  cartSummary = computed(() => this.cartService.cartSummary());

  shippingForm: FormGroup;
  paymentForm: FormGroup;

  constructor() {
    this.shippingForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', Validators.required],
      country: ['France', Validators.required]
    });

    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      cardName: ['', Validators.required],
      expiryDate: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]]
    });
  }

  ngOnInit(): void {
    const user = this.currentUser();
    if (!user) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    // Pré-remplir avec les données utilisateur si disponibles
    if (user.email) {
      this.shippingForm.patchValue({
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ')[1] || ''
      });
    }

    // Charger le panier
    this.cartService.loadCart().subscribe();

    // Vérifier que le panier n'est pas vide
    if (this.cartSummary().itemCount === 0) {
      this.router.navigate(['/cart']);
    }
  }

  goToStep(step: 'shipping' | 'payment' | 'confirmation'): void {
    if (step === 'payment' && !this.shippingForm.valid) {
      this.shippingForm.markAllAsTouched();
      return;
    }
    this.currentStep.set(step);
  }

  submitOrder(): void {
    if (!this.paymentForm.valid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const user = this.currentUser();
    if (!user) return;

    this.isProcessing.set(true);

    const cartItems = this.cartSummary().items;
    const orderRequest: CreateOrderRequest = {
      buyerId: user.id,
      items: cartItems.map(item => ({
        listingId: item.listingId,
        quantity: item.quantity
      }))
    };

    this.orderService.createOrder(orderRequest).subscribe({
      next: (order) => {
        this.isProcessing.set(false);
        this.orderCompleted.set(true);
        
        // Générer le numéro de commande
        const timestamp = new Date().getTime();
        const formattedOrderNumber = `INF-${timestamp.toString().slice(-6)}-${order.id.toString().padStart(4, '0')}`;
        this.orderNumber.set(formattedOrderNumber);
        
        // Envoyer l'email de confirmation automatiquement
        const userEmail = this.shippingForm.get('email')?.value || user.email;
        this.emailService.sendOrderConfirmation(order, userEmail, formattedOrderNumber).subscribe({
          next: () => console.log('✅ Email de confirmation envoyé'),
          error: (err) => console.error('❌ Erreur email confirmation:', err)
        });
        
        // Vider le panier
        this.cartService.clearCart().subscribe();
        
        // Redirection vers la page de confirmation avec l'orderId
        this.router.navigate(['/orders/confirmation'], { 
          queryParams: { orderId: order.id } 
        });
      },
      error: (error) => {
        console.error('Error creating order:', error);
        this.isProcessing.set(false);
        alert('Erreur lors de la création de la commande');
      }
    });
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  viewOrders(): void {
    this.router.navigate(['/orders']);
  }
}
