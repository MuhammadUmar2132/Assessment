import mongoose from 'mongoose';
import { SiteSchema } from '../sites/schemas/site.schema';
import { generateSeedSites } from './seed.data';

async function runSeed() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smallweb';
  console.log(`Connecting to MongoDB at ${mongoUri}...`);

  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB successfully.');

  const SiteModel = mongoose.model('Site', SiteSchema);

  const seedSites = generateSeedSites();
  console.log(`Generated ${seedSites.length} seed sites. Writing to database...`);

  let count = 0;
  for (const site of seedSites) {
    await SiteModel.updateOne(
      { address: site.address },
      {
        $set: {
          title: site.title,
          content: site.content,
          author: site.author,
          tags: site.tags,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        }
      },
      { upsert: true }
    );
    count++;
    if (count % 25 === 0) {
      console.log(`Progress: ${count} / ${seedSites.length} sites seeded...`);
    }
  }

  const total = await SiteModel.countDocuments();
  console.log(`✅ Seeding complete! Processed ${count} sites. Total sites in database: ${total}`);

  await mongoose.disconnect();
  console.log('Disconnected from MongoDB.');
  process.exit(0);
}

runSeed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});

