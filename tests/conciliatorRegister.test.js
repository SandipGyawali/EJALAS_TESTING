/*
  मेलमिलापकर्ता दर्ताको सूची
  url: https://demo.ejalas.com/admin/melmilapkarta-darta
*/
const { Builder, until, By } = require("selenium-webdriver");
const { login } = require("../index.js");
const chrome = require("selenium-webdriver/chrome.js");

describe("Conciliator test", () => {
  const driver = new Builder()
    .forBrowser("chrome")
    .setChromeOptions(new chrome.Options().headless())
    .build();

  after(async () => {
    await driver.quit();
  });

  it("conciliator-inspection-verify test", async () => {
    try {
      driver.get("https://demo.ejalas.com/login");
      // login
      await login(driver);

      // navigate to the url
      await driver.get("https://demo.ejalas.com/admin/melmilapkarta-darta");

      // target the table data
      const targetElement = await driver.findElement(
        By.css(`tbody tr:first-child`)
      );

      // first get the data of the darta that you are going to vew
      // this is the username that we want to vew the content of
      const name = await targetElement.findElement(By.css("td")).getText();

      // now see the darta info by clicking on view/eye icon
      const viewButton = await targetElement.findElement(
        By.css(`:last-child a`)
      );

      await driver.executeScript("arguments[0].click();", viewButton);
      //now target the table and get the text and note the text should not be empty
      // in most case, we consider the test that does contains the info in the table
      const tableElement = await driver.wait(
        until.elementLocated(By.css("tbody tr:first-child"))
      );

      const tableName = await tableElement.findElement(By.css("td")).getText();

      if (name != tableName)
        throw new Error(
          "The user name that we viewed the content of didn't match"
        );

      if (name == tableName) {
        // click reject or approved we check for the reject
        const btn = await driver.findElement(
          By.css(".buttons-container a:last-child")
        );

        driver.executeScript("arguments[0].click();", btn);

        // now check for the modification if the approval section is rejected
        // target the element that we clicked previously
        await driver.sleep(2000);
        const targetElement = await driver.wait(
          until.elementLocated(By.css(`tbody tr:first-child`))
        );

        const isChanged = await targetElement
          .findElement(By.css(`td:nth-child(7)`))
          .getText();

        if (isChanged != "अस्वीकार गरियो")
          throw new Error("conciliator registered was not rejected");
      }
    } catch (err) {
      throw new Error(err);
    }
  });
});
