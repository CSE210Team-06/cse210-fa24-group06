---
# These are optional metadata elements. Feel free to remove any of them.
status: "accepted"
date: { 2024/11/16 }
decision-makers: { Ethan, Stephen, Sushaanth, U Lam, Vedant, Sahil }
consulted:
  {
   Ethan, Stephen, Sushaanth, U Lam, Vedant, Sahil
  }
informed:
  {
    Gagan, Vincent, Nishant
  }
---

# Electron for Desktop App Development

## Context and Problem Statement

We want our development journal to run locally on our operating system, at least the frontend, as a standalone desktop application. 
The primary goal is to improve the user experience and provide better UI/UX compared to running the app in a browser tab. 
The challenge is to choose a framework that enables this while balancing usability, reliability, and performance.

## Decision Drivers

- Familiarity and industry adoption of the framework
- Ease of packaging a web application into a desktop app
- User experience and interface quality
- Resource usage and performance considerations

## Considered Options

- Electron
- Tauri

## Decision Outcome

Chosen option: Electron, because it is a well-established standard for packaging web applications as desktop apps. 
It has a proven track record and is used by popular applications like WhatsApp, Discord, and others.

### Consequences

- Good, because it provides a consistent and familiar user experience.
- Good, because it implifies the process of converting web apps to desktop applications.
- Good, because backed by strong community support and extensive documentation.
- Bad, becuase it takes up a bit of memory (RAM), similar to Chrome.

## Pros and Cons of the Other Option

### Tauri

- Bad, becuase it is less widely adopted, so community support and documentation are limited.
- Bad, beacuase it involves a steeper learning curve for our team.
