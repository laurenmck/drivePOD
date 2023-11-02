function FHIR_to_summary(fhirJsonString){
    const fhirData = parseFhirJson(fhirJsonString);
    const summary = summarizePatient(fhirData);
    return summary;
}

function parseFhirJson(fhirJsonString) {
    try {
        const parsedData = JSON.parse(fhirJsonString);
        return parsedData;
    } catch (error) {
        return `Error parsing JSON: ${error.message}`;
    }
    
}

function mapRelationshipCodeToText(code) {
    const relationshipMap = {
        'BP': 'Billing Contact Person',
        'CP': 'Contact Person',
        'EP': 'Emergency Contact Person',
        'PR': 'Person Preparing Referral',
        'E': 'Employer',
        'C': 'Emergency Contact',
        'F': 'Federal Agency',
        'I': 'Insurance Company',
        'N': 'Next-of-Kin',
        'S': 'State Agency',
        'O': 'Other',
        'U': 'Unknown'
    };
    return relationshipMap[code] || 'Unknown';
}

function summarizePatient(fhirData) {
    if (!fhirData || fhirData.resourceType !== 'Patient') {
        return 'Invalid FHIR Patient data';
    }

    const name = fhirData.name && fhirData.name[0] ? `${fhirData.name[0].given.join(' ')} ${fhirData.name[0].family}` : 'Unknown';
    const dob = fhirData.birthDate || 'Unknown';
    const gender = fhirData.gender || 'Unknown';

    const address = fhirData.address && fhirData.address[0] ? fhirData.address[0].text || `${fhirData.address[0].line.join(', ')} ${fhirData.address[0].city}, ${fhirData.address[0].state} ${fhirData.address[0].postalCode}` : 'Unknown';

    const familyConnections = fhirData.contact ? fhirData.contact.map(contact => {
        const relationship = contact.relationship && contact.relationship[0] && contact.relationship[0].coding && contact.relationship[0].coding[0] ? mapRelationshipCodeToText(contact.relationship[0].coding[0].code) : 'Unknown';
        const contactName = contact.name ? `${contact.name.given.join(' ')} ${contact.name.family}` : 'Unknown';
        return `${relationship}: ${contactName}`;
    }).join(', ') : 'None';

    const contactInfo = fhirData.contact ? fhirData.contact.map(contact => {
        return contact.telecom ? contact.telecom.map(t => `${t.system}: ${t.value}`).join(', ') : 'None';
    }).join(', ') : 'None';

    return `
    Patient Summary:
    Name: ${name}
    Date of Birth: ${dob}
    Gender: ${gender}
    Address: ${address}
    Family Connections: ${familyConnections}
    Contact Info: ${contactInfo}
    `;
}

/*
function readFileAsString(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data;
    } catch (error) {
        return `Error reading file: ${error.message}`;
    }
}
*/

export default FHIR_to_summary;