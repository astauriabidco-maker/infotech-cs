import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DigitalPassportService } from '../../../core/services/digital-passport.service';
import { DigitalPassport } from '../../../core/models/digital-passport-backend.model';

@Component({
  selector: 'app-digital-passport',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './digital-passport.component.html',
  styleUrl: './digital-passport.component.scss'
})
export class DigitalPassportComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private passportService = inject(DigitalPassportService);
  
  productId!: number;
  passport = signal<DigitalPassport | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);
  
  // Tab actif
  activeTab = signal<'carbon' | 'materials' | 'durability' | 'certifications' | 'recycling'>('carbon');

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
      if (this.productId) {
        this.loadPassport();
      }
    });
  }

  private loadPassport(): void {
    this.passportService.getByProductId(this.productId).subscribe({
      next: (passport) => {
        this.passport.set(passport);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement passeport:', err);
        this.error.set('Passeport numérique non disponible pour ce produit');
        this.isLoading.set(false);
      }
    });
  }

  setActiveTab(tab: 'carbon' | 'materials' | 'durability' | 'certifications' | 'recycling'): void {
    this.activeTab.set(tab);
  }

  getScoreColor(score: string): string {
    const colors: Record<string, string> = {
      'A': '#00a550',
      'B': '#50b848',
      'C': '#ffc107',
      'D': '#ff9800',
      'E': '#f44336'
    };
    return colors[score] || '#666';
  }

  getMaterialIcon(material: any): string {
    if (material.renewable) return '🌱';
    if (material.recycled) return '♻️';
    if (material.recyclable) return '🔄';
    return '📦';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}
