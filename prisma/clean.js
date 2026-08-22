const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Limpando todos os dados de demonstração para o Lançamento Oficial...");

  await prisma.clickEvent.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.brand.deleteMany({});

  console.log("✨ Banco de dados zerado com sucesso! Pronto para receber os primeiros pagamentos reais.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
