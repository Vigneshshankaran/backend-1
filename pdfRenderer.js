const puppeteer = require('puppeteer');

async function generatePDF(htmlContent) {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
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

    await browser.close();
    return pdfBuffer;
}

module.exports = { generatePDF };
