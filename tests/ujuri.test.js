// url : https://demo.ejalas.com/online-case-registration
// here we are performing the biwad-dart

const { Builder, until, By } = require("selenium-webdriver");
const { login } = require("..");
const { expect } = require("chai");
const { Select } = require("selenium-webdriver/lib/select");

// petitioner == निवेदक
const petitioner = {
  0: "test Johnson",
  1: "samakhushi",
  2: "9847566548",
  3: "test father",
  4: "test grand father",
  5: 24,
  6: `C:/DriveD/EJALAS_TESTING/test.png`,
};
// opposition == विपक्षीको
const opposition = {
  0: "test-opposition Johnson",
  1: "maitidevi",
  2: "9847857322",
  3: "test-opposition father",
  4: "test-opposition grandfather",
};

describe("ujuri test", () => {
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

  it("should register the form data as per the info provided 951", async function () {
    driver.get("https://demo.ejalas.com/online-case-registration");

    // navigate further to the biwad-darta enpoint
    await driver.findElement(By.css(".btn.btn-primary")).click();

    // now input the form data according to the mentioned format
    // input in the first section of form निवेदकको विवरण
    const form = await driver.findElement(By.css("form"));

    const labeled_form1 = await form.findElement(By.css(".common-section")); //contains the two form separated in different component
    const firstSectionInputs = await labeled_form1.findElements(
      By.css("input")
    );

    firstSectionInputs.forEach(async (selectElem, i) => {
      await selectElem.sendKeys(petitioner[i]);
    });
    // select wada differently
    await labeled_form1.findElement(By.css(".form-subject"));

    const select = new Select(labeled_form1);
    await select.selectByValue("५");

    // input in the second section of the form विपक्षीको विवरण
    const labeled_form2 = await form.findElements(By.css(".common-section"));
    const secondSectionInputs = await labeled_form2[1].findElements(
      By.css("input")
    );

    secondSectionInputs.forEach(async (selectElem, i) => {
      await selectElem.sendKeys(opposition[i]);
    });

    await labeled_form2[1].findElement(By.css(".form-subject"));

    // select the wada number for second section of form
    const select2 = new Select(labeled_form2[1]);
    await select2.selectByValue("५");

    // now select the dispute type
    const disputeElement = await form.findElement(
      By.css(".form-group.col-md-3.text-center")
    );

    const disputeSelect = new Select(disputeElement);
    disputeSelect.selectByIndex(3);

    // now get the 3 form field that contains input field for the detailed description of the dispute
    const disputeDetailElement = await form.findElements(
      By.css(".form-group.col-md-12.text-center")
    );

    disputeDetailElement.forEach(async (elem, i) => {
      if (i == 0) {
        console.log("Hello");
        await elem.findElement(By.css("p")).sendKeys("This is test");
      } else {
        await elem.findElement(By.css("textarea")).sendKeys("This is test");
      }
    });

    // the citizenship file must be a test file
    // here for demo we use the test.pdf file
    await form
      .findElement(By.css(".fileInput2.citizenship-input"))
      .sendKeys("C:/DriveD/EJALAS_TESTING/test.pdf");

    // check mark the terms and condition section
    await form.findElement(By.css(".form-check-label")).click();

    await form.findElement(By.css("#likhit-jawaf-pesh")).click();

    const successMessage = await driver
      .findElement(By.css(".alert.alert-success.alert-dismissible span"))
      .getText();

    expect(successMessage).to.equal("विवाद सफलतापूर्वक पेश गरिएको छ");
  });
});
