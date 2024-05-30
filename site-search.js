import dotenv from 'dotenv';
import OpenAI from 'openai';
import DDG from 'duck-duck-scrape';
import unfluff from 'unfluff';
import fs from 'fs';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI(OPENAI_API_KEY);
const model_name = 'gpt-3.5-turbo';

async function searchDDG(query, limit) {
    try {
        const response = await DDG.search(query);
        const results = response.results;
        const limitedResults = results.slice(0, limit);
        const urls = limitedResults.map(result => result.url);
        return limitedResults;
    } catch (error) {
        console.error('Error fetching results:', error);
        return [];
    }
}

async function fetchHTML(url) {
    let response;
    let failContainer = [];
    
    try {
        response = await fetch(url);
    } catch (error) {
        failContainer.push({res:response?.status,url:url});
    }
    if (response.status > 399) {
        failContainer.push({res:response?.status,url:url});
    }
    const contentType = response.headers.get('content-type');
    if (!contentType.includes('text/html')) {
        failContainer.push({res:response?.status,url:url,contentType:contentType});
    }
    fs.writeFileSync('./failcontainer.json',JSON.stringify(failContainer));
    return response.text();
}

async function extractTextFromHTML(urls) {
    const texts = [];
    let number = 1
    for (const url of urls) {
        try {
            const html = await fetchHTML(url);
            const data = unfluff(html, 'en');
            texts.push(`Website ${number}: ${data.text}`);
        } catch (error) {
            throw new Error(`Error extracting text from HTML. Site Number: ${number}. Message:${error.message}`);
        }
        number++;
    }
    return texts;
}

async function analyzeResults(results, location) {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const openai = new OpenAI(OPENAI_API_KEY);
    const model_name = 'gpt-3.5-turbo';
    const completion = await openai.chat.completions.create({
        model: model_name,
        messages: [
            { role: 'system', content: 'You are a political researcher trying to identify candidates running for local offices based on the information passed to you.' },
            { role: 'user', content: `Analyze the extracted text from each of the five websites. Return all of the information on candidates running for local offices for ${location}. Office examples include school board member, sheriff, commissioner, mayor, councilmember, etc.` },
            { role: 'user', content: results.join('\n\n') }
        ],
    });
    return completion.choices[0].message.content;
}

async function analyzeResultsHasData(results) {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const openai = new OpenAI(OPENAI_API_KEY);
    const model_name = 'gpt-3.5-turbo';
    const completion = await openai.chat.completions.create({
        model: model_name,
        messages: [
            { role: 'system', content: 'You are a political researcher trying to identify candidates running for local offices based on the information passed to you.' },
            { role: 'user', content: 'Analyze the text from each of the 10 websites, and ' },
            { role: 'user', content: results.join('\n\n') }
        ],
    });
    return completion.choices[0].message.content;
}

export { analyzeResults, extractTextFromHTML, searchDDG };