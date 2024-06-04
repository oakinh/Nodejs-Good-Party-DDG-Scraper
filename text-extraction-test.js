import dotenv from 'dotenv';
import OpenAI from 'openai';
import DDG from 'duck-duck-scrape';
import unfluff from 'unfluff';
import fs from 'fs';
import { JSDOM } from 'jsdom';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI(OPENAI_API_KEY);
const model_name = 'gpt-4o';

async function searchDDG(query, limit) {
    try {
        const response = await DDG.search(query);
        const results = response.results;
        const limitedResults = results.slice(0, limit);
        const urls = limitedResults.map(result => result.url);
        return urls;
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

async function extractTable(dom) {
    try {
        const document = dom.window.document
        const table = document.querySelector('table');
        const tbody = table.querySelector('tbody');
        const rows = tbody.querySelectorAll('tr');
        let tableData = [];

        rows.forEach(row => {
            let rowData = [];
            const cells = row.querySelectorAll('td, th');
            cells.forEach(cell => {
                rowData.push(cell.textContent.trim());
            });
            tableData.push(rowData);   
    });
        return tableData
    } catch (error) {
        console.error("\n~~~~~~\n Table wasn't found or couldn't be extracted. \n~~~~~~\n.", error.message)
        return [];
    }   
}

function cleanText(text) {
    return text.replace(/\s+/g, ' ').trim();
}


async function extractTextFromHTML(urls) {
    const texts = [];
    let number = 1;

    for (const url of urls) {
        try {
            const html = await fetchHTML(url);
            const dom = new JSDOM(html);
            const document = dom.window.document;

            const unwantedElements = document.querySelectorAll('script, style, noscript, iframe, object, embed');
            unwantedElements.forEach(el => el.remove());

            let textContent = '';
            const elements = document.querySelectorAll('p, div, span, h1, h2, h3, h4, h5, h6, li');
            elements.forEach(el => {
                textContent += el.textContent.trim() + ' ';
            });

            const text = textContent.trim();
            const cleanedText = cleanText(textContent);

            const table = await extractTable(dom);

            texts.push(`Website ${number} - URL: ${url} \n Text: ${cleanedText}\nTable: ${table}`);
            texts.push('\n ~~~~~~~~~~~~~~~~~~ \n');
            number++;
        } catch (error) {
            console.error(`Error extracting text from HTML. Site Number: ${number}. URL: ${url}. Message: ${error.message}`);
            texts.push(`Error extracting text from HTML. Site Number: ${number}. URL: ${url}. Message: ${error.message}`);
            texts.push('\n ~~~~~~~~~~~~~~~~~~ \n');
            number++;
        }
    }
    return texts;
}

async function extractTextCheerio(urls) {
    for (const url in urls) {

    }
}

async function run() {
    const urls = [
        'https://www.nvsos.gov/sos/elections/election-information/2024-election-information',
        'https://www.elkocountynv.net/departments/clerk/new_page.php',
        'https://www.landercountynv.org/government/clerk/election_information.php',
        'https://cms7files.revize.com/pershingcountynv/document_center/Government/Clerk-Treasurer/elections/2024/2024-03-05-notice-of-primary.pdf',
        'https://churchillcountynv.gov/115/Elections']
    const text = await extractTextFromHTML(urls)

    console.log(text)
}

run()