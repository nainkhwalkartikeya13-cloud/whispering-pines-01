export interface Service {
    id: string;
    name: string;
    category: 'accommodation' | 'add-on' | 'merchandise';
    price: number;
    priceType: 'per_night' | 'one_time';
    description: string;
}

export const initialServices: Service[] = [
    {
        id: 'yurt-01',
        name: "#01 Wy'East Yurt",
        category: 'accommodation',
        price: 400,
        priceType: 'per_night',
        description: 'Luxury Creekside Yurt with expansive deck, private trails access, and radiant infloor heating.',
    },
    {
        id: 'yurt-02',
        name: '#02 Pahto Yurt',
        category: 'accommodation',
        price: 400,
        priceType: 'per_night',
        description: 'Positioned to take best advantage of the sights and sounds of the forest.',
    },
    {
        id: 'yurt-03',
        name: '#03 Loowit Yurt',
        category: 'accommodation',
        price: 400,
        priceType: 'per_night',
        description: 'Part of the premium Creekside Yurt collection.',
    },
    {
        id: 'yurt-04',
        name: '#04 Tahoma Yurt',
        category: 'accommodation',
        price: 400,
        priceType: 'per_night',
        description: 'Luxury glamping experience with high-end forest views.',
    },
    {
        id: 'safari-07',
        name: '#07 Trillium Safari Tent',
        category: 'accommodation',
        price: 350,
        priceType: 'per_night',
        description: '2-bedroom luxury tent designed for small groups or families.',
    },
    {
        id: 'safari-08',
        name: '#08 Lupine Safari Tent',
        category: 'accommodation',
        price: 275,
        priceType: 'per_night',
        description: '1-bedroom luxury tent ideal for solo travelers or couples seeking serenity.',
    },
    {
        id: 'addon-pet-premium',
        name: 'Yurt / Safari Tent Pet Fee',
        category: 'add-on',
        price: 50,
        priceType: 'one_time',
        description: 'One-time fee per dog (Maximum 2 dogs). Includes dog bed, blankets, leash, and bowls.',
    },
    {
        id: 'addon-pet-bell',
        name: 'Bell Tent Pet Fee',
        category: 'add-on',
        price: 25,
        priceType: 'one_time',
        description: 'One-time fee per dog (Maximum 2 dogs) for Bell Tent guests.',
    },
    {
        id: 'merch-hat-1',
        name: 'CGG Logo - Trucker Hat',
        category: 'merchandise',
        price: 27,
        priceType: 'one_time',
        description: 'Dark Brown and Khaki trucker hat.',
    },
    {
        id: 'merch-mug',
        name: 'CGG Classic Logo Mug',
        category: 'merchandise',
        price: 15,
        priceType: 'one_time',
        description: 'Ceramic Coffee Mug in Forest Green.',
    }
];
