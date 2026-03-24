export type GalleryCategory = 'accommodations' | 'nature' | 'activities' | 'events' | 'food';

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  span?: 2; // optional: image spans 2 columns for masonry effect
}

export const GALLERY_CATEGORIES: { value: GalleryCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'accommodations', label: 'Accommodations' },
  { value: 'nature', label: 'Nature' },
  { value: 'activities', label: 'Activities' },
  { value: 'events', label: 'Events' },
  { value: 'food', label: 'Food & Drink' },
];

export const galleryImages: GalleryImage[] = [
  // Accommodations
  { id: 'a1', src: 'https://images.unsplash.com/photo-1533619239233-6280475a633a?w=800', alt: "Wy'East Yurt exterior at sunset", category: 'accommodations', span: 2 },
  { id: 'a2', src: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800', alt: 'Trillium Safari Tent with forest backdrop', category: 'accommodations' },
  { id: 'a3', src: 'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?w=800', alt: 'Camas Bell Tent interior with Moroccan decor', category: 'accommodations' },
  { id: 'a4', src: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800', alt: 'Pahto Yurt wraparound deck with meadow view', category: 'accommodations' },
  { id: 'a5', src: 'https://images.unsplash.com/photo-1504615755583-2916b52192a3?w=800', alt: 'Forest Campsite beneath Douglas firs', category: 'accommodations' },
  { id: 'a6', src: 'https://images.unsplash.com/photo-1562767882-c8e9a7c82b22?w=800', alt: 'Loowit Yurt fire pit at dusk', category: 'accommodations' },

  // Nature
  { id: 'n1', src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', alt: 'Sunlight filtering through old-growth Douglas firs', category: 'nature', span: 2 },
  { id: 'n2', src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800', alt: 'Morning mist rolling through the canyon', category: 'nature' },
  { id: 'n3', src: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800', alt: 'Waterfall cascading into mossy pool', category: 'nature' },
  { id: 'n4', src: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800', alt: 'Wildflower meadow with mountain backdrop', category: 'nature' },
  { id: 'n5', src: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=800', alt: 'Bald eagle soaring over the Columbia River', category: 'nature' },

  // Activities
  { id: 'ac1', src: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', alt: 'Hiking the Eagle Creek Trail', category: 'activities', span: 2 },
  { id: 'ac2', src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', alt: 'Kayaking on the Columbia River at sunset', category: 'activities' },
  { id: 'ac3', src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800', alt: 'Morning yoga on the meadow platform', category: 'activities' },
  { id: 'ac4', src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', alt: 'Summit view from Dog Mountain', category: 'activities' },
  { id: 'ac5', src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800', alt: 'Stargazing from the observatory meadow', category: 'activities' },

  // Events
  { id: 'e1', src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', alt: 'Wedding ceremony at The Meadow venue', category: 'events', span: 2 },
  { id: 'e2', src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', alt: 'Corporate retreat in The Creekside Longhouse', category: 'events' },
  { id: 'e3', src: 'https://images.unsplash.com/photo-1529543544282-ea57407bc2f7?w=800', alt: 'Outdoor celebration with string lights', category: 'events' },

  // Food & Drink
  { id: 'f1', src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', alt: 'Private chef dinner plating', category: 'food', span: 2 },
  { id: 'f2', src: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=800', alt: 'Champagne arrival welcome basket', category: 'food' },
  { id: 'f3', src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', alt: 'Farm-to-table breakfast spread', category: 'food' },
  { id: 'f4', src: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', alt: 'Local wine tasting selection', category: 'food' },
  { id: 'f5', src: 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=800', alt: 'Fireside s\'mores with artisan chocolate', category: 'food' },
];
