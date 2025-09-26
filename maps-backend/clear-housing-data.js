import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearHousingData() {
  try {
    console.log('🗑️  Clearing all housing project data...');
    
    // Delete all houses from the database
    const result = await prisma.house.deleteMany({});
    
    console.log(`✅ Deleted ${result.count} housing projects from database`);
    console.log('🎉 Database cleared successfully!');
    
  } catch (error) {
    console.error('❌ Clear operation failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearHousingData();
