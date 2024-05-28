import dotenv from 'dotenv';
import DDG from 'duck-duck-scrape';
import { JSDOM } from 'jsdom';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const location = 'mckinney texas'
const query = `${location} (election | candidate | elections | candidates) (filing | listing | filings | listings | list)`
const limit = 5
const model_name = 'gpt-3.5-turbo'

async function searchDDG(query, limit) {
    try {
        const response = await DDG.search(query);
        const results = response.results;
        const limitedResults = results.slice(0, limit);
        const urls = limitedResults.map(result => result.url);
        console.log(urls)
    } catch (error) {
        console.error('Error fetching results:', error);
    }
}

searchDDG(query, limit);

async function extractHTML(url) {

}

async function extractTextFromHTML(HTML) {

}

async function analyzeResults(results) {
    const completion = await openai.chat.completions.create({
        messages: [{role: 'system', content: 'You are a political researcher trying to find information on candidates running for local offices.'}],
        model: model_name
    });
}
