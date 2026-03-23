export interface AccommodationTypeDetail {
  heroImage: string;
  tagline: string;
  longDescription: string[];
  whatToExpect: string[];
  galleryImages: string[];
  amenities: { icon: string; label: string }[];
}

export const accommodationTypeDetails: Record<string, AccommodationTypeDetail> = {
  yurt: {
    heroImage: 'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1400',
    tagline: 'Circular sanctuaries where rustic charm meets refined luxury — your private forest retreat awaits.',
    longDescription: [
      'Our luxury yurts are the crown jewels of Whispering Pines Retreats. Inspired by the traditional nomadic shelters of Central Asia, these permanent structures have been reimagined for the modern traveler who refuses to compromise on comfort.',
      'Each yurt sits on a raised hardwood platform, with solid insulated walls, a domed skylight that frames the treetops, and a wood-burning stove that fills the space with warmth and the scent of Douglas fir. The interiors feature king or queen beds with organic cotton linens, handwoven rugs, and locally crafted furniture.',
      'Step outside onto your private deck and you will find an outdoor soaking tub (in select yurts), Adirondack chairs, and a fire pit with complimentary firewood and marshmallow roasting kits. The only sounds are the creek, the wind, and the occasional call of a great horned owl.',
      'Our yurts range from 400 to 500 square feet and accommodate 2 to 6 guests. Whether you are planning a romantic escape or a family adventure, there is a yurt that fits your vision perfectly.',
    ],
    whatToExpect: [
      'Private en-suite bathroom with hot shower',
      'Wood-burning stove with firewood provided',
      'King or queen bed with premium organic linens',
      'Private outdoor deck with seating',
      'Welcome basket with local artisan snacks',
      'Bathrobes and slippers',
      'French press coffee and loose-leaf tea',
      'Flashlights and lanterns for evening ambiance',
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
      'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800',
      'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800',
    ],
    amenities: [
      { icon: '🔥', label: 'Wood-Burning Stove' },
      { icon: '🛁', label: 'En-Suite Bathroom' },
      { icon: '🛏️', label: 'Premium Linens' },
      { icon: '☕', label: 'Coffee & Tea Station' },
      { icon: '🌲', label: 'Private Deck' },
      { icon: '🧖', label: 'Bathrobes & Slippers' },
      { icon: '🔦', label: 'Lantern Lighting' },
      { icon: '🧺', label: 'Welcome Basket' },
    ],
  },
  'safari-tent': {
    heroImage: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1400',
    tagline: 'Canvas walls, hardwood floors — where the thrill of the wild meets boutique hotel elegance.',
    longDescription: [
      'Our safari tents are for those who want to feel the boundary between indoors and out dissolve. Raised on hardwood platforms and wrapped in heavy-duty canvas, these tents capture the romance of a classic African safari while delivering the comforts of a luxury retreat.',
      'Each tent features a proper bed frame with quality mattress, bedside tables with reading lamps, handwoven rugs over hardwood floors, and a private deck that extends your living space into the forest. The canvas walls breathe with the weather — you will hear the rain, smell the earth, and feel the temperature shift with the day.',
      'Safari tents are our most popular accommodation for couples. The Trillium tent, with its en-suite bathroom and 350 square feet, is the more "hotel-like" option. The Lupine tent, at 280 square feet with a garden view and pet-friendly policy, is perfect for those seeking a more intimate, stripped-back experience.',
    ],
    whatToExpect: [
      'Queen or king bed with quality mattress',
      'Hardwood floor platform',
      'Private deck with forest or garden views',
      'En-suite bathroom (Trillium) or shared bathhouse (Lupine)',
      'Reading lamps and power outlets',
      'Welcome basket with local snacks',
      'Pet-friendly options available',
      'Portable heater available in cooler months',
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
      'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
      'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800',
    ],
    amenities: [
      { icon: '🏕️', label: 'Canvas Walls' },
      { icon: '🪵', label: 'Hardwood Platform' },
      { icon: '🛏️', label: 'Proper Bed Frame' },
      { icon: '🌿', label: 'Private Deck' },
      { icon: '🐕', label: 'Pet-Friendly Options' },
      { icon: '💡', label: 'Reading Lamps' },
      { icon: '🧺', label: 'Welcome Basket' },
      { icon: '🔌', label: 'Power Outlets' },
    ],
  },
  'bell-tent': {
    heroImage: 'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=1400',
    tagline: 'Bohemian-chic canvas cocoons beneath a canopy of ancient evergreens and starlit skies.',
    longDescription: [
      'The bell tent is the most iconic shape in glamping — a single-pole conical canvas structure that has sheltered travelers for centuries. Our Camas Bell Tent reimagines this timeless form with Moroccan-inspired interiors that feel like stepping into a desert oasis.',
      'Inside, you will find handwoven Moroccan rugs, hand-poured soy candles, a double bed dressed in quality linens, and a sky-view mesh ceiling panel that lets you stargaze from the warmth of your bed. The curved canvas walls create an intimate, cocoon-like atmosphere that strips away the noise of modern life.',
      'At 200 square feet, the bell tent is our most compact accommodation — and for many guests, that intimacy is the entire point. It is glamping at its most essential: a beautiful shelter in a beautiful place, with nothing unnecessary.',
    ],
    whatToExpect: [
      'Double bed with quality linens',
      'Moroccan-inspired interior design',
      'Sky-view mesh ceiling panel for stargazing',
      'Hand-poured soy candles and lanterns',
      'Shared bathhouse access (short walk)',
      'Welcome basket with local snacks',
      'Coir mat flooring with area rugs',
      'Portable heater available on request',
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=800',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800',
      'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
    ],
    amenities: [
      { icon: '⛺', label: 'Classic Canvas Design' },
      { icon: '🌙', label: 'Stargazing Panel' },
      { icon: '🕯️', label: 'Candle & Lantern Lighting' },
      { icon: '🛏️', label: 'Quality Double Bed' },
      { icon: '🧶', label: 'Moroccan Textiles' },
      { icon: '🐕', label: 'Pet-Friendly' },
      { icon: '🧺', label: 'Welcome Basket' },
      { icon: '🚿', label: 'Shared Bathhouse' },
    ],
  },
  campsite: {
    heroImage: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1400',
    tagline: 'Sleep beneath a cathedral of old-growth Douglas firs — the most immersive way to experience the Gorge.',
    longDescription: [
      'For those who want the full outdoor experience, our Forest Campsites offer primitive tent camping in one of the most spectacular settings in the Pacific Northwest. Each site sits beneath a cathedral canopy of old-growth Douglas firs, with a fire ring, picnic table, and access to our shared bathhouses.',
      'Primitive does not mean forgotten. The bathhouses feature hot showers, clean facilities, and mirrors. The fire rings come with complimentary firewood. And every campsite guest has full access to the property\'s trails, meadows, and common areas — the same 400 acres that our yurt guests explore.',
      'The Forest Campsites are our most affordable accommodation and our most pet-friendly. They are perfect for families who want to introduce children to camping, friends planning a group adventure, or solo travelers looking for the most immersive connection with the land.',
    ],
    whatToExpect: [
      'Flat, cleared tent pad',
      'Fire ring with complimentary firewood',
      'Picnic table',
      'Access to shared bathhouses with hot showers',
      'Bear box for food storage',
      'Pet-friendly (leash required in common areas)',
      'Access to all property trails and common areas',
      'Marshmallow roasting kit provided',
    ],
    galleryImages: [
      'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=800',
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800',
      'https://images.unsplash.com/photo-1517824806704-9040b037703b?w=800',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
    ],
    amenities: [
      { icon: '🔥', label: 'Fire Ring & Firewood' },
      { icon: '🪑', label: 'Picnic Table' },
      { icon: '🚿', label: 'Shared Bathhouse' },
      { icon: '🐕', label: 'Pet-Friendly' },
      { icon: '🐻', label: 'Bear Box' },
      { icon: '🏞️', label: 'Trail Access' },
      { icon: '👨‍👩‍👧‍👦', label: 'Family-Friendly' },
      { icon: '🫕', label: 'Marshmallow Kit' },
    ],
  },
};
