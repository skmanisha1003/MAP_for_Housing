import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Housing project data from the large image dataset
const housingProjects = [
  {
    status: "Preferred - pending contract close",
    organizationName: "Homes North Community Housi",
    numericalId: "23",
    state: "NSW",
    suburb: "Liverpool",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Homes North Community Housi",
    numericalId: "20",
    state: "NSW",
    suburb: "Wyong",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Homes North Community Housi",
    numericalId: "13",
    state: "NSW",
    suburb: "Raymond Terrace",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Kirinari Community Services Ltd",
    numericalId: "1",
    state: "NSW",
    suburb: "Thrumster",
    projectStage: "Complete"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Kirinari Community Services Ltd",
    numericalId: "1",
    state: "NSW",
    suburb: "Thrumster",
    projectStage: "Under Construction"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Kirinari Community Services Ltd",
    numericalId: "1",
    state: "NSW",
    suburb: "Thrumster",
    projectStage: "Complete"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Kirinari Community Services Ltd",
    numericalId: "1",
    state: "NSW",
    suburb: "Thrumster",
    projectStage: "Under Construction"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Link Wentworth Housing Limited",
    numericalId: "135",
    state: "NSW",
    suburb: "Macquarie Park",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Link Wentworth Housing Limited",
    numericalId: "37",
    state: "NSW",
    suburb: "North Manly",
    projectStage: "Under Construction"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Link Wentworth Housing Limited",
    numericalId: "10",
    state: "NSW",
    suburb: "Pennant Hills",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Link Wentworth Housing Limited",
    numericalId: "48",
    state: "NSW",
    suburb: "Thornleigh",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "NSW Land And Housing Corpora",
    numericalId: "86",
    state: "NSW",
    suburb: "Lane Cove North",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "NSW Land And Housing Corpora",
    numericalId: "144",
    state: "NSW",
    suburb: "Maroubra",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Pacific Link Housing Limited",
    numericalId: "21",
    state: "NSW",
    suburb: "Woy Woy",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Searms Community Housing Abc",
    numericalId: "6",
    state: "NSW",
    suburb: "Batemans Bay",
    projectStage: "Under Construction"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Searms Community Housing Abc",
    numericalId: "51",
    state: "NSW",
    suburb: "Mittagong",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "SHP X HCA HA Ltd (Assemble)",
    numericalId: "54",
    state: "NSW",
    suburb: "Thurgoona",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "St George Community Housing L",
    numericalId: "111",
    state: "NSW",
    suburb: "Alexandria",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "St Vincent De Paul (Society) Hou",
    numericalId: "12",
    state: "NSW",
    suburb: "Coonabarabran",
    projectStage: "In Planning"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "The Illawarra Community Housin",
    numericalId: "27",
    state: "NSW",
    suburb: "Wollongong",
    projectStage: "Under Construction"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "The North Coast Community Ho",
    numericalId: "9",
    state: "NSW",
    suburb: "Casino",
    projectStage: "Under Construction"
  },
  {
    status: "Preferred - pending contract close",
    organizationName: "Third Sector Australia Ltd",
    numericalId: "15",
    state: "NSW",
    suburb: "Brunswick Heads",
    projectStage: "Under Construction"
  },
  {
    status: "Withdrawn",
    organizationName: "N/A Withdrawn application",
    numericalId: "32",
    state: "NSW",
    suburb: "Null",
    projectStage: "Null"
  }
];

// NSW suburb coordinates with multiple coordinates for Thrumster to avoid overlap
const suburbCoordinates = {
  "Liverpool": { lat: -33.9167, lng: 150.9167 },
  "Wyong": { lat: -33.2833, lng: 151.4167 },
  "Raymond Terrace": { lat: -32.7500, lng: 151.7500 },
  "Thrumster": [
    { lat: -31.8833, lng: 152.5167 }, // Base coordinates
    { lat: -31.8850, lng: 152.5200 }, // Slightly offset
    { lat: -31.8800, lng: 152.5150 }, // Another offset
    { lat: -31.8870, lng: 152.5180 }  // Fourth offset
  ],
  "Macquarie Park": { lat: -33.7667, lng: 151.1167 },
  "North Manly": { lat: -33.7833, lng: 151.2833 },
  "Pennant Hills": { lat: -33.7333, lng: 151.0667 },
  "Thornleigh": { lat: -33.7167, lng: 151.0833 },
  "Lane Cove North": { lat: -33.8000, lng: 151.1667 },
  "Maroubra": { lat: -33.9500, lng: 151.2333 },
  "Woy Woy": { lat: -33.4833, lng: 151.3167 },
  "Batemans Bay": { lat: -35.7167, lng: 150.1833 },
  "Mittagong": { lat: -34.4500, lng: 150.4500 },
  "Thurgoona": { lat: -36.0167, lng: 146.9833 },
  "Alexandria": { lat: -33.9000, lng: 151.2000 },
  "Coonabarabran": { lat: -31.2667, lng: 149.2833 },
  "Wollongong": { lat: -34.4333, lng: 150.8833 },
  "Casino": { lat: -28.8667, lng: 153.0500 },
  "Brunswick Heads": { lat: -28.5333, lng: 153.5500 }
};

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

async function importLargeDataset() {
  try {
    console.log('🚀 Starting import of large housing project dataset...');
    
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
        source: "large_dataset"
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
    
    console.log('\n🎉 Import complete! Successfully imported housing projects from large dataset.');
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

importLargeDataset();
