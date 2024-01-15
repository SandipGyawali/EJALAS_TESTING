/*
url : https://demo.ejalas.com/admin/complaint-type  
मास्टर डाटा व्यवस्थापन -> विवादको प्रकार
*/
const { Builder, By, until } = require("selenium-webdriver");
const { login } = require("../index.js");
const chrome = require("selenium-webdriver/chrome.js");

describe("Complain-Type Test", () => {
  let driver;
  before(async () => {
    driver = new Builder()
      .forBrowser("chrome")
      .setChromeOptions(new chrome.Options().headless())
      .build();

    await driver.manage().window().setRect({ width: 1920, height: 1080 });
  });

  after(async () => {
    await driver.quit();
  });

  it("Add Complaint-Test", async () => {
    try {
      await driver.get("https://demo.ejalas.com/login");

      await login(driver);

      await driver.get("https://demo.ejalas.com/admin/complaint-type");

      // get the length of the table
      const tableDataLength = (await driver.findElements(By.css("tbody tr")))
        .length;

      // select the input element
      // issue type element.
      await driver
        .findElement(By.id("courtName"))
        .sendKeys("This is a demo test issue");

      await driver
        .findElement(By.className("common-court-btn btn btn-success"))
        .click();

      // check the issue if added to the list or not.
      // it will be contained at the last of the table.
      const lastElement = await driver.wait(
        until.elementLocated(By.css("tbody tr:last-child")),
        3000
      );

      console.log(await lastElement.getText());
      // check if the length has been increase in the table if yes then the
      // data has been added
      const newTableDataLength = await driver.findElements(By.css("tbody tr"));
      if (newTableDataLength == tableDataLength)
        throw new Error("The Data was not added");
    } catch (err) {
      throw new Error(err);
    }
  });

  it("Edit Complain-Test", async () => {
    try {
      await driver.get("https://demo.ejalas.com/admin/complaint-type");

      // target the element that we want to modify
      // target the last table data because it contains the latest data
      const lastElement = await driver.wait(
        until.elementLocated(By.css("tbody tr:last-child"))
      );

      const text = await lastElement.findElement(By.css("td")).getText();
      // click edit btn
      const editBtn = await lastElement.findElement(
        By.css("td:nth-child(3) a")
      );

      await driver.executeScript("arguments[0].click()", editBtn);

      // now do the modification that you want and submit.
      await driver.findElement(By.id("courtName")).sendKeys(" modification");

      // submit
      await driver
        .findElement(By.className("common-court-btn btn btn-success"))
        .click();

      // check if the data has been modified or not
      const modifiedLastElement = await driver.wait(
        until.elementLocated(By.css("tbody tr:last-child"))
      );
      const modifiedText = await modifiedLastElement
        .findElement(By.css("td"))
        .getText();

      console.log(text);
      console.log(modifiedText);

      // if modified text and the previous text is same then the data was not updated
      if (modifiedText == text) throw new Error("Data was not modified");
    } catch (err) {
      throw new Error(err);
    }
  });
});
