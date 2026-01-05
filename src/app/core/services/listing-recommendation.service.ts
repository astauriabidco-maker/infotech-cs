import { Injectable } from '@angular/core';
import { Listing } from '../models/listing.model';

export interface ListingScore {
  listing: Listing;
  score: number;
  conditionScore: number;
  priceScore: number;
  stockScore: number;
  isRecommended: boolean;
}

export type ConditionLevel = 'new' | 'excellent' | 'very-good' | 'good' | 'fair' | 'unknown';

@Injectable({
  providedIn: 'root'
})
export class ListingRecommendationService {

  /**
   * Détermine le niveau de condition basé sur le texte libre conditionNote
   */
  getConditionLevel(conditionNote: string | undefined): ConditionLevel {
    if (!conditionNote) return 'unknown';
    
    const note = conditionNote.toLowerCase();
    
    // Neuf
    if (note.includes('neuf') || note.includes('scellé') || note.includes('new') || note.includes('jamais utilisé')) {
      return 'new';
    }
    
    // Excellent
    if (note.includes('excellent') || note.includes('parfait') || note.includes('comme neuf') || note.includes('impeccable')) {
      return 'excellent';
    }
    
    // Très bon
    if (note.includes('très bon') || note.includes('tres bon') || note.includes('très bonne') || note.includes('quasi neuf')) {
      return 'very-good';
    }
    
    // Bon
    if (note.includes('bon') || note.includes('bonne') || note.includes('correct') || note.includes('fonctionnel')) {
      return 'good';
    }
    
    // État correct/moyen
    if (note.includes('moyen') || note.includes('rayure') || note.includes('usure') || note.includes('trace')) {
      return 'fair';
    }
    
    return 'unknown';
  }

  /**
   * Obtient le label français pour un niveau de condition
   */
  getConditionLabel(level: ConditionLevel): string {
    const labels: Record<ConditionLevel, string> = {
      'new': 'Neuf',
      'excellent': 'Excellent état',
      'very-good': 'Très bon état',
      'good': 'Bon état',
      'fair': 'État correct',
      'unknown': 'Non spécifié'
    };
    return labels[level];
  }

  /**
   * Score de condition (0-100)
   */
  private getConditionScore(level: ConditionLevel): number {
    const scores: Record<ConditionLevel, number> = {
      'new': 100,
      'excellent': 85,
      'very-good': 70,
      'good': 55,
      'fair': 40,
      'unknown': 30
    };
    return scores[level];
  }

  /**
   * Score de prix (0-100) - plus le prix est bas, plus le score est élevé
   */
  private getPriceScore(listing: Listing, allListings: Listing[]): number {
    if (allListings.length === 0) return 50;
    
    const prices = allListings.map(l => l.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === maxPrice) return 100;
    
    // Inverse: prix bas = score élevé
    return 100 - ((listing.price - minPrice) / (maxPrice - minPrice)) * 100;
  }

  /**
   * Score de stock (0-100)
   */
  private getStockScore(quantity: number): number {
    if (quantity === 0) return 0;
    if (quantity >= 10) return 100;
    return quantity * 10; // 1=10, 5=50, 10=100
  }

  /**
   * Calcule le score global d'un listing
   * Pondération: Condition 50% | Prix 35% | Stock 15%
   */
  calculateScore(listing: Listing, allListings: Listing[]): ListingScore {
    const condition = this.getConditionLevel(listing.conditionNote);
    const conditionScore = this.getConditionScore(condition);
    const priceScore = this.getPriceScore(listing, allListings);
    const stockScore = this.getStockScore(listing.quantity);
    
    // Score global pondéré
    const score = (conditionScore * 0.5) + (priceScore * 0.35) + (stockScore * 0.15);
    
    return {
      listing,
      score,
      conditionScore,
      priceScore,
      stockScore,
      isRecommended: false
    };
  }

  /**
   * Trouve le meilleur listing (recommandé)
   */
  getRecommendedListing(listings: Listing[]): Listing | null {
    if (listings.length === 0) return null;
    
    const scoredListings = listings.map(l => this.calculateScore(l, listings));
    
    // Trier par score décroissant
    scoredListings.sort((a, b) => b.score - a.score);
    
    // Marquer le meilleur comme recommandé
    if (scoredListings.length > 0) {
      scoredListings[0].isRecommended = true;
      return scoredListings[0].listing;
    }
    
    return null;
  }

  /**
   * Obtient tous les listings triés par score
   */
  getSortedListings(listings: Listing[]): ListingScore[] {
    const scored = listings.map(l => this.calculateScore(l, listings));
    scored.sort((a, b) => b.score - a.score);
    
    // Marquer le meilleur
    if (scored.length > 0) {
      scored[0].isRecommended = true;
    }
    
    return scored;
  }

  /**
   * Obtient la couleur du badge selon l'état
   */
  getConditionColor(level: ConditionLevel): string {
    const colors: Record<ConditionLevel, string> = {
      'new': '#10b981',         // Vert
      'excellent': '#3b82f6',   // Bleu
      'very-good': '#8b5cf6',   // Violet
      'good': '#f59e0b',        // Orange
      'fair': '#ef4444',        // Rouge
      'unknown': '#6b7280'      // Gris
    };
    return colors[level];
  }
}
