import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Updated housing project data from the image
const housingProjects = [
  {
    status: "Contract signed",
    organizationName: "Bridge Housing Limited",
    numericalId: "174",
    state: "NSW",
    suburb: "Merrylands",
    projectStage: "In Planning"
  },
  {
    status: "Contract signed",
    organizationName: "Civic Disability Services Limited",
    numericalId: "5",
    state: "NSW",
    suburb: "Bangor",
    projectStage: "In Planning"
  },
  {
    status: "Contract signed",
    organizationName: "Evolve Housing Limited",
    numericalId: "236",
    state: "NSW",
    suburb: "Heathcote",
    projectStage: "In Planning"
  },
  {
    status: "Contract signed",
    organizationName: "Link Wentworth Housing Limited",
    numericalId: "185",
    state: "NSW",
    suburb: "Dapto",
    projectStage: "In Planning"
  },
  {
    status: "Contract signed",
    organizationName: "Kirinari Community Services Ltd",
    numericalId: "1",
    state: "NSW",
    suburb: "Bankstown",
    projectStage: "In Planning"
  },
  {
    status: "Contract signed",
    organizationName: "NSW Land And Housing Corpora",
    numericalId: "257",
    state: "NSW",
    suburb: "Wyee",
    projectStage: "In Planning"
  },
  {
    status: "Contract signed",
    organizationName: "Bridge Housing Limited",
    numericalId: "160",
    state: "NSW",
    suburb: "Arncliffe",
    projectStage: "In Planning"
  },
  {
    status: "Contract signed",
    organizationName: "Civic Disability Services Limited",
    numericalId: "135",
    state: "NSW",
    suburb: "Blacktown",
    projectStage: "In Planning"
  },
  {
    status: "Contract signed",
    organizationName: "Evolve Housing Limited",
    numericalId: "54",
    state: "NSW",
    suburb: "Thrumster",
    projectStage: "In Planning"
  },
  {
    status: "Contract signed",
    organizationName: "Link Wentworth Housing Limited",
    numericalId: "200",
    state: "NSW",
    suburb: "Maroubra",
    projectStage: "Under Construction"
  },
  {
    status: "Contract signed",
    organizationName: "NSW Land And Housing Corpora",
    numericalId: "300",
    state: "NSW",
    suburb: "Wollongong",
    projectStage: "Complete"
  },
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
  },
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
  },
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

// NSW suburb coordinates - base coordinates for each suburb
const suburbBaseCoordinates = {
  "Merrylands": { lat: -33.8333, lng: 150.9833 },
  "Bangor": { lat: -34.0167, lng: 151.0333 },
  "Heathcote": { lat: -34.0833, lng: 151.0167 },
  "Dapto": { lat: -34.5000, lng: 150.7833 },
  "Bankstown": { lat: -33.9167, lng: 151.0333 },
  "Wyee": { lat: -33.1833, lng: 151.4833 },
  "Arncliffe": { lat: -33.9333, lng: 151.1500 },
  "Blacktown": { lat: -33.7667, lng: 150.9167 },
  "Thrumster": { lat: -31.8833, lng: 152.5167 },
  "Maroubra": { lat: -33.9500, lng: 151.2333 },
  "Wollongong": { lat: -34.4333, lng: 150.8833 },
  "Regents Park": { lat: -33.8833, lng: 151.0167 },
  "South Kempsey": { lat: -31.0833, lng: 152.8333 },
  "Alexandria": { lat: -33.9000, lng: 151.2000 },
  "Waterloo": { lat: -33.9000, lng: 151.2167 },
  "Caringbah": { lat: -34.0333, lng: 151.1167 },
  "South Grafton": { lat: -29.7000, lng: 152.9333 },
  "Queanbeyan": { lat: -35.3500, lng: 149.2333 },
  "Granville": { lat: -33.8333, lng: 151.0167 },
  "Melrose Place": { lat: -33.8833, lng: 151.2167 },
  "Morisset": { lat: -33.1167, lng: 151.4833 },
  "Penrith": { lat: -33.7500, lng: 150.7000 },
  "Armidale": { lat: -30.5000, lng: 151.6667 },
  "East Tamworth": { lat: -31.0833, lng: 150.9167 },
  "Moree": { lat: -29.4667, lng: 149.8500 },
  "Liverpool": { lat: -33.9167, lng: 150.9167 },
  "Wyong": { lat: -33.2833, lng: 151.4167 },
  "Raymond Terrace": { lat: -32.7500, lng: 151.7500 },
  "Macquarie Park": { lat: -33.7667, lng: 151.1167 },
  "North Manly": { lat: -33.7833, lng: 151.2833 },
  "Pennant Hills": { lat: -33.7333, lng: 151.0667 },
  "Thornleigh": { lat: -33.7167, lng: 151.0833 },
  "Lane Cove North": { lat: -33.8000, lng: 151.1667 },
  "Woy Woy": { lat: -33.4833, lng: 151.3167 },
  "Batemans Bay": { lat: -35.7167, lng: 150.1833 },
  "Mittagong": { lat: -34.4500, lng: 150.4500 },
  "Thurgoona": { lat: -36.0167, lng: 146.9833 },
  "Coonabarabran": { lat: -31.2667, lng: 149.2833 },
  "Casino": { lat: -28.8667, lng: 153.0500 },
  "Brunswick Heads": { lat: -28.5333, lng: 153.5500 }
};

// Track suburb counts for positioning
const suburbCounts = {};

function getCoordinates(suburb, index = 0) {
  if (suburb === "Null") {
    return { lat: -33.8688, lng: 151.2093 }; // Sydney center as fallback
  }

  const baseCoords = suburbBaseCoordinates[suburb];
  
  if (!baseCoords) {
    console.log(`⚠️  No coordinates found for ${suburb}, using Sydney center`);
    return { lat: -33.8688, lng: 151.2093 };
  }

  // Initialize suburb count if not exists
  if (!suburbCounts[suburb]) {
    suburbCounts[suburb] = 0;
  }

  // Increment count for this suburb
  suburbCounts[suburb]++;

  // If this is the first entry for this suburb, use base coordinates
  if (suburbCounts[suburb] === 1) {
    return baseCoords;
  }

  // For subsequent entries in the same suburb, place them close together
  // with slight latitude changes to keep them next to each other
  const latOffset = (suburbCounts[suburb] - 1) * 0.001; // Small offset for each additional entry
  const lngOffset = (suburbCounts[suburb] - 1) * 0.0005; // Even smaller longitude offset

  return {
    lat: baseCoords.lat + latOffset,
    lng: baseCoords.lng + lngOffset
  };
}

async function importUpdatedDataset() {
  try {
    console.log('🚀 Starting import of updated housing project dataset...');
    
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

      // Get coordinates with close positioning for same suburbs
      const coords = getCoordinates(project.suburb, i);
      
      const properties = {
        status: project.status,
        organizationName: project.organizationName,
        numericalId: project.numericalId,
        state: project.state,
        suburb: project.suburb,
        projectStage: project.projectStage,
        source: "updated_dataset"
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
    
    console.log('\n🎉 Import complete! Successfully imported housing projects from updated dataset.');
    console.log(`📊 Summary:`);
    console.log(`   - Total projects imported: ${importedCount}`);
    console.log(`   - Total projects skipped: ${skippedCount}`);
    console.log(`   - Total projects processed: ${housingProjects.length}`);
    console.log('✨ Data is now available on your map with close positioning for same suburbs!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importUpdatedDataset();
