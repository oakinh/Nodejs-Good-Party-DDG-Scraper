import axios from "axios"
import { HttpsProxyAgent } from "hpagent";
import JSDOM from "JSDOM";

const url = 'https://duckduckgo.com';
// const proxyAgent = new HttpsProxyAgent(
//   'https://user-sp2jidpail-sessionduration-30:8Tck1PVy1ubNff6e~b@us.smartproxy.com:10001');

const proxyURL = new URL('https://user-sp2jidpail-sessionduration-30:8Tck1PVy1ubNff6e~b@us.smartproxy.com:10001')

const keywords = "Mckinney, Texas".replace(/\s+/g,'+')

const payload = {

  q: keywords,
};

axios
  .get(url, {
        host: proxyURL.hostname,
        port: proxyURL.port,
        auth: {
            username: proxyURL.username,
            password: proxyURL.password,
        },
        payload: payload,
  })
  .then((response) => {
    console.log(response.data);
  });

//   axios
//   .request({url, "GET", {
//         host: proxyURL.hostname,
//         port: proxyURL.port,
//         auth: {
//             username: proxyURL.username,
//             password: proxyURL.password,
//         }
//   }})
//   .then((response) => {
//     console.log(response.data);
//   });