const puppeteer = require('puppeteer');

(async () => {
  try {
    // Launch the browser
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Navigate to the Flipkart product page
    const productUrl = 'https://www.flipkart.com/search?q=gaming+laptop'; // Replace with the actual product URL
    await page.goto(productUrl, { waitUntil: 'networkidle2' });

    // Wait for the title element to load
    await page.waitForSelector('span.B_NuCI', { timeout: 5000 }).catch(() => {
      console.error('Title element not found');
      throw new Error('Title element not found');
    });

    // Extract the required data
    const productData = await page.evaluate(() => {
      const titleElement = document.querySelector('span.B_NuCI');
      const descriptionElement = document.querySelector('div._1mXcCf');
      const priceElement = document.querySelector('div._30jeq3._16Jk6d');
      const imageElement = document.querySelector('div._312yBx._3AChxK img');

      // Check if elements exist before accessing their properties
      if (!titleElement || !descriptionElement || !priceElement || !imageElement) {
        throw new Error('One or more elements not found on the page');
      }

      const title = titleElement.innerText;
      const description = descriptionElement.innerText;
      const price = priceElement.innerText.replace(/[^0-9]/g, '');
      const image = imageElement.src;

      return {
        title,
        description,
        price: parseInt(price, 10),
        photos: [image],
        createdAt: new Date().toISOString(),
        __v: 0
      };
    });

    // Output the scraped data
    console.log(productData);

    // Close the browser
    await browser.close();
  } catch (error) {
    console.error('Error during scraping:', error);
  }
})();