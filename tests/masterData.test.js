/*
  url: https://demo.ejalas.com/admin/court-type,
  master data management/court-type
*/

const { Builder, until, By } = require("selenium-webdriver");
const { login } = require("../index.js");
const chrome = require("selenium-webdriver/chrome.js");
const { expect } = require("chai");

//side bar master data management section test case
describe("masterData management", () => {
  let driver;
  before(async () => {
    driver = new Builder().forBrowser("chrome").build();
  });

  after(async () => {
    await driver.quit();
  });

  it("court-type addition 221", async () => {
    await driver.get("https://demo.ejalas.com/login");

    await login(driver);

    await driver.get("https://demo.ejalas.com/admin/court-type");

    // target the input field
    await driver.findElement(By.id("courtName")).sendKeys("demo");

    // submit the input
    await driver
      .findElement(By.className("common-court-btn btn btn-success"))
      .click();

    // now check int he list if the input is added successfully in the list.
    const lastElement = await driver.findElement(By.css("tbody tr:last-child"));

    const inputData = await lastElement
      .findElement(By.css("td:nth-child(2)"))
      .getText();

    expect(inputData).to.equal("demo");
  });

  it("court-type edit 222", async () => {
    // test for the same url end point as mentioned above
    // edit the last element/ latest element in the table
    const lastElement = await driver.findElement(By.css("tbody tr:last-child"));

    const editBtnWrapper = await lastElement.findElement(
      By.css("td:nth-child(3)")
    );

    await editBtnWrapper.findElement(By.css("a")).click();

    // change the input in the input field
    const input = await driver.findElement(By.id("courtName"));

    await input.clear();

    await input.sendKeys("demo edit");

    // submit the updated input
    await driver
      .findElement(By.className("common-court-btn btn btn-success"))
      .click();

    // now check if the list is successfully updated or not
    const newLast = await driver.findElement(By.css("tbody tr:last-child"));
    const data = await newLast.findElement(By.css("td:nth-child(2)")).getText();

    expect(data).to.equal("demo edit");
  });

  it("court-type deletion 223", async () => {
    // run the program according to the preceding url endpoint
    // select the last element to delete
    const lastElement = await driver.findElement(By.css("tbody tr:last-child"));

    const inputDataWrapper = await lastElement.findElement(
      By.css("td:last-child")
    );

    await inputDataWrapper.findElement(By.css("a")).click();

    // now check if the updated last element is not equal to the previous one
    const latestLastElement = await driver.findElement(
      By.css("tbody tr:last-child")
    );
    const data = await latestLastElement
      .findElement(By.css("td:nth-child(2)"))
      .getText();

    expect(data).to.not.equal("demo test");
  });
});
