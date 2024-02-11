const { Builder, until, By, FileDetector } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { expect } = require("chai");
const { Select } = require("selenium-webdriver/lib/select");
const fs = require("fs");

const info = {
  0: "Test grill",
  1: "Test grill dad",
  2: "Test grill grandfather",
  3: "tokha, Kathmandu",
  4: "2080-10-18",
  5: "9841399292",
  6: "test2@gmail.com",
};

const selectObj = {
  0: "Bachelor",
  1: 5,
};

describe("melmilapkarta-darta test", () => {
  let driver;

  // initialize driver
  before(async () => {
    driver = new Builder()
      .forBrowser("chrome")
      .setChromeOptions(new chrome.Options().headless())
      .build();
  });

  after(async () => {
    await driver.quit();
  });

  it("should not register the form info with repeated email 901", async () => {
    try {
      await driver.get("https://demo.ejalas.com/melmilapkarta-darta");

      // target all the input field from the form
      // in this case it's arranged in the form from 0th to 6th index
      const list = await driver.findElements(By.css("form input"));
      const inputField = list.slice(0, 8);

      inputField.forEach(async (input, i) => {
        await input.sendKeys(info[i]);
      });

      // now target the 2 select element, select the desired option
      const selectField = await driver.findElements(By.css("form select"));

      selectField.forEach((selectElem, i) => {
        const select = new Select(selectElem);
        select.selectByVisibleText(selectObj[i]);
      });

      // select the choose file fields to add the appropriate file here we will send only one test image because it's just a test
      const fileFields = list.slice(7, 13);

      const imagePath = `C:/DriveD/EJALAS_TESTING/test.png`;
      fileFields.forEach(async (fileElem, i) => {
        await fileElem.sendKeys(imagePath);
      });

      // submit the given form
      await driver
        .findElement(By.className("common-case-btn btn btn-primary"))
        .click();

      const message = await driver
        .findElement(By.className("alert alert-danger alert-danger"))
        .getText();

      expect(message).to.equal(
        "×\nइमेल पहिले नै प्रयोगमा छ कृपया अर्को इमेल मार्फत प्रयास गर्नुहोस्।"
      );
    } catch (err) {
      console.log(err);
    }
  });
});
