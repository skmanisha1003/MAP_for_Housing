import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Housing project data from your spreadsheet
const housingProjects = [
  {
    fundingAgreementStatus: "Contract signed",
    projectApplicant: "Bridge Housing Limited",
    totalDwellingsProposed: "144",
    totalBedroomsProposed: "288",
    state: "NSW",
    suburb: "Lakemba",
    projectStatus: "In Planning",
    nhafFunding: "$147.91m"
  },
  {
    fundingAgreementStatus: "Contract signed",
    projectApplicant: "Bridge Housing Limited",
    totalDwellingsProposed: "174",
    totalBedroomsProposed: "330",
    state: "NSW",
    suburb: "Merrylands",
    projectStatus: "In Planning",
    nhafFunding: "$163.81m"
  },
  {
    fundingAgreementStatus: "Contract signed",
    projectApplicant: "Civic Disability Services Limited",
    totalDwellingsProposed: "5",
    totalBedroomsProposed: "6",
    state: "NSW",
    suburb: "Bangor",
    projectStatus: "In Planning",
    nhafFunding: "$4.66m"
  },
  {
    fundingAgreementStatus: "Contract signed",
    projectApplicant: "Civic Disability Services Limited",
    totalDwellingsProposed: "18",
    totalBedroomsProposed: "23",
    state: "NSW",
    suburb: "Heathcote",
    projectStatus: "In Planning",
    nhafFunding: "$16.76m"
  },
  {
    fundingAgreementStatus: "Contract signed",
    projectApplicant: "Evolve Housing Limited",
    totalDwellingsProposed: "236",
    totalBedroomsProposed: "460",
    state: "NSW",
    suburb: "Merrylands",
    projectStatus: "In Planning",
    nhafFunding: "$157.03m"
  },
  {
    fundingAgreementStatus: "Contract signed",
    projectApplicant: "Link Wentworth Housing Limited",
    totalDwellingsProposed: "12",
    totalBedroomsProposed: "12",
    state: "NSW",
    suburb: "Cammeray",
    projectStatus: "Under Construction",
    nhafFunding: "$6.64m"
  },
  {
    fundingAgreementStatus: "Contract signed",
    projectApplicant: "Link Wentworth Housing Limited",
    totalDwellingsProposed: "33",
    totalBedroomsProposed: "38",
    state: "NSW",
    suburb: "Rouse Hill",
    projectStatus: "Under Construction",
    nhafFunding: "$20.10m"
  },
  {
    fundingAgreementStatus: "Contract signed",
    projectApplicant: "St George Community Housing Limited",
    totalDwellingsProposed: "231",
    totalBedroomsProposed: "338",
    state: "NSW",
    suburb: "Arncliffe",
    projectStatus: "Under Construction",
    nhafFunding: "$172.24m"
  },
  {
    fundingAgreementStatus: "Contract signed",
    projectApplicant: "The Illawarra Community Housing Trust Ltd",
    totalDwellingsProposed: "9",
    totalBedroomsProposed: "17",
    state: "NSW",
    suburb: "Dapto",
    projectStatus: "Complete",
    nhafFunding: "$1.92m"
  },
  {
    fundingAgreementStatus: "Contract signed",
    projectApplicant: "The Illawarra Community Housing Trust Ltd",
    totalDwellingsProposed: "9",
    totalBedroomsProposed: "11",
    state: "NSW",
    suburb: "Wollongong",
    projectStatus: "Complete",
    nhafFunding: "$2.16m"
  }
];

// NSW suburb coordinates (approximate)
const suburbCoordinates = {
  "Lakemba": { lat: -33.9200, lng: 151.0750 },
  "Merrylands": { lat: -33.8333, lng: 150.9833 },
  "Bangor": { lat: -34.0167, lng: 151.0333 },
  "Heathcote": { lat: -34.0833, lng: 151.0167 },
  "Cammeray": { lat: -33.8167, lng: 151.2167 },
  "Rouse Hill": { lat: -33.6833, lng: 150.9167 },
  "Arncliffe": { lat: -33.9333, lng: 151.1500 },
  "Dapto": { lat: -34.5000, lng: 150.7833 },
  "Wollongong": { lat: -34.4333, lng: 150.8833 }
};

async function importHousingProjects() {
  try {
    console.log('🚀 Starting housing project data import...');
    
    let importedCount = 0;
    let totalDwellings = 0;
    let totalFunding = 0;
    const uniqueSuburbs = new Set();
    const uniqueOrganizations = new Set();
    
    for (const project of housingProjects) {
      const coords = suburbCoordinates[project.suburb];
      
      if (!coords) {
        console.log(`⚠️  No coordinates found for ${project.suburb}, using Sydney center`);
        coords = { lat: -33.8688, lng: 151.2093 };
      }
      
      const properties = {
        fundingAgreementStatus: project.fundingAgreementStatus,
        projectApplicant: project.projectApplicant,
        totalDwellingsProposed: project.totalDwellingsProposed,
        totalBedroomsProposed: project.totalBedroomsProposed,
        state: project.state,
        suburb: project.suburb,
        projectStatus: project.projectStatus,
        nhafFunding: project.nhafFunding
      };
      
      await prisma.house.create({
        data: {
          lat: coords.lat,
          lng: coords.lng,
          properties: properties
        }
      });
      
      console.log(`✅ Imported: ${project.projectApplicant} in ${project.suburb} (${project.totalDwellingsProposed} dwellings, ${project.nhafFunding})`);
      importedCount++;
      
      // Aggregate totals
      totalDwellings += parseInt(project.totalDwellingsProposed);
      const fundingValue = parseFloat(project.nhafFunding.replace('$', '').replace('m', ''));
      if (!isNaN(fundingValue)) {
        totalFunding += fundingValue;
      }
      
      uniqueSuburbs.add(project.suburb);
      uniqueOrganizations.add(project.projectApplicant);
    }
    
    console.log('\n🎉 Housing project data import complete!');
    console.log(`\n## What was imported:\n`);
    console.log(`**${importedCount} Housing Projects** across NSW with:`);
    console.log(`- **Total dwellings:** ${totalDwellings} across all projects`);
    console.log(`- **Total funding:** $${totalFunding.toFixed(2)}m in NHAF funding`);
    console.log(`- **Locations:** ${uniqueSuburbs.size} different NSW suburbs`);
    console.log(`- **Organizations:** ${uniqueOrganizations.size} different organizations`);
    
    console.log(`\n## Projects imported:\n`);
    housingProjects.forEach((project, index) => {
      console.log(`${index + 1}. **${project.projectApplicant}** - ${project.suburb} (${project.totalDwellingsProposed} dwellings, ${project.nhafFunding}) - ${project.projectStatus}`);
    });
    
    console.log('\n✨ Data is now available on your map!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importHousingProjects();

