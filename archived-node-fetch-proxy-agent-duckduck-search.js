import fs from 'fs';
import { HttpsProxyAgent } from 'https-proxy-agent';


var hex_hsh = {"10":"►","11":"◄","12":"↕","13":"‼","14":"¶","15":"§","16":"▬","17":"↨","18":"↑","19":"↓","20":"","21":"!","22":"\\\"","23":"#","24":"$","25":"%","26":"&","27":"'","28":"(","29":")","30":"0","31":"1","32":"2","33":"3","34":"4","35":"5","36":"6","37":"7","38":"8","39":"9","40":"@","41":"A","42":"B","43":"C","44":"D","45":"E","46":"F","47":"G","48":"H","49":"I","50":"P","51":"Q","52":"R","53":"S","54":"T","55":"U","56":"V","57":"W","58":"X","59":"Y","80":"Ç","81":"ü","82":"é","83":"â","84":"ä","85":"à","86":"å","87":"ç","88":"ê","89":"ë","90":"É","91":"æ","92":"Æ","93":"ô","94":"ö","95":"ò","96":"û","97":"ù","98":"ÿ","99":"Ö","01":"☺","02":"☻","03":"♥","04":"♦","05":"♣","06":"♠","07":"•","08":"◘","09":"○","0A":"◙","0B":"♂","0C":"♀","0D":"♪","0E":"♫","0F":"☼","1A":"→","1B":"←","1C":"∟","1D":"↔","1E":"▲","1F":"▼","2A":"*","2B":"+","2C":",","2D":"-","2E":".","2F":"/","3A":":","3B":";","3C":"<","3D":"=","3E":">","3F":"?","4A":"J","4B":"K","4C":"L","4D":"M","4E":"N","4F":"O","5A":"Z","5B":"[","5C":"","5D":"]","5E":"^","5F":"_","7B":"{","7C":"|","7D":"}","7E":"~","7F":"⌂","8A":"è","8B":"ï","8C":"î","8D":"ì","8E":"Ä","8F":"Å","9A":"Ü","9B":"¢","9C":"£","9D":"¥","9E":"₧","9F":"ƒ","A0":"á","A1":"í","A2":"ó","A3":"ú","A4":"ñ","A5":"Ñ","A6":"ª","A7":"º","A8":"¿","A9":"⌐","AA":"¬","AB":"½","AC":"¼","AD":"¡","AE":"«","AF":"»","B0":"░","B1":"▒","B2":"▓","B3":"│","B4":"┤","B5":"╡","B6":"╢","B7":"╖","B8":"╕","B9":"╣","BA":"║","BB":"╗","BC":"╝","BD":"╜","BE":"╛","BF":"┐","C0":"└","C1":"┴","C2":"┬","C3":"├","C4":"─","C5":"┼","C6":"╞","C7":"╟","C8":"╚","C9":"╔","CA":"╩","CB":"╦","CC":"╠","CD":"═","CE":"╬","CF":"╧","D0":"╨","D1":"╤","D2":"╥","D3":"╙","D4":"╘","D5":"╒","D6":"╓","D7":"╫","D8":"╪","D9":"┘","DA":"┌","DB":"█","DC":"▄","DD":"▌","DE":"▐","DF":"▀","E0":"α","E1":"ß","E2":"Γ","E3":"π","E4":"Σ","E5":"σ","E6":"µ","E7":"τ","E8":"Φ","E9":"Θ","EA":"Ω","EB":"δ","EC":"∞","ED":"φ","EE":"ε","EF":"∩","F0":"≡","F1":"±","F2":"≥","F3":"≤","F4":"⌠","F5":"⌡","F6":"÷","F7":"≈","F8":"°","F9":"∙","FA":"·","FB":"√","FC":"ⁿ","FD":"²","FE":"■","60":"`"};

var html_hsh = { "&amp;":"&", "&lt;":"<", "&gt;":">", "&forall;":"∀", "&part;":"∂", "&exist;":"∃", "&empty;":"∅", "&nabla;":"∇", "&isin;":"∈", "&notin;":"∉", "&ni;":"∋", "&prod;":"∏", "&sum;":"∑", "&minus;":"−", "&lowast;":"∗", "&radic;":"√", "&prop;":"∝", "&infin;":"∞", "&ang;":"∠", "&and;":"∧", "&or;":"∨", "&cap;":"∩", "&cup;":"∪", "&int;":"∫", "&there4;":"∴", "&sim;":"∼", "&cong;":"≅", "&asymp;":"≈", "&ne;":"≠", "&equiv;":"≡", "&le;":"≤", "&ge;":"≥", "&sub;":"⊂", "&sup;":"⊃", "&nsub;":"⊄", "&sube;":"⊆", "&supe;":"⊇", "&oplus;":"⊕", "&otimes;":"⊗", "&perp;":"⊥", "&sdot;":"⋅", "&iexcl;":"¡", "&cent;":"¢", "&pound;":"£", "&curren;":"¤", "&yen;":"¥", "&brvbar;":"¦", "&sect;":"§", "&uml;":"¨", "&copy;":"©", "&ordf;":"ª", "&laquo;":"«", "&not;":"¬", "&shy;":"­", "&reg;":"®", "&macr;":"¯", "&deg;":"°", "&plusmn;":"±", "&sup2;":"²", "&sup3;":"³", "&micro;":"µ", "&para;":"¶", "&cedil;":"¸", "&sup1;":"¹", "&ordm;":"º", "&raquo;":"»", "&frac14;":"¼", "&frac12;":"½", "&frac34;":"¾", "&iquest;":"¿", "&times;":"×", "&divide;":"÷", "&Alpha;":"Α", "&Beta;":"Β", "&Gamma;":"Γ", "&Delta;":"Δ", "&Epsilon;":"Ε", "&Zeta;":"Ζ", "&Eta;":"Η", "&Theta;":"Θ", "&Iota;":"Ι", "&Kappa;":"Κ", "&Lambda;":"Λ", "&Mu;":"Μ", "&Nu;":"Ν", "&Xi;":"Ξ", "&Omicron;":"Ο", "&Pi;":"Π", "&Rho;":"Ρ", "&Sigma;":"Σ", "&Tau;":"Τ", "&Upsilon;":"Υ", "&Phi;":"Φ", "&Chi;":"Χ", "&Psi;":"Ψ", "&Omega;":"Ω", "&alpha;":"α", "&beta;":"β", "&gamma;":"γ", "&delta;":"δ", "&epsilon;":"ε", "&zeta;":"ζ", "&eta;":"η", "&theta;":"θ", "&iota;":"ι", "&kappa;":"κ", "&lambda;":"λ", "&mu;":"μ", "&nu;":"ν", "&xi;":"ξ", "&omicron;":"ο", "&pi;":"π", "&rho;":"ρ", "&sigmaf;":"ς", "&sigma;":"σ", "&tau;":"τ", "&upsilon;":"υ", "&phi;":"φ", "&chi;":"χ", "&psi;":"ψ", "&omega;":"ω", "&thetasym;":"ϑ", "&upsih;":"ϒ", "&piv;":"ϖ", "&OElig;":"Œ", "&oelig;":"œ", "&Scaron;":"Š", "&scaron;":"š", "&Yuml;":"Ÿ", "&fnof;":"ƒ", "&circ;":"ˆ", "&tilde;":"˜", "&ensp;":" ", "&emsp;":" ", "&thinsp;":" ", "&zwnj;":"‌", "&zwj;":"‍", "&ndash;":"–", "&mdash;":"—", "&lsquo;":"‘", "&rsquo;":"’", "&sbquo;":"‚", "&ldquo;":"“", "&rdquo;":"”", "&bdquo;":"„", "&dagger;":"†", "&Dagger;":"‡", "&bull;":"•", "&hellip;":"…", "&permil;":"‰", "&prime;":"′", "&Prime;":"″", "&lsaquo;":"‹", "&rsaquo;":"›", "&oline;":"‾", "&euro;":"€", "&trade;":"™", "&larr;":"←", "&uarr;":"↑", "&rarr;":"→", "&darr;":"↓", "&harr;":"↔", "&crarr;":"↵", "&lceil;":"⌈", "&rceil;":"⌉", "&lfloor;":"⌊", "&rfloor;":"⌋", "&loz;":"◊", "&spades;":"♠", "&clubs;":"♣", "&hearts;":"♥", "&diams;":"♦", "&quot;":"\\\"", "&apos;":"'", "&nbsp;":" "};


var unicodeHexCleanse = (t)=> t.replace(/&#x\w{2,4};/g, m=> hex_hsh[/(?<=&#x)\w{2,4}(?=;)/.exec(m)[0]]);
var htmlEntityCleanse = (t)=> t.replace(/&\w{2,8}?;/g, m=> html_hsh[m]);
var htmlTagCleanse = (t)=> t.replace(/<\w+>|<\/\w+>/g,'');
var cleanObject = (ob) => 
    Object.entries(ob).reduce((r, [k, v]) => {
        if( v != null && v != undefined && v !== "" && ( ['string','number','boolean','function','symbol'].some(opt=> typeof v == opt) || (typeof v == 'object' && ((Array.isArray(v) && v.length) || (Array.isArray(v) != true) ) ) ) ) { 
            r[k] = v; 
            return r;
        } else { 
            return r; 
        }
    }, {});
async function fetchText(url,obj){
    try{
        var res = await fetch(url,obj);
        // console.log(res.headers);
        return await res.text();
    } catch(err){
        return null;
    }
}
function remapDuckObject(ob){
    return cleanObject({
        url:ob?.u,
        title:ob?.t,
        description:ob?.a,
        created_at:ob?.e,
        timestamp:ob?.e ? new Date(ob?.e).getTime() : null,
        hostname:ob?.i,
    })

}
/*
from australia IP

https://links.duckduckgo.com/d.js?q=lafayette%20ga%20election&l=au-en&p=&s=29&a=h_&ex=-1&dl=en&ct=AU&sp=0&vqd=4-18767350920882136949889640524153505831&host_region=aue&biaexp=b&eclsexp=b&litexp=a&msvrtexp=b&product_ad_extensions_exp=b&bpa=1&wrap=1
*/
async function duckduck(params){//&s= index of search results.
    var {keywords,lang_iso_2,country_iso_2,host_region,proxy_agent} =params;
    var vqd_text = await fetchText(`https://duckduckgo.com/?t=h_&q=${encodeURIComponent(keywords)}&ia=web`,proxy_agent);
    var vqd = /(?<=vqd[="]+)[\d-]+/.exec(vqd_text)?.[0];
    console.log(vqd);
    var text = await fetchText(`https://links.duckduckgo.com/d.js?
    q=${keywords.replace(/\s+/g,'+')}
    &l=${lang_iso_2 && country_iso_2 ? country_iso_2+'-'+lang_iso_2 : 'us-en'}
    &p=
    &s=0
    &a=h_
    &ex=-1
    &dl=${lang_iso_2 || 'en'}
    &ct=${country_iso_2 ? country_iso_2.toUpperCase() : 'US'}
    &sp=0
    &vqd=${vqd}
    &host_region=${host_region || 'usc'}
    &bccaexp=b
    &biaexp=b
    &btaaexp=b
    &litexp=b
    &msvrtexp=b
    &product_ad_extensions_exp=b
    &bpa=1
    &baa=1
    &wrap=1`.replace(/\t|\n|\s/g,''),proxy_agent);
    var results = JSON.parse(/(?<=DDG.pageLayout.load\('d',).+?\](?=\);)/.exec(htmlEntityCleanse(unicodeHexCleanse(htmlTagCleanse(text))))?.[0]).map(ob=> remapDuckObject(ob));
    // console.log(results);
    // console.log(results.length);
    // console.log(vqd);
    return results.filter(r => r.url)
}


/*usc == central US, use == eastern US, usw == western US*/



var subArr = (r, n) => r.reduceRight((a,b,c,d) => [...a, d.splice(0,n)],[]);

var search_results_container = []
async function shallowLoopSearches(searches,proxy_threshold){
    var start_time = new Date().getTime()
    var switch_threshold = 0;
    for(let i=0; i<searches.length; i++){        
        let proxyAgent = new HttpsProxyAgent(smartproxy_list[switch_threshold].proxy);
        let results = await duckduck({
            ...searches[i],
            ...smartproxy_list[switch_threshold],
            ...{
                proxy_agent:{ agent: proxyAgent }
            },
        });
        search_results_container.push({...searches,...results})
        console.log(results)
        if(switch_threshold >= proxy_threshold){
            switch_threshold = 0;
        }else{
            switch_threshold = switch_threshold+1;
        }
    }
    return (Math.floor((new Date().getTime() - start_time)/1000));
}
async function loopThroughSearches(searches){
    /*
        distribute searches over proxies for switching.
    */
    // var max_searches_per_proxy = 4;
    // var search_blocks = subArr(searches, max_searches_per_proxy);
    /* 
        takes a shallow array of search strings ['','','','','','','',''] 
        and chops them up into an array containing sub arrays with x number of strings [['','','','',''],['','','']]
    */


    // for(let i=0; i<search_blocks.length; i++){
        let duration_seconds = await shallowLoopSearches(searches, smartproxy_list.length);
        console.log(`completed in ${duration_seconds} seconds`);
    //}
console.log(search_results_container)
}

loopThroughSearches([
    {keywords: "dunwoody ga 2024 ballot"},
])
// loopThroughSearches()

// async function tester(){
//     var proxy_url = "https://sp2jidpail:8Tck1PVy1ubNff6e~b@gate.smartproxy.com:10001";
//     var proxyAgent = new HttpsProxyAgent(proxy_url);
//     var res =await fetch('https://api.ipify.org?format=json', { agent: proxyAgent });
//     var text = await res.text();
//     console.log(text);
// }
// tester()
// duckduck({
//     keywords:'lafayette ga 2024 ballot',
//     lang_iso_2:'en',
//     country_iso_2:'au',
//     host_region:'aue',
//     // proxy:
// })
/*
TODO:
associate proxy country/location with the links.duckduckgo request on 
`
    &l=us-en
    &dl=en
    &ct=US
`
Set up proxy:
// npm i https-proxy-agent

*/