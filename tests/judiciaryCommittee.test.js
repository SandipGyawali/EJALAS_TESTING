/*
  Judiciary Committee test
  endpoint : https://demo.ejalas.com/admin/court
  न्यायिक समिति test
*/
const { Builder, By, until } = require("selenium-webdriver");
const { login } = require("../index.js");
const { Select } = require("selenium-webdriver/lib/select.js");
const chrome = require("selenium-webdriver/chrome.js");

// object defined for input field testing.
const obj = {
  0: "THis is test",
};

describe("Judiciary Committee Test", async () => {
  let driver;
  // initializing driver.
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

  it("Addition of judiciary Committee Test 305", async () => {
    try {
      await driver.get("https://demo.ejalas.com/login");

      // login.
      await login(driver);

      await driver.get("https://demo.ejalas.com/admin/court");

      // here the input element is a div tag
      const inputELements = await driver.findElements(By.className("col-md-3"));

      for (let i = 0; i < inputELements.length; i++) {
        // the first one is the input field and other is to be selected from the option element

        if (i == 0) {
          const input = await inputELements[0].findElement(By.css("input"));

          await input.sendKeys(obj[0]);
        } else {
          // remaining 3 of them are a select option so selecting one of them
          // first target the select element
          const selectElement = await inputELements[i].findElement(
            By.css("select")
          );
          const select = new Select(selectElement);
          select.selectByIndex(0);
        }
      }

      // submit the data that we added.
      await driver
        .findElement(By.className("common-court-btn btn btn-success"))
        .click();

      // get the last element of the table body
      // to check if the element is added or not
      const lastElement = await driver.wait(
        until.elementLocated(By.css("tbody tr:last-child")),
        3000
      );

      // target the tbody to check the length of tr
      const tbody = await driver.findElements(By.css("tbody tr"));

      const thText = await lastElement.findElement(By.css("th")).getText();
      // gets the data in array format
      const tdText = (
        await lastElement.findElement(By.css("td")).getText()
      ).split();

      console.log(tdText, thText);
      if (tdText[0] != obj[0] && tbody.length != thText) {
        throw new Error(
          "The content didn't match with the input or the index was not matched with the table index"
        );
      }
    } catch (err) {
      throw new Error(err);
    }
  });

  // edit
  it("Edit Judicial Committee Test 306", async () => {
    await driver.get("https://demo.ejalas.com/admin/court");

    //click the edit button
    await driver
      .findElement(
        By.xpath(
          `//*[@id="content-wrapper"]/section[2]/div[2]/section/div[3]/div/table/tbody/tr[1]/td[5]/a`
        )
      )
      .click();

    // now modify the data
    // target the input and change the data.
    const inputELements = await driver.findElements(By.className("col-md-3"));

    //input text.
    const inputText = `test modified ${Math.floor(Math.random() * 10)}`;
    for (let i = 0; i < inputELements.length; i++) {
      // the first one is the input field and other is to be selected from the option element

      if (i == 0) {
        const input = await inputELements[0].findElement(By.css("input"));

        await input.clear();
        await input.sendKeys(inputText);
      } else {
        // remaining 3 of them are a select option so selecting one of them
        // first target the select element
        const selectElement = await inputELements[i].findElement(
          By.css("select")
        );
        const select = new Select(selectElement);
        select.selectByIndex(0);
      }
    }

    // submit the edited data.
    await driver
      .findElement(By.className("common-court-btn btn btn-success"))
      .click();

    // check if the data has been chanced or not.
    const modifiedDataElement = await driver.findElement(
      By.xpath(
        `//*[@id="content-wrapper"]/section[2]/div[2]/section/div[3]/div/table/tbody/tr[1]`
      )
    );

    const inputDataElement = await modifiedDataElement.findElement(
      By.xpath(`//tr/td[1]`)
    );

    const latestModifiedText = await inputDataElement.getText();

    if (latestModifiedText != inputText)
      throw new Error("Modification un-successful");

    console.log("Ok");
    await driver.sleep(5000);
  });
});
