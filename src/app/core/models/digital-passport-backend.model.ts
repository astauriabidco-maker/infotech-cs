/**
 * Modèle DigitalPassport aligné avec le backend
 * Correspond exactement au DigitalPassportDto.java
 */

export interface DigitalPassport {
  id: number;
  productId: number;
  carbonFootprint: CarbonFootprint;
  traceability: Traceability;
  materials: Material[];
  durability: Durability;
  certifications: Certification[];
  recyclingInfo: RecyclingInfo;
  createdAt: string;
  updatedAt: string;
}

export interface CarbonFootprint {
  id?: number;
  totalCO2: number;
  manufacturing: number;
  transportation: number;
  usage: number;
  endOfLife: number;
  score: string; // A, B, C, D, E
}

export interface Traceability {
  id?: number;
  originCountry: string;
  manufacturer: string;
  factory?: string;
  supplyChainJourney?: string[];
  transparencyScore: number;
}

export interface Material {
  id?: number;
  name: string;
  percentage: number;
  renewable: boolean;
  recycled: boolean;
  recyclable: boolean;
  origin?: string;
}

export interface Durability {
  id?: number;
  expectedLifespanYears?: number;
  repairabilityScore: number;
  repairabilityIndex: string; // A, B, C, D, E
  sparePartsAvailable: boolean;
  warrantyYears?: number;
  softwareUpdates?: boolean;
}

export interface Certification {
  id?: number;
  name: string;
  issuer: string;
  validUntil: string;
  logoUrl?: string;
  verificationUrl?: string;
  type: string;
}

export interface RecyclingInfo {
  id?: number;
  recyclablePercentage: number;
  instructions?: string;
  takeBackProgram: boolean;
  collectionPoints?: CollectionPoint[];
}

export interface CollectionPoint {
  id?: number;
  name: string;
  address: string;
  distance: string;
  acceptedMaterials?: string[];
}

/**
 * DTO pour créer/modifier un passeport numérique
 * Correspond à CreateDigitalPassportRequest.java
 */
export interface CreateDigitalPassportRequest {
  productId: number;
  carbonFootprint: {
    totalCO2: number;
    manufacturing: number;
    transportation: number;
    usage: number;
    endOfLife: number;
  };
  traceability: {
    originCountry: string;
    manufacturer: string;
    factory?: string;
    supplyChainJourney?: string[];
    transparencyScore: number;
  };
  materials: {
    name: string;
    percentage: number;
    renewable: boolean;
    recycled: boolean;
    recyclable: boolean;
    origin?: string;
  }[];
  durability: {
    expectedLifespanYears?: number;
    repairabilityScore: number;
    sparePartsAvailable: boolean;
    warrantyYears?: number;
    softwareUpdates?: boolean;
  };
  certifications?: {
    name: string;
    issuer: string;
    validUntil: string;
    logoUrl?: string;
    verificationUrl?: string;
    type: string;
  }[];
  recyclingInfo: {
    recyclablePercentage: number;
    instructions?: string;
    takeBackProgram: boolean;
    collectionPoints?: {
      name: string;
      address: string;
      distance: string;
      acceptedMaterials?: string[];
    }[];
  };
}
