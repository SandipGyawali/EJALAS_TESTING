const { Builder, By } = require("selenium-webdriver");
const { login } = require("../index");
const chrome = require("selenium-webdriver/chrome");

// in dashboard we have cases component with various categories with it's state
// 1. icon display test
// 2. categories text display or not and number display based on the cases which should not be empty

// and other is the canvas graph

describe("DashBoard-Test", () => {
  // declaring a driver variable
  let driver;
  before(async () => {
    driver = new Builder()
      .forBrowser("chrome")
      .setChromeOptions(new chrome.Options().headless())
      .build();

    await driver.manage().window().setRect({ width: 1920, height: 1080 });
  });

  after(async () => {
    await driver.quit();
  });

  it("dashboard-component test 451", async () => {
    try {
      await driver.get("https://demo.ejalas.com/login");

      await login(driver);

      // checking the dashboard content
      const contentElement = await driver.findElements(
        By.className("number-of-cases-item")
      );

      for (content of contentElement) {
        const icon = await content.findElement(By.xpath(".//i")).isDisplayed();
        const categoryText = await content.findElement(By.xpath(".//h3"));
        const caseQuantity = await content.findElement(By.xpath(".//span"));

        // test for the icon render in the component dashboard.
        if (!icon)
          throw new Error("Error: component icon not rendered in dashboard");

        // number of cases cannot be negative.
        if ((await Number(caseQuantity)) <= 0 || caseQuantity == "")
          throw new Error(
            "The number defined in the dashboard component is not displayed or inappropriate format"
          );

        // text cannot be empty inside the component.
        if (categoryText == "")
          throw new Error(
            "The category text is not defined in the dashboard component"
          );
      }
    } catch (err) {
      throw new Error(err);
    }
  });

  // case for the dashboard graph
  it("dashboard-graph test 452", async () => {
    try {
      await driver.get("https://demo.ejalas.com/login");

      await login(driver);

      const chart = await driver.findElement(By.id("myChart"));

      // check if the canvas is displayed or not
      if (!(await chart.isDisplayed())) {
        throw new Error("Chart in dashboard not displayed");
      }

      // check for the width and height of the canvas
      const width = await chart.getAttribute("width");
      const height = await chart.getAttribute("height");

      console.log(width, height);
      if (width <= 0 || height <= 0) {
        throw new Error("Canvas width and height is improper");
      }
    } catch (err) {
      throw new Error(err);
    }
  });
});
