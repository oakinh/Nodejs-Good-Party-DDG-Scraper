import dotenv from 'dotenv';
dotenv.config();
import { extractTextFromHTML, analyzeResults, analyzeResultsHasData, extractURL } from './site-search.js';
import { parseCSV, usStateSwitch, filterSearchResults } from './data-prep.js';
import fs from 'fs';
import { sleep } from './sleep.js';
import { createObjectCsvWriter } from 'csv-writer';
import async from 'async';
import { smartproxy_list } from './config.js';
import { loopThroughSearches } from './utils.js';



const locations = parseCSV('./municipality-prepped.csv')?.filter(r=> /\bUT/i.test(r.state))?.slice(0, 3);
console.log('Locations here:', locations)
console.log(locations.length);
const limit = 10;


const csvWriter = createObjectCsvWriter ({
    path: 'output.csv',
    header: [
        { id: 'site 1', title: 'Site 1' },
        { id: 'site 2', title: 'Site 2' },
        { id: 'site 3', title: 'Site 3' },
        { id: 'site 4', title: 'Site 4' },
        { id: 'site 5', title: 'Site 5' },
        { id: 'site 6', title: 'Site 6' },
        { id: 'site 7', title: 'Site 7' },
        { id: 'site 8', title: 'Site 8' },
        { id: 'site 9', title: 'Site 9' },
        { id: 'site 10', title: 'Site 10' },
        { id: 'location', title: 'Location' },
        { id: 'links', title: 'Links' },
        { id: 'gpt response', title: 'GPT Response' }
    ]
});


async function main() {
    console.log('Main function started');
    let records = [];

    for (const location of locations) {
        try {
            console.log(`Processing location: ${location.name}, ${location.state}`)
            const stateFullName = usStateSwitch(location.state);
            const locationClean = `${location.name} county ${location.state}`;
            const query = `${locationClean} local (election | candidate | elections | candidates) (filing | listing | filings | listings | list) 2024`;
            console.log(`Query: ${query}`)
            
            const searchResults = await loopThroughSearches([
                { keywords: query },
            ], smartproxy_list);

            const resultsArray = [];
            for await (const result of searchResults) {
                resultsArray.push(result);
            }
            console.log('Search Results:', searchResults)
            
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
                    'site 6': filteredResults[5]?.url, 
                    'site 7': filteredResults[6]?.url,
                    'site 8': filteredResults[7]?.url,
                    'site 9': filteredResults[8]?.url,
                    'site 10': filteredResults[9]?.url,
                    'location': locationClean,
                    'links': links,
                    'gpt response': candidateInformation
            }
            records.push(row)
            console.log(`Here's the HTML Text: ${HTMLText}`)
            console.log(candidateInformation);

        } catch (error) {
            console.error('An error occured:', error);
        }
        // const sleepTime = Math.floor(Math.random() * 2000) + 1000; // Random between 1000ms (1s) and 3000ms (3s)
        // await sleep(sleepTime);
    }  
    csvWriter.writeRecords(records)
        .then(() => {
            console.log('CSV file was written successfully');
        })
        .catch(error => {
            console.error('Error writing to CSV file', error);
        });
        console.log('Main function ended');
}


main();