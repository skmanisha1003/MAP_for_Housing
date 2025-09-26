import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Housing project data from the new image
const housingProjects = [
  {
    status: "Preferred - pending contract close",
    organizationName: "Community Housing Canberra Lt",
    numericalId: "80",
    state: "NSW",
    suburb: "Queanbeyan",
    projectStage: "Under Construction"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Evolve Housing Limited",
    numericalId: "160",
    state: "NSW",
    suburb: "Arncliffe",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Evolve Housing Limited",
    numericalId: "103",
    state: "NSW",
    suburb: "Blacktown",
    projectStage: "Under Construction"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Evolve Housing Limited",
    numericalId: "58",
    state: "NSW",
    suburb: "Blacktown",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Evolve Housing Limited",
    numericalId: "96",
    state: "NSW",
    suburb: "Granville",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Evolve Housing Limited",
    numericalId: "197",
    state: "NSW",
    suburb: "Melrose Place",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Evolve Housing Limited",
    numericalId: "15",
    state: "NSW",
    suburb: "Morisset",
    projectStage: "Under Construction"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Evolve Housing Limited",
    numericalId: "135",
    state: "NSW",
    suburb: "Penrith",
    projectStage: "Under Construction"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Homes North Community Housi",
    numericalId: "6",
    state: "NSW",
    suburb: "Armidale",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Homes North Community Housi",
    numericalId: "5",
    state: "NSW",
    suburb: "East Tamworth",
    projectStage: "Complete"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Homes North Community Housi",
    numericalId: "4",
    state: "NSW",
    suburb: "Moree",
    projectStage: "Under Construction"
  }
];

// NSW suburb coordinates with slight variations for same suburbs to avoid overlap
const suburbCoordinates = {
  "Queanbeyan": { lat: -35.3500, lng: 149.2333 },
  "Arncliffe": { lat: -33.9333, lng: 151.1500 },
  "Blacktown": [
    { lat: -33.7667, lng: 150.9167 }, // Base coordinates
    { lat: -33.7700, lng: 150.9200 }  // Slightly offset for second entry
  ],
  "Granville": { lat: -33.8333, lng: 151.0167 },
  "Melrose Place": { lat: -33.8833, lng: 151.2167 },
  "Morisset": { lat: -33.1167, lng: 151.4833 },
  "Penrith": { lat: -33.7500, lng: 150.7000 },
  "Armidale": { lat: -30.5000, lng: 151.6667 },
  "East Tamworth": { lat: -31.0833, lng: 150.9167 },
  "Moree": { lat: -29.4667, lng: 149.8500 }
};

// Track used coordinates for suburbs with multiple entries
const usedCoordinates = {};

function getCoordinates(suburb, index = 0) {
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

async function importNewImageData() {
  try {
    console.log('🚀 Starting import of new image housing project data...');
    
    let importedCount = 0;
    
    for (let i = 0; i < housingProjects.length; i++) {
      const project = housingProjects[i];
      
      // Get coordinates with index for suburbs that appear multiple times
      const coords = getCoordinates(project.suburb, i);
      
      const properties = {
        status: project.status,
        organizationName: project.organizationName,
        numericalId: project.numericalId,
        state: project.state,
        suburb: project.suburb,
        projectStage: project.projectStage,
        source: "new_image_data"
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
    
    console.log('\n🎉 Import complete! Successfully imported housing projects from new image data.');
    console.log(`📊 Summary:`);
    console.log(`   - Total projects imported: ${importedCount}`);
    console.log(`   - Total projects processed: ${housingProjects.length}`);
    console.log('✨ Data is now available on your map!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importNewImageData();
