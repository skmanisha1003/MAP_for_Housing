import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Housing project data from the image
const housingProjects = [
  {
    status: "Preferred - pending contract close",
    organizationName: "ACGC SPV No.1 Limited",
    numericalId: "185",
    state: "NSW",
    suburb: "Bankstown",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "ACGC SPV No.1 Limited",
    numericalId: "74",
    state: "NSW",
    suburb: "Regents Park",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Anglicare North Coast",
    numericalId: "6",
    state: "NSW",
    suburb: "South Kempsey",
    projectStage: "Complete"
  },
  {
    status: "Withdrawn",
    organizationName: "N/A Withdrawn application",
    numericalId: "32",
    state: "NSW",
    suburb: "Null",
    projectStage: "Null"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Aruma Services Limited",
    numericalId: "1",
    state: "NSW",
    suburb: "Wyee",
    projectStage: "Under Construction"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Aruma Services Limited",
    numericalId: "1",
    state: "NSW",
    suburb: "Wyee",
    projectStage: "Under Construction"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "City West Housing Pty Limited",
    numericalId: "257",
    state: "NSW",
    suburb: "Alexandria",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "City West Housing Pty Limited",
    numericalId: "126",
    state: "NSW",
    suburb: "Bankstown",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "City West Housing Pty Limited",
    numericalId: "74",
    state: "NSW",
    suburb: "Waterloo",
    projectStage: "Under Construction"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Civic Disability Services Limited",
    numericalId: "11",
    state: "NSW",
    suburb: "Caringbah",
    projectStage: "Complete"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Clarence Village Limited",
    numericalId: "32",
    state: "NSW",
    suburb: "South Grafton",
    projectStage: "Under Construction"
  }
];

// NSW suburb coordinates with slight variations for same suburbs to avoid overlap
const suburbCoordinates = {
  "Bankstown": [
    { lat: -33.9167, lng: 151.0333 }, // Base coordinates
    { lat: -33.9200, lng: 151.0300 }  // Slightly offset for second entry
  ],
  "Regents Park": { lat: -33.8833, lng: 151.0167 },
  "South Kempsey": { lat: -31.0833, lng: 152.8333 },
  "Wyee": [
    { lat: -33.1833, lng: 151.4833 }, // Base coordinates
    { lat: -33.1900, lng: 151.4800 }  // Slightly offset for second entry
  ],
  "Alexandria": { lat: -33.9000, lng: 151.2000 },
  "Waterloo": { lat: -33.9000, lng: 151.2167 },
  "Caringbah": { lat: -34.0333, lng: 151.1167 },
  "South Grafton": { lat: -29.7000, lng: 152.9333 }
};

// Track used coordinates for suburbs with multiple entries
const usedCoordinates = {};

function getCoordinates(suburb, index = 0) {
  if (suburb === "Null") {
    return { lat: -33.8688, lng: 151.2093 }; // Sydney center as fallback
  }

  const coords = suburbCoordinates[suburb];
  
  if (!coords) {
    console.log(`⚠️  No coordinates found for ${suburb}, using Sydney center`);
    return { lat: -33.8688, lng: 151.2093 };
  }

  // If it's an array (multiple coordinates for same suburb)
  if (Array.isArray(coords)) {
    if (index < coords.length) {
      return coords[index];
    } else {
      // If we've used all predefined coordinates, add slight random offset
      const baseCoord = coords[0];
      const offset = 0.005; // Small offset to avoid overlap
      return {
        lat: baseCoord.lat + (Math.random() - 0.5) * offset,
        lng: baseCoord.lng + (Math.random() - 0.5) * offset
      };
    }
  }

  return coords;
}

async function importImageData() {
  try {
    console.log('🚀 Starting import of image housing project data...');
    
    let importedCount = 0;
    let skippedCount = 0;
    
    for (let i = 0; i < housingProjects.length; i++) {
      const project = housingProjects[i];
      
      // Skip withdrawn applications
      if (project.status === "Withdrawn" || project.suburb === "Null") {
        console.log(`⏭️  Skipped: ${project.organizationName} (${project.status})`);
        skippedCount++;
        continue;
      }

      // Get coordinates with index for suburbs that appear multiple times
      const coords = getCoordinates(project.suburb, i);
      
      const properties = {
        status: project.status,
        organizationName: project.organizationName,
        numericalId: project.numericalId,
        state: project.state,
        suburb: project.suburb,
        projectStage: project.projectStage,
        source: "image_data"
      };
      
      await prisma.house.create({
        data: {
          lat: coords.lat,
          lng: coords.lng,
          properties: properties
        }
      });
      
      console.log(`✅ Imported: ${project.organizationName} in ${project.suburb} (${project.projectStage}) - Lat: ${coords.lat}, Lng: ${coords.lng}`);
      importedCount++;
    }
    
    console.log('\n🎉 Import complete! Successfully imported housing projects from image data.');
    console.log(`📊 Summary:`);
    console.log(`   - Total projects imported: ${importedCount}`);
    console.log(`   - Total projects skipped: ${skippedCount}`);
    console.log(`   - Total projects processed: ${housingProjects.length}`);
    console.log('✨ Data is now available on your map!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importImageData();
