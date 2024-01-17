const { Builder, By } = require("selenium-webdriver");
const { login } = require("../index");

describe("Department", () => {
  let driver;
  before(async () => {
    driver = new Builder().forBrowser("chrome").build();
  });

  after(async () => {
    await driver.quit();
  });

  it("add-department-test", async () => {
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
});
