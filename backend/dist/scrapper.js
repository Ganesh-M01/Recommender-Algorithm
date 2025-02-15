const puppeteer = require("puppeteer");
const fs = require("fs/promises");

const start = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let searchtext = "gaminglaptops"; //change this according to your need
  await page.goto(
    `https://www.flipkart.com/search?q=${searchtext}&otracker=search&otracker1=search&marketplace=FLIPKART&as-show=on&as=off`
  );
  const textArray = await page.$$eval(
    'a[rel="noopener noreferrer"] div:nth-child(2)', // select 2nd div child inside a tag
    (res) => {
      return res
        .filter((ele) => ele.textContent.length > 0)
        .map((ele) => ele.textContent);
    }
  );
  await fs.writeFile("mobile-data.txt", textArray.join("\n\n"));
  browser.close();
};

start();