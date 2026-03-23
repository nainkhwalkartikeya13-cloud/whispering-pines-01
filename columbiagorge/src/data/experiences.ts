export interface Experience {
  name: string;
  description: string;
  season: string[];
  duration: string;
  image: string;
  bookable: boolean;
  price?: string;
}

export const experiences: Experience[] = [
  {
    name: 'Guided Hiking',
    description:
      'Explore the Gorge with a local naturalist guide who knows every hidden waterfall, wildflower meadow, and viewpoint. Routes tailored to your fitness level and interests, from gentle creek-side strolls to challenging ridge scrambles.',
    season: ['Spring', 'Summer', 'Autumn'],
    duration: '3–5 hours',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    bookable: false,
  },
  {
    name: 'Columbia River Kayaking',
    description:
      'Paddle the calm waters of the Columbia River with views of the Gorge walls rising on either side. Our outfitter provides all equipment, safety briefing, and a guide who knows the best spots for wildlife sightings and photo opportunities.',
    season: ['Summer'],
    duration: '2–3 hours',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    bookable: false,
  },
  {
    name: 'Stargazing Experience',
    description:
      'Our property sits in a low-light-pollution zone, offering exceptional night sky viewing. Join our resident astronomer on the observatory meadow for a guided tour of the constellations, planets, and deep-sky objects using our telescope.',
    season: ['Summer', 'Autumn'],
    duration: '1.5–2 hours',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
    bookable: false,
  },
  {
    name: 'Wine Tasting Excursion',
    description:
      'The Columbia River Gorge is home to over 40 wineries and tasting rooms. We arrange private transportation to our three favorite vineyards, where you will taste award-winning Pinot Noir, Riesling, and Syrah while overlooking the river.',
    season: ['Spring', 'Summer', 'Autumn'],
    duration: '4–5 hours',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
    bookable: false,
  },
  {
    name: 'Couples Spa Treatment',
    description:
      'A 60-minute couples massage in our forest spa pavilion, surrounded by the sounds of the creek and the scent of cedar. Our licensed therapists use locally sourced essential oils and techniques drawn from both Eastern and Western traditions.',
    season: ['Spring', 'Summer', 'Autumn', 'Winter'],
    duration: '60 minutes',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
    bookable: true,
    price: '$400',
  },
  {
    name: 'Morning Yoga',
    description:
      'Begin your day with a guided yoga session on our open-air meadow platform, overlooking the forest canopy. Suitable for all levels. Mats, blocks, and props provided. Available as a private session or small group.',
    season: ['Spring', 'Summer', 'Autumn'],
    duration: '60 minutes',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
    bookable: false,
  },
  {
    name: 'Wild Foraging Walk',
    description:
      'Join our foraging guide for a walk through the property\'s forest and meadows, learning to identify edible mushrooms, herbs, and plants. In autumn, expect chanterelles, wood sorrel, and miner\'s lettuce. Seasonal and weather-dependent.',
    season: ['Autumn'],
    duration: '2–3 hours',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    bookable: false,
  },
  {
    name: 'Private Chef Dinner',
    description:
      'A 3-course farm-to-table dinner prepared at your accommodation by our resident chef. Menus change with the seasons, featuring locally sourced ingredients, foraged elements from the property, and wines from Gorge vineyards.',
    season: ['Spring', 'Summer', 'Autumn', 'Winter'],
    duration: '2.5–3 hours',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
    bookable: true,
    price: '$600',
  },
];
