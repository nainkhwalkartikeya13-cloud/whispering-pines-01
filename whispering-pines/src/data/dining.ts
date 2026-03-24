export interface MenuItem {
  course: string;
  name: string;
  description: string;
}

export interface SampleMenu {
  season: string;
  items: MenuItem[];
}

export interface WineEntry {
  name: string;
  vineyard: string;
  varietal: string;
  description: string;
}

export const diningPhilosophy = [
  'At Whispering Pines Retreats, food is not an afterthought — it is an extension of the landscape. Every ingredient on your plate has a story, and most of those stories begin within 50 miles of where you are sitting.',
  'Our culinary program is built on three principles: source locally, cook seasonally, and waste nothing. We partner with farms in Hood River, White Salmon, and the Underwood Valley, paying above market rate because we believe the true cost of food should reflect the care that goes into growing it.',
  'The result is food that tastes like this place. Wild chanterelles foraged from our own forest floor. Heritage tomatoes still warm from a morning harvest. Columbia River steelhead that was swimming upstream that same day. This is not farm-to-table as a marketing concept — it is farm-to-table as a way of life.',
];

export const chefBio = {
  name: 'Chef Amara Okafor',
  title: 'Resident Chef',
  bio: 'Amara brings 15 years of culinary experience spanning three continents to the Gorge. After training at Le Cordon Bleu and staging at Noma in Copenhagen, she fell in love with the Pacific Northwest\'s abundance during a foraging expedition in the Cascades. She joined Whispering Pines Retreats in 2021 with a mission: to create dishes that are indistinguishable from the landscape they come from.',
  image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600',
};

export const sampleMenus: SampleMenu[] = [
  {
    season: 'Summer',
    items: [
      { course: 'First', name: 'Chilled Sweet Corn Soup', description: 'Basil oil, Dungeness crab, grilled sourdough from a Hood River bakery' },
      { course: 'Main', name: 'Pan-Seared Columbia River Steelhead', description: 'Roasted fingerling potatoes, grilled broccolini, chanterelle cream sauce with mushrooms foraged that morning' },
      { course: 'Dessert', name: 'Lavender Panna Cotta', description: 'Macerated Hood River strawberries, honey tuile, paired with a late-harvest Gorge Riesling' },
    ],
  },
  {
    season: 'Autumn',
    items: [
      { course: 'First', name: 'Roasted Butternut Squash Bisque', description: 'Sage brown butter, toasted pepitas, crème fraîche from Briar Rose Creamery' },
      { course: 'Main', name: 'Braised Short Ribs', description: 'Celery root purée, roasted root vegetables, red wine reduction with Gorge Syrah' },
      { course: 'Dessert', name: 'Pear Tarte Tatin', description: 'Kiyokawa orchard pears, vanilla bean ice cream, salted caramel' },
    ],
  },
  {
    season: 'Winter',
    items: [
      { course: 'First', name: 'Wild Mushroom Consommé', description: 'Sherry, thyme oil, house-made sourdough croutons' },
      { course: 'Main', name: 'Herb-Crusted Rack of Lamb', description: 'Potato gratin, braised kale, mint gremolata, Underwood Valley rosemary' },
      { course: 'Dessert', name: 'Dark Chocolate Fondant', description: 'Raspberry coulis, whipped mascarpone, candied hazelnuts from the Willamette Valley' },
    ],
  },
  {
    season: 'Spring',
    items: [
      { course: 'First', name: 'Asparagus Vichyssoise', description: 'Lemon crème fraîche, wild garlic oil foraged from the meadow, micro herbs' },
      { course: 'Main', name: 'Pan-Roasted Halibut', description: 'Spring pea risotto, morel mushrooms, preserved lemon beurre blanc' },
      { course: 'Dessert', name: 'Rhubarb & Strawberry Crumble', description: 'Oat streusel, ginger ice cream, elderflower syrup' },
    ],
  },
];

export const wineList: WineEntry[] = [
  { name: 'Estate Pinot Noir 2023', vineyard: 'Grateful Vineyard', varietal: 'Pinot Noir', description: 'Cherry, earth, and cedar. Our house red — elegant and approachable.' },
  { name: 'Gorge White Riesling 2024', vineyard: 'Syncline Winery', varietal: 'Riesling', description: 'Crisp stone fruit and citrus with a mineral finish. Perfect with seafood.' },
  { name: 'Columbia Valley Syrah 2022', vineyard: 'Memaloose Wines', varietal: 'Syrah', description: 'Dark fruit, black pepper, and smoke. Bold enough for braised meats.' },
  { name: 'Sparkling Brut NV', vineyard: 'Marchesi Vineyards', varietal: 'Sparkling', description: 'Our celebration wine. Fine bubbles, green apple, brioche notes.' },
];
