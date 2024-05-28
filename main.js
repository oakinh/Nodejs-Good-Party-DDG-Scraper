import dotenv from 'dotenv';
import { searchDDG, extractTextFromHTML, analyzeResults } from './site-search.js';

dotenv.config();

const location = 'mckinney texas';
const query = `${location} (election | candidate | elections | candidates) (filing | listing | filings | listings | list)`;
const limit = 5;


async function main() {
    try {
        const searchResultsURL = await searchDDG(query, limit);
        const HTMLText = await extractTextFromHTML(searchResultsURL);
        const candidateInformation = await analyzeResults(HTMLText, location);
        console.log(candidateInformation);
    } catch (error) {
        console.error('An error occured:', error);
    }
    
}

main();