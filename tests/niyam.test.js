const { Builder, until, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { expect } = require("chai");

describe("niyam", () => {
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

  it("should not contains the empty url and when click should redirect to respective endpoint 1001", async () => {
    await driver.get("https://demo.ejalas.com/niyam");

    // target all the button/redirect event button and check is it's reference is not empty or not
    const niyamComponent = await driver.findElement(By.css(".niyam-wrapper"));

    // get all the anchor tag inside the niyamComponent
    const anchors = await niyamComponent.findElements(By.css("a"));

    // the href attribute should now be empty
    anchors.forEach(async (a) => {
      const href = await a.getAttribute("href");
      expect(href).to.not.equal(""); //checks for the attribute value not to be zero
    });

    // now check each and individual link if it is redirected or not while clicked
    anchors.forEach(async (a) => {
      const href = await a.getAttribute("href");
      await a.click();
      const currentUrl = await driver.getCurrentUrl();

      expect(href).to.equal(currentUrl); //checks if after click the button the href link was successfully redirect using the current url check
      await driver.navigate().back(); //this navigates to the original page for the remaining href test
    });
  });
});
