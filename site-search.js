import dotenv from 'dotenv';
dotenv.config();
import OpenAI from 'openai';
import DDG from 'duck-duck-scrape';
import unfluff from 'unfluff';
import fs from 'fs';
import { JSDOM } from 'jsdom';
import puppeteer from 'puppeteer';




const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI(OPENAI_API_KEY);
const model_name = 'gpt-4o';

// const proxies = process.env.PROXIES.split(',');

// function getRandomProxy(proxies) {
//     const randomIndex = Math.floor(Math.random() * proxies.length);
//     let selectedProxy = proxies[randomIndex]
//     console.log(selectedProxy)
//     return selectedProxy;
// }

// const proxyURL = getRandomProxy(proxies);


// async function searchDDG(query, limit) {
//     try {
//         if (!proxyURL) {
//             throw new Error('Proxy URL is not defined');
//         }

//         const needleOptions = {
//             proxy: proxyURL,
//             headers: {
//                 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
//             }
//         };

//         console.log('Needle options:', needleOptions);

//         const response = await DDG.search(query, {}, needleOptions);
//         console.log('DDG response:', response);
//         const results = response.results;
//         if (!results) {
//             console.log('No results found');
//             return [];
//         }
//         const limitedResultsObj = results.slice(0, limit);
//         // const urls = limitedResults.map(result => result.url);
//         return limitedResultsObj;
//     } catch (error) {
//         console.error('Error fetching results:', error.message);
//         console.error(error.response ? error.response.body : error)
//         return [];
//     }
// }

async function fetchHTML(url) {
    let response;
    let failContainer = [];
    
    try {
        response = await fetch(url);
    } catch (error) {
        failContainer.push({res:response?.status,url:url});
        console.log(response.status, url)
    }
    if (response.status > 399) {
        failContainer.push({res:response?.status,url:url});
        console.log(response.status, url)
    }
    const contentType = response.headers.get('content-type');
    if (!contentType.includes('text/html')) {
        failContainer.push({res:response?.status,url:url,contentType:contentType});
        console.log(response.status, url, contentType)
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
    }
}

// ^ To do: Extract multiple tables
// To do: Explore using Puppeteer instead of fetch
// To do: Write output sooner, not just at the end

async function extractTextFromHTML(urls) {
    const texts = [];
    let number = 1;
    let dom;
    let data; 
    for (const url of urls) {
        try {
            const html = await fetchHTML(url);
            data = unfluff(html, 'en');
            dom = new JSDOM(html);
        } catch (error) {
            throw new Error(`Error extracting text from HTML. Site Number: ${number}. URL: ${url} Message:${error.message}`);
        }
        const table = await extractTable(dom);
        texts.push(`Website ${number} - URL: ${url} Title: ${data.title}. Text: ${data.text} \n Table: ${table}`);
        texts.push('\n ~~~~~~~~~~~~~~~~~~ \n');
        number++;
    }
    return texts;
}

async function analyzeResults(results, location) {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const openai = new OpenAI(OPENAI_API_KEY);
    const model_name = 'gpt-4o';
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
    const model_name = 'gpt-4o';
    const completion = await openai.chat.completions.create({
        model: model_name,
        messages: [
            { role: 'system', content: 'You are a political researcher trying to identify candidates running for local offices based on the information passed to you.' },
            { role: 'user', content: 'Analyze the text from each of the websites, and return either the URL of the site that has data on local candidates running for office, or \'Not Found\' if none of them have that data. Office examples include but are not limited to: school board member, sheriff, commissioner, mayor, councilmember. If multiple results have the candidate data we\'re looking for, then return a maximum of 2 URLs. Don\'t return your explanation or extra text or extra links. Only return a maximum of 2 URLs. Nothing else.' },
            { role: 'user', content: results.join('\n\n') }
        ],
    });
    return completion.choices[0].message.content;
}

function extractURL(text) {
    const pattern = /https?:\/\/(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F])|[\/?:=&])+/g;
    const urls = text.match(pattern);
    return urls || [];
}

async function analyzeExtractURLs(dom) {
    const document = dom.window.document;
    const anchors = dom.window.document.querySelectorAll('a');

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const openai = new OpenAI(OPENAI_API_KEY);
    const model_name = 'gpt-4o';
    const completion = await openai.chat.completions.create({
        model: model_name,
        messages: [
            { role: 'system', content: 'You are a political researcher trying to identify candidates running for local offices based on the information passed to you.' },
            { role: 'user', content: 'Analyze the links I will pass to you. Please choose which of the links will most likely lead us to information on political candidates running for office. I will navigate to the link you choose and pass you more links until we find a list of political candidates running for local office in 2024.' },
            { role: 'user', content: results.join('\n\n') }
        ],
    });
    return completion.choices[0].message.content;
}



export { analyzeResults, extractTextFromHTML, analyzeResultsHasData, fetchHTML, extractTable, extractURL };