import { PrismaClient } from '@prisma/client';

async function checkConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Attempting to connect to database...');
    // Try a simple query
    const count = await prisma.quote.count();
    console.log(`Connection successful! Found ${count} quotes in database.`);
    
    // Check schema
    console.log('Database schema:');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    console.log(tables);
    
    return true;
  } catch (error) {
    console.error('Failed to connect to database:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

checkConnection()
  .then(success => {
    if (success) {
      console.log('Database check completed successfully');
    } else {
      console.error('Database check failed');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error during database check:', error);
    process.exit(1);
  });