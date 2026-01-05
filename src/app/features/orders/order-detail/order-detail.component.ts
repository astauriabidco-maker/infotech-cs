import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../../shared/header/header.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  template: '<app-header></app-header><main><div class="container"><h1>Détail commande</h1></div></main><app-footer></app-footer>'
})
export class OrderDetailComponent {}
