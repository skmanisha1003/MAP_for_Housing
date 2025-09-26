// Example: Bulk import multiple housing projects
const projects = [
  {
    lat: -33.925,
    lng: 151.075,
    properties: {
      fundingAgreementStatus: "Contract signed",
      projectApplicant: "Bridge Housing Limited",
      totalDwellingsProposed: "144",
      totalBedroomsProposed: "288",
      state: "NSW",
      suburb: "Lakemba",
      projectStatus: "In Planning",
      nhafFunding: "$147.91m"
    }
  },
  // Add more projects here...
];

async function bulkImport() {
  for (const project of projects) {
    try {
      const response = await fetch('http://localhost:7000/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
      
      if (response.ok) {
        console.log(`✅ Added: ${project.properties.projectApplicant}`);
      } else {
        console.log(`❌ Failed: ${project.properties.projectApplicant}`);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

bulkImport();

