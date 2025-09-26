import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function importFromCSV(csvFilePath) {
  try {
    // Read CSV file
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    // Skip header row
    const dataLines = lines.slice(1);
    
    console.log(`Found ${dataLines.length} records to import...`);
    
    for (const line of dataLines) {
      if (!line.trim()) continue;
      
      // Parse CSV line (simple comma split - adjust if you have commas in data)
      const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
      
      // Map columns to your data structure
      // Adjust column order based on your CSV structure
      const [
        fundingAgreementStatus,
        projectApplicant,
        totalDwellings,
        totalBedrooms,
        state,
        suburb,
        projectStatus,
        nhafFunding
      ] = columns;
      
      // Create properties object
      const properties = {};
      if (fundingAgreementStatus) properties.fundingAgreementStatus = fundingAgreementStatus;
      if (projectApplicant) properties.projectApplicant = projectApplicant;
      if (totalDwellings) properties.totalDwellingsProposed = totalDwellings;
      if (totalBedrooms) properties.totalBedroomsProposed = totalBedrooms;
      if (state) properties.state = state;
      if (suburb) properties.suburb = suburb;
      if (projectStatus) properties.projectStatus = projectStatus;
      if (nhafFunding) properties.nhafFunding = nhafFunding;
      
      // Create record in database with default coordinates (Sydney center)
      // You can update coordinates later through the map interface
      await prisma.place.create({
        data: {
          lat: -33.8688, // Default to Sydney center
          lng: 151.2093,
          properties: properties
        }
      });
      
      console.log(`Imported: ${projectApplicant} in ${suburb}`);
    }
    
    console.log('✅ Import completed successfully!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get CSV file path from command line argument
const csvFilePath = process.argv[2];

if (!csvFilePath) {
  console.log('Usage: node import-data.js <path-to-csv-file>');
  console.log('Example: node import-data.js housing-projects.csv');
  process.exit(1);
}

if (!fs.existsSync(csvFilePath)) {
  console.error(`❌ File not found: ${csvFilePath}`);
  process.exit(1);
}

importFromCSV(csvFilePath);
