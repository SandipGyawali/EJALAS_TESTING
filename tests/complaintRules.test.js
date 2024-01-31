const { Builder, By, until } = require("selenium-webdriver");
const { login } = require("../index.js");
const chrome = require("selenium-webdriver/chrome.js");
const { Select } = require("selenium-webdriver/lib/select");
const { expect } = require("chai");

describe("complaint-related-rules", () => {
  let driver;
  before(async () => {
    driver = new Builder().forBrowser("chrome").build();
  });

  after(async () => {
    await driver.quit();
  });

  it("addition of complaint rule 601", async () => {
    await driver.get("https://demo.ejalas.com/login");

    await login(driver);

    await driver.get("https://demo.ejalas.com/admin/complaint-related-rules");

    // input the complain related rule
    const selectElement = await driver.findElement(By.css(".form-control"));
    const select = new Select(selectElement);
    select.selectByVisibleText("This is a demo test issue modification");

    await driver.sleep(1000);
    // add by submit
    await driver.findElement(By.css("form button")).click();

    // check if the complaint rule is added or not
    const lastElement = await driver.findElement(By.css("tbody tr:last-child"));
    const data = await lastElement
      .findElement(By.css("td:nth-child(2)"))
      .getText();

    expect(data).to.equal("This is a demo test issue modification");
  });

  // it("edit of complaint rule", async () => {
  // same as the above addition end point
  // const lastElement = await driver.findElement(By.css("tbody tr:last-child"));
  // const element = await lastElement.findElement(By.css("td:nth-child(4) a"));
  // await driver.executeScript("arguments[0].click()", element);
  // // now insert the data inside the rich text editor
  // const elem = await driver.findElement(By.xpath(`/html/body/p`));
  // console.log(await elem.getAttribute("outerHTML"));
  // // submit the changes
  // await driver
  //   .findElement(By.css(".common-court-btn.btn.btn-success a"))
  //   .click();
  // // now check if the modification that we did is actually reflected.
  // const lasElem = await driver.findElement(By.css("tbody tr:last-child"));
  // await lasElem.findElement(By.css("td:nth-child(4) a")).click();
  // // check if the inserted rule is added there or not
  // const data = await driver
  //   .findElement(By.css(".niyem-dafa-content"))
  //   .getText();
  // expect(data).to.equal("THis is the dummy rule test");
  // });
});
