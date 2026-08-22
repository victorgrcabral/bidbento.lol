const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const brandCount = await prisma.brand.count();
  const paymentCount = await prisma.payment.count();
  const clickCount = await prisma.clickEvent.count();

  console.log("=== STATUS DO BANCO DE DADOS EM PRODUÇÃO ===");
  console.log("Brands ativas:", brandCount);
  console.log("Pagamentos registrados:", paymentCount);
  console.log("Cliques registrados:", clickCount);
  console.log("Pronto para o 1º comprador:", brandCount === 0);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
