import type { Category } from '@/lib/types';

export const categories: Category[] = [
  {
    slug: 'residential',
    name: 'Residential',
    label: 'Homes, apartments and rentals',
    description:
      'Family houses, apartments and rental units across Kampala and the regional towns. We value residential stock for mortgage lending and probate, and we list it for owners who want a realistic asking price rather than an optimistic one.',
    image: '/images/categories/residential.jpg',
    imageAlt: 'Kampala rooftops above Lake Victoria, under a rainbow',
    cta: { label: 'Book a residential valuation', href: '/contact?subject=valuation' },
  },
  {
    slug: 'commercial',
    name: 'Commercial',
    label: 'Offices, retail and mixed use',
    description:
      'Office suites, retail space and mixed-use buildings. Commercial instructions usually turn on income rather than finish, so our reports lead with lettable area, rent roll and comparable evidence.',
    image: '/images/categories/commercial.jpg',
    imageAlt: "Kampala's commercial towers rising above the trees",
    cta: { label: 'Discuss a commercial instruction', href: '/contact?subject=valuation' },
  },
  {
    slug: 'industrial',
    name: 'Industrial',
    label: 'Warehousing and light industry',
    description:
      'Warehousing, factory space and yards, largely along the industrial corridors. Access, power supply and clear internal height drive value here more than location prestige does.',
    image: '/images/categories/industrial.jpg',
    imageAlt: 'Racked warehouse interior',
    cta: { label: 'Value an industrial asset', href: '/contact?subject=valuation' },
  },
  {
    slug: 'land',
    name: 'Land',
    label: 'Titled plots and development sites',
    description:
      'Titled plots and development sites. Every land instruction starts with the title and the tenure, because that is where most Ugandan land disputes and most lending refusals begin.',
    image: '/images/categories/land.jpg',
    imageAlt: 'Titled plots on a tea-covered Ugandan hillside',
    cta: { label: 'Check a title and value a plot', href: '/contact?subject=valuation' },
  },
  {
    slug: 'agricultural',
    name: 'Agricultural',
    label: 'Farmland and estates',
    description:
      'Farmland, plantations and agricultural estates. Valuation accounts for soil, water access and standing crop, and for the harvest cycle the buyer is actually inheriting.',
    image: '/images/categories/agricultural.jpg',
    imageAlt: 'Coffee cherries ripening on the branch',
    cta: { label: 'Value farmland or an estate', href: '/contact?subject=valuation' },
  },
];

export const categoryBySlug = Object.fromEntries(
  categories.map((category) => [category.slug, category]),
) as Record<Category['slug'], Category>;
