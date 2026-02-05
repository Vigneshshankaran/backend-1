const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

async function generatePDF(htmlContent) {
    let browser;
    try {
        const isProd = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
        
        const launchOptions = isProd 
            ? {
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
            }
            : {
                args: ['--no-sandbox', '--disable-setuid-sandbox'],
                executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', // Standard Windows path
                headless: 'new',
            };

        browser = await puppeteer.launch(launchOptions);
        const page = await browser.newPage();
        
        // Set viewport for consistent rendering
        await page.setViewport({ width: 1200, height: 800 });

        // Set content and wait for it to load
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true,
            margin: {
                top: '0',
                bottom: '0',
                left: '0',
                right: '0'
            }
        });

        return pdfBuffer;
    } catch (error) {
        console.error('PDF Generation Error:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

module.exports = { generatePDF };
