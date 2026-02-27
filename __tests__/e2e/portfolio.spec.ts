import { test, expect } from '@playwright/test';

test.describe('Portfolio Website - Main Flows', () => {
  test('should display home page with visible h1', async ({ page }) => {
    await page.goto('/en');
    
    // Wait for page to load and check h1 is visible
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/en');
    
    // Click on About link in navigation
    await page.click('a[href="/en/about"]');
    
    // Validate URL changed
    await expect(page).toHaveURL('/en/about');
    
    // Validate page loaded (h1 should be visible)
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to links page', async ({ page }) => {
    await page.goto('/en');
    
    // Click on Links link in navigation
    await page.click('a[href="/en/links"]');
    
    // Validate URL changed
    await expect(page).toHaveURL('/en/links');
    
    // Validate page loaded
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should load GitHub projects', async ({ page }) => {
    await page.goto('/en');
    
    // Wait for projects section to be visible
    await page.waitForSelector('#projects', { timeout: 10000 });
    
    // Wait for project cards to load (they are rendered as Card components)
    // The ProjectsSection renders cards in a grid, so we look for the card elements
    const projectCards = page.locator('[class*="grid"] > div').filter({ 
      has: page.locator('svg[class*="lucide-github"]') 
    });
    
    // Wait for at least one project card to appear
    await expect(projectCards.first()).toBeVisible({ timeout: 15000 });
    
    // Validate that there are projects displayed
    const count = await projectCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should validate contact form submission', async ({ page }) => {
    await page.goto('/en');
    
    // Scroll to contact section
    await page.locator('#contact').scrollIntoViewIfNeeded();
    
    // Find the email input and submit button
    const emailInput = page.locator('input[type="email"]');
    const submitButton = page.locator('button[type="submit"]').filter({ hasText: /send message/i });
    
    // Wait for the button to be visible
    await expect(submitButton).toBeVisible();
    
    // Try to submit with empty email (should trigger HTML5 validation)
    await submitButton.click();
    
    // Check if the email input is invalid (HTML5 validation)
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
    
    // Now fill with invalid email format
    await emailInput.fill('invalid-email');
    await submitButton.click();
    
    // Check validation again
    const isStillInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isStillInvalid).toBe(true);
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/en');
    
    // Validate h1 is visible on mobile
    await expect(page.locator('h1').first()).toBeVisible();
    
    // Validate mobile menu button is visible
    const mobileMenuButton = page.locator('button[aria-label="Toggle menu"]');
    await expect(mobileMenuButton).toBeVisible();
    
    // Click mobile menu button to open menu
    await mobileMenuButton.click();
    
    // Validate mobile menu is open (navigation links should be visible in mobile menu)
    // Use more specific selectors for mobile menu items
    const mobileMenu = page.locator('.md\\:hidden.border-t');
    await expect(mobileMenu).toBeVisible();
    
    // Check that navigation links are visible in the mobile menu
    await expect(mobileMenu.locator('a[href="/en/about"]')).toBeVisible();
    await expect(mobileMenu.locator('a[href="/en/links"]')).toBeVisible();
  });
});
