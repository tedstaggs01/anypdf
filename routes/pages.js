const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs-extra');
const Handlebars = require('handlebars');

router.use(bodyParser.urlencoded({ extended: true }));

let count = 0; 

router.get('/', (req, res) => {
    res.render('index', {
        count,
        title: 'Your PDF generator'
    });
});

router.get('/create-pdf', async (req, res) => {
    try {
        // Launch a new Puppeteer browser instance
        const browser = await puppeteer.launch();
        // Create a new page within the browser
        const page = await browser.newPage();

        // Define the path to the Handlebars template file
        const templatePath = path.join(__dirname, '../templates', 'template.handlebars');
        // Read the contents of the Handlebars template file
        const templateSource = await fs.readFile(templatePath, 'utf-8');

        // Compile the Handlebars template
        const template = Handlebars.compile(templateSource);

        // Get the calculated data from the Express app's locals
        const renderedData = req.app.locals.calculatedData;

        // Render the template with the calculated data
        const compiledHtml = template(renderedData);

        // Set the HTML content of the Puppeteer page
        await page.setContent(compiledHtml);

        // Generate a PDF buffer from the page content
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true
        });

        // Close the Puppeteer browser
        await browser.close();

        // Set response headers for the PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=loadsheet.pdf');
        // Send the generated PDF buffer as the response
        res.send(pdfBuffer);
    } catch (error) {
        // If an error occurs, log the error and send a 500 status response
        console.error('An error occurred:', error);
        res.status(500).send('An error occurred');
    }
});


module.exports = router