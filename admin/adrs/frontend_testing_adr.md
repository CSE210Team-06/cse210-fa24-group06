---
# These are optional metadata elements. Feel free to remove any of them.
status: "accepted"
date: { 2024/12/10 }
decision-makers: { Ethan, Sahil }
consulted:
  {
   Sushaanth
  }
informed:
  {
    All Members
  }
---

# Electron for Desktop App Development

## Context and Problem Statement

We needed a working testing framework for our frontend JS code, we had previously had some team members attempt to accomplish this using Puppeteer but failed to produce working tests.

## Decision Drivers

- Time availability
- Ability to access and manipulate DOM elements
- Adaptability with Electron apps without having to install extra dependencies

## Considered Options

- Puppeteer
- Playwright
- Spectron
- Web Driver IO

## Decision Outcome

We had very high doubts that Puppeteer would be compatible with our desktop app and Electron apps in particular. In the time we had it was extremely difficult to find code that would be able to run the simplest functionalities. We believe part of the issue with a large discrepancy between the version of Chrome that our Electron app runs on and the version of Chrome that ChromeDriver supports. We could not find a reasonable way to fix that in a timely manner.

Spectron seemed ideal, and WAS the testing framework of choice for electron, but has been deprecated. Even when we tried writing a basic test we continued running into issues with ChromeDriver/Google Chrome versions not matching up.

WebDriverIO was one of the suggested alternatives https://www.electronjs.org/docs/latest/tutorial/automated-testing by ElectronJS themselves, but we could not install it because our node version did not match their minimum expected NodeJS version.

Puppeteer was also recommended by ElectronJS, and the setup was near instant. It also supported checking and testing DOM elements without much difficulty in implementation. We did not have to worry about ChromeDriver/Chrome versions and it worked with our existing NodeJS version.

### Consequences

- Good, because it provides a consistent and familiar developer experience.
- Good, because we can use this to help set up frontend end to end tests and testing pipelines.
- Bad, becuase we are uncertain how well it will work for complex e2e tests and if there may be any unexpected issues when implemented as a github action.

## Pros and Cons of the Other Option

- Already discussed above.
