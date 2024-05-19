const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
  try {
    const categories = [
      { name: "Computer Science" },
      { name: "Music" },
      { name: "Fitness" },
      { name: "Photography" },
      { name: "Accounting" },
      { name: "Engineering" },
      { name: "Filming" },
    ];

    await database.category.createMany({ data: categories });
    console.log("Success seeding.");
  } catch (error) {
    console.log("Database seeding error:", error);
  } finally {
    await database.$disconnect();
  }
}

main();
