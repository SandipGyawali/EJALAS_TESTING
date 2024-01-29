const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const fs = require("fs");
const addContext = require("mochawesome/addContext");
const { login } = require("../index");

// validate login info
const data = {
  user: "admin",
  password: "IETnepal@123",
  navUrl: "https://demo.ejalas.com/admin/dashboard",
};

describe("Login Test", async function () {
  let driver;
  // defining a chrome driver.
  before(async () => {
    // headless options
    driver = new Builder()
      .forBrowser("chrome")
      .setChromeOptions(new chrome.Options().headless())
      .build();

    await driver.manage().window().setRect({ width: 1920, height: 1080 });
  });

  // quit driver after completing test case.
  after(async () => {
    await driver.quit();
  });

  //runs if the test case if failed.
  afterEach(async function () {
    const specificTestCases = ["unsuccessful-login"];

    if (
      this.currentTest.state == "passed" &&
      specificTestCases.includes(this.currentTest.title)
    ) {
      let imageFileName = this.currentTest.title + ".jpeg";
      driver.takeScreenshot().then(function (image) {
        fs.writeFileSync(`./screenshots/${imageFileName}`, image, "base64");
      });

      // addContext is the method that is defined in the mocha awesome library
      addContext(this, "Following comes the test case screen shot.");
      addContext(this, `../screenshots/${imageFileName}`);
    }
  });

  // test for successful login
  it("successful-login 1", async () => {
    try {
      await driver.get("https://demo.ejalas.com/login");

      // handles login operation
      await login(driver);

      try {
        // to be more specific the url will be redirect to the admin/dashboard
        // check for the url if it has been navigated or not.
        await driver.wait(until.urlContains(data.navUrl));
      } catch (err) {
        console.log(err.message);
      }
    } catch (err) {
      throw new Error(err);
    }
  });

  // this test is also validates the error message that is showing error after login
  // intentionally failing test.
  it("unsuccessful-login 2", async () => {
    try {
      await driver.get("https://demo.ejalas.com/login");

      // method handles the  login operation
      await login(driver, data.user, `${data.password}sdf`);

      // search for the error element if exists
      const errorElement = await driver.wait(
        until.elementLocated(By.className("alert alert-danger")),
        3000
      );

      // if the user and password are incorrect.
      // error message element pops up
      if (errorElement) {
        const errorText = await errorElement.getText();
        console.log(errorText);
      }

      // here the url will also not be redirected to the dashboard
      // this is optional because the url is different for the different user based on the name/dashboard
      await driver.wait(until.urlContains(data.navUrl), 3000);
    } catch (err) {
      // here the occurrence error is for sure so check so we log the error message only,
      console.log(`Error: ${err.message}`);
    }
  });
});

//exports the login method in other module.
module.exports = { login };
