export type TrailDifficulty = 'easy' | 'moderate' | 'challenging';

export interface Trail {
  name: string;
  difficulty: TrailDifficulty;
  distance: string;
  elevation: string;
  estimatedTime: string;
  description: string;
  highlights: string[];
  seasonal: string;
  image: string;
}

export const trailDifficultyColors: Record<TrailDifficulty, string> = {
  easy: '#4CAF50',
  moderate: '#FF9800',
  challenging: '#E53935',
};

export const trails: Trail[] = [
  {
    name: 'Eagle Creek Trail',
    difficulty: 'moderate',
    distance: '4.2 mi (round trip to Punchbowl Falls)',
    elevation: '400 ft',
    estimatedTime: '2–3 hours',
    description:
      'The most iconic trail in the Gorge. A cliff-hugging path passes a procession of waterfalls before arriving at the turquoise pool of Punchbowl Falls. Can be extended to High Bridge (8 mi) or Tunnel Falls (12 mi).',
    highlights: ['Punchbowl Falls', 'Cliff-edge trail', 'Moss-covered canyon', 'Multiple waterfalls'],
    seasonal: 'Best April–November. Trail can be icy in winter.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
  },
  {
    name: 'Dog Mountain',
    difficulty: 'challenging',
    distance: '6.9 mi (round trip)',
    elevation: '2,800 ft',
    estimatedTime: '4–5 hours',
    description:
      'A strenuous climb rewarded by one of the most spectacular wildflower displays in the Pacific Northwest. The summit offers panoramic views of the Gorge, Mount Hood, and Mount Adams.',
    highlights: ['Wildflower meadows', '360° summit views', 'Mount Hood & Adams vista', 'Balsamroot blooms'],
    seasonal: 'Peak wildflowers mid-May to mid-June. Permit required May–June.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
  },
  {
    name: 'Hamilton Mountain',
    difficulty: 'challenging',
    distance: '7.5 mi (loop)',
    elevation: '2,000 ft',
    estimatedTime: '4–5 hours',
    description:
      'Our staff favorite. A rewarding loop that climbs through mossy forest past Hardy Falls and Rodney Falls before reaching a rocky summit with 360-degree views of the Gorge.',
    highlights: ['Hardy Falls', 'Rodney Falls', 'Rocky summit viewpoint', 'Loop trail option'],
    seasonal: 'Year-round, but best March–November. Muddy in winter.',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800',
  },
  {
    name: 'Beacon Rock',
    difficulty: 'moderate',
    distance: '1.8 mi (round trip)',
    elevation: '600 ft',
    estimatedTime: '1–1.5 hours',
    description:
      'An engineering marvel — 52 switchbacks carved into the face of an 848-foot volcanic plug. Short but steep, with a view from the top that is one of the most photographed in the Gorge.',
    highlights: ['Volcanic monolith', '52 switchbacks', 'River panorama', 'Historic trail construction'],
    seasonal: 'Year-round. Open weather permitting.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  },
  {
    name: 'Wahclella Falls',
    difficulty: 'easy',
    distance: '2.0 mi (round trip)',
    elevation: '350 ft',
    estimatedTime: '1–1.5 hours',
    description:
      'A gentle canyon walk to a dramatic two-tiered waterfall. Perfect for afternoon arrivals — short enough to complete before dinner, beautiful enough to set the tone for your stay.',
    highlights: ['Two-tiered waterfall', 'Narrow canyon', 'Family-friendly', 'Old-growth forest'],
    seasonal: 'Year-round. Most dramatic in spring with snowmelt.',
    image: 'https://images.unsplash.com/photo-1432405972618-c6b0cfbbb14d?w=800',
  },
  {
    name: 'Cape Horn Trail',
    difficulty: 'challenging',
    distance: '8.0 mi (loop)',
    elevation: '1,300 ft',
    estimatedTime: '4–6 hours',
    description:
      'A rim-hugging loop with views that rival anything in the national park system. The western viewpoint overlooks the river 800 feet below. Less crowded than the Oregon side.',
    highlights: ['Gorge rim views', 'Wildflowers in spring', 'River overlook', 'Less crowded'],
    seasonal: 'Best March–November. Western viewpoint closed during falcon nesting (Feb–July).',
    image: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800',
  },
  {
    name: 'Catherine Creek',
    difficulty: 'easy',
    distance: '1–6 mi (multiple options)',
    elevation: '200–800 ft',
    estimatedTime: '1–3 hours',
    description:
      'The driest area of the Gorge, with the earliest wildflower blooms. A flexible trail system with options from gentle meadow walks to longer ridge hikes. Natural rock arches and panoramic views. Dog-friendly.',
    highlights: ['Early wildflowers', 'Natural rock arch', 'Dog-friendly', 'Flexible distances'],
    seasonal: 'Best March–May for wildflowers. Exposed — bring sun protection in summer.',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
  },
  {
    name: 'Falls Creek Falls',
    difficulty: 'moderate',
    distance: '3.4 mi (round trip)',
    elevation: '700 ft',
    estimatedTime: '2–3 hours',
    description:
      'A forest walk to a spectacular 200-foot waterfall that drops into a natural amphitheater. Well-maintained and relatively flat, accessible for most fitness levels.',
    highlights: ['200-foot waterfall', 'Natural amphitheater', 'Old-growth forest', 'Well-maintained trail'],
    seasonal: 'Best spring through early summer when snowmelt powers the falls.',
    image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800',
  },
  {
    name: 'Coyote Wall',
    difficulty: 'moderate',
    distance: '5.0 mi (loop)',
    elevation: '1,200 ft',
    estimatedTime: '3–4 hours',
    description:
      'An open, wind-swept ridge hike with sweeping views of the eastern Gorge. Wildflower-covered meadows lead to dramatic basalt cliffs and Columbia River views.',
    highlights: ['Basalt formations', 'Wildflower meadows', 'Eastern Gorge views', 'Open ridgeline'],
    seasonal: 'Best March–June. Very exposed — avoid in extreme heat or wind.',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
  },
];
