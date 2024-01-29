const { Builder, By } = require("selenium-webdriver");
const { login } = require("../index");
const chrome = require("selenium-webdriver/chrome");

describe("Department", () => {
  let driver;
  before(async () => {
    driver = new Builder()
      .forBrowser("chrome")
      // .setChromeOptions(new chrome.Options().headless())
      .build();
  });

  after(async () => {
    await driver.quit();
  });

  it("add-department-test 401", async () => {
    // login
    await driver.get("https://demo.ejalas.com/login");

    await login(driver);

    await driver.get("https://demo.ejalas.com/department");

    // target the input and add the department
    await driver.findElement(By.id("departmentName")).sendKeys("test-data");

    // submit
    await driver
      .findElement(By.className("common-court-btn btn btn-success"))
      .click();

    // now check if the element was successfully added or not
    const lastElement = await driver.findElement(By.css("tbody tr:last-child"));

    const data = await lastElement
      .findElement(By.css("td:nth-child(2)"))
      .getText();

    console.log(data);
    if (data != "test-data")
      throw new Error("The input new department is not added");
  });

  it("edit-department existing dept 402", async () => {
    // get the last element of the table body
    const lastElement = await driver.findElement(By.css("tbody tr:last-child"));

    // edit btn target
    const editBtnWrapper = await lastElement.findElement(
      By.css("td:nth-child(3)")
    );

    const editBtn = await editBtnWrapper.findElement(By.css("a"));

    await driver.executeScript("arguments[0].click();", editBtn);

    // now change the input
    const input = await driver.findElement(By.id("departmentName"));

    await input.clear();
    await input.sendKeys("test-data-modified");

    // submit
    await driver
      .findElement(By.className("common-court-btn btn btn-success"))
      .click();

    // now check if the element is modified or not
    const modifiedElement = await driver.findElement(
      By.css("tbody tr:last-child")
    );

    const newData = await modifiedElement
      .findElement(By.css("td:nth-child(2)"))
      .getText();

    if (newData != "test-data-modified")
      throw new Error("The department input was not able to be edited.");
  });
});
