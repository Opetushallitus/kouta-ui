const puppeteer = require('puppeteer');

let timeout = 10000;
let browser;
let page;
let host = 'http://localhost:' + process.env.PORT + '/kouta';
let backend = 'http://localhost:' + process.env.REACT_APP_BACKEND_PORT + '/kouta-backend';

console.log('Using host: ' + host);
console.log('Using backend: ' + backend);

function response(json) { return {
    status: 200,
    contentType: 'application/json',
    headers: {"Access-Control-Allow-Origin": "*"},
    body: JSON.stringify(json)}
}

beforeAll(async () => {
    browser = await puppeteer.launch(
        {args: ['--no-sandbox']}
        /*{dumpio: true}*/ //Uncomment to see what happens
    );
    page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', request => {
        // console.log(request.url())
        if (request.url().startsWith(backend + '/healthcheck')) {
            request.respond(response({message: "ok"}));
        } else {
            request.continue();
        }
    });
}, timeout);

afterAll(async () => {
    await browser.close();
}, timeout);

describe('TarjontaMain', () => {
    beforeEach(async () => {
        await page.goto(host);
    }, timeout);

    it('renders', async () => {
        expect.assertions(1);
        await page.waitForSelector('h6');
        expect(await page.$eval('h6', e => e.innerHTML)).toBe('ok');
    }, timeout);
});
