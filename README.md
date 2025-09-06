# Autamigo Invoice Processing - Playwright Test Suite

This repository contains an automated test suite for the invoice processing functionality of the Autamigo web application. The tests are written using [Playwright](https://playwright.dev/), a modern and powerful browser automation framework.

## Test Plan
The primary test is a single E2E flow that:
- Logs into the application.
- Navigates to the - Document Centre and opens the first invoice.
- Performs a detailed data integrity check on every field in the Details, Amount, and 
- Invoice Lines sections.
It heavily utilizes soft assertions (expect.soft()) to ensure that if one data point is incorrect, the test will continue to run and report all data validation failures at once, rather than stopping at the first error.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

-   **Node.js**: Version 18.x or later is recommended. You can download it from [nodejs.org](https://nodejs.org/).
-   **npm**: Node Package Manager, which is included with Node.js.
-   **Git**: For cloning the repository.
-   **(Recommended) Visual Studio Code**: A code editor with excellent support for JavaScript/TypeScript.
-   **(Recommended) Playwright Test for VS Code Extension**: For the best development experience, install this extension from the VS Code Marketplace.

## Getting Started

Follow these steps to get the project set up on your local machine.

### 1. Clone the Repository

First, clone this repository to your local machine using Git.

```bash
git clone <your-repository-url>
cd <repository-folder-name>
```

### 2. Configure Environment Variables

This project requires credentials to log in for testing. These are managed using a `.env` file, which is kept private and should never be committed to version control.

1.  **Create your local `.env` file** by copying the example template.

    *On macOS or Linux:*
    ```bash
    cp .env.example .env
    ```

    *On Windows Command Prompt:*
    ```bash
    copy .env.example .env
    ```

2.  **Update the `.env` file**: Open the newly created `.env` file and replace the placeholder values with your actual test credentials.

    ```env
    PW_USERNAME="username"
    PW_PASSWORD="password"
    ```

### 3. Install Dependencies

Once you have configured your environment variables, install all the necessary dependencies, including Playwright and its browsers.

```bash
# This will install all packages listed in package.json
npm install

# This will download the browsers (Chromium, Firefox, WebKit) needed by Playwright
npx playwright install
```

## Running the Tests

The test suite is configured to run headlessly by default. You can execute the tests from your terminal.

### Running the Tests

You can run the test suite from your terminal in two primary modes.

**Run tests with browser NOT showing (Headless Mode)**

This is the default and fastest way to run tests. It's ideal for CI/CD pipelines or when you just need the results quickly.

```bash
npx playwright test
```

### Run Tests in Headed Mode

To watch the tests execute in a live browser window, use the `--headed` flag. This is extremely useful for debugging.

```bash
npx playwright test --headed
```

## Viewing Test Results

After the tests have finished running, a comprehensive HTML report is generated. This report is the best way to visualize the results.

### Open the HTML Report

To open the last test run's report, use the following command:

```bash
npx playwright show-report
```

This will start a local web server and open the report in your default browser. The report includes:
-   A summary of all passed, failed, and skipped tests.
-   Detailed information for each test, including the steps executed.
-   Error logs, and full-page traces for failed tests, allowing you to debug issues effectively.