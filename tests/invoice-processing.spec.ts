import { test, expect } from '@playwright/test';

// A check to ensure the .env file was loaded correctly before any tests run.
if (!process.env.PW_USERNAME || !process.env.PW_PASSWORD) {
  throw new Error('Test environment variables PW_USERNAME or PW_PASSWORD are not set. Please check your .env file.');
}

test('should perform a full end-to-end data verification of the invoice', async ({ page }) => {

  // ==================================================================
  // 1. SETUP: LOGIN AND NAVIGATE
  // ==================================================================
  await page.goto('/');
  await page.getByPlaceholder('Email Address').fill(process.env.PW_USERNAME!);
  await page.getByPlaceholder('Password').fill(process.env.PW_PASSWORD!);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Hard expect: If the dashboard doesn't load, the entire test is invalid.
  await expect(page.locator('ds-document-centre')).toBeVisible({ timeout: 15000 });
  
  // Click on the first invoice to open the editor.
  await page.locator('.dx-datagrid-rowsview .dx-row.dx-data-row').first().click();
  
  // Hard expect: If the editor doesn't open, the test cannot proceed.
  await expect(page.locator('ds-document-centre-invoice-item')).toBeVisible();

  // ==================================================================
  // 2. VERIFY INITIAL DATA (using expect.soft for a full report)
  // ==================================================================

  // --- Details Section ---
  const detailsHeader = page.locator('mat-expansion-panel-header', { hasText: 'Details' });
  await expect.soft(detailsHeader, 'Details panel should be expanded by default').toHaveAttribute('aria-expanded', 'true');
  
  const supplierInput = page.locator('lt-lookup-ds-payable-account .dx-texteditor-input');
  await expect.soft(supplierInput, 'Supplier name should be correct').toHaveValue('(SIMPRO23) Bayside Club');
  
  const invoiceNumberInput = page.locator('lt-text[prompt="Invoice no."] .dx-texteditor-input');
  await expect.soft(invoiceNumberInput, 'Invoice number should be correct').toHaveValue('45348966');

  const invoiceDateInput = page.locator('lt-date[prompt="Invoice date"] .dx-texteditor-input');
  await expect.soft(invoiceDateInput, 'Invoice date should be correct').toHaveValue('11/08/2025');

  const poNumberInput = page.locator('lt-text[prompt="P/O no."] .dx-texteditor-input');
  await expect.soft(poNumberInput, 'P/O number should be correct').toHaveValue('372');

  // --- Amount Section ---
  const amountHeader = page.locator('mat-expansion-panel-header', { hasText: 'Amount' });
  await amountHeader.click();
  await expect.soft(amountHeader, 'Amount panel should be expanded after click').toHaveAttribute('aria-expanded', 'true');
  await amountHeader.scrollIntoViewIfNeeded(); // Scroll down to ensure it's visible

  const subtotalInput = page.locator('lt-money[prompt="Subtotal"] .dx-texteditor-input');
  await expect.soft(subtotalInput, "Subtotal should be correct").toHaveValue('$161.98');

  const taxInput = page.locator('lt-money[prompt="Tax"] .dx-texteditor-input');
  await expect.soft(taxInput, "Tax should be correct").toHaveValue('$16.20');
  
  const totalInput = page.locator('lt-money[prompt="Total"] .dx-texteditor-input');
  await expect.soft(totalInput, "Total should be correct").toHaveValue('$178.18');

  // --- Invoice Lines Section ---
  const invoiceLinesHeader = page.locator('mat-expansion-panel-header', { hasText: 'Invoice Lines' });
  await invoiceLinesHeader.click();
  await expect.soft(invoiceLinesHeader, 'Invoice Lines panel should be expanded after click').toHaveAttribute('aria-expanded', 'true');
  await invoiceLinesHeader.scrollIntoViewIfNeeded(); // Scroll down to ensure it's visible

  const expectedLines = [
    { code: 'GRTD0035', description: 'TIE DOWN RATCHET 25MMX3M', quantity: '3.00', price: '10.000', total: '30.00' },
    { code: 'GRTD0036', description: 'TIE DOWN RATCHET 27MMX3M', quantity: '2.00', price: '15.990', total: '31.98' },
    { code: 'GRTD0037', description: 'TIE DOWN RATCHET 30MMX3M', quantity: '4.00', price: '25.000', total: '100.00' }  
  ];
  const invoiceLinesGrid = page.locator('lt-expandable-panel[title="Invoice Lines"] lt-grid');
  const rows = invoiceLinesGrid.locator('.dx-data-row');
  await expect.soft(rows, 'Should find the correct number of invoice lines').toHaveCount(expectedLines.length);

  for (let i = 0; i < expectedLines.length; i++) {
    const expected = expectedLines[i];
    const row = rows.nth(i);
    await expect.soft(row.locator('td').nth(0), `Code for row ${i + 1}`).toHaveText(expected.code);
    await expect.soft(row.locator('td').nth(1), `Description for row ${i + 1}`).toHaveText(expected.description);
    await expect.soft(row.locator('td').nth(2), `Quantity for row ${i + 1}`).toHaveText(expected.quantity);
    await expect.soft(row.locator('td').nth(3), `Price for row ${i + 1}`).toHaveText(expected.price);
    await expect.soft(row.locator('td').nth(4), `Line total for row ${i + 1}`).toHaveText(expected.total);
  }
  
  const summaryElement = page.locator('.lines-summary');
  await expect.soft(summaryElement, 'Line total summary should be correct').toContainText('Line total (excl. tax): 161.98');
});