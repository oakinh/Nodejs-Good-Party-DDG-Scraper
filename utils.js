// The code in this file, utils.js, is credited entirely to Andre Bradshaw

import { HttpsProxyAgent } from 'https-proxy-agent';
import fs from 'fs';

const hex_hsh = {/* your hex_hsh object */};
const html_hsh = {/* your html_hsh object */};

const unicodeHexCleanse = (t) => t.replace(/&#x\w{2,4};/g, m => hex_hsh[/(?<=&#x)\w{2,4}(?=;)/.exec(m)[0]]);
const htmlEntityCleanse = (t) => t.replace(/&\w{2,8}?;/g, m => html_hsh[m]);
const htmlTagCleanse = (t) => t.replace(/<\w+>|<\/\w+>/g, '');

const cleanObject = (ob) => Object.entries(ob).reduce((r, [k, v]) => {
    if (v != null && v != undefined && v !== "" && (['string', 'number', 'boolean', 'function', 'symbol'].some(opt => typeof v == opt) || (typeof v == 'object' && ((Array.isArray(v) && v.length) || (Array.isArray(v) != true))))) {
        r[k] = v;
        return r;
    } else {
        return r;
    }
}, {});

const fetchText = async (url, obj) => {
    try {
        var res = await fetch(url, obj);
        return await res.text();
    } catch (err) {
        return null;
    }
};

const remapDuckObject = (ob) => cleanObject({
    url: ob?.u,
    title: ob?.t,
    description: ob?.a,
    created_at: ob?.e,
    timestamp: ob?.e ? new Date(ob?.e).getTime() : null,
    hostname: ob?.i,
});

const duckduck = async (params) => {
    var { keywords, lang_iso_2, country_iso_2, host_region, proxy_agent } = params;
    var vqd_text = await fetchText(`https://duckduckgo.com/?t=h_&q=${encodeURIComponent(keywords)}&ia=web`, proxy_agent);
    var vqd = /(?<=vqd[="]+)[\d-]+/.exec(vqd_text)?.[0];
    var text = await fetchText(`https://links.duckduckgo.com/d.js?q=${keywords.replace(/\s+/g, '+')}&l=${lang_iso_2 && country_iso_2 ? country_iso_2 + '-' + lang_iso_2 : 'us-en'}&p=&s=0&a=h_&ex=-1&dl=${lang_iso_2 || 'en'}&ct=${country_iso_2 ? country_iso_2.toUpperCase() : 'US'}&sp=0&vqd=${vqd}&host_region=${host_region || 'usc'}&bccaexp=b&biaexp=b&btaaexp=b&litexp=b&msvrtexp=b&product_ad_extensions_exp=b&bpa=1&baa=1&wrap=1`.replace(/\t|\n|\s/g, ''), proxy_agent);
    var results = JSON.parse(/(?<=DDG.pageLayout.load\('d',).+?\](?=\);)/.exec(htmlEntityCleanse(unicodeHexCleanse(htmlTagCleanse(text))))?.[0]).map(ob => remapDuckObject(ob));
    return results.filter(r => r.url);
};

const subArr = (r, n) => r.reduceRight((a, b, c, d) => [...a, d.splice(0, n)], []);

const shallowLoopSearches = async (searches, proxy_threshold, smartproxy_list) => {
    var start_time = new Date().getTime();
    var switch_threshold = 0;
    var search_results_container = [];
    for (let i = 0; i < searches.length; i++) {
        let proxyAgent = new HttpsProxyAgent(smartproxy_list[switch_threshold].proxy);
        let results = await duckduck({
            ...searches[i],
            ...smartproxy_list[switch_threshold],
            ...{
                proxy_agent: { agent: proxyAgent }
            },
        });
        search_results_container.push({ ...searches, ...results });
        if (switch_threshold >= proxy_threshold) {
            switch_threshold = 0;
        } else {
            switch_threshold = switch_threshold + 1;
        }
    }
    var duration_seconds = Math.floor((new Date().getTime() - start_time) / 1000);
    return { duration_seconds, search_results_container };
};

const loopThroughSearches = async (searches, smartproxy_list) => {
    let { duration_seconds, search_results_container } = await shallowLoopSearches(searches, smartproxy_list.length, smartproxy_list);
    console.log(`completed in ${duration_seconds} seconds`);
    console.log(search_results_container);
    return search_results_container;
};

export {
    unicodeHexCleanse,
    htmlEntityCleanse,
    htmlTagCleanse,
    cleanObject,
    fetchText,
    remapDuckObject,
    duckduck,
    subArr,
    shallowLoopSearches,
    loopThroughSearches
};