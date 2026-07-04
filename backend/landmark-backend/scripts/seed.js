require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');
const Property = require('../src/models/Property');
const Review = require('../src/models/Review');
const Stats = require('../src/models/Stats');
const Plot = require('../src/models/Plot');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // ── Admin ──────────────────────────────────────────────────────────────────
  const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existingAdmin) {
    await Admin.create({
      name: 'Latif Admin',
      email: process.env.ADMIN_EMAIL || 'admin@latiflandmark.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@1234',
      role: 'superadmin',
    });
    console.log(`👤 Admin created: ${process.env.ADMIN_EMAIL}`);
  } else {
    console.log('👤 Admin already exists, skipping.');
  }

  // ── Properties ─────────────────────────────────────────────────────────────
  await Property.deleteMany({});
  await Property.insertMany([
    {
      title: 'Duplex Province – Block A',
      location: 'Noikahon, Araihazar, Narayanganj',
      status: 'Available',
      images: [
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
        'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=600&q=80',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
      ],
      description:
        'Premium residential plot in a serene garden environment with all modern amenities including road access, electricity, and gas pipeline.',
      featured: true,
      order: 1,
    },
    {
      title: 'Latif Green Valley – Block B',
      location: 'Noikahon, Araihazar, Narayanganj',
      status: 'Sold',
      images: [
        'https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=600&q=80',
        'https://images.unsplash.com/photo-1625602812206-5ec545ca1231?w=600&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
      ],
      description:
        'Spacious plot with panoramic views, close to school and hospital. Ideal for family homes.',
      order: 2,
    },
    {
      title: 'Latif Sunrise Province – Block C',
      location: 'Noikahon, Araihazar, Narayanganj',
      status: 'Available',
      images: [
        'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80',
        'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80',
      ],
      description:
        'East-facing sunrise plots with wide road frontage. Fully demarcated with boundary walls.',
      order: 3,
    },
    {
      title: 'Bashundhara Landmark Chalet',
      location: 'H-777-778, Block-N, Bashundhara R/A, Dhaka',
      status: 'Available',
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
        'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
      ],
      description:
        'Corner plot in prestigious Bashundhara Residential Area with prime location and high investment value.',
      featured: true,
      order: 4,
    },
  ]);
  console.log('🏠 Properties seeded.');

  // ── Reviews ────────────────────────────────────────────────────────────────
  await Review.deleteMany({});
  await Review.insertMany([
    {
      name: 'Mohammad Rafiqul Islam',
      location: 'Dhaka, Bangladesh',
      rating: 5,
      date: 'January 2025',
      avatar: 'MR',
      text: 'Latif Landmark exceeded every expectation. The plot I purchased in Araihazar has all promised utilities in place.',
      tag: 'Araihazar Plot',
    },
    {
      name: 'Farida Begum',
      location: 'Narayanganj',
      rating: 5,
      date: 'March 2025',
      avatar: 'FB',
      text: 'I was hesitant to invest in land but their team walked me through every step.',
      tag: 'Bashundhara Residential',
    },
    {
      name: 'Kamal Hossain',
      location: 'Chattogram',
      rating: 5,
      date: 'November 2024',
      avatar: 'KH',
      text: 'The post-sale support is what sets Latif Landmark apart.',
      tag: 'North Jatrabari',
    },
    {
      name: 'Sumaiya Akter',
      location: 'Dhaka',
      rating: 5,
      date: 'February 2025',
      avatar: 'SA',
      text: 'As a first-time buyer I was nervous. The sales team helped me find the right plot.',
      tag: 'Araihazar Plot',
    },
    {
      name: 'Abdul Karim Miah',
      location: 'Sylhet',
      rating: 5,
      date: 'December 2024',
      avatar: 'AK',
      text: 'A colleague recommended Latif Landmark. I visited the site and was impressed.',
      tag: 'Bashundhara Residential',
    },
  ]);
  console.log('⭐ Reviews seeded.');

  // ── Stats ──────────────────────────────────────────────────────────────────
  await Stats.deleteMany({});
  await Stats.create({
    totalArea: '100 Decimal',
    availablePlots: 9,
    soldPlots: 3,
    ongoingProjects: 3,
    totalPlots: 12,
    yearsOfExperience: 5,
  });
  console.log('📊 Stats seeded.');

  // ── Plots ──────────────────────────────────────────────────────────────────
  // 5 Katha plot IDs (from index.html FIVE_KATHA set)
  const FIVE_KATHA = new Set([
    ...([1,13,14,26,27,39,40,52,53,65].map(n=>`A-S-${n}`)),
    ...([1,10,11,20,21,30,31,40,47,48].map(n=>`A-N-${n}`)),
    ...([1,6,7,12,13,23,24,34,44,45].map(n=>`B-S-${n}`)),
    ...([1,16,17,25,37,38,50,51,63].map(n=>`B-N-${n}`)),
    ...([9,10,19,29,30,40,41,51].map(n=>`C-S-${n}`)),
    ...([1,13,14,26,27,37,38,48,49,61].map(n=>`C-N-${n}`)),
  ]);

  // Block A: North 54, South 65 | Block B: North 63, South 54 | Block C: North 61, South 51
  const BLOCK_ZONES = [
    { block: 'A', zone: 'N', max: 54 },
    { block: 'A', zone: 'S', max: 65 },
    { block: 'B', zone: 'N', max: 63 },
    { block: 'B', zone: 'S', max: 54 },
    { block: 'C', zone: 'N', max: 61 },
    { block: 'C', zone: 'S', max: 51 },
  ];

  await Plot.deleteMany({});
  const plotDocs = [];
  for (const { block, zone, max } of BLOCK_ZONES) {
    for (let num = 1; num <= max; num++) {
      const plotId = `${block}-${zone}-${num}`;
      plotDocs.push({
        plotId,
        block,
        zone,
        num,
        size: FIVE_KATHA.has(plotId) ? '5 Katha' : '3 Katha',
        status: 'available',
        name: '', phone: '', email: '', note: '', adminNote: '',
      });
    }
  }
  await Plot.insertMany(plotDocs);
  console.log(`🗺  Plots seeded: ${plotDocs.length} total (348 plots across Blocks A, B, C).`);

  console.log('\n✅ Database seeded successfully!');
  console.log(`   Admin email    : ${process.env.ADMIN_EMAIL || 'admin@latiflandmark.com'}`);
  console.log(`   Admin password : ${process.env.ADMIN_PASSWORD || 'Admin@1234'}`);
  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
