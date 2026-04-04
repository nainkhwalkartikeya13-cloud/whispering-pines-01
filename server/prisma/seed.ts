import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌲 Checking database state...');
  const accommodationCount = await prisma.accommodation.count();
  if (accommodationCount > 0) {
    console.log('🌲 Database already has accommodations. Skipping mock seed to prevent data loss.');
    return;
  }

  console.log('🌲 Seeding Columbia Gorge Getaways database...\n');

  // ── Admin ──────────────────────────────────────────────
  const adminEmail = process.env.ADMIN_EMAIL ?? 'kartikeyanainkhwal@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash },
  });
  console.log(`✓ Admin: ${adminEmail}`);

  // ── Accommodations ─────────────────────────────────────
  const accommodations = [
    // Luxury Yurts
    {
      slug: 'yurt-wyeast',
      name: "Wy'East Yurt",
      type: 'yurt',
      description: "Our flagship 700 sq ft luxury yurt, named after the Native American name for Mt. Hood. Features a private bedroom with king bed, sleeping loft with queen futon, full kitchen, and a wraparound deck overlooking the creek. Radiant floor heating keeps you cozy through every season while floor-to-ceiling windows frame the old-growth forest canopy.",
      sqft: 700,
      maxGuests: 6,
      pricePerNight: 12500,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=1200',
        'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1200',
        'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200',
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200',
      ]),
      amenityTags: JSON.stringify(['King Bed', 'Full Kitchen', 'Radiant Heat', 'Private Deck', 'Creek View', 'WiFi', 'Fire Pit', 'BBQ Grill']),
    },
    {
      slug: 'yurt-pahto',
      name: 'Pahto Yurt',
      type: 'yurt',
      description: "Perched on a gentle hillside with sweeping views of the Columbia River Gorge, the Pahto Yurt blends rustic charm with modern luxury. The open-plan living space features a vaulted skylight dome that fills the interior with natural light by day and offers stargazing from your bed at night. A wood-burning stove anchors the living area.",
      sqft: 550,
      maxGuests: 4,
      pricePerNight: 9800,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
        'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200',
        'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1200',
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200',
      ]),
      amenityTags: JSON.stringify(['Queen Bed', 'Skylight Dome', 'Wood Stove', 'Kitchenette', 'Gorge View', 'Fire Pit', 'Stargazing']),
    },
    {
      slug: 'yurt-loowit',
      name: 'Loowit Yurt',
      type: 'yurt',
      description: "Tucked into a grove of Douglas fir, the Loowit Yurt is our most intimate retreat. Ideal for couples seeking seclusion, it features a plush king bed, a clawfoot soaking tub, and a private hot tub on the deck. Named after Mt. St. Helens, this yurt captures the raw beauty of the Pacific Northwest in every detail.",
      sqft: 450,
      maxGuests: 2,
      pricePerNight: 8500,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=1200',
        'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=1200',
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200',
        'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=1200',
      ]),
      amenityTags: JSON.stringify(['King Bed', 'Hot Tub', 'Soaking Tub', 'Kitchenette', 'Forest View', 'Couples Retreat', 'Heated Floors']),
    },
    {
      slug: 'yurt-tahoma',
      name: 'Tahoma Yurt',
      type: 'yurt',
      description: "The Tahoma is our family-friendly luxury yurt with two separate sleeping areas, a full kitchen, and a large covered porch with dining table. The kids' loft has built-in bunks with reading lights and a climbing wall to reach it — adventure starts at home. Located steps from the creek trail and playground.",
      sqft: 650,
      maxGuests: 8,
      pricePerNight: 13500,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1200',
        'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=1200',
        'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200',
      ]),
      amenityTags: JSON.stringify(['King Bed', 'Bunk Loft', 'Full Kitchen', 'Covered Porch', 'Family Friendly', 'Near Playground', 'Fire Pit', 'BBQ']),
    },

    // Safari Tents
    {
      slug: 'safari-trillium',
      name: 'Trillium Safari Tent',
      type: 'safari-tent',
      description: "Step into the Trillium and feel the boundaries between indoors and outdoors dissolve. This spacious canvas-and-wood safari tent features a raised platform deck, king bed with organic linens, a wood-burning stove, and roll-up canvas walls that let the forest breeze flow through. Private bathroom with rainfall shower included.",
      sqft: 400,
      maxGuests: 4,
      pricePerNight: 7200,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200',
        'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=1200',
        'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=1200',
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200',
      ]),
      amenityTags: JSON.stringify(['King Bed', 'Wood Stove', 'Private Bathroom', 'Rainfall Shower', 'Roll-up Walls', 'Deck', 'Solar Powered']),
    },
    {
      slug: 'safari-lupine',
      name: 'Lupine Safari Tent',
      type: 'safari-tent',
      description: "The Lupine sits on the meadow's edge where wildflowers bloom from spring through fall. This safari tent features a queen bed, cozy sitting area, private composting toilet, and an outdoor shower that looks out to the mountains. Perfect for couples who want to wake up surrounded by nature's palette.",
      sqft: 350,
      maxGuests: 3,
      pricePerNight: 6500,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=1200',
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200',
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      ]),
      amenityTags: JSON.stringify(['Queen Bed', 'Outdoor Shower', 'Meadow View', 'Solar Lanterns', 'Private Toilet', 'Sitting Area']),
    },
    {
      slug: 'safari-fern',
      name: 'Fern Safari Tent',
      type: 'safari-tent',
      description: "Hidden beneath a canopy of bigleaf maples, the Fern Safari Tent feels like a secret retreat discovered deep in the forest. Features a luxurious queen bed, writing desk, hammock on the deck, and an en-suite bathroom. The dappled light through the leaves creates an ever-changing natural art installation.",
      sqft: 380,
      maxGuests: 3,
      pricePerNight: 6800,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200',
        'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=1200',
        'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=1200',
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200',
      ]),
      amenityTags: JSON.stringify(['Queen Bed', 'Writing Desk', 'Hammock', 'En-Suite Bath', 'Forest Canopy', 'Solar Powered']),
    },

    // Bell Tents
    {
      slug: 'bell-tent-camas',
      name: 'Camas Bell Tent',
      type: 'bell-tent',
      description: "Our signature bell tent offers a magical glamping experience with a queen bed dressed in premium linens, handwoven rugs, and solar-powered fairy lights. Share the communal bathhouse with hot showers and step out to your private fire pit each evening. Simple, beautiful, and deeply connected to the land.",
      sqft: 200,
      maxGuests: 2,
      pricePerNight: 4200,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=1200',
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200',
        'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=1200',
      ]),
      amenityTags: JSON.stringify(['Queen Bed', 'Fire Pit', 'Solar Lights', 'Communal Bathhouse', 'Handwoven Rugs']),
    },
    {
      slug: 'bell-tent-aster',
      name: 'Aster Bell Tent',
      type: 'bell-tent',
      description: "The Aster Bell Tent is set in a wildflower meadow with panoramic views of the Gorge. It features a plush double bed, Pendleton blankets, a small reading nook, and lantern lighting. Wake to birdsong and step outside to dew-covered grass — this is glamping at its most poetic.",
      sqft: 180,
      maxGuests: 2,
      pricePerNight: 3800,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=1200',
        'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=1200',
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200',
      ]),
      amenityTags: JSON.stringify(['Double Bed', 'Meadow View', 'Pendleton Blankets', 'Reading Nook', 'Fire Pit', 'Communal Bathhouse']),
    },
    {
      slug: 'bell-tent-yarrow',
      name: 'Yarrow Bell Tent',
      type: 'bell-tent',
      description: "Nestled at the forest edge, the Yarrow Bell Tent bridges meadow and woodland. It comes with a comfortable double bed, side table, woven storage baskets, and an outdoor seating area with Adirondack chairs. Ideal for adventurers who want a cozy base camp for Gorge exploration.",
      sqft: 190,
      maxGuests: 2,
      pricePerNight: 3500,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200',
        'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?w=1200',
        'https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=1200',
      ]),
      amenityTags: JSON.stringify(['Double Bed', 'Adirondack Chairs', 'Forest Edge', 'Fire Pit', 'Communal Bathhouse']),
    },

    // Campsites
    {
      slug: 'campsite-forest',
      name: 'Forest Campsite',
      type: 'campsite',
      description: "Set beneath towering Douglas firs, our forest campsites offer level ground, a fire ring with grate, a picnic table, and nearby access to clean restrooms and hot showers. Each site is generously spaced for privacy. Bring your own tent or rent one of ours — either way, you'll sleep under a cathedral of ancient trees.",
      sqft: null,
      maxGuests: 6,
      pricePerNight: 2200,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200',
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1200',
        'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1200',
      ]),
      amenityTags: JSON.stringify(['Fire Ring', 'Picnic Table', 'Hot Showers', 'Restrooms', 'Tent Rental Available', 'Pet Friendly']),
    },
    {
      slug: 'campsite-creek',
      name: 'Creekside Campsite',
      type: 'campsite',
      description: "Fall asleep to the sound of rushing water at our creekside campsites. Located along the property's year-round creek, these sites are our most popular for summer stays. Each site includes a fire ring, bear box, picnic table, and access to the creek for wading and fishing.",
      sqft: null,
      maxGuests: 4,
      pricePerNight: 2800,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1200',
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200',
        'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1200',
      ]),
      amenityTags: JSON.stringify(['Creekside', 'Fire Ring', 'Bear Box', 'Fishing Access', 'Hot Showers', 'Restrooms']),
    },
    {
      slug: 'campsite-meadow',
      name: 'Meadow Campsite',
      type: 'campsite',
      description: "Open sky lovers, this one's for you. Our meadow campsites sit in a sunny clearing with unobstructed views of the night sky — perfect for stargazing. Each site has a fire pit, picnic table, and is close to the communal gathering area where guests share stories around the central bonfire.",
      sqft: null,
      maxGuests: 4,
      pricePerNight: 2000,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1200',
        'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=1200',
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200',
      ]),
      amenityTags: JSON.stringify(['Open Sky', 'Stargazing', 'Fire Pit', 'Communal Bonfire', 'Hot Showers', 'Restrooms']),
    },
  ];

  for (const acc of accommodations) {
    await prisma.accommodation.upsert({
      where: { slug: acc.slug },
      update: {
        name: acc.name,
        type: acc.type,
        description: acc.description,
        sqft: acc.sqft,
        maxGuests: acc.maxGuests,
        pricePerNight: acc.pricePerNight,
        images: acc.images,
        amenityTags: acc.amenityTags,
        isActive: true,
      },
      create: acc,
    });
  }
  console.log(`✓ ${accommodations.length} accommodations seeded`);

  // ── Services ───────────────────────────────────────────
  const services = [
    { name: 'Guided Waterfall Hike', category: 'activities', price: 1500, priceType: 'per-person', description: 'A 3-hour guided trek to hidden waterfalls with a naturalist guide.', sortOrder: 1 },
    { name: 'Kayak River Tour', category: 'activities', price: 3500, priceType: 'per-person', description: '2-hour guided kayaking on the Columbia River with all equipment included.', sortOrder: 2 },
    { name: 'Stargazing Experience', category: 'activities', price: 1200, priceType: 'per-person', description: 'Evening astronomy session with telescopes and a guide. Hot cocoa included.', sortOrder: 3 },
    { name: 'Sunrise Yoga Session', category: 'activities', price: 800, priceType: 'per-person', description: 'Morning yoga in the meadow led by a certified instructor.', sortOrder: 4 },
    { name: 'Wild Foraging Walk', category: 'activities', price: 2000, priceType: 'per-person', description: 'Learn to identify edible mushrooms, berries, and herbs with our foraging expert.', sortOrder: 5 },
    { name: 'Horseback Trail Ride', category: 'activities', price: 4500, priceType: 'per-person', description: '90-minute horseback ride through forest and meadow trails.', sortOrder: 6 },
    { name: 'Private Chef Dinner', category: 'dining', price: 8500, priceType: 'per-booking', description: 'Multi-course farm-to-table dinner prepared at your accommodation by our resident chef.', sortOrder: 7 },
    { name: 'Wine & Cheese Tasting', category: 'dining', price: 3000, priceType: 'per-person', description: 'Curated selection of Pacific Northwest wines paired with local artisan cheeses.', sortOrder: 8 },
    { name: "Campfire S'mores Kit", category: 'dining', price: 600, priceType: 'per-booking', description: "Gourmet s'mores with artisan chocolate, house-made marshmallows, and graham crackers.", sortOrder: 9 },
    { name: 'Breakfast Basket', category: 'dining', price: 1200, priceType: 'per-booking', description: 'Fresh pastries, local eggs, seasonal fruit, and coffee delivered to your door each morning.', sortOrder: 10 },
    { name: 'Forest Bathing Session', category: 'wellness', price: 2500, priceType: 'per-person', description: 'Guided shinrin-yoku (forest bathing) through old-growth forest. 90 minutes of mindful immersion.', sortOrder: 11 },
    { name: 'Couples Massage', category: 'wellness', price: 7000, priceType: 'per-booking', description: 'Side-by-side massage in our forest spa tent using locally sourced botanical oils.', sortOrder: 12 },
    { name: 'Hot Tub Reservation', category: 'wellness', price: 1500, priceType: 'per-booking', description: 'Private 90-minute hot tub session under the stars.', sortOrder: 13 },
    { name: 'Celebration Package', category: 'extras', price: 4000, priceType: 'per-booking', description: 'Flowers, champagne, chocolates, and a personalized card set up in your accommodation.', sortOrder: 14 },
    { name: 'Photography Session', category: 'extras', price: 5000, priceType: 'per-booking', description: '1-hour professional photo shoot at scenic spots on the property.', sortOrder: 15 },
    { name: 'Firewood Bundle', category: 'extras', price: 300, priceType: 'per-booking', description: 'Seasoned firewood bundle for your fire pit or wood stove.', sortOrder: 16 },
  ];

  await prisma.bookingEnhancement.deleteMany({});
  await prisma.service.deleteMany({});
  for (const svc of services) {
    await prisma.service.create({ data: svc });
  }
  console.log(`✓ ${services.length} services seeded`);

  // ── Get accommodation IDs ──────────────────────────────
  const allAccs = await prisma.accommodation.findMany();
  const accMap = Object.fromEntries(allAccs.map(a => [a.slug, a.id]));

  // ── Bookings ───────────────────────────────────────────
  await prisma.booking.deleteMany({});

  const bookings = [
    {
      guestFirstName: 'Sarah', guestLastName: 'Mitchell', guestEmail: 'sarah.mitchell@email.com',
      guestAdults: 2, guestChildren: 0, checkIn: new Date('2026-04-05'), checkOut: new Date('2026-04-08'),
      nights: 3, accommodationId: accMap['yurt-wyeast'], roomSubtotal: 37500, enhancementsSubtotal: 8500,
      totalAmountCents: 46000, status: 'confirmed',
      specialRequests: 'Anniversary trip — any special touches would be appreciated!',
    },
    {
      guestFirstName: 'James', guestLastName: 'Kumar', guestEmail: 'james.kumar@email.com',
      guestAdults: 2, guestChildren: 2, checkIn: new Date('2026-04-10'), checkOut: new Date('2026-04-14'),
      nights: 4, accommodationId: accMap['yurt-tahoma'], roomSubtotal: 54000, enhancementsSubtotal: 3000,
      totalAmountCents: 57000, status: 'confirmed',
      specialRequests: 'Kids ages 5 and 8. Do you have board games?',
    },
    {
      guestFirstName: 'Emily', guestLastName: 'Chen', guestEmail: 'emily.chen@email.com',
      guestAdults: 2, guestChildren: 0, checkIn: new Date('2026-03-28'), checkOut: new Date('2026-03-30'),
      nights: 2, accommodationId: accMap['yurt-loowit'], roomSubtotal: 17000, enhancementsSubtotal: 7000,
      totalAmountCents: 24000, status: 'confirmed',
      specialRequests: 'Couples retreat. Would love the hot tub!',
    },
    {
      guestFirstName: 'Michael', guestLastName: 'Torres', guestEmail: 'michael.torres@email.com',
      guestAdults: 2, guestChildren: 0, checkIn: new Date('2026-04-15'), checkOut: new Date('2026-04-17'),
      nights: 2, accommodationId: accMap['safari-trillium'], roomSubtotal: 14400, enhancementsSubtotal: 0,
      totalAmountCents: 14400, status: 'pending',
    },
    {
      guestFirstName: 'Priya', guestLastName: 'Sharma', guestEmail: 'priya.sharma@email.com',
      guestAdults: 1, guestChildren: 0, checkIn: new Date('2026-04-20'), checkOut: new Date('2026-04-23'),
      nights: 3, accommodationId: accMap['safari-lupine'], roomSubtotal: 19500, enhancementsSubtotal: 2500,
      totalAmountCents: 22000, status: 'confirmed',
      specialRequests: 'Solo wellness retreat. Interested in forest bathing.',
    },
    {
      guestFirstName: 'Tom', guestLastName: 'Richardson', guestEmail: 'tom.richardson@email.com',
      guestAdults: 2, guestChildren: 0, checkIn: new Date('2026-03-15'), checkOut: new Date('2026-03-18'),
      nights: 3, accommodationId: accMap['bell-tent-camas'], roomSubtotal: 12600, enhancementsSubtotal: 600,
      totalAmountCents: 13200, status: 'confirmed', paidAt: new Date('2026-03-10'),
    },
    {
      guestFirstName: 'Margot', guestLastName: 'Laurent', guestEmail: 'margot.laurent@email.com',
      guestAdults: 2, guestChildren: 0, checkIn: new Date('2026-05-01'), checkOut: new Date('2026-05-04'),
      nights: 3, accommodationId: accMap['yurt-pahto'], roomSubtotal: 29400, enhancementsSubtotal: 8500,
      totalAmountCents: 37900, status: 'confirmed',
    },
    {
      guestFirstName: 'David', guestLastName: 'Anderson', guestEmail: 'david.anderson@email.com',
      guestAdults: 2, guestChildren: 1, checkIn: new Date('2026-04-25'), checkOut: new Date('2026-04-28'),
      nights: 3, accommodationId: accMap['campsite-creek'], roomSubtotal: 8400, enhancementsSubtotal: 900,
      totalAmountCents: 9300, status: 'confirmed',
      specialRequests: "Bringing our golden retriever — he's friendly!",
    },
    {
      guestFirstName: 'Rachel', guestLastName: 'Kim', guestEmail: 'rachel.kim@email.com',
      guestAdults: 4, guestChildren: 0, checkIn: new Date('2026-05-10'), checkOut: new Date('2026-05-12'),
      nights: 2, accommodationId: accMap['campsite-forest'], roomSubtotal: 4400, enhancementsSubtotal: 4800,
      totalAmountCents: 9200, status: 'pending',
    },
    {
      guestFirstName: 'Alex', guestLastName: 'Petrov', guestEmail: 'alex.petrov@email.com',
      guestAdults: 2, guestChildren: 0, checkIn: new Date('2026-03-01'), checkOut: new Date('2026-03-03'),
      nights: 2, accommodationId: accMap['safari-fern'], roomSubtotal: 13600, enhancementsSubtotal: 0,
      totalAmountCents: 13600, status: 'confirmed', paidAt: new Date('2026-02-25'),
    },
    {
      guestFirstName: 'Sophie', guestLastName: 'Dubois', guestEmail: 'sophie.dubois@email.com',
      guestAdults: 2, guestChildren: 0, checkIn: new Date('2026-02-14'), checkOut: new Date('2026-02-17'),
      nights: 3, accommodationId: accMap['yurt-loowit'], roomSubtotal: 25500, enhancementsSubtotal: 11000,
      totalAmountCents: 36500, status: 'confirmed', paidAt: new Date('2026-02-01'),
      specialRequests: "Valentine's Day surprise for my partner!",
    },
    {
      guestFirstName: 'Marcus', guestLastName: 'Johnson', guestEmail: 'marcus.johnson@email.com',
      guestAdults: 2, guestChildren: 3, checkIn: new Date('2026-06-15'), checkOut: new Date('2026-06-20'),
      nights: 5, accommodationId: accMap['yurt-tahoma'], roomSubtotal: 67500, enhancementsSubtotal: 3600,
      totalAmountCents: 71100, status: 'confirmed',
      specialRequests: 'Family reunion trip! Kids are 4, 7, and 10.',
    },
    {
      guestFirstName: 'Lena', guestLastName: 'Okafor', guestEmail: 'lena.okafor@email.com',
      guestAdults: 1, guestChildren: 0, checkIn: new Date('2026-03-20'), checkOut: new Date('2026-03-22'),
      nights: 2, accommodationId: accMap['bell-tent-aster'], roomSubtotal: 7600, enhancementsSubtotal: 0,
      totalAmountCents: 7600, status: 'cancelled',
    },
    {
      guestFirstName: 'Carlos', guestLastName: 'Rivera', guestEmail: 'carlos.rivera@email.com',
      guestAdults: 2, guestChildren: 0, checkIn: new Date('2026-05-20'), checkOut: new Date('2026-05-24'),
      nights: 4, accommodationId: accMap['safari-trillium'], roomSubtotal: 28800, enhancementsSubtotal: 5000,
      totalAmountCents: 33800, status: 'pending',
    },
    {
      guestFirstName: 'Hannah', guestLastName: 'Brooks', guestEmail: 'hannah.brooks@email.com',
      guestAdults: 2, guestChildren: 0, checkIn: new Date('2026-01-10'), checkOut: new Date('2026-01-13'),
      nights: 3, accommodationId: accMap['yurt-wyeast'], roomSubtotal: 37500, enhancementsSubtotal: 4000,
      totalAmountCents: 41500, status: 'confirmed', paidAt: new Date('2025-12-28'),
    },
    {
      guestFirstName: 'Nadia', guestLastName: 'Hassan', guestEmail: 'nadia.hassan@email.com',
      guestAdults: 2, guestChildren: 0, checkIn: new Date('2026-06-01'), checkOut: new Date('2026-06-03'),
      nights: 2, accommodationId: accMap['bell-tent-yarrow'], roomSubtotal: 7000, enhancementsSubtotal: 1200,
      totalAmountCents: 8200, status: 'confirmed',
      specialRequests: 'Celebrating finishing grad school!',
    },
    {
      guestFirstName: 'Oliver', guestLastName: 'Wright', guestEmail: 'oliver.wright@email.com',
      guestAdults: 2, guestChildren: 0, checkIn: new Date('2026-07-04'), checkOut: new Date('2026-07-07'),
      nights: 3, accommodationId: accMap['safari-fern'], roomSubtotal: 20400, enhancementsSubtotal: 3000,
      totalAmountCents: 23400, status: 'confirmed',
      specialRequests: '4th of July weekend — any fireworks viewing spots?',
    },
    {
      guestFirstName: 'Mei', guestLastName: 'Zhang', guestEmail: 'mei.zhang@email.com',
      guestAdults: 1, guestChildren: 0, checkIn: new Date('2026-04-01'), checkOut: new Date('2026-04-04'),
      nights: 3, accommodationId: accMap['campsite-meadow'], roomSubtotal: 6000, enhancementsSubtotal: 800,
      totalAmountCents: 6800, status: 'confirmed',
      specialRequests: 'Bringing my own telescope for stargazing!',
    },
  ];

  for (const booking of bookings) {
    if (booking.accommodationId) {
      await prisma.booking.create({ data: booking });
    }
  }
  console.log(`✓ ${bookings.length} bookings seeded`);

  // ── Reviews ────────────────────────────────────────────
  await prisma.review.deleteMany({});
  const reviews = [
    {
      authorName: 'Sarah Mitchell',
      rating: 5,
      body: "An absolutely stunning property. Woke up to mist rising off the creek with deer grazing outside our yurt. The Wy'East Yurt is impeccably designed — the radiant floor heating was a dream on chilly mornings. Already planning our return trip.",
      isPublished: true,
      createdAt: new Date('2026-01-15'),
    },
    {
      authorName: 'James & Priya Kumar',
      rating: 5,
      body: "The attention to detail in the yurts is remarkable. Our kids absolutely loved the climbing wall to reach the bunk loft. The guided waterfall hike was the highlight — our naturalist guide knew every plant and bird by name. This place sets the bar for family glamping.",
      isPublished: true,
      createdAt: new Date('2026-02-01'),
    },
    {
      authorName: 'Tom Richardson',
      rating: 5,
      body: "Perfect spot to completely disconnect. No wifi in the bell tents (by design), just the sound of wind through the trees and a crackling fire. The s'mores kit with artisan chocolate was a fantastic touch. Simple, beautiful, exactly what we needed.",
      isPublished: true,
      createdAt: new Date('2026-03-19'),
    },
    {
      authorName: 'Margot Laurent',
      rating: 5,
      body: "The private chef dinner was extraordinary. Chef used foraged mushrooms from the property and paired everything with Columbia Gorge wines. Sitting on the Pahto Yurt's deck watching the sunset over the Gorge while eating world-class food — genuinely unforgettable.",
      isPublished: true,
      createdAt: new Date('2025-11-20'),
    },
    {
      authorName: 'David Anderson',
      rating: 4,
      body: "Brought our dog — the staff were incredibly accommodating. The creekside campsite was gorgeous and our golden retriever was in paradise. Only wish there were a few more pet-friendly accommodation options beyond campsites. But what an experience!",
      isPublished: true,
      createdAt: new Date('2026-01-05'),
    },
    {
      authorName: 'Sophie Dubois',
      rating: 5,
      body: "Booked the Loowit Yurt for Valentine's Day and it exceeded every expectation. The clawfoot tub, the private hot tub under the stars, the celebration package with champagne and flowers — it was pure romance. My partner said it was the best trip we've ever taken.",
      isPublished: true,
      createdAt: new Date('2026-02-18'),
    },
    {
      authorName: 'Alex Petrov',
      rating: 4,
      body: "The Fern Safari Tent felt like a treehouse for adults. Waking up to dappled sunlight through the maple canopy was magical. The writing desk was a nice touch — I actually got some journaling done. Would have liked a slightly larger bathroom but otherwise perfect.",
      isPublished: true,
      createdAt: new Date('2026-03-05'),
    },
    {
      authorName: 'Emily Chen',
      rating: 5,
      body: "We came for a couples retreat and left feeling completely restored. The forest bathing session changed how I think about spending time in nature. The Loowit Yurt is the most thoughtfully designed accommodation I've ever stayed in. Every detail whispers luxury without excess.",
      isPublished: true,
      createdAt: new Date('2026-03-31'),
    },
    {
      authorName: 'Rachel Kim',
      rating: 5,
      body: "Organized a girls' weekend at the forest campsite and it was the most fun we've had in years. The communal bonfire area was perfect for our group. The stargazing experience with the guide was mind-blowing — we saw Jupiter's moons through the telescope!",
      isPublished: false,
      createdAt: new Date('2026-03-10'),
    },
    {
      authorName: 'Hannah Brooks',
      rating: 5,
      body: "January in the Gorge is absolutely magical. Snow-dusted trees, empty trails, and the coziest yurt imaginable. The Wy'East's full kitchen meant we could cook our own meals, and the fire pit was perfect for evening hot chocolate. Off-season glamping is seriously underrated.",
      isPublished: true,
      createdAt: new Date('2026-01-14'),
    },
    {
      authorName: 'Nadia Hassan',
      rating: 5,
      body: "Stayed at the Yarrow Bell Tent to celebrate finishing my masters and it was the perfect reward. Simple, cozy, and surrounded by the most peaceful forest. The Adirondack chairs on the deck became my favorite reading spot. Will be back for sure.",
      isPublished: true,
      createdAt: new Date('2026-03-15'),
    },
    {
      authorName: 'Oliver Wright',
      rating: 4,
      body: "The Fern Safari Tent was incredible — the hammock on the deck was my happy place. Only giving 4 stars because we visited during a rare July heatwave and the tent got quite warm. But the staff brought us a portable fan and extra cold water immediately. Great service.",
      isPublished: false,
      createdAt: new Date('2026-03-20'),
    },
  ];

  for (const review of reviews) {
    await prisma.review.create({ data: review });
  }
  console.log(`✓ ${reviews.length} reviews seeded`);

  // ── Contact Submissions ────────────────────────────────
  await prisma.contactSubmission.deleteMany({});
  const contacts = [
    {
      name: 'Jennifer Wu',
      email: 'jennifer.wu@email.com',
      message: "Hi! I'm planning a small wedding (30 guests) for September 2026. Do you offer event packages or exclusive-use bookings? Would love to discuss options for a weekend celebration on your property.",
      isRead: false,
      createdAt: new Date('2026-03-20'),
    },
    {
      name: 'Robert Garcia',
      email: 'robert.garcia@email.com',
      message: "We're a family of 5 with a child who uses a wheelchair. Can you tell me about accessibility at your accommodations? Specifically interested in the yurts. Thanks!",
      isRead: false,
      createdAt: new Date('2026-03-18'),
    },
    {
      name: 'Aisha Patel',
      email: 'aisha.patel@email.com',
      message: "I'm a travel blogger writing a feature on Pacific Northwest glamping for Condé Nast Traveler. Would you be interested in hosting a media stay? I'd love to cover your property. My Instagram is @aisha_explores (85K followers).",
      isRead: true,
      createdAt: new Date('2026-03-15'),
    },
    {
      name: 'Mark Stevens',
      email: 'mark.stevens@email.com',
      message: "Looking to book a corporate retreat for our team of 12. Interested in 3 yurts for 2 nights in June. Do you offer any group or corporate rates? We'd also love to add team-building activities.",
      isRead: false,
      createdAt: new Date('2026-03-22'),
    },
    {
      name: 'Lisa Chang',
      email: 'lisa.chang@email.com',
      message: "Just wanted to say thank you! We stayed at the Pahto Yurt last weekend and it was the most incredible experience. The private chef dinner was a highlight — please pass our compliments to Chef!",
      isRead: true,
      createdAt: new Date('2026-03-10'),
    },
    {
      name: 'Daniel Okonkwo',
      email: 'daniel.okonkwo@email.com',
      message: "Do you have gift cards or vouchers available? I want to give my parents a 2-night stay as a retirement gift. They love nature but aren't big on roughing it — the yurts seem perfect.",
      isRead: false,
      createdAt: new Date('2026-03-21'),
    },
  ];

  for (const contact of contacts) {
    await prisma.contactSubmission.create({ data: contact });
  }
  console.log(`✓ ${contacts.length} contact submissions seeded`);

  // ── Newsletter Subscribers ─────────────────────────────
  const newsletters = [
    { email: 'sarah.mitchell@email.com', createdAt: new Date('2026-01-15') },
    { email: 'james.kumar@email.com', createdAt: new Date('2026-02-01') },
    { email: 'emily.chen@email.com', createdAt: new Date('2026-03-28') },
    { email: 'nature.lover@email.com', createdAt: new Date('2026-02-14') },
    { email: 'portland.weekender@email.com', createdAt: new Date('2026-03-01') },
    { email: 'adventure.seeker@email.com', createdAt: new Date('2026-03-15') },
    { email: 'wanderlust.pnw@email.com', createdAt: new Date('2026-01-22') },
    { email: 'gorge.explorer@email.com', createdAt: new Date('2026-03-05') },
    { email: 'sophie.dubois@email.com', createdAt: new Date('2026-02-18') },
    { email: 'hannah.brooks@email.com', createdAt: new Date('2026-01-14') },
  ];

  await prisma.newsletterSubscriber.deleteMany({});
  for (const nl of newsletters) {
    await prisma.newsletterSubscriber.create({ data: nl });
  }
  console.log(`✓ ${newsletters.length} newsletter subscribers seeded`);

  console.log('\n🌲 Seeding complete! Your sanctuary is ready.\n');
  console.log(`   Admin: ${adminEmail} / ${adminPassword}\n`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
