import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Housing project data from your spreadsheet
const housingProjects = [
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
    projectApplicant: "Evolve Housing Limited",
    totalDwellingsProposed: "236",
    totalBedroomsProposed: "460",
    state: "NSW",
    suburb: "Heathcote",
    projectStatus: "In Planning",
    nhafFunding: "$16.76m"
  },
  {
    fundingAgreementStatus: "Contract signed",
    projectApplicant: "Link Wentworth Housing Limited",
    totalDwellingsProposed: "185",
    totalBedroomsProposed: "12",
    state: "NSW",
    suburb: "Dapto",
    projectStatus: "In Planning",
    nhafFunding: "$157.03m"
  },
  {
    fundingAgreementStatus: "Contract signed",
    projectApplicant: "Kirinari Community Services Ltd",
    totalDwellingsProposed: "1",
    totalBedroomsProposed: "17",
    state: "NSW",
    suburb: "Bankstown",
    projectStatus: "In Planning",
    nhafFunding: "$6.64m"
  },
  {
    fundingAgreementStatus: "Contract signed",
    projectApplicant: "NSW Land And Housing Corporation",
    totalDwellingsProposed: "257",
    totalBedroomsProposed: "NSW",
    state: "NSW",
    suburb: "Wyee",
    projectStatus: "In Planning",
    nhafFunding: "$20.10m"
  },
  {
    fundingAgreementStatus: "Contract signed",
    projectApplicant: "Bridge Housing Limited",
    totalDwellingsProposed: "160",
    totalBedroomsProposed: "6",
    state: "NSW",
    suburb: "Arncliffe",
    projectStatus: "In Planning",
    nhafFunding: "$172.24m"
  },
  {
    fundingAgreementStatus: "Contract signed",
    projectApplicant: "Civic Disability Services Limited",
    totalDwellingsProposed: "135",
    totalBedroomsProposed: "21",
    state: "NSW",
    suburb: "Blacktown",
    projectStatus: "In Planning",
    nhafFunding: "$1.92m"
  },
  {
    fundingAgreementStatus: "Contract signed",
    projectApplicant: "Evolve Housing Limited",
    totalDwellingsProposed: "54",
    totalBedroomsProposed: "38",
    state: "NSW",
    suburb: "Thrumster",
    projectStatus: "In Planning",
    nhafFunding: "$2.16m"
  },
  {
    fundingAgreementStatus: "Contract signed",
    projectApplicant: "Link Wentworth Housing Limited",
    totalDwellingsProposed: "200",
    totalBedroomsProposed: "400",
    state: "NSW",
    suburb: "Maroubra",
    projectStatus: "Under Construction",
    nhafFunding: "$45.50m"
  },
  {
    fundingAgreementStatus: "Contract signed",
    projectApplicant: "NSW Land And Housing Corporation",
    totalDwellingsProposed: "300",
    totalBedroomsProposed: "600",
    state: "NSW",
    suburb: "Wollongong",
    projectStatus: "Complete",
    nhafFunding: "$89.25m"
  }
];

// NSW suburb coordinates (approximate)
const suburbCoordinates = {
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
  "Wollongong": { lat: -34.4333, lng: 150.8833 }
};

async function importHousingData() {
  try {
    console.log('Starting import of housing project data...');
    
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
      
      await prisma.place.create({
        data: {
          lat: coords.lat,
          lng: coords.lng,
          properties: properties
        }
      });
      
      console.log(`✅ Imported: ${project.projectApplicant} in ${project.suburb} (${project.totalDwellingsProposed} dwellings, ${project.nhafFunding})`);
    }
    
    console.log('🎉 All housing projects imported successfully!');
    console.log(`📊 Total projects: ${housingProjects.length}`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

importHousingData();

