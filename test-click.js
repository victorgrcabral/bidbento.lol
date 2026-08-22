const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const brand = await prisma.brand.findFirst();
  console.log('Sample brand:', brand.name, 'ID:', brand.id, 'Clicks:', brand.clicksCount, 'URL:', brand.websiteUrl);
  
  const updated = await prisma.brand.update({
    where: { id: brand.id },
    data: { clicksCount: { increment: 1 } }
  });
  console.log('Updated clicks:', updated.clicksCount);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
