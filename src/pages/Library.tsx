import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, AlertTriangle, ArrowLeft, HelpCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface Condition {
  id: string;
  name: string;
  category: 'Fungal' | 'Inflammatory' | 'Pigmentation' | 'Infections' | 'Autoimmune' | 'Scarring';
  isCommonInNigeria: boolean;
  isFitzpatrickSpecific: boolean;
  shortDesc: string;
  longDesc: {
    EN: string;
    YO: string;
    HA: string;
    IG: string;
  };
  darkSkinTips: string;
  visualExample: {
    color: string;
    description: string;
  };
  severityRange: {
    mild: { desc: string };
    moderate: { desc: string };
    severe: { desc: string };
  };
  selfTreatment: string[];
  pharmacyOptions: string[];
  redFlags: string[];
  relatedConditions: string[];
}

const CONDITIONS: Condition[] = [
  {
    id: 'cond_eczema',
    name: 'Eczema',
    category: 'Inflammatory',
    isCommonInNigeria: true,
    isFitzpatrickSpecific: true,
    shortDesc: 'Inflammatory dry skin causing intense itching, triggered by climate shifts.',
    longDesc: {
      EN: "A highly common inflammatory skin condition that makes skin dry, red (or dark purple/grey in skin of color), and intensely itchy. It often flares up dramatically during the dry, dusty Harmattan wind shifts or extreme humidity drops in Nigeria.",
      YO: "Eyi jẹ aisan awọ ara ti o nfa igbona, gbigbẹ, ati yun lile lori awọ. O maa n pọ si lakoko igba ẹlẹri tabi nigbati afẹfẹ ba gbẹ ni orilẹ-ede Naijiria ti o si n mu ki awọ fọ tabi ki o gbe eepo.",
      HA: "Wannan wata cutar fata ce da ke kawo kumburi, bushewa, da ƙaiƙayi mai tsanani. Yana yawan tashi lokacin rani ko lokacin sanyi a Najeriya lokacin da iska mai ƙura ke busawa.",
      IG: "Nke a bụ ọrịa akpụkpọ ahụ na-ebute ọkụ ọkụ, nkụ, na mgbu siri ike. Ọ na-emekarị mgbe ọkọchị na-ada ma ọ bụ mgbe ikuku kpọrọ nkụ na Nigeria nke na-eme ka akpụkpọ ahụ kọọ mgbawa."
    },
    darkSkinTips: "In Fitzpatrick skin phototypes V and VI, eczema rarely presents as bright red. Instead, it appears as dark brown, purplish, or ash-grey patches. It frequently manifests as follicular eczema, showing tiny, itchy bumps concentrated around hair follicles, and leaves long-lasting dark spots (hyperpigmentation) as it heals.",
    visualExample: {
      color: '#4B382A',
      description: "Thickened, slightly scaling purplish-brown patch with exaggerated skin markings on a deep brown skin background."
    },
    severityRange: {
      mild: { desc: "Occasional dry, scaly patches with mild itchiness that responds quickly to moisturizers." },
      moderate: { desc: "Spreading rough patches on elbows, knees, or face with persistent itching, causing sleep disruptions." },
      severe: { desc: "Widespread, thickened skin (lichenification) with raw weeping cracks, bleeding, or signs of secondary bacterial infections." }
    },
    selfTreatment: [
      "Bathe in cool or lukewarm water (never hot water, which strips natural lipids).",
      "Apply a thick moisturizer (Shea Butter, petroleum jelly, or cetomacrogol) within 3 minutes of bathing while skin is still damp.",
      "Use mild, unscented baby soaps or soap substitutes instead of harsh antiseptic medicated soaps.",
      "Apply 1% hydrocortisone cream sparingly to active itchy flares for up to 7 consecutive days."
    ],
    pharmacyOptions: [
      "Hydrocortisone 1% Cream (mild steroid) — ₦800 - ₦2,000",
      "Aqueous Cream / Cetomacrogol base — ₦1,500 - ₦3,000",
      "Pure Unscented Shea Butter (Natural Emollient) — ₦500 - ₦1,500",
      "Zinc Oxide Barrier Ointment (Soothing agent) — ₦1,000 - ₦2,500"
    ],
    redFlags: [
      "The patches begin oozing yellowish fluid or crusting (signs of bacterial infection).",
      "The skin feels hot to the touch, swollen, or you develop a fever.",
      "The condition fails to show signs of improvement after 10 days of continuous self-care."
    ],
    relatedConditions: ['Contact Dermatitis', 'Post-Inflammatory Hyperpigmentation']
  },
  {
    id: 'cond_acne',
    name: 'Acne Vulgaris',
    category: 'Inflammatory',
    isCommonInNigeria: true,
    isFitzpatrickSpecific: true,
    shortDesc: 'Clogged pores leading to whiteheads, blackheads, and oily breakouts.',
    longDesc: {
      EN: "A chronic inflammatory skin condition occurring when hair follicles become blocked with sebum (oil) and dead skin cells. Worsened by hot humid weather, sweat friction, and heavy comedogenic skincare formulations.",
      YO: "Aisan awọ ara ti o nwaye nigbati awọn ihò awọ ba dina pẹlu epo ati awọn sẹẹli awọ ara ti o ku, eyi ti o nfa pimples tabi spots ati awọ ara didan ti epo ba pọ ju lori rẹ.",
      HA: "Ciwon fata da ke faruwa lokacin da ramukan gashi suka toshe da mai da matattun kwayoyin halitta. Yana yawan ƙaruwa lokacin zafi ko gumi saboda toshewar ramukan gashi.",
      IG: "Ọrịa akpụkpọ ahụ na-eme mgbe pores akpụkpọ ahụ na-emechi site na mmanụ na sel akpụkpọ nwụrụ anwụ, na-ebute otuto ma na-enye ihu ọdịdị mmanụ mmanụ."
    },
    darkSkinTips: "Acne in skin of color is highly prone to leaving post-inflammatory hyperpigmentation (PIH). These are flat dark spots that remain for months after the pimple clears. Squeezing, picking, or physically scrubbing the skin aggressively triggers more melanin production, worsening these dark marks.",
    visualExample: {
      color: '#553E31',
      description: "Raised dark-brown bumps (papules) alongside dark, flat circular spots (PIH) on the cheeks and forehead."
    },
    severityRange: {
      mild: { desc: "Scattered whiteheads and blackheads (comedones) with occasional minor inflamed pimples." },
      moderate: { desc: "Numerous inflamed papules and pustules (pimples filled with pus) covering larger areas of the face or chest." },
      severe: { desc: "Deep, painful, pus-filled nodules or cysts that look swollen, feel firm, and carry a high risk of permanent scarring." }
    },
    selfTreatment: [
      "Wash your face gently twice daily with a cleanser containing 2% Salicylic Acid.",
      "Apply Benzoyl Peroxide gel sparingly to active pimples at night to kill acne bacteria.",
      "Use lightweight, water-based, non-comedogenic moisturizers that will not clog pores.",
      "Apply oil-free sunscreen daily to prevent UV rays from darkening your existing acne spots."
    ],
    pharmacyOptions: [
      "Benzoyl Peroxide 5% Gel (Antimicrobial) — ₦1,200 - ₦2,500",
      "Salicylic Acid 2% Wash (Pore exfoliator) — ₦2,000 - ₦4,500",
      "Adapalene 0.1% Gel (Topical Retinoid) — ₦4,500 - ₦8,000",
      "Niacinamide 10% Clarifying Serum — ₦3,500 - ₦7,000"
    ],
    redFlags: [
      "Breakouts form large, painful, hard lumps deep under the skin (nodulocystic acne).",
      "Acne is causing severe structural scarring or pitting of the skin.",
      "No improvement after 8 weeks of consistent, daily over-the-counter treatment."
    ],
    relatedConditions: ['Post-Inflammatory Hyperpigmentation', 'Contact Dermatitis']
  },
  {
    id: 'cond_tinea_versicolor',
    name: 'Tinea Versicolor',
    category: 'Fungal',
    isCommonInNigeria: true,
    isFitzpatrickSpecific: false,
    shortDesc: 'Superficial fungal overgrowth common in hot, humid climates.',
    longDesc: {
      EN: "A common, harmless superficial fungal infection caused by an overgrowth of natural yeast on the skin. It thrives in warm, highly humid environments and is locally known in Nigeria as 'lotta' or 'lapalapa'.",
      YO: "Ìdàgbàsókè kòkòrò àrùn fungal lórí awọ ara tó wọ́pọ̀ ní ojú ọjọ́ tó gbóná. Ó máa ń fara hàn gẹ́gẹ́ bí àwọn tó yún tàbí tó yí àwọ̀ padà lórí ọrùn tàbí àyà, tí a mọ̀ sí 'lotta'.",
      HA: "Kamuwa da cutar yist ta fata wacce ke haifar da tabo masu haske ko duhu a kirji ko wuya sakamakon gumi da yanayin zafi, ana kiranta da 'lotta'.",
      IG: "Ntiwapụ nke fungal na akpụkpọ ahụ na-ebute ntụpọ ọcha ma ọ bụ ntụpọ ojii n'olu na n'obi n'ihi ọkụ ọkụ, nke a na-akpọ 'lotta' na Nigeria."
    },
    darkSkinTips: "Presents as small, flat, slightly scaly spots that can merge into larger patches. In darker skin tones, these patches are typically hypopigmented (appearing as light brown or ash-colored spots) or hyperpigmented (darker brown patches), usually on the neck, chest, back, and upper arms.",
    visualExample: {
      color: '#654D3F',
      description: "Fine-scaling, oval light-beige patches that stand out against surrounding dark brown skin, usually clustered on the upper chest or back."
    },
    severityRange: {
      mild: { desc: "Few isolated light-colored spots on the neck or shoulders with little to no itching." },
      moderate: { desc: "Spreading clusters of patches covering the entire chest or mid-back, causing mild itch when sweating." },
      severe: { desc: "Extensive patches covering the entire torso and arms, accompanied by constant flaking and visible discoloration." }
    },
    selfTreatment: [
      "Keep skin as dry and cool as possible, especially during hot, high-perspiration afternoons.",
      "Apply over-the-counter Ketoconazole or Clotrimazole antifungal cream to the spots twice daily for 14 days.",
      "Use an anti-dandruff shampoo containing Selenium Sulfide or Ketoconazole as a body wash on the affected areas once weekly (leave on for 10 minutes before rinsing)."
    ],
    pharmacyOptions: [
      "Clotrimazole 1% Cream (Antifungal) — ₦1,000 - ₦2,200",
      "Ketoconazole 2% Cream (Potent Antifungal) — ₦1,800 - ₦3,500",
      "Ketoconazole 2% Shampoo (Preventative Wash) — ₦3,500 - ₦6,500",
      "Selenium Sulfide 2.5% Lotion/Shampoo — ₦4,000 - ₦7,500"
    ],
    redFlags: [
      "The patches continue to spread rapidly despite 3 weeks of daily antifungal cream use.",
      "The skin becomes intensely raw, inflamed, or shows signs of bleeding.",
      "The condition is accompanied by severe itching or burning that does not improve."
    ],
    relatedConditions: ['Ringworm', 'Post-Inflammatory Hyperpigmentation']
  },
  {
    id: 'cond_ringworm',
    name: 'Ringworm',
    category: 'Fungal',
    isCommonInNigeria: true,
    isFitzpatrickSpecific: false,
    shortDesc: 'Contagious fungal skin infection producing itchy circular rashes.',
    longDesc: {
      EN: "A highly contagious, superficial fungal infection of the skin. It spreads easily through contact with infected people, animals, or shared household items like combs and towels.",
      YO: "Arun kokoro fungal ti o le ran eniyan ni irọrun, ti o si n fa awọ gbigbẹ to n yun ni apẹrẹ roboto pẹlu eti ti o ga soke diẹ.",
      HA: "Ciwon fata na fungus mai saurin yaduwa tsakanin mutane ko dabbobi, wanda ke haifar da ƙaiƙayi da kuraje masu da'ira mai fadi.",
      IG: "Ọrịa fungal nke na-efe efe nke na-ebute ọkụ ọkụ n'ụdị gburugburu, na-akpụkọ ọkọ na mpaghara ndị akpụkpọ ahụ."
    },
    darkSkinTips: "On darker skin tones, the circular margins are not bright red but appear as hyperpigmented dark brown or black raised rings. The center of the circle may clear up, leaving a ringside scaly edge that is highly characteristic of the infection.",
    visualExample: {
      color: '#442E20',
      description: "Raised, dark, slightly scaly circular ring with a clearer, hyperpigmented center on dark skin."
    },
    severityRange: {
      mild: { desc: "A single, small circular patch on the arm, leg, or torso that is mildly itchy." },
      moderate: { desc: "Multiple overlapping circular patches spreading across different body parts." },
      severe: { desc: "Large, inflamed, raised plaques that are thick, scaly, and painful, showing secondary bacterial crusting." }
    },
    selfTreatment: [
      "Keep the affected skin clean and completely dry after bathing.",
      "Apply Terbinafine or Miconazole antifungal cream twice daily, spreading it 2cm beyond the visible edge of the rash.",
      "Avoid sharing personal items like towels, hairbrushes, sponges, or clothing with family members.",
      "Wash bed sheets and towels in hot water and iron them to kill fungal spores."
    ],
    pharmacyOptions: [
      "Terbinafine 1% Cream (Fast-acting Antifungal) — ₦1,500 - ₦3,500",
      "Clotrimazole 1% Cream (Standard Antifungal) — ₦1,000 - ₦2,200",
      "Miconazole Nitrate 2% Cream — ₦1,200 - ₦2,600"
    ],
    redFlags: [
      "The circular rash forms on the scalp, leading to hair breakage or patches of hair loss.",
      "The rash begins oozing yellow pus, suggesting a bacterial infection.",
      "The condition continues to grow and itch after 14 days of consistent antifungal application."
    ],
    relatedConditions: ['Tinea Versicolor', 'Eczema']
  },
  {
    id: 'cond_pih',
    name: 'Post-Inflammatory Hyperpigmentation',
    category: 'Pigmentation',
    isCommonInNigeria: true,
    isFitzpatrickSpecific: true,
    shortDesc: 'Dark spots remaining after skin injury or inflammation heals.',
    longDesc: {
      EN: "A condition where skin produces excess melanin (pigment) after healing from an injury, irritation, or inflammatory state like acne, eczema, insect bites, or cosmetic chemical burns.",
      YO: "Awọ ara didudu lẹhin aisan tabi farapa kekere bi pimple tabi gige awọ. O maa n ṣẹlẹ nitori ọpọlọpọ melanin ti ara n gbe jade.",
      HA: "Duhuwar fata da ke warkewa bayan ciwo ko ƙaiƙayi, kamar tabon kurajen fuska ko cizon sauro, wanda ke daukar lokaci kafin ya warke.",
      IG: "Ntụpọ ojii na-adị n'akpụkpọ ahụ mgbe ọnya, otuto, ma ọ bụ mmerụ ahụ gasịrị. Ọ na-adịkarị n'ebe akpụkpọ ahụ nwere melanin dị elu."
    },
    darkSkinTips: "Fitzpatrick skin types IV, V, and VI have highly active melanocytes (pigment-producing cells). Any form of skin irritation triggers these cells to produce excess pigment. The dark spots are flat and can range from light brown to very dark grey. Sun protection is critical, as sunlight triggers more melanin and darkens the spots further.",
    visualExample: {
      color: '#38251B',
      description: "Flat, dark, non-scaly hyperpigmented spots localized in areas where previous skin lesions (like acne papules) have completely healed."
    },
    severityRange: {
      mild: { desc: "Faint, light brown spots that cover a small portion of the face and fade naturally within a few weeks." },
      moderate: { desc: "Widespread, dark brown spots that remain visible for several months without fading." },
      severe: { desc: "Extremely dark, dense grey-black patches that have penetrated deeper skin layers, requiring clinical ingredients to fade." }
    },
    selfTreatment: [
      "Wear a broad-spectrum SPF 30+ sunscreen daily, as UV light actively darkens hyperpigmentation.",
      "Incorporate topical Vitamin C, Niacinamide, or Azelaic Acid into your daily skincare routine to regulate melanin production.",
      "Bypass harsh physical scrubs, scrubbing sponges, and strong chemical peeling solutions that cause fresh inflammation."
    ],
    pharmacyOptions: [
      "Niacinamide 10% Face Cream/Serum — ₦3,500 - ₦7,500",
      "Azelaic Acid 10% Cream (Brightening agent) — ₦4,000 - ₦8,500",
      "Broad-Spectrum SPF 50+ Sunscreen (Non-greasy) — ₦6,000 - ₦12,000",
      "Vitamin C 20% Serum (Antioxidant) — ₦4,500 - ₦9,000"
    ],
    redFlags: [
      "The dark patches are accompanied by continuous skin thinning, redness, or burning (suggests steroid damage from bleaching creams).",
      "The spots begin changing shape, size, color, or bleed spontaneously.",
      "The dark patches cover large sections of the body without any history of injury or rash."
    ],
    relatedConditions: ['Acne Vulgaris', 'Eczema']
  },
  {
    id: 'cond_dermatitis',
    name: 'Contact Dermatitis',
    category: 'Inflammatory',
    isCommonInNigeria: true,
    isFitzpatrickSpecific: false,
    shortDesc: 'Allergic reaction or irritation caused by contact with a substance.',
    longDesc: {
      EN: "An acute inflammatory reaction of the skin caused by direct contact with allergens or irritants. Common triggers include strong laundry soaps, local antiseptic bath washes, synthetic fabrics, perfumes, or metals like nickel.",
      YO: "Igbona ati ibinu awọ ara nitori ifọwọkan pẹlu awọn nkan ti kii ṣe awọ bii ọṣẹ ti o lagbara tabi ipara ti o ni kẹmika pupọ.",
      HA: "Damuwa ko kumburin fata sakamakon shafar wani abu kamar sabulu mai karfi, man shafawa, ko tufafin roba.",
      IG: "Mmeghachi omume nke akpụkpọ ahụ site na nmetụta ihe dị iche iche dị ka ncha siri ike, ihe ịchọ mma, ma ọ bụ akwa roba."
    },
    darkSkinTips: "Presents as a swollen, extremely itchy rash. On darker skin tones, contact dermatitis appears as dark purple, brown, or ash-colored patches, sometimes with small bumps. Scratching can quickly break the skin, introducing bacteria and leading to permanent dark spots or thick scars.",
    visualExample: {
      color: '#5C4436',
      description: "Slightly swollen, dry, dark purplish plaque with small pinpoint bumps, matching the contact shape of a watch strap or soap boundary."
    },
    severityRange: {
      mild: { desc: "Mild redness or darkening with localized itching that resolves after removing the irritant." },
      moderate: { desc: "Spreading rash with prominent swelling, small itchy papules, and a burning sensation." },
      severe: { desc: "Severe swelling, blistering, raw weeping skin, intense pain, and high risk of secondary infections." }
    },
    selfTreatment: [
      "Identify and immediately stop using the suspected substance (change laundry detergent, discard new cosmetics, etc.).",
      "Apply cool compresses (a clean damp cloth) to the area to soothe burning and reduce swelling.",
      "Apply a thin layer of 1% hydrocortisone cream to active patches twice daily for up to 5 days to stop itching."
    ],
    pharmacyOptions: [
      "Hydrocortisone 1% Cream (Topic Steroid) — ₦800 - ₦2,000",
      "Calamine Lotion (Soothing itch relief) — ₦700 - ₦1,500",
      "Loratadine 10mg Tablets (Antihistamine) — ₦500 - ₦1,200",
      "Cetirizine 10mg Tablets (Fast Antihistamine) — ₦600 - ₦1,500"
    ],
    redFlags: [
      "The rash forms on your face, near the eyes, or covers your sensitive genital regions.",
      "Large blister bubbles develop and begin leaking yellow fluid.",
      "The swelling becomes severe, or you experience any difficulty breathing or swallowing."
    ],
    relatedConditions: ['Eczema', 'Post-Inflammatory Hyperpigmentation']
  },
  {
    id: 'cond_psoriasis',
    name: 'Psoriasis',
    category: 'Autoimmune',
    isCommonInNigeria: false,
    isFitzpatrickSpecific: true,
    shortDesc: 'Chronic autoimmune condition causing thick, scaly patches.',
    longDesc: {
      EN: "A chronic autoimmune condition where the immune system accelerates skin cell production, causing thick, scaly plaques. In Nigeria's climate, flares can be triggered by heat stress, streptococcal infections, and emotional stress.",
      YO: "Aisan autoimmune ti ara ti o mu ki awọn sẹẹli awọ ara dagba ni iyara pupọ, ti o nfa awọn pẹpẹ ti o nipọn ati ìpara. Ó lè dá sílẹ̀ nípasẹ̀ àìsàn ọ̀fun tàbí ìdààmú ọkàn.",
      HA: "Cutar autoimmune da ke sa'a samar da kwayoyin fata cikin gaggawa, wanda ke haifar da kashin fata masu kauri da tabo. Ana iya samun ta sakamakon ciwon makogwaro ko damuwa.",
      IG: "Ọrịa autoimmune nke na-eme ka sel akpụkpọ ahụ na-eto eto ngwa ngwa, na-ebute akpụkpọ ahụ gbara ụkwụ na nkwonkwo. Ọ nwere ike ịmalite site na oria akpịrị ma ọ bụ nchegbu."
    },
    darkSkinTips: "On Fitzpatrick V–VI skin, psoriasis plaques rarely appear with the classic bright silvery-white scale. Instead, they present as dark brown, violaceous (purple-tinted), or grey patches with a thickened, rough texture. Post-inflammatory hyperpigmentation or hypopigmentation is very common after flares resolve.",
    visualExample: {
      color: '#5C3D2E',
      description: "Well-defined, raised dark purple-brown plaques with a subtle silvery-grey scale on elbows or knees against deep brown skin."
    },
    severityRange: {
      mild: { desc: "A few small, scattered plaques on elbows or knees covering less than 3% of the body." },
      moderate: { desc: "Plaques covering 3–10% of the body, involving trunk, limbs, and potentially scalp." },
      severe: { desc: "Widespread plaques covering over 10% of the body, with joint pain (psoriatic arthritis risk), cracking, and bleeding." }
    },
    selfTreatment: [
      "Keep skin generously moisturized with thick emollients, especially immediately after bathing.",
      "Apply coal tar-based creams or ointments to reduce scaling and inflammation.",
      "Use mild, fragrance-free cleansers and avoid any harsh scrubbing of plaques.",
      "Manage stress through consistent routines and rest, as emotional stress is a major trigger."
    ],
    pharmacyOptions: [
      "Coal Tar 5% Ointment (Anti-scaling agent) — ₦1,500 - ₦3,500",
      "Salicylic Acid 2% Ointment (Keratolytic) — ₦1,200 - ₦2,500",
      "Betamethasone Valerate 0.1% Cream (Steroid) — ₦2,000 - ₦4,500",
      "Petroleum Jelly / Emollient Base — ₦500 - ₦1,500"
    ],
    redFlags: [
      "Plaques cover more than 10% of your body or are spreading rapidly.",
      "You experience joint pain, swelling, or stiffness (possible psoriatic arthritis).",
      "The skin becomes raw, cracked, and bleeds heavily."
    ],
    relatedConditions: ['Eczema', 'Post-Inflammatory Hyperpigmentation']
  },
  {
    id: 'cond_rosacea',
    name: 'Rosacea',
    category: 'Inflammatory',
    isCommonInNigeria: false,
    isFitzpatrickSpecific: true,
    shortDesc: 'Chronic facial flushing, bumps, and visible blood vessels.',
    longDesc: {
      EN: "A chronic inflammatory condition primarily affecting the central face, causing persistent warmth, flushing, and acne-like bumps. It is significantly underdiagnosed in people of color because the classic 'redness' is invisible on darker skin.",
      YO: "Aisan igbona onibaje ti o kan oju, ti o nfa igbona oju, wiwu, ati awọn bumps ti o dabi pimple. A kì í ṣàwárí rẹ̀ lórí awọ dudu nítorí pé pupa kì í hàn.",
      HA: "Cutar kumburi na fuska da ke haifar da zafin fuska, kumburin fuska, da kuraje irin na acne. Ba kasafai ake gano ta cikin mutanen launin fata mai duhu ba.",
      IG: "Ọrịa na-ebute ọkụ ọkụ n'ihu, ịbanye ụbọchị niile, na otuto dị ka acne. A naghị achọpụta ya n'akpụkpọ ahụ ojii n'ihi na ọbara aghịghị uhie."
    },
    darkSkinTips: "Rosacea is one of the most underdiagnosed conditions in skin of color. Instead of visible redness, look for: a persistent warm or burning sensation on the face, dusky purple-brown discoloration on the cheeks and nose, and acne-like papules that don't respond to standard acne treatment.",
    visualExample: {
      color: '#6B4F3E',
      description: "Diffuse dusky purple-brown discoloration across the central cheeks and nose, with scattered small papules on deep brown skin."
    },
    severityRange: {
      mild: { desc: "Occasional facial warmth and flushing with minimal visible changes on darker skin." },
      moderate: { desc: "Persistent facial warmth, scattered papules and pustules, and visible dusky discoloration." },
      severe: { desc: "Persistent swelling, numerous inflammatory papules, and thickening skin (phymatous changes)." }
    },
    selfTreatment: [
      "Identify and avoid personal triggers: hot drinks, spicy food, alcohol, extreme heat, and stress.",
      "Use gentle, fragrance-free skincare products and wash with lukewarm (never hot) water.",
      "Apply a broad-spectrum SPF 30+ sunscreen daily, as UV exposure worsens rosacea.",
      "Avoid heavy comedogenic moisturizers and products containing alcohol or menthol."
    ],
    pharmacyOptions: [
      "Metronidazole 0.75% Gel (Anti-inflammatory) — ₦3,000 - ₦6,000",
      "Azelaic Acid 15% Gel (Anti-redness/Brightening) — ₦4,000 - ₦8,500",
      "Gentle Non-Foaming Cleanser — ₦2,500 - ₦5,000",
      "SPF 50+ Mineral Sunscreen — ₦6,000 - ₦12,000"
    ],
    redFlags: [
      "Your eyes become persistently red, dry, or gritty (ocular rosacea).",
      "The nose begins to thicken and enlarge (rhinophyma).",
      "Symptoms don't improve after 6 weeks of consistent gentle skincare."
    ],
    relatedConditions: ['Acne Vulgaris', 'Contact Dermatitis']
  },
  {
    id: 'cond_vitiligo',
    name: 'Vitiligo',
    category: 'Autoimmune',
    isCommonInNigeria: true,
    isFitzpatrickSpecific: true,
    shortDesc: 'Autoimmune loss of skin pigment creating light patches.',
    longDesc: {
      EN: "An autoimmune condition where the immune system attacks melanocytes (pigment-producing cells), resulting in well-defined patches of depigmented (white) skin. It affects 1–2% of the global population regardless of ethnicity.",
      YO: "Aisan autoimmune nibiti ara rẹ ti n pa awọn sẹẹli ti o n ṣe awọ, ti o nfa awọn patches funfun lori awọ ara. O le fa wahala ẹdun nla ni awujọ Naijiria.",
      HA: "Cutar autoimmune inda jiki ke kai wa kwayoyin halitta masu samar da launi, wanda ke haifar da farin tabo a fata. Tana iya haifar da damuwa a cikin al'ummar Najeriya.",
      IG: "Ọrịa autoimmune ebe ahụ na-awakpo sel na-emepụta agba, na-ebute ntụpọ ọcha doro anya n'ahụ. Ọ nwere ike ịkpata nnukwu nsogbu n'ime obodo Nigeria."
    },
    darkSkinTips: "Vitiligo is far more visually conspicuous on Fitzpatrick IV–VI skin due to the stark contrast between depigmented white patches and surrounding dark skin. This high visibility often causes significant psychosocial distress, stigma, and shame, particularly in Nigerian communities. Patches commonly appear on the face, hands, wrists, and around body openings.",
    visualExample: {
      color: '#F5F0E8',
      description: "Sharply demarcated, completely white (depigmented) patches against deep brown skin, often symmetrical on the hands, face, or around the mouth."
    },
    severityRange: {
      mild: { desc: "A few small, localized depigmented patches on non-exposed areas." },
      moderate: { desc: "Multiple patches on visible areas (face, hands, arms) causing cosmetic concern." },
      severe: { desc: "Widespread depigmentation covering large body areas, or rapidly progressing patches." }
    },
    selfTreatment: [
      "Apply broad-spectrum SPF 50+ sunscreen to all depigmented patches daily, as they burn extremely easily.",
      "Use camouflage cosmetics or medical-grade concealer for visible patches if desired.",
      "Avoid skin trauma and friction on affected areas (Koebner phenomenon can trigger new patches).",
      "Seek emotional support — vitiligo can affect mental health significantly."
    ],
    pharmacyOptions: [
      "SPF 50+ Broad-Spectrum Sunscreen — ₦6,000 - ₦12,000",
      "Tacrolimus 0.1% Ointment (Immunomodulator, prescription) — ₦8,000 - ₦15,000",
      "Camouflage Cover Cream — ₦3,500 - ₦8,000",
      "Vitamin D3 Supplement — ₦2,000 - ₦4,000"
    ],
    redFlags: [
      "Patches are spreading rapidly within weeks.",
      "You develop signs of other autoimmune conditions (thyroid problems, fatigue, joint pain).",
      "The condition is causing severe depression or social withdrawal."
    ],
    relatedConditions: ['Post-Inflammatory Hyperpigmentation', 'Contact Dermatitis']
  },
  {
    id: 'cond_keloids',
    name: 'Keloids',
    category: 'Scarring',
    isCommonInNigeria: true,
    isFitzpatrickSpecific: true,
    shortDesc: 'Overgrown scar tissue extending beyond original wound.',
    longDesc: {
      EN: "An abnormal wound-healing response where fibrous scar tissue grows excessively beyond the boundaries of the original injury. Keloids are significantly more common in people of African descent (15–20x higher incidence), making them one of the most important dermatological conditions in Nigeria.",
      YO: "Ìdàgbàsókè aájò ti àsọ ọgbẹ́ ní àgbègbè tí ọgbẹ́ ti wà tẹ́lẹ̀. Ó wọ́pọ̀ gan-an lára àwọn ènìyàn Áfíríkà, ó sì lè fa ìrora àti ìtìjú.",
      HA: "Taimakon gyaran rauni wanda ke girma fiye da iyakar raunin asali. Keloids sun fi yawa a cikin mutanen Afirka, kuma suna iya haifar da zafi da kunya.",
      IG: "Ọgwụgwọ ọnya na-amụba karịa oke ọnya mbụ. Keloids na-adịkarị n'etiti ndị Africa, ọ nwekwara ike ibute mgbu na ihere."
    },
    darkSkinTips: "Keloids disproportionately affect Fitzpatrick IV–VI skin. They appear as firm, rubbery, shiny nodules that extend beyond the original wound. They are commonly triggered by ear piercings, surgical scars, acne scars, and even minor cuts. On dark skin, keloids can be hyperpigmented (darker than surrounding skin) or hypopigmented (lighter). Common sites include the earlobes, chest, shoulders, and jawline.",
    visualExample: {
      color: '#5A3E30',
      description: "Raised, firm, glossy dark-brown or pink-brown keloid mass extending beyond an earlobe piercing site, with smooth rounded edges."
    },
    severityRange: {
      mild: { desc: "Small, flat hypertrophic scar that remains within the wound boundary and is minimally itchy." },
      moderate: { desc: "Firm, raised keloid extending 1–2cm beyond the original wound, causing itching or tenderness." },
      severe: { desc: "Large, disfiguring keloid mass causing pain, restricted movement, and significant psychosocial distress." }
    },
    selfTreatment: [
      "Apply medical-grade silicone gel sheeting or cream over the keloid daily for at least 3 months.",
      "Avoid unnecessary piercings, tattoos, and elective surgeries if you have a history of keloids.",
      "Do not pick at, scratch, or traumatize healing wounds — keep them clean and moist.",
      "Use pressure garments over healing surgical sites if recommended by your doctor."
    ],
    pharmacyOptions: [
      "Silicone Gel Sheet / Scar Tape — ₦4,000 - ₦10,000",
      "Silicone Scar Gel (Topical) — ₦3,500 - ₦8,000",
      "Onion Extract Gel (Contractubex-type) — ₦5,000 - ₦12,000",
      "Compression Bandage / Pressure Earrings — ₦2,000 - ₦6,000"
    ],
    redFlags: [
      "The keloid is growing rapidly and causing significant pain.",
      "The scar tissue is restricting movement of a joint or limb.",
      "Multiple keloids are forming spontaneously without obvious triggers."
    ],
    relatedConditions: ['Acne Vulgaris', 'Post-Inflammatory Hyperpigmentation']
  }
];

export default function Library() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState<Condition | null>(null);
  
  // Detailed view states
  const [selectedLang, setSelectedLang] = useState<'EN' | 'YO' | 'HA' | 'IG'>('EN');
  const [activeSeverity, setActiveSeverity] = useState<'mild' | 'moderate' | 'severe'>('mild');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filters logic
  const filteredConditions = useMemo(() => {
    return CONDITIONS.filter(cond => {
      // Search matching
      const matchesSearch = 
        cond.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cond.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cond.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Category filter matching
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Common in Nigeria') return cond.isCommonInNigeria;
      if (activeFilter === 'Fitzpatrick IV–VI Specific') return cond.isFitzpatrickSpecific;
      return cond.category === activeFilter;
    });
  }, [searchQuery, activeFilter]);

  const handleSelectCondition = (cond: Condition) => {
    setSelectedCondition(cond);
    setSelectedLang('EN');
    setActiveSeverity('mild');
  };

  return (
    <div style={{ 
      backgroundColor: '#f9f5ef', 
      minHeight: '100dvh', 
      width: '100%', 
      fontFamily: "'Outfit', 'Inter', system-ui, -apple-system, sans-serif",
      paddingBottom: '96px',
      boxSizing: 'border-box'
    }}>
      
      {/* Main container */}
      <div style={{
        maxWidth: '480px',
        margin: '0 auto',
        paddingLeft: '16px',
        paddingRight: '16px',
        boxSizing: 'border-box',
        width: '100%'
      }}>
        
        {selectedCondition ? (
          /* ============================================ */
          /* 1. CONDITION DETAIL PAGE                     */
          /* ============================================ */
          <div style={{ paddingTop: '16px', animation: 'fadeIn 0.25s ease' }}>
            
            {/* Back to Library */}
            <button
              onClick={() => setSelectedCondition(null)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#0d6b5e',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                padding: '8px 0',
                marginBottom: '16px',
                minHeight: '44px'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back to Library</span>
            </button>

            {/* Condition Header Info */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  backgroundColor: 'rgba(13, 107, 94, 0.08)',
                  color: '#0d6b5e',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {selectedCondition.category}
                </span>
                {selectedCondition.isCommonInNigeria && (
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    backgroundColor: '#e6f6ee',
                    color: '#4caf87',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Common in Nigeria
                  </span>
                )}
              </div>
              
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: 900, 
                color: '#111827', 
                margin: 0,
                lineHeight: 1.15
              }}>
                {selectedCondition.name}
              </h1>
            </div>

            {/* Plain English Translation & Tabs */}
            <Card variant="default" padding="lg" style={{ border: '1px solid rgba(13, 107, 94, 0.05)', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '16px', backgroundColor: '#ffffff' }}>
              <p style={{ 
                fontSize: '14px', 
                color: '#4b5563', 
                lineHeight: 1.6, 
                margin: '0 0 16px 0' 
              }}>
                {selectedCondition.longDesc[selectedLang]}
              </p>

              {/* Language Toggle bar */}
              <div style={{
                display: 'flex',
                gap: '8px',
                borderTop: '1px solid rgba(13, 107, 94, 0.08)',
                paddingTop: '12px'
              }}>
                {(['EN', 'YO', 'HA', 'IG'] as const).map((lang) => {
                  const isSelected = selectedLang === lang;
                  return (
                    <button
                      key={lang}
                      onClick={() => setSelectedLang(lang)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 800,
                        border: '1px solid ' + (isSelected ? '#0d6b5e' : 'rgba(13, 107, 94, 0.15)'),
                        backgroundColor: isSelected ? 'rgba(13, 107, 94, 0.08)' : 'transparent',
                        color: isSelected ? '#0d6b5e' : '#6b7280',
                        cursor: 'pointer',
                        transition: 'all 0.15s'
                      }}
                    >
                      {lang === 'EN' ? 'English (EN)' : lang === 'YO' ? 'Yorùbá (YO)' : lang === 'HA' ? 'Hausa (HA)' : 'Igbo (IG)'}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Darker Skin Tones presentation */}
            {selectedCondition.isFitzpatrickSpecific && (
              <Card variant="default" padding="lg" style={{ border: '1px solid rgba(13, 107, 94, 0.05)', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '16px', backgroundColor: '#ffffff' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '4px', height: '14px', backgroundColor: '#0d6b5e', borderRadius: '2px', display: 'inline-block' }} />
                  How it looks on darker skin tones
                </h3>
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                  {selectedCondition.darkSkinTips}
                </p>

                {/* Visual example card */}
                <div style={{
                  background: '#faf7f2',
                  border: '1px solid #e8dcc4',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: selectedCondition.visualExample.color, border: '2px solid #ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }} />
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#0d6b5e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Visual Guide (Fitzpatrick IV–VI)</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#4b5563', margin: 0, lineHeight: 1.45, fontStyle: 'italic' }}>
                    "{selectedCondition.visualExample.description}"
                  </p>
                </div>
              </Card>
            )}

            {/* Severity Range interactive selector */}
            <Card variant="default" padding="lg" style={{ border: '1px solid rgba(13, 107, 94, 0.05)', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '16px', backgroundColor: '#ffffff' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 12px 0' }}>Severity Range</h3>
              
              {/* Severity Pill selectors */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                {(['mild', 'moderate', 'severe'] as const).map((sev) => {
                  const isSelected = activeSeverity === sev;
                  let color = '#4caf87';
                  let bg = 'rgba(76, 175, 135, 0.08)';
                  if (sev === 'moderate') {
                    color = '#e8a838';
                    bg = 'rgba(232, 168, 56, 0.08)';
                  } else if (sev === 'severe') {
                    color = '#e05252';
                    bg = 'rgba(224, 82, 82, 0.08)';
                  }

                  return (
                    <button
                      key={sev}
                      onClick={() => setActiveSeverity(sev)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 700,
                        textTransform: 'capitalize',
                        cursor: 'pointer',
                        border: isSelected ? `2px solid ${color}` : '1px solid rgba(0,0,0,0.06)',
                        backgroundColor: isSelected ? bg : '#ffffff',
                        color: isSelected ? color : '#6b7280',
                        transition: 'all 0.15s'
                      }}
                    >
                      {sev}
                    </button>
                  );
                })}
              </div>

              {/* Dynamic severity text box */}
              <div style={{ background: '#faf7f2', padding: '12px 16px', borderRadius: '12px', borderLeft: `3px solid ${activeSeverity === 'mild' ? '#4caf87' : activeSeverity === 'moderate' ? '#e8a838' : '#e05252'}` }}>
                <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: 1.45, margin: 0 }}>
                  {selectedCondition.severityRange[activeSeverity].desc}
                </p>
              </div>
            </Card>

            {/* Self-Treatment steps & generics */}
            <Card variant="default" padding="lg" style={{ border: '1px solid rgba(13, 107, 94, 0.05)', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '16px', backgroundColor: '#ffffff' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: '0 0 12px 0' }}>Self-Treatment</h3>
              
              {/* Steps */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {selectedCondition.selfTreatment.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#0d6b5e', width: '20px', textAlign: 'right' }}>{idx + 1}.</span>
                    <p style={{ fontSize: '13px', color: '#6b7280', margin: 0, lineHeight: 1.45 }}>{step}</p>
                  </div>
                ))}
              </div>

              {/* Pharmacy Guide */}
              <div style={{
                background: '#faf7f2',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid #e8dcc4',
              }}>
                <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#0d6b5e', margin: '0 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Available at Nigerian pharmacies
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedCondition.pharmacyOptions.map((med, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#4b5563' }}>
                      <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#0d6b5e' }} />
                      <span>{med}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* When To See A Doctor (Red Flags) */}
            <Card variant="default" padding="lg" style={{ border: '1px solid rgba(13, 107, 94, 0.05)', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '16px', backgroundColor: '#ffffff' }}>
              <div style={{
                background: '#fbebeb',
                padding: '16px',
                borderRadius: '12px',
                color: '#e05252'
              }}>
                <h4 style={{ fontSize: '13px', fontWeight: 800, margin: '0 0 10px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={16} />
                  When To See A Doctor
                </h4>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px', lineHeight: 1.5, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedCondition.redFlags.map((flag, idx) => (
                    <li key={idx}>{flag}</li>
                  ))}
                </ul>
              </div>
            </Card>

            {/* Related Conditions */}
            {selectedCondition.relatedConditions.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#6b7280', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Related Conditions</h3>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }} className="scrollbar-hide">
                  {selectedCondition.relatedConditions.map((relName) => {
                    const match = CONDITIONS.find(c => c.name === relName);
                    return (
                      <button
                        key={relName}
                        onClick={() => match && handleSelectCondition(match)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '20px',
                          border: '1.5px solid rgba(13, 107, 94, 0.15)',
                          backgroundColor: '#ffffff',
                          color: '#0d6b5e',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {relName}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CTA: Scan for this Condition */}
            <div style={{ padding: '8px 0 32px 0' }}>
              <Button
                fullWidth
                onClick={() => navigate('/scan/new')}
                style={{ minHeight: '48px', boxShadow: '0 4px 14px rgba(13, 107, 94, 0.3)' }}
              >
                Scan for This Condition
              </Button>
            </div>

          </div>
        ) : (
          /* ============================================ */
          /* 2. LIBRARY LIST & GRID VIEW                  */
          /* ============================================ */
          <div style={{ paddingTop: '20px' }}>
            
            {/* Header */}
            <div style={{ marginBottom: '20px' }}>
              <h1 style={{ 
                fontSize: '28px', 
                fontWeight: 900, 
                color: '#0d6b5e', 
                margin: 0,
                fontFamily: "'Outfit', 'Inter', system-ui, -apple-system, sans-serif"
              }}>
                Skin Library
              </h1>
              <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px', margin: 0 }}>
                Clinical guidance and resources calibrated for tropical skin phototypes.
              </p>
            </div>

            {/* Search Bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#ffffff',
              border: isSearchFocused ? '2px solid #0d6b5e' : '1.5px solid rgba(13, 107, 94, 0.15)',
              borderRadius: '16px',
              padding: '12px 18px',
              gap: '12px',
              marginBottom: '20px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              transition: 'all 0.2s'
            }}>
              <Search size={18} style={{ color: isSearchFocused ? '#0d6b5e' : '#6b7280' }} />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conditions..."
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '14px',
                  backgroundColor: 'transparent',
                  color: '#111827'
                }}
              />
            </div>

            {/* Filter Chips Horizontal Scroll */}
            <div style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              marginBottom: '24px',
              paddingBottom: '6px',
              scrollbarWidth: 'none',
            }} className="scrollbar-hide">
              {['All', 'Common in Nigeria', 'Fungal', 'Inflammatory', 'Pigmentation', 'Autoimmune', 'Scarring', 'Infections', 'Fitzpatrick IV–VI Specific'].map((chip) => {
                const isActive = activeFilter === chip;
                return (
                  <button
                    key={chip}
                    onClick={() => setActiveFilter(chip)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      cursor: 'pointer',
                      border: '1.5px solid ' + (isActive ? '#0d6b5e' : 'rgba(13, 107, 94, 0.15)'),
                      backgroundColor: isActive ? '#0d6b5e' : '#ffffff',
                      color: isActive ? '#ffffff' : '#0d6b5e',
                      transition: 'all 0.15s'
                    }}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>

            {/* Condition Grid (2 columns) */}
            {filteredConditions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0', color: '#6b7280' }}>
                <HelpCircle size={36} style={{ margin: '0 auto 12px auto', color: '#0d6b5e', opacity: 0.5 }} />
                <p style={{ fontSize: '14px', fontWeight: 600 }}>No conditions match "{searchQuery}"</p>
                <p style={{ fontSize: '12px', marginTop: '4px' }}>Try adjusting your filters or search keywords.</p>
              </div>
            ) : (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '14px',
                width: '100%' 
              }}>
                {filteredConditions.map((cond) => (
                  <Card
                    key={cond.id}
                    onClick={() => handleSelectCondition(cond)}
                    hover
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(13, 107, 94, 0.05)',
                      borderRadius: '16px',
                      padding: '20px 16px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      minHeight: '160px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#111827', margin: 0, lineHeight: 1.25 }}>
                        {cond.name}
                      </h3>
                      <p style={{ 
                        fontSize: '11px', 
                        color: '#6b7280', 
                        margin: 0, 
                        lineHeight: 1.35,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {cond.shortDesc}
                      </p>
                    </div>

                    {/* Chips Row at bottom of card */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '10px' }}>
                      {cond.isCommonInNigeria && (
                        <span style={{
                          fontSize: '8px',
                          fontWeight: 800,
                          backgroundColor: 'rgba(13, 107, 94, 0.08)',
                          color: '#0d6b5e',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          alignSelf: 'flex-start'
                        }}>
                          Common in Nigeria
                        </span>
                      )}
                      {cond.isFitzpatrickSpecific && (
                        <span style={{
                          fontSize: '8px',
                          fontWeight: 800,
                          backgroundColor: '#111827',
                          color: '#ffffff',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          alignSelf: 'flex-start'
                        }}>
                          Fitzpatrick IV–VI
                        </span>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
