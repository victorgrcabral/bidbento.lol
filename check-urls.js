const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const brands = await prisma.brand.findMany();
  console.log('Total brands:', brands.length);
  for (const b of brands) {
    console.log(`- ${b.name}: id=${b.id}, url=${b.websiteUrl}, domain=${b.domain}, clicks=${b.clicksCount}`);
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());
