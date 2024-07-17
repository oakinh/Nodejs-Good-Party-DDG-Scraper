import dotenv from 'dotenv';
dotenv.config();

const proxies = process.env.PROXIES.split(',');

const smartproxy_list = [
    { "proxy": proxies[0], "country_iso_2": "", "lang_iso_2": "", "host_region": "" },
    { "proxy": proxies[1], "country_iso_2": "", "lang_iso_2": "", "host_region": "" },
    { "proxy": proxies[2], "country_iso_2": "", "lang_iso_2": "", "host_region": "" },
    { "proxy": proxies[3], "country_iso_2": "", "lang_iso_2": "", "host_region": "" },
    { "proxy": proxies[4], "country_iso_2": "", "lang_iso_2": "", "host_region": "" },
    { "proxy": proxies[5], "country_iso_2": "", "lang_iso_2": "", "host_region": "" },
    { "proxy": proxies[6], "country_iso_2": "", "lang_iso_2": "", "host_region": "" },
    { "proxy": proxies[7], "country_iso_2": "", "lang_iso_2": "", "host_region": "" },
    { "proxy": proxies[8], "country_iso_2": "", "lang_iso_2": "", "host_region": "" },
    { "proxy": proxies[9], "country_iso_2": "", "lang_iso_2": "", "host_region": "" }
];

export { smartproxy_list };