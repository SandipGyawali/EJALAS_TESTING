const { Builder, until, By } = require("selenium-webdriver");
const { login } = require("..");
const { expect } = require("chai");
const { Select } = require("selenium-webdriver/lib/select");

describe("admin user ", () => {
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

  it("should add the new admin user info 651", async () => {
    await driver.get("https://demo.ejalas.com/login");

    await login(driver);

    await driver.get("https://demo.ejalas.com/admin/user");

    // name
    await driver.findElement(By.css("#username")).sendKeys("test01");

    // email
    await driver.findElement(By.css("#email")).sendKeys("test@gmail.com");

    // full name
    await driver.findElement(By.css("#fullName")).sendKeys("test user");

    // password
    await driver.findElement(By.css("#password")).sendKeys("Test@123");

    // role
    const selectElem = await driver.findElement(By.css("#roleId"));
    const selectRole = new Select(selectElem);
    selectRole.selectByVisibleText("ENGINEER");

    //enabled and disabled
    const enableElement = await driver.findElement(By.css("#enabled"));
    const enable = new Select(enableElement);
    enable.selectByVisibleText("Enabled");

    // ward number
    const wardElement = await driver.findElement(By.css("#wardId"));
    const wardSelect = new Select(wardElement);
    wardSelect.selectByVisibleText("४");

    // there are two wada number there should only be one
    // now submit the input
    await driver.sleep(1000);
    await driver.findElement(By.css("button")).click();

    // validate if it has been added to the table list or not
    const list = await driver.findElement(By.css("tbody tr:last-child"));

    // store the info in the array and assert the given array data
    const data = [];
    for (let i = 0; i < 3; i++) {
      const addedData = await list
        .findElement(By.css(`td:nth-child(${i + 2})`))
        .getText();
      data[i] = addedData;
    }

    // validating the user using the assertion.
    const validData = ["test01", "test@gmail.com", "test user"];
    console.log(data);
    for (let i = 0; i < 3; i++) {
      expect(data[i]).to.equal(validData[i]);
    }
  });

  it("should edit the user info 652", async () => {
    // we will change the name and validate if it is editable or not
    // first click on the edit btn of the instance that we want to change
    const lastElement = await driver.findElement(By.css("tbody tr:last-child"));

    const editBtn = await lastElement.findElement(By.css("td:nth-child(7) a"));

    await driver.executeScript("arguments[0].click();", editBtn);

    const input = await driver.findElement(By.css("#username"));
    await input.clear();
    await input.sendKeys("test012");

    // submit
    await driver.findElement(By.css("button")).click();

    // check if it has been successfully added or not
    const updatedLastElem = await driver.findElement(
      By.css("tbody tr:last-child")
    );

    const name = await updatedLastElem
      .findElement(By.css("td:nth-child(2)"))
      .getText();

    expect(name).to.equal("test012");
  });

  // submit the input without filling will show error check if the error message is successfully shown or not.
  // will show only three errors i.e of the name, email and full name field other won't show so not need to check
  it("check the error message/validator of the admin/user input form 653", async () => {
    await driver.get("https://demo.ejalas.com/admin/user");

    // submit
    await driver.findElement(By.css("button")).click();

    // use loop because the input is in continuous format
    const inputs = await driver.findElements(By.css(".col-md-3"));

    for (let i = 0; i < 3; i++) {
      const element = await inputs[i];
      const errorMsg = await element.findElement(By.css("span")).getText();

      console.log(errorMsg);
      expect(errorMsg).to.not.be.undefined;
      expect(errorMsg).to.not.be.equal("");
    }
  });
});
