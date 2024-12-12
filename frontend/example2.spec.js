const { test, expect, _electron: electron } = require("@playwright/test");

test("Automated Signup Process", async () => {
  // Increase timeout to allow for signup process
  test.setTimeout(30000);

  // Launch the Electron app
  const electronApp = await electron.launch({ args: ["."] });

  let window = null;
  try {
    // Verify the app is launched and not packaged (for testing)
    await electronApp.evaluate(async ({ app }) => {
      return app.isPackaged;
    });

    // Get the first window
    window = await electronApp.firstWindow();

    // Wait for the initial window to load completely
    await window.waitForLoadState("networkidle");

    // Click the Register button
    await window.click('button:has-text("Create Account")');

    // Wait for signup form to load
    await window.waitForSelector("#signup-firstname", { timeout: 10000 });

    // Generate unique test user details
    const timestamp = Date.now();
    const testFirstName = `FirstName_${timestamp}`;
    const testLastName = `LastName_${timestamp}`;
    const testEmail = `testuser_${timestamp}@example.com`;
    const testPassword = "TestPassword123!";

    // Fill out signup form using ids
    await window.fill("#signup-firstname", testFirstName);
    await window.fill("#signup-lastname", testLastName);
    await window.fill("#signup-email", testEmail);
    await window.fill("#signup-password", testPassword);

    // Click Sign Up button to complete registration
    await window.click('button:has-text("Sign Up")');

    // Wait for signup confirmation
    await window.waitForSelector("text=Welcome", { timeout: 10000 });

    // Optional: Verify signup success
    const bodyText = await window.evaluate(() => document.body.innerText);
    expect(bodyText).toContain("Welcome");
    expect(bodyText).toContain(testFirstName);

    // Optional: Take a screenshot
    await window.screenshot({ path: "signup-success.png" });
  } catch (error) {
    // Log detailed error information
    // eslint-disable-next-line no-console
    console.error("Detailed Error:", error);

    // Check if window exists before trying to screenshot
    if (window) {
      try {
        await window.screenshot({ path: "signup-failure.png" });
      } catch (screenshotError) {
        // eslint-disable-next-line no-console
        console.error("Could not take screenshot:", screenshotError);
      }
    }

    // Rethrow to fail the test
    throw error;
  } finally {
    // Always close the app
    if (electronApp) {
      await electronApp.close();
    }
  }
});
