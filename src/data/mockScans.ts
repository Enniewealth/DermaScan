// ============================================
// DermaScan — Mock Scan Data
// ============================================

import type { ScanResult, NextSteps } from '../types';

export const mockScanResults: ScanResult[] = [
  {
    id: 'scan_001',
    userId: 'usr_001',
    condition: {
      name: 'Eczema',
      fullName: 'Eczema (Atopic Dermatitis)',
      description:
        'Atopic dermatitis (eczema) is a chronic inflammatory skin condition often caused by high humidity and heat. It may appear as patches of hyperpigmentation rather than bright red, accompanied by intense itching and dryness. It tends to flare.',
      category: 'Inflammatory',
    },
    confidence: 94,
    date: '2024-04-23',
    imageUrl: '/mock-scan-eczema.jpg',
    symptoms: ['Intense itching', 'Dry & cracked skin', 'Hyperpigmentation', 'Redness', 'Swelling'],
    causes: [
      'High humidity and heat',
      'Genetic predisposition',
      'Immune system dysfunction',
      'Environmental triggers',
      'Stress',
    ],
    severity: 'moderate',
    riskIndicators: ['Recurring flare-ups', 'Risk of secondary infection', 'Sleep disruption'],
    recommendations: [
      'Keep skin moisturized with fragrance-free emollients',
      'Avoid known triggers (heat, certain fabrics)',
      'Use prescribed topical corticosteroids during flares',
      'Wear loose, breathable cotton clothing',
      'Take lukewarm baths instead of hot showers',
    ],
    medications: [
      {
        id: 'med_001',
        name: 'Hydrocortisone',
        type: 'OTC Anti-inflammatory Cream',
        tier: 'budget',
        priceRange: '₦1,500 – ₦3,000',
        description: 'Reliable, widely available relief for mild flares and itching.',
        isRecommended: false,
      },
      {
        id: 'med_002',
        name: 'Epiderm Ointment',
        type: 'Triple Action Topical Cream',
        tier: 'standard',
        priceRange: '₦5,000 – ₦8,500',
        description: 'Ointment with essential oils to restore the skin.',
        isRecommended: true,
      },
      {
        id: 'med_003',
        name: 'GSK Oilatum Plus',
        type: 'Antimicrobial Bath Cream',
        tier: 'premium',
        priceRange: '₦15,000+',
        description:
          'Advanced protection for severe dryness and preventing secondary infections.',
        isRecommended: false,
      },
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Clean the Area',
        description: 'Gently wash the affected skin with soap and water.',
      },
      {
        stepNumber: 2,
        title: 'Apply Thin Layer',
        description:
          'Massage a small amount into the skin until fully absorbed. Do not rub vigorously.',
      },
      {
        stepNumber: 3,
        title: 'Frequency',
        description:
          'Repeat 2–3 times daily, or immediately after bathing when skin is slightly damp.',
      },
    ],
    clinicalInsights:
      'Atopic dermatitis (eczema) is a chronic inflammatory skin condition often caused by high humidity and heat. It may appear as patches of hyperpigmentation rather than bright red, accompanied by intense itching and dryness. It tends to flare.',
    tags: ['Intense Itching', 'Dry & Cracked Skin', 'Hyperpigmentation'],
    status: 'completed',
  },
  {
    id: 'scan_002',
    userId: 'usr_001',
    condition: {
      name: 'Acne Vulgaris',
      fullName: 'Acne Vulgaris',
      description:
        'A common skin condition that occurs when hair follicles become clogged with oil and dead skin cells. It causes whiteheads, blackheads, or pimples.',
      category: 'Inflammatory',
    },
    confidence: 89,
    date: '2024-04-18',
    imageUrl: '/mock-scan-acne.jpg',
    symptoms: ['Papules', 'Pustules', 'Comedones', 'Oily skin', 'Post-inflammatory hyperpigmentation'],
    causes: [
      'Excess oil production',
      'Clogged hair follicles',
      'Bacteria',
      'Hormonal changes',
      'Diet',
    ],
    severity: 'mild',
    riskIndicators: ['Scarring potential', 'Hyperpigmentation risk'],
    recommendations: [
      'Cleanse face twice daily with a gentle cleanser',
      'Use non-comedogenic moisturizers',
      'Apply benzoyl peroxide or salicylic acid treatments',
      'Avoid picking or squeezing pimples',
      'Change pillowcases frequently',
    ],
    medications: [
      {
        id: 'med_004',
        name: 'Benzoyl Peroxide',
        type: 'OTC Topical Treatment',
        tier: 'budget',
        priceRange: '₦1,200 – ₦2,500',
        description: 'Kills bacteria and removes excess oil from the skin.',
        isRecommended: false,
      },
      {
        id: 'med_005',
        name: 'Adapalene Gel',
        type: 'Retinoid Gel',
        tier: 'standard',
        priceRange: '₦4,000 – ₦7,000',
        description: 'Prevents clogged pores and reduces inflammation.',
        isRecommended: true,
      },
      {
        id: 'med_006',
        name: 'Clindamycin Lotion',
        type: 'Antibiotic Lotion',
        tier: 'premium',
        priceRange: '₦10,000+',
        description: 'Prescription-strength treatment for moderate to severe acne.',
        isRecommended: false,
      },
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Cleanse',
        description: 'Wash face with lukewarm water and a gentle cleanser.',
      },
      {
        stepNumber: 2,
        title: 'Apply Treatment',
        description: 'Apply a pea-sized amount to affected areas. Avoid the eye area.',
      },
      {
        stepNumber: 3,
        title: 'Moisturize',
        description: 'Follow with a lightweight, non-comedogenic moisturizer.',
      },
    ],
    clinicalInsights:
      'Acne Vulgaris is extremely common and manageable with proper skincare. Post-inflammatory hyperpigmentation is a common concern for darker skin tones.',
    tags: ['Papules', 'Oily Skin', 'Comedones'],
    status: 'completed',
  },
  {
    id: 'scan_003',
    userId: 'usr_001',
    condition: {
      name: 'Psoriasis',
      fullName: 'Psoriasis (Plaque Type)',
      description:
        'An autoimmune condition that causes rapid skin cell buildup, resulting in scaling on the skin surface. Patches can appear darker on melanin-rich skin.',
      category: 'Autoimmune',
    },
    confidence: 78,
    date: '2024-03-10',
    imageUrl: '/mock-scan-psoriasis.jpg',
    symptoms: ['Thick plaques', 'Silvery scales', 'Itching', 'Burning sensation', 'Dry cracked skin'],
    causes: [
      'Autoimmune response',
      'Genetic factors',
      'Stress',
      'Infections',
      'Cold weather',
    ],
    severity: 'moderate',
    riskIndicators: ['Joint involvement (psoriatic arthritis)', 'Chronic condition', 'Emotional impact'],
    recommendations: [
      'Keep skin well moisturized',
      'Use medicated shampoos for scalp involvement',
      'Moderate sun exposure can help',
      'Manage stress levels',
      'Consult a dermatologist for systemic treatments',
    ],
    medications: [
      {
        id: 'med_007',
        name: 'Coal Tar Cream',
        type: 'OTC Topical',
        tier: 'budget',
        priceRange: '₦2,000 – ₦3,500',
        description: 'Reduces scaling, itching, and inflammation.',
        isRecommended: false,
      },
      {
        id: 'med_008',
        name: 'Betamethasone',
        type: 'Corticosteroid Cream',
        tier: 'standard',
        priceRange: '₦6,000 – ₦9,000',
        description: 'Stronger topical steroid for moderate plaques.',
        isRecommended: true,
      },
      {
        id: 'med_009',
        name: 'Calcipotriol',
        type: 'Vitamin D Analog',
        tier: 'premium',
        priceRange: '₦18,000+',
        description: 'Slows skin cell growth and removes scales.',
        isRecommended: false,
      },
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Soak or Soften',
        description: 'Take a lukewarm bath to soften plaques before applying medication.',
      },
      {
        stepNumber: 2,
        title: 'Apply Medication',
        description: 'Apply a thin layer to affected areas. Do not cover large areas.',
      },
      {
        stepNumber: 3,
        title: 'Moisturize After',
        description: 'Apply a thick emollient 30 minutes after medication.',
      },
    ],
    clinicalInsights:
      'Psoriasis is a chronic autoimmune condition. On darker skin, it may appear more violet or dark brown. Early management prevents joint complications.',
    tags: ['Thick Plaques', 'Scaling', 'Autoimmune'],
    status: 'completed',
  },
  {
    id: 'scan_004',
    userId: 'usr_001',
    condition: {
      name: 'Fungal Infection',
      fullName: 'Tinea Corporis (Ringworm)',
      description:
        'A contagious fungal infection that appears as a circular, ring-shaped rash with clearer skin in the middle. Common in warm, humid climates.',
      category: 'Fungal',
    },
    confidence: 91,
    date: '2024-02-05',
    imageUrl: '/mock-scan-fungal.jpg',
    symptoms: ['Ring-shaped rash', 'Itching', 'Scaly border', 'Redness', 'Spreading patches'],
    causes: [
      'Fungal infection (dermatophytes)',
      'Warm humid climate',
      'Direct contact',
      'Shared items',
      'Excessive sweating',
    ],
    severity: 'mild',
    riskIndicators: ['Highly contagious', 'Can spread to other body parts'],
    recommendations: [
      'Keep the area clean and dry',
      'Avoid sharing towels and clothing',
      'Wear loose-fitting clothing',
      'Complete full course of antifungal treatment',
      'Wash hands after touching affected areas',
    ],
    medications: [
      {
        id: 'med_010',
        name: 'Clotrimazole Cream',
        type: 'OTC Antifungal',
        tier: 'budget',
        priceRange: '₦800 – ₦1,500',
        description: 'Effective first-line treatment for mild fungal infections.',
        isRecommended: false,
      },
      {
        id: 'med_011',
        name: 'Terbinafine',
        type: 'Antifungal Cream',
        tier: 'standard',
        priceRange: '₦3,500 – ₦6,000',
        description: 'Faster-acting antifungal with higher cure rates.',
        isRecommended: true,
      },
      {
        id: 'med_012',
        name: 'Fluconazole',
        type: 'Oral Antifungal',
        tier: 'premium',
        priceRange: '₦12,000+',
        description: 'Systemic treatment for resistant or widespread infections.',
        isRecommended: false,
      },
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Clean & Dry',
        description: 'Wash the area and pat completely dry before application.',
      },
      {
        stepNumber: 2,
        title: 'Apply Cream',
        description: 'Apply beyond the edge of the rash by 1-2cm. Rub in gently.',
      },
      {
        stepNumber: 3,
        title: 'Continue Treatment',
        description: 'Apply twice daily for 2-4 weeks, even after symptoms improve.',
      },
    ],
    clinicalInsights:
      'Ringworm is very common in tropical climates. Complete the full treatment course to prevent recurrence.',
    tags: ['Ring-shaped Rash', 'Contagious', 'Fungal'],
    status: 'completed',
  },
];

export const nextStepsData: NextSteps = {
  message:
    'While our AI is 94% confident, Eczema often requires dedicated care and treatment. We recommend visiting a pharmacist.',
  confidenceNote: '94% confidence based on AI analysis',
  warningMessage:
    'Please visit your nearest clinic or pharmacy immediately if the area shows signs of infection like pus, intense heat, or yellow crusts.',
};

export const tipOfTheDay =
  'Early detection of skin conditions significantly improves treatment outcomes. Regular scanning helps maintain a detailed health history.';

export const conditionFilters = [
  'All',
  'Eczema',
  'Acne',
  'Psoriasis',
  'Fungal',
  'Dermatitis',
  'Other',
];
