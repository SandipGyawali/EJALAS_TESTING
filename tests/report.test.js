// url: https://demo.ejalas.com/admin/ward-wise-pratiwedan

const { Builder, By, until } = require("selenium-webdriver");
const { login } = require("../index.js");
const fs = require("fs");
const path = require("path");
const chrome = require("selenium-webdriver/chrome.js");

describe("ward-wise-pratiwedan", () => {
  let driver;
  before(async () => {
    driver = new Builder().forBrowser("chrome").build();
  });

  after(async () => {
    await driver.quit();
  });

  it("pratiwedan-report-download-test", async () => {
    await driver.get("https://demo.ejalas.com/login");
    // login
    await login(driver);

    //navigate to the pratiwedan endpoint
    await driver.get("https://demo.ejalas.com/admin/ward-wise-pratiwedan");

    // download the file by navigating to the ui button
    const downloadBtn = await driver.findElement(
      By.css(".form-group.row div:last-child")
    );

    await downloadBtn.findElement(By.css("button")).click();

    // now check in the downloads section of the file to see if file is downloaded or not
    const downloadedFileName = await driver.wait(async () => {
      const files = fs.readdirSync("C:/Users/ACER/Downloads");
      return files.find((file) => file.startsWith("ward-wise-pratiwedan.xlsx"));
    }, 10000);

    // now check is the file path exists or not
    const downloadFilePath = path.join(
      "C:/Users/ACER/Downloads",
      downloadedFileName
    );

    const fileExists = fs.existsSync(downloadFilePath);

    if (!fileExists) throw new Error("File Downloaded Failed");
  });
});
