export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqCategory {
  title: string;
  questions: FaqItem[];
}

export const faqCategories: FaqCategory[] = [
  {
    title: 'Booking & Cancellation',
    questions: [
      {
        q: 'How far in advance should I book?',
        a: 'We recommend booking at least 4–6 weeks in advance, especially for peak season (June–September) and holiday weekends. Our yurts and safari tents tend to fill up quickly. Last-minute availability does sometimes open up, so it never hurts to check.',
      },
      {
        q: 'What is your cancellation policy?',
        a: 'Cancellations made 14 or more days before check-in receive a full refund. Cancellations within 7–13 days receive a 50% refund. Cancellations within 6 days of check-in are non-refundable. We strongly recommend travel insurance for unexpected changes.',
      },
      {
        q: 'Can I modify my booking after confirmation?',
        a: 'Yes — date changes and accommodation upgrades are subject to availability. Contact us at least 7 days before your original check-in date and we will do our best to accommodate your request at no extra charge.',
      },
      {
        q: 'Is a deposit required?',
        a: 'Full payment is collected at the time of booking to secure your reservation. This guarantees your dates and accommodation are held exclusively for you.',
      },
      {
        q: 'Do you offer gift cards or vouchers?',
        a: 'Absolutely. Gift vouchers are available in any denomination and can be applied to any accommodation or add-on experience. They make wonderful gifts for birthdays, anniversaries, or holidays. Contact us directly to purchase.',
      },
    ],
  },
  {
    title: 'Getting Here',
    questions: [
      {
        q: 'Where exactly is Whispering Pines Retreats located?',
        a: 'We are located in Stevenson, Washington, nestled in the heart of the Columbia River Gorge National Scenic Area. The property sits on 400 acres of old-growth forest, meadows, and creekside land, about 45 minutes east of Portland, Oregon.',
      },
      {
        q: 'What is the best way to get here?',
        a: 'From Portland, take I-84 East to Exit 44 (Cascade Locks), then cross the Bridge of the Gods into Washington and head east on WA-14 for approximately 7 miles. The drive is stunning. From Portland International Airport (PDX), the journey takes about 1 hour.',
      },
      {
        q: 'Do you offer airport transfers?',
        a: 'Yes. Our private Airport Limousine Transfer service will pick you up from PDX in a luxury vehicle. This can be added as an enhancement during booking for $250. The drive through the Gorge is one of the most scenic airport approaches in the Pacific Northwest.',
      },
      {
        q: 'Is there parking on-site?',
        a: 'Yes, complimentary parking is available for all guests. Each accommodation has a designated parking area nearby. For yurts and safari tents, parking is a short 2–5 minute walk from your accommodation — part of the unplugged experience.',
      },
    ],
  },
  {
    title: 'Accommodations',
    questions: [
      {
        q: 'What is the difference between a yurt and a safari tent?',
        a: 'Our yurts are permanent, circular structures with solid walls, hardwood floors, wood-burning stoves, and en-suite bathrooms. They range from 400–500 sq ft and offer the most "hotel-like" experience. Safari tents are canvas-walled structures on raised hardwood platforms, offering a more immersive outdoor experience while still providing luxury amenities like quality linens and private decks.',
      },
      {
        q: 'Do the accommodations have heating?',
        a: 'Yes. Our yurts feature wood-burning stoves, and we provide firewood and fire-starting supplies. Safari tents and bell tents have portable heaters available upon request during cooler months. The campsites have fire rings for warmth and ambiance.',
      },
      {
        q: 'Is there Wi-Fi or cell service?',
        a: 'By design, we offer limited connectivity to encourage a true escape. There is no Wi-Fi in the accommodations. Cell service varies — Verizon tends to have the best coverage. The main lodge has complimentary Wi-Fi for guests who need to check in with the outside world.',
      },
      {
        q: 'What linens and amenities are provided?',
        a: 'All accommodations include premium bedding (organic cotton sheets, down comforters, plush towels), toiletries (locally made soaps and shampoos), bathrobes in yurts, flashlights, and a welcome basket with local snacks and water. Firewood, kindling, and marshmallow roasting kits are also provided.',
      },
      {
        q: 'What is the check-in and check-out time?',
        a: 'Check-in is from 3:00 PM and check-out is by 11:00 AM. Early check-in or late check-out may be available upon request, subject to availability. We will send you detailed arrival instructions and a property map 48 hours before your stay.',
      },
    ],
  },
  {
    title: 'Activities & Trails',
    questions: [
      {
        q: 'What activities are available on the property?',
        a: 'Our 400-acre property offers hiking trails, creek-side meditation spots, stargazing meadows, and yoga platforms. Seasonally, we offer guided foraging walks, wine tasting excursions, kayaking on the Columbia River, and horseback riding through the forest. Many of these can be added as enhancements during booking.',
      },
      {
        q: 'Are there hiking trails nearby?',
        a: 'The Columbia River Gorge is a hiker\'s paradise. Within 30 minutes of the property, you can access iconic trails like Eagle Creek, Dog Mountain, Hamilton Mountain, and Beacon Rock. We provide a detailed trail guide at check-in with our personal recommendations based on your fitness level and interests.',
      },
      {
        q: 'Can I book a private chef dinner or spa treatment?',
        a: 'Yes! Our Private Chef Dinner features a 3-course farm-to-table meal prepared at your site using seasonal, locally sourced ingredients. The Couples Spa Treatment is a 60-minute massage in our forest spa pavilion. Both can be added during booking or arranged after arrival (subject to availability).',
      },
      {
        q: 'Is the property suitable for children?',
        a: 'Absolutely. Families love our Tahoma Yurt (with bunk beds) and Forest Campsites. The property has nature exploration trails, a creek for supervised play, and wide meadows for games. We do ask that children are supervised at all times, especially near water and fire.',
      },
    ],
  },
  {
    title: 'Pets',
    questions: [
      {
        q: 'Are pets allowed?',
        a: 'Yes — we are proudly pet-friendly! Dogs are welcome in our Lupine Safari Tent, Bell Tents, and Forest Campsites. A one-time pet fee applies ($50 for safari tents, $25 for bell tents and campsites). Pets must be leashed in common areas and are not permitted in yurts due to the wood-burning stoves.',
      },
      {
        q: 'Are there any breed or size restrictions for pets?',
        a: 'We do not have breed or size restrictions. However, all pets must be well-behaved, up-to-date on vaccinations, and supervised at all times. We ask that you clean up after your pet and keep barking to a minimum out of respect for other guests.',
      },
      {
        q: 'What amenities do you provide for pets?',
        a: 'We provide water bowls, a welcome treat, and waste bags at check-in. The property has miles of trails perfect for walks, and the creek is a favorite splashing spot. If your dog enjoys swimming, the calm sections of the Columbia River are just a short drive away.',
      },
    ],
  },
  {
    title: 'Payments & Pricing',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major payment methods through Stripe, including credit/debit cards (Visa, Mastercard, Amex), Apple Pay, and Google Pay. All transactions are securely processed and encrypted.',
      },
      {
        q: 'Are prices listed per night or per stay?',
        a: 'All accommodation prices are listed per night. Add-on experiences (private chef dinner, spa treatment, airport transfer, champagne) are one-time charges regardless of the length of your stay.',
      },
      {
        q: 'Do you charge extra for additional guests?',
        a: 'Our published rates cover the accommodation up to its maximum guest capacity. There are no additional per-person charges. However, some experiences like the Private Chef Dinner may have pricing that varies based on party size — contact us for details.',
      },
      {
        q: 'Are there any hidden fees or taxes?',
        a: 'No hidden fees. The price you see during booking is the price you pay. All applicable taxes are included in the displayed total. The only additional charges would be for add-on experiences you explicitly select during the booking process.',
      },
    ],
  },
];
