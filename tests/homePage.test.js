/*
broken image check in the home page
url: https://demo.ejalas.com/
     https://demo.ejalas.com/tarikh
     https://demo.ejalas.com/hamro-barema
न्यायिक समितिका पदाधिकारीहरुको नामावली
namawali li also checked

Issue:
1. there is a image with 1 * 1 px don't know why?
2. The input label ask for the case code number but gives error sometime with number strings and dates but the case number is register with those mentioned types
*/
const { Builder, until, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const { brokenImageTest } = require("../index");
const { Select } = require("selenium-webdriver/lib/select");

describe("Home Page component Test", () => {
  let driver;
  // initialize driver
  before(async () => {
    driver = new Builder()
      .forBrowser("chrome")
      .setChromeOptions(new chrome.Options().headless())
      .build();

    await driver.manage().window().setRect({ width: 1920, height: 1080 });
  });

  // quit driver
  after(async () => {
    await driver.quit();
  });

  // broken image check
  // break this test into function because image is to be tested in different
  // url endpoint

  // news/marquee slide check
  it("home-page-test 350", async () => {
    try {
      await driver.get("https://demo.ejalas.com/");

      // check if the date is displayed or not
      const date = await driver.findElement(By.css(`.date span iframe`));

      if (!date.isDisplayed())
        throw new Error("The date is not displayed in home page");

      // home page broken image test.
      await brokenImageTest(driver, "https://demo.ejalas.com");

      const marquee = await driver.findElement(
        By.xpath(`//*[@id="header-wrapper"]/div/div[2]/div/marquee`)
      );

      // first check if the marquee if displayed or not
      if (!(await marquee.isDisplayed()))
        throw new Error("The marquee element/news slide is not displayed");

      // now check if the text message inside is present or not?
      const marqueeText = await marquee.findElement(By.css("ul")).getText();

      if (marqueeText == 0)
        throw new Error("The news-slide content is not displayed");
    } catch (err) {
      throw new Error(err);
    }
  });

  // manual fail
  it("ujuri-case-search-result-fail-test 351", async () => {
    try {
      await driver.get("https://demo.ejalas.com/tarikh");

      // target the input to search for the case number
      // assume the case number is 123 which does not exists should give us error message
      await driver.findElement(By.css(`form input`)).sendKeys("123");

      //target the button and search for it.
      // here we should get the error message because we have an unregister case number
      await driver.findElement(By.css("button")).click();

      // check if the error message pop up or not.
      const errorElement = await driver.wait(
        until.elementLocated(By.className("text-center alert alert-danger"))
      );

      const errorText = await errorElement.getText();

      if (errorText != "मुद्दा नं को तारिख उपलब्ध छैन")
        throw new Error("Error in getting the error element");

      console.log(errorText);
    } catch (err) {
      throw new Error(err);
    }
  });

  // success
  it("ujuri-case-search-result-success-test 352", async () => {
    try {
      const code = "sfj";
      await driver.get("https://demo.ejalas.com/tarikh");

      // target the input to search for the case number
      // assume the case number is 123 which does not exists should give us error message
      await driver.findElement(By.css(`form input`)).sendKeys(code);

      //target the button and search for it.
      // here we should get the error message because we have an unregister case number
      await driver.findElement(By.css("button")).click();

      // here the case number is valid so it should contain some information except the error message
      const tableElement = await driver.wait(
        until.elementLocated(By.css("tbody tr"))
      );

      const codeNumber = await tableElement
        .findElement(By.css("td:last-child"))
        .getText();

      if (codeNumber != code)
        throw new Error(
          "The expected ujuri result didn't match with the code that we input"
        );
    } catch (err) {
      throw new Error(err);
    }
  });

  // this test ensures if the about-use info is displayed in the page or not
  it("home-page about-us 353", async function () {
    try {
      await driver.get("https://demo.ejalas.com/hamro-barema");

      const textContainer = await driver.findElement(
        By.className("hamro-barema-container")
      );

      // check if the container is displayed or not.
      if (!(await textContainer.isDisplayed()))
        throw new Error("The container is not displayed in the page.");

      // check if the text is empty or not.
      const text = await textContainer.getText();

      if (text == "") throw new Error("The content in the page is not shown");
      console.log(await textContainer.getText());
    } catch (err) {
      throw new Error(err);
    }
  });

  // case look up test
  // 2080-04-24
  // जग्गा मिचि भवन निर्माण
  // issue: table body is not styled.
  it("conflict look-up test 354", async () => {
    const obj = {
      select: "जग्गा मिचि भवन निर्माण",
      date: "2080-04-24",
    };

    await driver.get("https://demo.ejalas.com/index");

    // first select the type of the type of case
    const selectElement = await driver.findElement(
      By.id("inlineFormCustomSelect")
    );

    const select = new Select(selectElement);
    select.selectByVisibleText(obj.select);

    // now select the date of register case.
    await driver
      .findElement(By.className("nepali-datepicker ndp-nepali-calendar"))
      .sendKeys(obj.date);

    //submit the detail
    const submitBtn = await driver.findElement(
      By.className("common-case-btn section-content-item")
    );

    await driver.wait(until.elementIsVisible(submitBtn), 10000);

    await driver.executeScript("arguments[0].click();", submitBtn);

    // result will show according to the detail provided
    // check for the result
    const targetElement = await driver.findElements(By.css(`tbody tr`));

    // check if the data is present or not it should not be empty
    console.log(targetElement.length);

    if (targetElement == 0)
      throw new Error("The search result didn't match for the given input");
    await driver.sleep(3000);
  });
});
