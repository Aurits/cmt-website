/**
 * The photography already licensed and shipped in public/images/listings (see
 * public/images/CREDITS.md) — the only images the prototype can honestly offer a picker
 * over, since there is no upload backend. Real client photography replaces these at the
 * same paths; see README.md "Replacing placeholder content".
 */
export const stockListingImages = [
  { file: 'res-villa-pool', label: 'Residential — villa with pool' },
  { file: 'res-modern-villa', label: 'Residential — modern villa exterior' },
  { file: 'res-family-house', label: 'Residential — family house' },
  { file: 'res-living-room', label: 'Residential — living room' },
  { file: 'res-apartment-interior', label: 'Residential — apartment interior' },
  { file: 'com-office-interior', label: 'Commercial — office interior' },
  { file: 'com-office-towers', label: 'Commercial — office towers' },
  { file: 'com-glass-facade', label: 'Commercial — glass facade' },
  { file: 'ind-warehouse', label: 'Industrial — warehouse' },
  { file: 'ind-port-yard', label: 'Industrial — port yard' },
  { file: 'ind-workshop', label: 'Industrial — workshop' },
  { file: 'land-green-plot', label: 'Land — cleared plot' },
  { file: 'land-wooded-plot', label: 'Land — wooded plot' },
  { file: 'agri-farmland', label: 'Agricultural — farmland' },
  { file: 'agri-seedlings', label: 'Agricultural — seedlings' },
  { file: 'agri-wheat', label: 'Agricultural — crop detail' },
].map((entry) => ({ ...entry, src: `/images/listings/${entry.file}.jpg` }));
