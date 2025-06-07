import { test, expect } from '@playwright/test';

test.describe('Slide Editor E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Start backend server (in real project, ensure backend server is running)
    await page.goto('/');
    // Wait for app to load
    await page.waitForSelector('.app-container');
  });

  test('should load and display initial slides', async ({ page }) => {
    // Verify initial slides are loaded
    await expect(page.getByText('Welcome to Slides')).toBeVisible();
    await expect(page.getByText('Features')).toBeVisible();
  });

  test('should create a new slide', async ({ page }) => {
    // Click add button
    await page.click('button:has-text("+")');
    
    // Verify new slide is created
    await expect(page.getByText('New Slide')).toBeVisible();
    
    // Verify editor is displayed
    await expect(page.getByRole('textbox')).toBeVisible();
  });

  test('should edit slide content', async ({ page }) => {
    // Select first slide
    await page.click('text=Welcome to Slides');
    
    // Edit content
    const editor = page.getByRole('textbox');
    await editor.fill('# Updated Title\n\nUpdated content');
    
    // Verify content is updated
    await expect(page.getByText('Updated Title')).toBeVisible();
    await expect(page.getByText('Updated content')).toBeVisible();
  });

  test('should navigate between slides using keyboard', async ({ page }) => {
    // Verify initial slides
    await expect(page.getByText('Welcome to Slides')).toBeVisible();
    
    // Use keyboard navigation to next slide
    await page.keyboard.press('ArrowRight');
    await expect(page.getByText('Getting Started')).toBeVisible();
    
    // Return to previous slide
    await page.keyboard.press('ArrowLeft');
    await expect(page.getByText('Welcome to Slides')).toBeVisible();
  });

  test('should toggle fullscreen mode', async ({ page }) => {
    // Enter fullscreen mode
    await page.click('button:has-text("Preview")');
    
    // Verify fullscreen status
    await expect(page.locator('.fullscreen-preview-container')).toBeVisible();
    await expect(page.getByRole('textbox')).not.toBeVisible();
    
    // Exit fullscreen mode
    await page.keyboard.press('Escape');
    await expect(page.getByRole('textbox')).toBeVisible();
  });

  test('should delete a slide', async ({ page }) => {
    // Select slide to delete
    await page.click('text=Getting Started');
    
    // Click delete button
    await page.click('button:has-text("-")');
    
    // Verify slide is deleted
    await expect(page.getByText('Getting Started')).not.toBeVisible();
  });

  test('should handle different slide layouts', async ({ page }) => {
    // Test code layout
    await page.click('text=Markdown Highlight Demo');
    await expect(page.locator('.slide-layout-code')).toBeVisible();
    await expect(page.getByText('Code block with syntax highlight')).toBeVisible();
    
    // Test split layout
    await page.click('text=Design Considerations');
    await expect(page.locator('.slide-layout-split')).toBeVisible();
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile device viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify mobile layout
    await expect(page.locator('.sidebar')).toHaveCSS('display', 'none');
    await expect(page.locator('.preview-container')).toBeVisible();
    
    // Verify navigation buttons are visible
    await expect(page.getByRole('button', { name: '←' })).toBeVisible();
    await expect(page.getByRole('button', { name: '→' })).toBeVisible();
  });

  test('should handle markdown formatting', async ({ page }) => {
    // Select first slide
    await page.click('text=Welcome to Slides');
    
    // Edit content, add various Markdown formats
    const editor = page.getByRole('textbox');
    await editor.fill(`
# Title
## Subtitle

**Bold text** and *italic text*

- List item 1
- List item 2

\`\`\`javascript
const code = 'example';
console.log(code);
\`\`\`

> Blockquote

[Link](https://example.com)
    `);
    
    // Verify format is correctly rendered
    await expect(page.getByText('Title')).toBeVisible();
    await expect(page.getByText('Subtitle')).toBeVisible();
    await expect(page.getByText('Bold text')).toHaveCSS('font-weight', '700');
    await expect(page.getByText('italic text')).toHaveCSS('font-style', 'italic');
    await expect(page.getByText('List item 1')).toBeVisible();
    await expect(page.getByText('const code')).toBeVisible();
    await expect(page.getByText('Blockquote')).toBeVisible();
    await expect(page.getByRole('link')).toHaveAttribute('href', 'https://example.com');
  });

  test('should handle keyboard shortcuts', async ({ page }) => {
    // Test save shortcut
    await page.keyboard.press('Control+S');
    // Verify save status (may need to add save success prompt)
    
    // Test new slide shortcut
    await page.keyboard.press('Control+N');
    await expect(page.getByText('New Slide')).toBeVisible();
    
    // Test delete slide shortcut
    await page.keyboard.press('Control+D');
    // Verify delete confirmation dialog
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Simulate network error (by modifying backend API response)
    await page.route('**/api/slides', route => 
      route.fulfill({ status: 500, body: 'Internal Server Error' })
    );
    
    // Refresh page
    await page.reload();
    
    // Verify error message
    await expect(page.getByText('Error loading slides')).toBeVisible();
  });

  test('should maintain slide order after operations', async ({ page }) => {
    // Create new slide
    await page.click('button:has-text("+")');
    
    // Verify order
    const slides = await page.$$('.slide-item');
    expect(slides.length).toBeGreaterThan(1);
    
    // Verify new slide is last
    const lastSlide = await slides[slides.length - 1].textContent();
    expect(lastSlide).toContain('New Slide');
  });
}); 
 