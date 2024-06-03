import { JSDOM } from 'jsdom';
import { fetchHTML } from './site-search.js';


const links = ['https://candidates.sos.mn.gov/CandidateFilingResults.aspx?county=0&municipality=0&schooldistrict=0&hospitaldistrict=0&level=1&party=0&federal=True&judicial=False&executive=True&senate=True&representative=True&title=&office=0&candidateid=0', 'https://www.richlandcountysc.gov/Government/Departments/Government-and-Community-Services/Elected-Officials-and-Local-Municipalities' ];

for (const link of links) {
    const HTML = await fetchHTML(link);
    const dom = new JSDOM(HTML);
    const document = dom.window.document
    const table = document.querySelector('table');
    console.log('Table: ', table);
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
    })
    console.log(tableData);
}

