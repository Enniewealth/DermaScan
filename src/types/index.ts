// ============================================
// DermaScan — TypeScript Type Definitions
// ============================================

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  primarySkinConcern: string;
  fitzpatrickType?: string;
  settings: UserSettings;
  createdAt: string;
}

export interface UserSettings {
  scanReminders: boolean;
  language: string;
  privacyMode: boolean;
}

export interface ScanResult {
  id: string;
  userId: string;
  condition: SkinCondition;
  confidence: number;
  date: string;
  imageUrl: string;
  symptoms: string[];
  causes: string[];
  severity: SeverityLevel;
  riskIndicators: string[];
  recommendations: string[];
  medications: Medication[];
  applicationSteps: ApplicationStep[];
  clinicalInsights: string;
  tags: string[];
  status: ScanStatus;
  hydrationLevel?: number;
  sebumLevel?: number;
  barrierIntegrity?: number;
  hyperpigmentationIndex?: number;
}

export interface SkinCondition {
  name: string;
  fullName: string;
  description: string;
  category: string;
}

export interface Medication {
  id: string;
  name: string;
  type: string;
  tier: MedicationTier;
  priceRange: string;
  description: string;
  isRecommended: boolean;
}

export type MedicationTier = 'budget' | 'standard' | 'premium';

export interface ApplicationStep {
  stepNumber: number;
  title: string;
  description: string;
  icon?: string;
}

export type SeverityLevel = 'mild' | 'moderate' | 'severe' | 'critical';

export type ScanStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ScanHistoryFilter {
  search: string;
  condition: string | null;
  dateRange: 'all' | 'week' | 'month' | '3months';
}

export interface NextSteps {
  message: string;
  confidenceNote: string;
  warningMessage: string;
}

export interface RoutineStep {
  id: string;
  userId: string;
  timeOfDay: string; // morning, evening, weekly
  stepNumber: number;
  productName: string;
  productType: string; // cleanser, treatment, moisturizer, sunscreen
  instruction: string;
  isCompleted: boolean;
}

export interface ProductScanResponse {
  fitScore: number;
  compatibility: string; // Safe, Use with Caution, Avoid
  reason: string;
  harmfulIngredients: string[];
}

