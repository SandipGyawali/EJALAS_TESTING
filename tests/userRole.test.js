const { Builder, until, By } = require("selenium-webdriver");
const { login } = require("../index.js");
const chrome = require("selenium-webdriver/chrome.js");
const { Select } = require("selenium-webdriver/lib/select.js");
const { assert, expect } = require("chai");

const role = "test-role";
const role_edit = "test-role-edit";

describe("user-role", () => {
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

  it("user-role-add-test 201", async () => {
    // first login to the page before starting the test
    await driver.get("https://demo.ejalas.com/login");

    await login(driver);

    await driver.get("https://demo.ejalas.com/admin/role");

    // add the input tag enter name of role and submit
    const inputELement = await driver.findElement(By.id("name"));

    await inputELement.sendKeys(role);

    // submit
    await driver
      .findElement(By.className("common-court-btn btn btn-success"))
      .click();

    // check at the last of the table body if the role has been added or not
    const lastElement = await driver.wait(
      until.elementLocated(By.css("tbody tr:last-child"))
    );

    // now check if the user input role name is matched
    const data = await lastElement
      .findElement(By.css(`td:nth-child(2)`))
      .getText();

    if (data != role) throw new Error("The user role is not added.");
  });

  // edit user role.
  it("user-role-test-edit 202", async () => {
    await driver.get("https://demo.ejalas.com/admin/role");

    // edit the role
    const element = await driver.findElement(By.css("tbody tr:last-child"));

    const editButtonWrapper = await element.findElement(
      By.css("td:nth-child(3)")
    );

    const editBtn = await editButtonWrapper.findElement(By.css(`a`));

    await driver.executeScript("arguments[0].click();", editBtn);

    // target the input field and edit accordingly
    const input = await driver.findElement(By.id("name"));

    await input.clear();

    await input.sendKeys(role_edit);

    // now submit the change
    const button = await driver.findElement(By.css("button"));

    await driver.executeScript("arguments[0].click();", button);

    // now check if the edited section has been reflected or not
    const lastElement = await driver.findElement(By.css("tbody tr:last-child"));

    const text = await lastElement
      .findElement(By.css("td:nth-child(2)"))
      .getText();

    if (text != role_edit) throw new Error("The user role is not updated");
  });

  it("permission-management module-addition 203", async () => {
    await driver.get("https://demo.ejalas.com/login");

    await login(driver);

    await driver.get("https://demo.ejalas.com/admin/permission-management");

    // select the prayog-karta
    const element = await driver.findElement(By.id("user"));
    const select = new Select(element);
    select.selectByVisibleText("ashish03");

    const secondElement = await driver.findElement(By.id("menu"));
    const select2 = new Select(secondElement);
    select2.selectByVisibleText("समाचार");

    // submit the module for addition
    await driver.findElement(By.id("addModule")).click();
    // validate the table for successful addition

    await driver.sleep(2000);

    const firstElement = await driver.findElement(
      By.css("thead tr:nth-child(2)")
    );

    const menu = await firstElement
      .findElement(By.css("td:nth-child(2)"))
      .getText();

    // the latest element enu must be equal to the one that you choose
    expect(menu).to.equal("समाचार");
  });
});
