import { agents } from '@/data/agents';
import { listings } from '@/data/listings';
import { partnerGroups } from '@/data/partners';
import { site, stats } from '@/data/site';
import { testimonials } from '@/data/testimonials';
import type {
  AdminAgent,
  AdminListing,
  AdminPartner,
  AdminSiteSettings,
  AdminState,
  AdminTestimonial,
  Inquiry,
} from '@/lib/admin/types';

/**
 * The CMS's starting position: the same static data the public site renders, reshaped into
 * the admin's mutable records. Nothing here is invented — it is exactly what ships today,
 * with the editorial fields (status, order, verified…) defaulted to what the current site
 * implies (everything live is 'published', every partner already on the belt is 'verified').
 */
function seedListings(): AdminListing[] {
  return listings.map((listing) => ({
    ...listing,
    status: 'published',
    updatedAt: '2026-09-01',
  }));
}

function seedAgents(): AdminAgent[] {
  return agents.map((agent) => ({
    ...agent,
    assignedListings: listings.filter((l) => l.agentId === agent.id).map((l) => l.slug),
  }));
}

function seedPartners(): AdminPartner[] {
  const out: AdminPartner[] = [];
  partnerGroups.forEach((group) => {
    group.partners.forEach((partner, index) => {
      out.push({
        ...partner,
        id: `${group.id}-${index}`,
        groupId: group.id,
        order: index,
        verified: true,
      });
    });
  });
  return out;
}

function seedTestimonials(): AdminTestimonial[] {
  return testimonials.map((testimonial, index) => ({
    ...testimonial,
    id: `testimonial-${index}`,
  }));
}

function seedInquiries(): Inquiry[] {
  return [
    {
      id: 'inq-1001',
      type: 'valuation',
      status: 'New',
      name: 'Patricia Nakato',
      phone: '+256 772 445 981',
      email: 'p.nakato@example.com',
      message:
        'Bank has asked for a valuation of our Kololo house before releasing a mortgage facility. Need this within two weeks.',
      listingSlug: 'kololo-four-bedroom-villa',
      createdAt: '2026-09-15T09:12:00Z',
    },
    {
      id: 'inq-1002',
      type: 'agent-contact',
      status: 'In Progress',
      name: 'David Okello',
      phone: '+256 701 223 344',
      message: 'Interested in viewing the Nakasero office suite this week, mornings preferred.',
      listingSlug: 'nakasero-office-suite',
      createdAt: '2026-09-14T14:40:00Z',
    },
    {
      id: 'inq-1003',
      type: 'list-a-property',
      status: 'Contacted',
      name: 'Grace Amono',
      phone: '+256 754 009 812',
      email: 'grace.amono@example.com',
      message: 'Would like to list a 20-decimal plot in Kyanja. Title is clean, ready to sell.',
      createdAt: '2026-09-12T11:05:00Z',
    },
    {
      id: 'inq-1004',
      type: 'general',
      status: 'Closed',
      name: 'Michael Tumusiime',
      email: 'm.tumusiime@example.com',
      message: 'Do you cover valuations for plant and machinery for an insurance claim?',
      createdAt: '2026-09-08T08:30:00Z',
    },
    {
      id: 'inq-1005',
      type: 'valuation',
      status: 'New',
      name: 'Ruth Namusoke',
      phone: '+256 776 118 220',
      message: 'Need a compensation valuation for a plot affected by a road project in Mbarara.',
      createdAt: '2026-09-17T16:20:00Z',
    },
  ];
}

function seedSettings(): AdminSiteSettings {
  return {
    name: site.name,
    shortName: site.shortName,
    tagline: site.tagline,
    description: site.description,
    phone: { ...site.phone },
    email: site.email,
    whatsapp: site.whatsapp,
    address: { ...site.address },
    nairobiAddress: '',
    hours: site.hours.map((row) => ({ ...row })),
    hoursConfirmed: site.hoursConfirmed,
    yearsInBusiness: site.yearsInBusiness,
    stats: stats.map((stat) => ({ ...stat })),
  };
}

export function seedAdminState(): AdminState {
  return {
    listings: seedListings(),
    agents: seedAgents(),
    partners: seedPartners(),
    testimonials: seedTestimonials(),
    inquiries: seedInquiries(),
    settings: seedSettings(),
  };
}
