import axios from "axios"
import { HttpsProxyAgent } from "hpagent";

const url = 'https://duckduckgo.com';
// const proxyAgent = new HttpsProxyAgent(
//   'https://user-sp2jidpail-sessionduration-30:8Tck1PVy1ubNff6e~b@us.smartproxy.com:10001');

const proxyURL = new URL('https://user-sp2jidpail-sessionduration-30:8Tck1PVy1ubNff6e~b@us.smartproxy.com:10001')

axios
  .get(url, {
        host: proxyURL.hostname,
        port: proxyURL.port,
        auth: {
            username: proxyURL.username,
            password: proxyURL.password,
        }
  })
  .then((response) => {
    console.log(response.data);
  });