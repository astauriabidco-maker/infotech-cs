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
  id: number;
  totalCO2: number;
  manufacturing: number;
  transportation: number;
  usage: number;
  endOfLife: number;
  score: string;
}

export interface Traceability {
  id: number;
  originCountry: string;
  manufacturer: string;
  factory: string | null;
  supplyChainJourney: string[];
  transparencyScore: number;
}

export interface Material {
  id: number;
  name: string;
  percentage: number;
  renewable: boolean;
  recycled: boolean;
  recyclable: boolean;
  origin: string;
}

export interface Durability {
  id: number;
  expectedLifespanYears: number | null;
  repairabilityScore: number;
  repairabilityIndex: number | null;
  sparePartsAvailable: boolean;
  warrantyYears: number | null;
  softwareUpdates: boolean | null;
}

export interface Certification {
  id: number;
  name: string;
  issuer: string;
  validUntil: string;
  logoUrl: string | null;
  verificationUrl: string | null;
  type: string;
}

export interface RecyclingInfo {
  id: number;
  recyclablePercentage: number;
  instructions: string;
  takeBackProgram: boolean;
  collectionPoints: CollectionPoint[];
}

export interface CollectionPoint {
  id: number;
  name: string;
  address: string;
  distance: string | null;
  acceptedMaterials: string[];
}

export interface CreateDigitalPassportRequest {
  productId: number;
  carbonFootprint: CarbonFootprintDto;
  traceability: TraceabilityDto;
  materials: MaterialDto[];
  durability: DurabilityDto;
  certifications: CertificationDto[];
  recyclingInfo: RecyclingInfoDto;
}

export interface CarbonFootprintDto {
  totalCO2: number;
  manufacturing: number;
  transportation: number;
  usage: number;
  endOfLife: number;
}

export interface TraceabilityDto {
  originCountry: string;
  manufacturer: string;
  factory: string | null;
  supplyChainJourney: string[];
  transparencyScore: number;
}

export interface MaterialDto {
  name: string;
  percentage: number;
  renewable: boolean;
  recycled: boolean;
  recyclable: boolean;
  origin: string;
}

export interface DurabilityDto {
  expectedLifespanYears: number | null;
  repairabilityScore: number;
  repairabilityIndex: number | null;
  sparePartsAvailable: boolean;
  warrantyYears: number | null;
  softwareUpdates: boolean | null;
}

export interface CertificationDto {
  name: string;
  issuer: string;
  validUntil: string;
  logoUrl: string | null;
  verificationUrl: string | null;
  type: string;
}

export interface RecyclingInfoDto {
  recyclablePercentage: number;
  instructions: string;
  takeBackProgram: boolean;
  collectionPoints: CollectionPointDto[];
}

export interface CollectionPointDto {
  name: string;
  address: string;
  distance: string | null;
  acceptedMaterials: string[];
}
