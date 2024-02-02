const { Builder, until, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { login } = require("..");
const { Select } = require("selenium-webdriver/lib/select");
const { expect } = require("chai");

describe("Melmilap-Karta", () => {
  let driver;
  // initialize driver
  before(async () => {
    driver = new Builder()
      .forBrowser("chrome")
      // .setChromeOptions(new chrome.Options().headless())
      .build();
  });

  after(async () => {
    await driver.quit();
  });

  it("should add the melmilakarta_name_wada 701", async () => {
    await driver.get("https://demo.ejalas.com/login");

    await login(driver);

    await driver.get("https://demo.ejalas.com/admin/melmilapKarta");

    // select the input and submit the given data in the list
    await driver.findElement(By.css("#name")).sendKeys("Jack Sparrow");

    const selectElement = await driver.findElement(By.css("#wardNumber"));

    const select = new Select(selectElement);
    select.selectByVisibleText("10");

    // submit the given info
    await driver.sleep(1000);
    await driver.findElement(By.css("button")).click();

    // check if the data is added to the list or not
    const lastElement = await driver.findElement(By.css("tbody tr:last-child"));
    const data = await lastElement
      .findElement(By.css("td:nth-child(2)"))
      .getText();
    const wardNumber = await lastElement
      .findElement(By.css("td:nth-child(3)"))
      .getText();

    // assertion for validating the input data
    expect(data).to.equal("Jack Sparrow");
    expect(wardNumber).to.equal("10");
  });

  it("should edit the latest added name and ward number 702", async () => {
    // get  the last data that we added and try to edit it's input
    const lastELem = await driver.findElement(By.css("tbody tr:last-child"));

    const editBtn = await lastELem.findElement(By.css("td:nth-child(5) a"));

    await driver.executeScript("arguments[0].click();", editBtn);

    // not change the data in the input label
    const input = await driver.findElement(By.css("#name"));
    await input.clear();
    await input.sendKeys("Jack Sparrow Updated");

    // submit the updated result
    await driver.findElement(By.css("button")).click();

    // check if the data is updated successfully or not.
    const updatedLastElem = await driver.findElement(
      By.css("tbody tr:last-child")
    );

    const updatedName = await updatedLastElem
      .findElement(By.css("td:nth-child(2)"))
      .getText();

    expect(updatedName).to.equal("Jack Sparrow Updated");
  });

  it("should delete the previous updated melmilap_name and ward data 703", async () => {
    // select the list and click the event delete that is provided
    const element = await driver.findElement(By.css("tbody tr:last-child"));

    const deleteBtn = await element.findElement(By.css("td:last-child a"));

    await driver.executeScript("arguments[0].click();", deleteBtn);

    // check if successful deletion or not
    const lastElement = await driver.findElement(By.css("tbody tr:last-child"));

    const data = await lastElement
      .findElement(By.css("td:nth-child(2)"))
      .getText();

    expect(data).to.not.equal("Jack Sparrow Updated");
  });
});
