import type { Listing } from '@/lib/types';

/**
 * MOCK STOCK. No database this phase.
 *
 * Prices, references and specifications are illustrative and are not CMT's real stock.
 * Photographs are generic stock imagery (see public/images/CREDITS.md), so a gallery
 * shows representative shots rather than one real building — the property detail page
 * says so on the page. Map pins are neighbourhood-level, which is also how a real agent
 * would publish them before a viewing is booked.
 */
const img = (file: string, alt: string) => ({ src: `/images/listings/${file}.jpg`, alt });

export const listings: Listing[] = [
  {
    slug: 'kololo-four-bedroom-villa',
    reference: 'CMT-R-1042',
    title: 'Four-bedroom villa with pool, Kololo',
    category: 'residential',
    listingType: 'sale',
    price: 2_800_000_000,
    city: 'Kampala',
    area: 'Kololo',
    coords: [0.3345, 32.6003],
    beds: 4,
    baths: 4,
    size: '420 sqm',
    sizeLabel: 'Built area',
    tenure: 'Leasehold',
    images: [
      img('res-villa-pool', 'Villa exterior with swimming pool'),
      img('res-modern-villa', 'Villa frontage at dusk'),
      img('res-living-room', 'Reception room with garden view'),
    ],
    summary:
      'Walled compound on half an acre, four en-suite bedrooms, staff quarters and a pool, five minutes from the Kololo airstrip.',
    description: [
      'A single-storey villa on a walled half-acre plot in lower Kololo, arranged around a central reception that opens to the garden and pool. Four en-suite bedrooms, a study, and separate staff quarters with their own entrance.',
      'The compound has a borehole, a standby generator and parking for six cars. Leasehold interest with 44 years unexpired, and the title is clean and available for inspection.',
    ],
    features: [
      'Borehole and 10,000 litre reservoir',
      'Standby generator',
      'Staff quarters',
      'Parking for six cars',
    ],
    agentId: 'kanshabe-lindah',
    valuedOn: 'Mar 2026',
    featured: true,
  },
  {
    slug: 'muyenga-family-home',
    reference: 'CMT-R-1043',
    title: 'Five-bedroom family home, Muyenga',
    category: 'residential',
    listingType: 'sale',
    price: 1_350_000_000,
    city: 'Kampala',
    area: 'Muyenga',
    coords: [0.2905, 32.6135],
    beds: 5,
    baths: 3,
    size: '380 sqm',
    sizeLabel: 'Built area',
    tenure: 'Mailo',
    images: [
      img('res-modern-villa', 'Modern family house exterior'),
      img('res-apartment-interior', 'Open living and dining area'),
      img('res-villa-pool', 'Garden and terrace'),
    ],
    summary:
      'Two-storey home on 20 decimals in upper Muyenga, with a view over the wetland and room to extend at the rear.',
    description: [
      'A two-storey house on 20 decimals of mailo land in upper Muyenga. Five bedrooms across the first floor, two of them en-suite, with the main reception, kitchen and a guest bedroom at ground level.',
      'The rear of the plot is undeveloped and carries approved space for an annex. Mains water and power, with a 5,000 litre backup tank.',
    ],
    features: [
      'Wetland view',
      'Room to extend at the rear',
      'Mains water and power',
      'Fitted kitchen',
    ],
    agentId: 'kanshabe-lindah',
    valuedOn: 'Feb 2026',
    featured: true,
  },
  {
    slug: 'bugolobi-two-bedroom-apartment',
    reference: 'CMT-R-1051',
    title: 'Two-bedroom apartment, Bugolobi',
    category: 'residential',
    listingType: 'rent',
    price: 3_500_000,
    rentPeriod: 'month',
    city: 'Kampala',
    area: 'Bugolobi',
    coords: [0.317, 32.6224],
    beds: 2,
    baths: 2,
    size: '96 sqm',
    sizeLabel: 'Floor area',
    tenure: 'Leasehold',
    images: [
      img('res-living-room', 'Furnished living room'),
      img('res-apartment-interior', 'Kitchen and dining area'),
    ],
    summary:
      'Serviced two-bedroom apartment on the third floor of a managed block, walking distance to Village Mall.',
    description: [
      'A third-floor apartment in a managed block of twelve, fully furnished, with a balcony facing away from the road. Service charge covers water, security, lift maintenance and common-area power.',
      'Let on a twelve-month tenancy, two months deposit. Available immediately.',
    ],
    features: [
      'Furnished',
      'Lift and standby generator',
      '24-hour security',
      'Covered parking bay',
    ],
    agentId: 'kanshabe-lindah',
  },
  {
    slug: 'naguru-three-bedroom-apartment',
    reference: 'CMT-R-1052',
    title: 'Three-bedroom apartment, Naguru',
    category: 'residential',
    listingType: 'rent',
    price: 6_000_000,
    rentPeriod: 'month',
    city: 'Kampala',
    area: 'Naguru',
    coords: [0.3399, 32.6047],
    beds: 3,
    baths: 3,
    size: '145 sqm',
    sizeLabel: 'Floor area',
    tenure: 'Leasehold',
    images: [
      img('res-apartment-interior', 'Living area with city outlook'),
      img('res-living-room', 'Sitting room'),
      img('res-modern-villa', 'Apartment block exterior'),
    ],
    summary:
      'Top-floor three-bedroom apartment with a city outlook, in a small block of eight off Naguru Hill.',
    description: [
      'Top-floor apartment in a block of eight, all bedrooms en-suite, with an open kitchen and a corner balcony looking west over the city.',
      'Suits a corporate tenancy: the landlord accepts quarterly payment against an organisation guarantee.',
    ],
    features: [
      'All bedrooms en-suite',
      'Corner balcony',
      'Borehole backup',
      'Two parking bays',
    ],
    agentId: 'kanshabe-lindah',
  },
  {
    slug: 'mbarara-four-bedroom-house',
    reference: 'CMT-R-1063',
    title: 'Four-bedroom house, Mbarara',
    category: 'residential',
    listingType: 'sale',
    price: 420_000_000,
    city: 'Mbarara',
    area: 'Kakoba',
    coords: [-0.6072, 30.6545],
    beds: 4,
    baths: 2,
    size: '210 sqm',
    sizeLabel: 'Built area',
    tenure: 'Freehold',
    images: [
      img('res-family-house', 'House exterior with mature trees'),
      img('res-living-room', 'Sitting and dining room'),
    ],
    summary:
      'Established four-bedroom house on a quarter-acre freehold plot in Kakoba, ten minutes from Mbarara town centre.',
    description: [
      'A well-kept house of roughly 210 square metres on a quarter-acre freehold plot, with mature trees, a detached kitchen block and a separate double garage.',
      'Freehold title, no encumbrance, and the vendor is open to a staged payment over six months.',
    ],
    features: [
      'Freehold title',
      'Detached garage',
      'Mature garden',
      'Staged payment considered',
    ],
    agentId: 'waniala-andrew',
  },
  {
    slug: 'nakasero-office-suite',
    reference: 'CMT-C-2018',
    title: 'Office suite, Nakasero',
    category: 'commercial',
    listingType: 'rent',
    price: 12_000_000,
    rentPeriod: 'month',
    city: 'Kampala',
    area: 'Nakasero',
    coords: [0.3255, 32.5793],
    size: '240 sqm',
    sizeLabel: 'Floor area',
    tenure: 'Leasehold',
    images: [
      img('com-office-interior', 'Open-plan office floor'),
      img('com-glass-facade', 'Building facade detail'),
      img('com-office-towers', 'Office building exterior'),
    ],
    summary:
      'Fitted open-plan floor of 240 square metres in a Nakasero office block, with lift access and dedicated parking.',
    description: [
      'A fitted second-floor suite arranged as open plan with two meeting rooms and a server cupboard. Lift access, standby generator, and six dedicated parking bays in the basement.',
      'Quoted rent excludes a service charge of UGX 12,000 per square metre per month. Minimum term three years.',
    ],
    features: [
      'Fitted, open plan',
      'Two meeting rooms',
      'Six basement bays',
      'Standby generator',
    ],
    agentId: 'kanshabe-lindah',
    valuedOn: 'Jan 2026',
    featured: true,
  },
  {
    slug: 'kampala-road-commercial-building',
    reference: 'CMT-C-2024',
    title: 'Commercial building, Kampala Road',
    category: 'commercial',
    listingType: 'sale',
    price: 6_500_000_000,
    city: 'Kampala',
    area: 'Central Business District',
    coords: [0.3146, 32.5806],
    size: '1,850 sqm',
    sizeLabel: 'Floor area',
    tenure: 'Leasehold',
    images: [
      img('com-office-towers', 'Commercial building from street level'),
      img('com-office-interior', 'Office floor plate'),
      img('com-glass-facade', 'Facade detail'),
    ],
    summary:
      'Five-storey commercial building on Kampala Road, fully let, producing a stabilised income with two anchor tenants.',
    description: [
      'Five floors over ground-floor retail, 1,850 square metres of lettable area, currently fully let to seven tenants of whom two occupy just over half the building.',
      'Sale is of the leasehold interest with the tenancies in place. The rent roll, service charge accounts and tenancy schedule are available to qualified buyers on request.',
    ],
    features: [
      'Fully let',
      'Ground-floor retail',
      'Rent roll available',
      'Lift and generator',
    ],
    agentId: 'waniala-andrew',
  },
  {
    slug: 'ntinda-retail-and-office-space',
    reference: 'CMT-C-2031',
    title: 'Retail and office space, Ntinda',
    category: 'commercial',
    listingType: 'rent',
    price: 4_800_000,
    rentPeriod: 'month',
    city: 'Kampala',
    area: 'Ntinda',
    coords: [0.3563, 32.6155],
    size: '120 sqm',
    sizeLabel: 'Floor area',
    tenure: 'Leasehold',
    images: [
      img('com-glass-facade', 'Shopfront glazing'),
      img('com-office-interior', 'Interior shell space'),
    ],
    summary:
      'Corner unit on a busy Ntinda junction, glazed on two sides, suitable for retail at ground level with an office above.',
    description: [
      'A corner unit of 120 square metres, glazed on two elevations, on one of the busier Ntinda junctions. Shell condition, so the incoming tenant fits to their own specification.',
      'Landlord offers a three-month rent-free period against a five-year term.',
    ],
    features: [
      'Corner position',
      'Glazed two sides',
      'Shell condition',
      'Rent-free period offered',
    ],
    agentId: 'kanshabe-lindah',
  },
  {
    slug: 'namanve-warehouse',
    reference: 'CMT-I-3007',
    title: 'Warehouse, Namanve',
    category: 'industrial',
    listingType: 'sale',
    price: 2_200_000_000,
    city: 'Kampala',
    area: 'Namanve',
    coords: [0.3498, 32.7085],
    size: '2,400 sqm',
    sizeLabel: 'Built area',
    tenure: 'Leasehold',
    images: [
      img('ind-warehouse', 'Racked warehouse interior'),
      img('ind-port-yard', 'Loading yard'),
      img('ind-workshop', 'Ancillary workshop space'),
    ],
    summary:
      'Purpose-built warehouse of 2,400 square metres on a two-acre serviced plot, eight metres to the eaves, with a hardstanding yard.',
    description: [
      'A steel-framed warehouse on a two-acre serviced plot in the industrial park, eight metres clear to the eaves, with four roller shutters and a concrete hardstanding yard that takes articulated vehicles.',
      'Three-phase power, a 200,000 litre water tank, and a two-storey office block at the front. Leasehold from the estate with 39 years unexpired.',
    ],
    features: [
      'Eight metres to eaves',
      'Four roller shutter doors',
      'Three-phase power',
      'Articulated vehicle access',
    ],
    agentId: 'waniala-andrew',
    valuedOn: 'Apr 2026',
    featured: true,
  },
  {
    slug: 'nalukolongo-industrial-yard',
    reference: 'CMT-I-3012',
    title: 'Industrial yard and store, Nalukolongo',
    category: 'industrial',
    listingType: 'rent',
    price: 9_500_000,
    rentPeriod: 'month',
    city: 'Kampala',
    area: 'Nalukolongo',
    coords: [0.2937, 32.5343],
    size: '1.2 acres',
    sizeLabel: 'Plot size',
    tenure: 'Leasehold',
    images: [
      img('ind-port-yard', 'Open storage yard'),
      img('ind-warehouse', 'Covered store'),
    ],
    summary:
      'Secured 1.2-acre yard with a covered store of 600 square metres, on the Masaka Road industrial stretch.',
    description: [
      'A walled and gated yard of 1.2 acres with a covered store of 600 square metres, a weighbridge foundation in place, and a gatehouse. Suits distribution, plant hire or vehicle storage.',
      'Available on a minimum three-year term. Rent quoted exclusive of taxes.',
    ],
    features: ['Walled and gated', 'Covered store', 'Gatehouse', 'Masaka Road access'],
    agentId: 'waniala-andrew',
  },
  {
    slug: 'ntinda-light-industrial-workshop',
    reference: 'CMT-I-3019',
    title: 'Light industrial workshop, Ntinda',
    category: 'industrial',
    listingType: 'rent',
    price: 5_200_000,
    rentPeriod: 'month',
    city: 'Kampala',
    area: 'Ntinda Industrial Area',
    coords: [0.3605, 32.6198],
    size: '700 sqm',
    sizeLabel: 'Built area',
    tenure: 'Leasehold',
    images: [
      img('ind-workshop', 'Workshop interior with overhead services'),
      img('ind-warehouse', 'Storage bay'),
    ],
    summary:
      'Workshop of 700 square metres with three-phase power and an overhead gantry, in the Ntinda industrial area.',
    description: [
      'A workshop unit of 700 square metres with three-phase power, a five-tonne overhead gantry, an inspection pit and a small office and welfare block.',
      'Suits fabrication, assembly or servicing. The landlord will consider a shorter term for an established covenant.',
    ],
    features: [
      'Five-tonne gantry',
      'Three-phase power',
      'Inspection pit',
      'Office and welfare block',
    ],
    agentId: 'waniala-andrew',
  },
  {
    slug: 'kyanja-titled-plot',
    reference: 'CMT-L-4004',
    title: 'Titled plot, 25 decimals, Kyanja',
    category: 'land',
    listingType: 'sale',
    price: 320_000_000,
    city: 'Kampala',
    area: 'Kyanja',
    coords: [0.3757, 32.6141],
    size: '25 decimals',
    sizeLabel: 'Land area',
    tenure: 'Mailo',
    images: [
      img('land-green-plot', 'Cleared plot with boundary markers'),
      img('land-wooded-plot', 'Plot frontage from the access road'),
    ],
    summary:
      'Level 25-decimal plot on a tarmac access road in Kyanja, with a clean mailo title ready for transfer.',
    description: [
      'A level, cleared plot of 25 decimals fronting a tarmac access road, in an established residential pocket of Kyanja with mains water and power at the boundary.',
      'Private mailo title, single registered proprietor, no caveat. We have inspected the title and the search is available to a serious buyer.',
    ],
    features: [
      'Clean mailo title, no caveat',
      'Tarmac access road',
      'Mains water and power at boundary',
      'Level, ready to build',
    ],
    agentId: 'waniala-andrew',
    valuedOn: 'Feb 2026',
    featured: true,
  },
  {
    slug: 'gulu-development-land',
    reference: 'CMT-L-4011',
    title: 'Development land, 4 acres, Gulu',
    category: 'land',
    listingType: 'sale',
    price: 180_000_000,
    city: 'Gulu',
    area: 'Laroo',
    coords: [2.7724, 32.2881],
    size: '4 acres',
    sizeLabel: 'Land area',
    tenure: 'Freehold',
    images: [
      img('land-wooded-plot', 'Wooded development land'),
      img('land-green-plot', 'Open section of the site'),
    ],
    summary:
      'Four freehold acres on the edge of Gulu town, partly wooded, with frontage on a graded road.',
    description: [
      'Four acres of freehold land at Laroo on the edge of Gulu town, roughly a third wooded and the remainder open, with 60 metres of frontage on a graded road.',
      'Suits institutional or residential development. The vendor will split into one-acre portions for buyers who want less.',
    ],
    features: [
      'Freehold title',
      '60 m road frontage',
      'Will split into acres',
      'Power line along the road',
    ],
    agentId: 'waniala-andrew',
  },
  {
    slug: 'mbale-coffee-farm',
    reference: 'CMT-A-5002',
    title: 'Coffee farm, 15 acres, Mbale',
    category: 'agricultural',
    listingType: 'sale',
    price: 650_000_000,
    city: 'Mbale',
    area: 'Bungokho',
    coords: [1.0644, 34.1796],
    size: '15 acres',
    sizeLabel: 'Land area',
    tenure: 'Freehold',
    images: [
      img('agri-farmland', 'Farmland on sloping ground'),
      img('agri-seedlings', 'Nursery seedlings'),
      img('agri-wheat', 'Crop detail'),
    ],
    summary:
      'Fifteen freehold acres on the Mbale slopes, twelve under mature arabica, with a store and a drying yard.',
    description: [
      'Fifteen acres of freehold land on the lower slopes at Bungokho, twelve of them under mature arabica with roughly 6,000 trees, plus a nursery and three acres of food crop.',
      'Improvements are a block store, a concrete drying yard and a caretaker house. Spring-fed water on the boundary. The sale includes the standing crop for the coming season.',
    ],
    features: [
      'Roughly 6,000 mature arabica trees',
      'Store and concrete drying yard',
      'Spring-fed water on boundary',
      'Standing crop included',
    ],
    agentId: 'waniala-andrew',
  },
  {
    slug: 'mbarara-mixed-farm',
    reference: 'CMT-A-5008',
    title: 'Mixed farm, 45 acres, Mbarara',
    category: 'agricultural',
    listingType: 'sale',
    price: 900_000_000,
    city: 'Mbarara',
    area: 'Rwanyamahembe',
    coords: [-0.5488, 30.6192],
    size: '45 acres',
    sizeLabel: 'Land area',
    tenure: 'Freehold',
    images: [
      img('agri-wheat', 'Cereal crop in the field'),
      img('agri-farmland', 'Open pasture'),
    ],
    summary:
      'Forty-five acres of pasture and cropping land with a valley dam, currently running 40 head of cattle.',
    description: [
      'Forty-five freehold acres divided into eight paddocks, with a valley dam, a cattle crush, a milking shed and a four-room farmhouse.',
      'Currently carrying 40 head of dairy cattle, which the vendor will sell separately by agreement. Graded road to the gate, and the grid reaches the neighbouring farm.',
    ],
    features: ['Valley dam', 'Eight paddocks', 'Milking shed and crush', 'Farmhouse'],
    agentId: 'waniala-andrew',
  },
  {
    slug: 'gulu-irrigated-farmland',
    reference: 'CMT-A-5015',
    title: 'Irrigated farmland, 100 acres, Gulu',
    category: 'agricultural',
    listingType: 'rent',
    price: 2_400_000,
    rentPeriod: 'month',
    city: 'Gulu',
    area: 'Unyama',
    coords: [2.8321, 32.2905],
    size: '100 acres',
    sizeLabel: 'Land area',
    tenure: 'Customary',
    images: [
      img('agri-seedlings', 'Seedlings under irrigation'),
      img('agri-farmland', 'Open farmland'),
      img('agri-wheat', 'Cereal crop'),
    ],
    summary:
      'One hundred acres of cleared farmland at Unyama available on a long agricultural lease, with river abstraction in place.',
    description: [
      'One hundred acres of cleared, level farmland with an existing abstraction point on the Unyama river and two years of maize and soya cropping history.',
      'Held under customary tenure with a recorded certificate, offered on a fifteen-year agricultural lease. Rent is quoted per month for comparison but is payable annually in advance.',
    ],
    features: [
      'River abstraction point',
      'Cleared and level',
      'Fifteen-year lease available',
      'Cropping history on record',
    ],
    agentId: 'waniala-andrew',
  },
];

export const listingBySlug = Object.fromEntries(
  listings.map((listing) => [listing.slug, listing]),
) as Record<string, Listing>;

export const featuredListings = listings.filter((listing) => listing.featured);

export function listingsByCategory(category: Listing['category']): Listing[] {
  return listings.filter((listing) => listing.category === category);
}

/** Same category first, then anything else, never the listing itself. */
export function relatedListings(listing: Listing, count = 3): Listing[] {
  const sameCategory = listings.filter(
    (item) => item.category === listing.category && item.slug !== listing.slug,
  );
  const rest = listings.filter(
    (item) => item.category !== listing.category && item.slug !== listing.slug,
  );
  return [...sameCategory, ...rest].slice(0, count);
}

export const cities = [...new Set(listings.map((listing) => listing.city))].sort();
