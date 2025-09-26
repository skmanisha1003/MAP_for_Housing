import { PrismaClient } from '@prisma/client';
import XLSX from 'xlsx';
import fs from 'fs';

const prisma = new PrismaClient();

async function importFromExcel(excelFilePath) {
  try {
    // Read Excel file
    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0]; // Use first sheet
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`Found ${data.length} records to import...`);
    
    for (const row of data) {
      // Map Excel columns to your data structure
      // Adjust these property names to match your Excel column headers
      const properties = {};
      
      if (row['Funding Agreement Status']) properties.fundingAgreementStatus = row['Funding Agreement Status'];
      if (row['Project applicant']) properties.projectApplicant = row['Project applicant'];
      if (row['Total dwellings proposed']) properties.totalDwellingsProposed = row['Total dwellings proposed'];
      if (row['Total number of bedrooms proposed']) properties.totalBedroomsProposed = row['Total number of bedrooms proposed'];
      if (row['State']) properties.state = row['State'];
      if (row['Suburb']) properties.suburb = row['Suburb'];
      if (row['Project Status']) properties.projectStatus = row['Project Status'];
      if (row['NHAF Funding']) properties.nhafFunding = row['NHAF Funding'];
      
      // Create record in database with default coordinates (Sydney center)
      // You can update coordinates later through the map interface
      await prisma.place.create({
        data: {
          lat: -33.8688, // Default to Sydney center
          lng: 151.2093,
          properties: properties
        }
      });
      
      console.log(`Imported: ${row['Project applicant']} in ${row['Suburb']}`);
    }
    
    console.log('✅ Import completed successfully!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get Excel file path from command line argument
const excelFilePath = process.argv[2];

if (!excelFilePath) {
  console.log('Usage: node import-excel.js <path-to-excel-file>');
  console.log('Example: node import-excel.js housing-projects.xlsx');
  process.exit(1);
}

if (!fs.existsSync(excelFilePath)) {
  console.error(`❌ File not found: ${excelFilePath}`);
  process.exit(1);
}

importFromExcel(excelFilePath);
