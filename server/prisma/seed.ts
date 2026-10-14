import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient, PropertyCategory, PropertyStatus, PropertyType, Role } from '@prisma/client';

const prisma = new PrismaClient();

const listings = [
  {
    slug: 'maitama-residence-abuja',
    title: 'A considered home in Maitama',
    category: PropertyCategory.HOUSE,
    type: PropertyType.SALE,
    description:
      'An airy family home on a quiet Maitama street, with generous entertaining space, mature landscaping, and secure parking. A thoughtful layout gives every room a calm connection to the outdoors.',
    price: 485000000,
    bedrooms: 5,
    bathrooms: 5,
    area: 540,
    address: 'Off Aguiyi Ironsi Street, Maitama',
    city: 'Abuja',
    state: 'FCT',
    lat: 9.082,
    lng: 7.492,
    features: ['Private garden', '24-hour security', 'Borehole', 'Staff quarters'],
    image: 'photo-1600607687939-ce8a6c25118c',
  },
  {
    slug: 'lekki-coastal-apartment',
    title: 'Light-filled apartment by the coast',
    category: PropertyCategory.APARTMENT,
    type: PropertyType.SALE,
    description:
      'A refined apartment with open living areas, wide balconies, and a considered finish throughout. Close to everyday conveniences and the waterfront, with a resident gym and controlled access.',
    price: 195000000,
    bedrooms: 3,
    bathrooms: 3,
    area: 210,
    address: 'Admiralty Way, Lekki Phase 1',
    city: 'Lagos',
    state: 'Lagos',
    lat: 6.447,
    lng: 3.472,
    features: ['Swimming pool', 'Fitness studio', 'Elevator', 'Backup power'],
    image: 'photo-1600210492486-724fe5c67fb0',
  },
  {
    slug: 'gwarinpa-family-duplex',
    title: 'Room to grow in Gwarinpa',
    category: PropertyCategory.DUPLEX,
    type: PropertyType.SALE,
    description:
      'A well-kept duplex on a peaceful residential road. The home has flexible living spaces for family life, a private compound, and reliable services close to schools, shops, and local transport.',
    price: 185000000,
    bedrooms: 4,
    bathrooms: 4,
    area: 360,
    address: '6th Avenue, Gwarinpa',
    city: 'Abuja',
    state: 'FCT',
    lat: 9.111,
    lng: 7.404,
    features: ['Private compound', 'Water treatment', 'Boys quarters', 'Gated street'],
    image: 'photo-1600566753086-00f18fb6b3ea',
  },
  {
    slug: 'suleja-garden-home',
    title: 'A quiet garden home in Suleja',
    category: PropertyCategory.HOUSE,
    type: PropertyType.SALE,
    description:
      'A welcoming home with a practical floor plan, good natural light, and a private garden. Set in an established neighborhood with straightforward access to Abuja and nearby amenities.',
    price: 68500000,
    bedrooms: 3,
    bathrooms: 3,
    area: 245,
    address: 'Madalla Road, Suleja',
    city: 'Suleja',
    state: 'Niger',
    lat: 9.181,
    lng: 7.179,
    features: ['Garden', 'Secure parking', 'Water storage', 'Solar backup'],
    image: 'photo-1600047509807-ba8f99d2cdde',
  },
  {
    slug: 'minna-modern-residence',
    title: 'A modern residence in Minna',
    category: PropertyCategory.HOUSE,
    type: PropertyType.SALE,
    description:
      'A modern detached home with bright interiors and space for a growing household. The property includes a generous kitchen, a covered terrace, and a secure enclosed compound.',
    price: 92500000,
    bedrooms: 4,
    bathrooms: 4,
    area: 310,
    address: 'Tunga Extension, Minna',
    city: 'Minna',
    state: 'Niger',
    lat: 9.613,
    lng: 6.556,
    features: ['Covered terrace', 'Fitted kitchen', 'Enclosed compound', 'Guest suite'],
    image: 'photo-1600607687920-4e2a09cf159d',
  },
  {
    slug: 'ikoyi-serviced-apartment',
    title: 'A calm, serviced Ikoyi apartment',
    category: PropertyCategory.APARTMENT,
    type: PropertyType.RENT,
    description:
      'A beautifully proportioned apartment in a full-service residence. Residents enjoy a discreet concierge, dependable power, leisure amenities, and quick access to business districts.',
    price: 42000000,
    bedrooms: 3,
    bathrooms: 3,
    area: 230,
    address: 'Bourdillon Road, Ikoyi',
    city: 'Lagos',
    state: 'Lagos',
    lat: 6.451,
    lng: 3.431,
    features: ['Concierge', 'Generator', 'Swimming pool', 'Secure parking'],
    image: 'photo-1600607687939-ce8a6c25118c',
  },
];

async function main() {
  const agentEmail = process.env.SEED_AGENT_EMAIL?.trim().toLowerCase();
  const agentPassword = process.env.SEED_AGENT_PASSWORD;
  if (!agentEmail || !agentPassword || agentPassword.length < 12) {
    throw new Error(
      'Set SEED_AGENT_EMAIL and a SEED_AGENT_PASSWORD of at least 12 characters in server/.env before seeding.',
    );
  }

  const agentPasswordHash = await bcrypt.hash(agentPassword, Number(process.env.BCRYPT_ROUNDS) || 12);
  const agent = await prisma.user.upsert({
    where: { email: agentEmail },
    update: { name: 'EstatePro Property Advisor', role: Role.AGENT, isActive: true },
    create: {
      name: 'EstatePro Property Advisor',
      email: agentEmail,
      passwordHash: agentPasswordHash,
      role: Role.AGENT,
    },
  });

  const adminEmail = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const adminPasswordIsPlaceholder = adminPassword?.startsWith('REPLACE_') ?? false;
  if ((adminEmail && !adminPassword) || (!adminEmail && adminPassword && !adminPasswordIsPlaceholder)) {
    throw new Error('Set both SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in server/.env to create the admin account.');
  }
  if (adminEmail && adminPassword && !adminPasswordIsPlaceholder) {
    if (adminPassword.length < 12)
      throw new Error('SEED_ADMIN_PASSWORD must contain at least 12 characters.');
    const passwordHash = await bcrypt.hash(adminPassword, Number(process.env.BCRYPT_ROUNDS) || 12);
    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: { name: 'EstatePro Administrator', role: Role.ADMIN, isActive: true },
      create: { name: 'EstatePro Administrator', email: adminEmail, passwordHash, role: Role.ADMIN },
    });
    console.log(`Seeded admin account ${admin.email} with role ${admin.role}.`);
  }

  for (const listing of listings) {
    const imageUrl = `https://images.unsplash.com/${listing.image}?auto=format&fit=crop&w=1600&q=85`;
    const { image, ...data } = listing;
    await prisma.property.upsert({
      where: { slug: listing.slug },
      update: { ...data, agentId: agent.id, status: PropertyStatus.APPROVED },
      create: {
        ...data,
        agentId: agent.id,
        status: PropertyStatus.APPROVED,
        images: {
          create: [{ url: imageUrl, publicId: `seed/${listing.slug}`, alt: listing.title, position: 0 }],
        },
      },
    });
  }

  console.log(`Seeded agent account ${agent.email} with role ${agent.role}.`);
  console.log(`Seeded ${listings.length} Nigerian property listings.`);
}

main()
  .catch((error: unknown) => {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2021'
    ) {
      console.error(
        'The database tables are missing. From the repository root, run `npm run db:generate`, then `npm run db:push`, and retry `npm run db:seed`.',
      );
      console.error(error.message);
    } else {
      console.error(error);
    }
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
