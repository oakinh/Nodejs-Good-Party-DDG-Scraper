import fs from 'fs';
import readline from 'readline';

function usStateSwitch(str){
  var arr = [["Alabama","AL"],["Alaska","AK"],["Arizona","AZ"],["Arkansas","AR"],["California","CA"],["Colorado","CO"],["Connecticut","CT"],["Delaware","DE"],["District of Columbia","DC"],["District of Columbia","D.C."],["Florida","FL"],["Georgia","GA"],["Hawaii","HI"],["Idaho","ID"],["Illinois","IL"],["Indiana","IN"],["Iowa","IA"],["Kansas","KS"],["Kentucky","KY"],["Louisiana","LA"],["Maine","ME"],["Maryland","MD"],["Massachusetts","MA"],["Michigan","MI"],["Minnesota","MN"],["Mississippi","MS"],["Missouri","MO"],["Montana","MT"],["Nebraska","NE"],["Nevada","NV"],["New Hampshire","NH"],["New Jersey","NJ"],["New Mexico","NM"],["New York","NY"],["North Carolina","NC"],["North Dakota","ND"],["Ohio","OH"],["Oklahoma","OK"],["Oregon","OR"],["Pennsylvania","PA"],["Rhode Island","RI"],["South Carolina","SC"],["South Dakota","SD"],["Tennessee","TN"],["Texas","TX"],["Utah","UT"],["Vermont","VT"],["Virginia","VA"],["Washington","WA"],["West Virginia","WV"],["Wisconsin","WI"],["Wyoming","WY"],["American Samoa","AS"],["Guam","GU"],["Northern Mariana Islands","MP"],["Puerto Rico","PR"],["U.S. Virgin Islands","VI"],["U.S. Minor Outlying Islands","UM"],["Micronesia","FM"],["Marshall Islands","MH"],["Palau","PW"]];
  for(var i=0; i<arr.length; i++){
    if(str == arr[i][0] || str == arr[i][1]){
      return str.length > 2 ? arr[i][1] : arr[i][0];
    }
  }
}

function parseCSV(filepath){
    var header = 'createdAt,updatedAt,id,slug,name,state,data'.split(/,/);
    let file = fs.readFileSync(filepath, { encoding: 'utf8', flag: 'r' })
    let table = file.split(/[\r\n]+/).map(row=> row.split(/[,](?=(?:[^\"]|\"[^\"]*\")*$)/))
    table.shift();
    let data = table.map((row)=> {
      return row.map((cell,i)=> {
        return {[header[i]]:cell}
      }).reduce((a,b)=> ({...a,...b}))
    });
    return data
  }


function filterSearchResults(results,query){
  var {state,stateFullName,county,keyword} = query;
  console.log(`Results passed to filter: ${JSON.stringify({results:results,query:query})}`);
  fs.writeFileSync('searchResults-test-SC.json', JSON.stringify({results:results,query:query}));

  return results.filter(r=> {
    return !/wikip/i.test(r.url)
    &&
    (
      new RegExp(`\\b${state}\\b|${stateFullName}`,'i').test(r.title)
      ||
      new RegExp(`\\b${state}\\b|${stateFullName}`,'i').test(r.description)
    )
    &&
    (
      new RegExp(`${county}`,'i').test(r.title)
      ||
      new RegExp(`${county}`,'i').test(r.description)
    )
    &&
    (
      keyword ? (
        new RegExp(`${keyword}`,'i').test(r.title)
        ||
        new RegExp(`${keyword}`,'i').test(r.description)
      ) : true
    )
  })
}


export { parseCSV, usStateSwitch, filterSearchResults }
