import dotenv from 'dotenv';
import { searchDDG, extractTextFromHTML, analyzeResults, analyzeResultsHasData, extractURL } from './site-search.js';
import { parseCSV, usStateSwitch, filterSearchResults } from './data-prep.js';
import fs from 'fs';
import { sleep } from './sleep.js';
import { createObjectCsvWriter } from 'csv-writer';

dotenv.config();

const locations = parseCSV('./county.csv')?.filter(r=> /\bNV/i.test(r.state))?.slice(0, 3);
console.log(locations.length);
const limit = 5;

const csvWriter = createObjectCsvWriter ({
    path: 'output.csv',
    header: [
        { id: 'site 1', title: 'Site 1' },
        { id: 'site 2', title: 'Site 2' },
        { id: 'site 3', title: 'Site 3' },
        { id: 'site 4', title: 'Site 4' },
        { id: 'site 5', title: 'Site 5' },
        { id: 'location', title: 'Location' },
        { id: 'links', title: 'Links' },
        { id: 'gpt response', title: 'GPT Response' }
    ]
});


async function main() {
    let records = [];
    for (const location of locations) {
        try {
            const stateFullName = usStateSwitch(location.state);
            const locationClean = `${location.name} county ${location.state}`;
            const query = `${locationClean} local (election | candidate | elections | candidates) (filing | listing | filings | listings | list) 2024`;
            const searchResults = await searchDDG(query, limit);
            
            const queryObj = {state:location.state,stateFullName:stateFullName,county:location.name}
            const filteredResults = filterSearchResults(searchResults, queryObj);

            console.log(`Here are filtered results: ${JSON.stringify(filteredResults)}`)
            const HTMLText = await extractTextFromHTML(filteredResults.map(p => p.url));
            
            
            const candidateInformation = await analyzeResultsHasData(HTMLText);
            const links = extractURL(candidateInformation)
            let row = { 
                    'site 1': filteredResults[0]?.url, 
                    'site 2': filteredResults[1]?.url,
                    'site 3': filteredResults[2]?.url,
                    'site 4': filteredResults[3]?.url,
                    'site 5': filteredResults[4]?.url,
                    'location': location,
                    'links': links,
                    'gpt response': candidateInformation
            }
            records.push(row)
            console.log(`Here's the HTML Text: ${HTMLText}`)
            console.log(candidateInformation);

        } catch (error) {
            console.error('An error occured:', error);
        }
        await sleep(5000);
    }  
    csvWriter.writeRecords(records)
        .then(() => {
            console.log('CSV file was written successfully');
        })
        .catch(error => {
            console.error('Error writing to CSV file', error);
        });
}

main();