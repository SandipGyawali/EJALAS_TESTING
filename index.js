const { By } = require("selenium-webdriver");
const fs = require("fs");
const addContext = require("mochawesome/addContext");

// validate login info
const data = {
  user: "admin",
  password: "IETnepal@123",
  navUrl: "https://demo.ejalas.com/admin/dashboard",
};

// handles the input field and submit.
async function login(driver, user = data.user, password = data.password) {
  await driver.findElement(By.id("username")).sendKeys(user);
  await driver.findElement(By.id("password")).sendKeys(password);
  await driver.findElement(By.id("login-btn")).click();
}

// screenShot
async function screenShot(test, driver) {
  // note test is reference to the this.currentTes
  let imageFileName = test.currentTest.title + ".jpeg";

  console.log(imageFileName);
  driver.takeScreenshot().then(function (image) {
    fs.writeFileSync(`./screenshots/${imageFileName}`, image, "base64");
  });
  // addContext is the method that is defined in the mocha awesome library
  addContext(test, "Following comes the test case screenShot.");
  addContext(test, `../screenshots/${imageFileName}`);
}

// broken Image
async function brokenImageTest(driver, url) {
  try {
    await driver.get(url);

    // target all the image of the page
    const images = await driver.findElements(By.css("img"));

    for (const image of images) {
      const outerHTML = await image.getAttribute("outerHTML");

      // check the image if it is broken or not
      // here we will use the image natural height and width
      // if both are 0 then we can say the image is broken.
      const naturalWidth = await image.getAttribute("naturalWidth");
      const naturalHeight = await image.getAttribute("naturalHeight");

      if (naturalHeight == 0 && naturalWidth == 0)
        throw new Error(
          `Error: The image is broken, and the broken element is: ${outerHTML} in url: ${url}`
        );
    }
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = { login, screenShot, brokenImageTest };

// error page
// https://demo.ejalas.com/admin/news
