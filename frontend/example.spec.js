const { test, expect, _electron: electron } = require("@playwright/test");

test("Has a title", async () => {
  test.setTimeout(10000);
  const electronApp = await electron.launch({ args: ["."] });
  await electronApp.evaluate(async ({ app }) => {
    return app.isPackaged;
  });

  // Wait for the first BrowserWindow to open
  // and return its Page object
  const window = await electronApp.firstWindow();
  //    // Example: Check if the body text contains a specific string
  const bodyText = await window.evaluate(() => document.body.innerText);
  expect(bodyText).toContain(`(code) => {chronicle;}
Login
Create Account`);

  // Click the "Sign Up" button
  //   await window.click("text=Sign In"); // Replace 'text=Sign Up' with the actual selector if necessary

  // Fill out the sign-up form
  //   await window.fill('input[name="username"]', "testuser"); // Replace with actual form field selector
  //   await window.fill('input[name="email"]', "testuser@example.com"); // Replace with actual form field selector
  //   await window.screenshot({ path: "after-signup.png" });

  // Optional: If you want to match a specific element's content
  //   const elementText = await window.evaluate(
  //     () => document.querySelector("#specific-element-id").innerText,
  //   );
  //   expect(elementText).toBe("Expected Element Content");
  //   await window.screenshot({ path: "intro.png" });

  // close app
  await electronApp.close();
});
