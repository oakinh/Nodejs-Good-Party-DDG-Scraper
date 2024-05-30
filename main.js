import dotenv from 'dotenv';
import { searchDDG, extractTextFromHTML, analyzeResults, analyzeResultsHasData } from './site-search.js';
import { parseCSV, usStateSwitch, filterSearchResults } from './data-prep.js';
import fs from 'fs';
import { sleep } from './sleep.js';

dotenv.config();

const locations = parseCSV('./county.csv')?.filter(r=> /\bSC/i.test(r.state))?.slice(0, 1);
console.log(locations.length);
const limit = 5;


async function main() {
    for (const location of locations) {
        try {
            const stateFullName = usStateSwitch(location.state);
            const locationClean = `${location.name} county ${location.state}`;
            const query = `${locationClean} local (election | candidate | elections | candidates) (filing | listing | filings | listings | list) 2024`;
            const searchResultsURL = await searchDDG(query, limit);
            // const queryObj = {state:location.state,stateFullName:stateFullName,county:location.name}
            // const filteredResults = filterSearchResults(searchResults, queryObj);
            const HTMLText = await extractTextFromHTML(searchResultsURL);
            // const candidateInformation = await analyzeResultsHasData(HTMLText);
            console.log(`Here's the HTML Text: ${HTMLText}`)
            // console.log(candidateInformation);
        } catch (error) {
            console.error('An error occured:', error);
        }
        await sleep(5000);
    }  
}

main();