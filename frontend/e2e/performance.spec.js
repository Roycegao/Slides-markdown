import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.app-container');
  });

  test('should load slides quickly', async ({ page }) => {
    const startTime = Date.now();
    // Wait for all slides to load
    await page.waitForSelector('.slide-item');
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000); // Load within 2 seconds
  });

  test('should render preview quickly', async ({ page }) => {
    // Select first slide
    await page.click('.slide-item:first-child');
    const startTime = Date.now();
    // Input large amount of Markdown content
    const editor = page.getByRole('textbox');
    await editor.fill(`
# Performance Test
## Large Content
${Array(100).fill('This is a test paragraph. ').join('\n\n')}
\`\`\`javascript
${Array(50).fill('const test = "This is a test code block";').join('\n')}
\`\`\`
    `);
    // Wait for preview update
    await page.waitForTimeout(100);
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(100); // Render within 100ms
  });

  test('should navigate between slides quickly', async ({ page }) => {
    const navigationTimes = [];
    // Quick navigation 10 times
    for (let i = 0; i < 10; i++) {
      const startTime = Date.now();
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(50);
      const time = Date.now() - startTime;
      navigationTimes.push(time);
      // Verify navigation time for each
      expect(time).toBeLessThan(50); // Each navigation within 50ms
    }
    // Verify average navigation time
    const avgTime = navigationTimes.reduce((a, b) => a + b) / navigationTimes.length;
    expect(avgTime).toBeLessThan(30); // Average navigation time less than 30ms
  });

  test('should handle large content efficiently', async ({ page }) => {
    // Create slide with large content
    await page.click('button:has-text("+")');
    const editor = page.getByRole('textbox');
    const largeContent = Array(1000).fill('# Large Content\n\nThis is a test paragraph.\n\n').join('');
    await editor.fill(largeContent);
    // Wait for preview update
    await page.waitForTimeout(500);
    const renderTime = Date.now() - startTime;
    expect(renderTime).toBeLessThan(500); // Render large content within 500ms
  });

  test('should maintain smooth scrolling with many slides', async ({ page }) => {
    // 创建多个幻灯片
    for (let i = 0; i < 20; i++) {
      await page.click('button:has-text("+")');
    }
    
    const scrollTimes = [];
    
    // 测试滚动性能
    for (let i = 0; i < 5; i++) {
      const startTime = Date.now();
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitForTimeout(100); // 等待滚动完成
      scrollTimes.push(Date.now() - startTime);
    }
    
    // 验证滚动性能
    scrollTimes.forEach(time => {
      expect(time).toBeLessThan(100); // 每次滚动在 100ms 内完成
    });
  });

  test('should handle concurrent operations', async ({ page }) => {
    const operationTimes = [];
    
    // 同时执行多个操作
    const startTime = Date.now();
    
    // 并行执行多个操作
    await Promise.all([
      page.click('button:has-text("+")'),
      page.keyboard.press('Control+S'),
      page.click('button:has-text("Preview")'),
    ]);
    
    // 等待所有操作完成
    await page.waitForSelector('.slide-preview-content');
    
    const totalTime = Date.now() - startTime;
    expect(totalTime).toBeLessThan(300); // 并发操作在 300ms 内完成
  });

  test('should maintain performance during long editing sessions', async ({ page }) => {
    const editTimes = [];
    
    // 模拟长时间编辑会话
    for (let i = 0; i < 50; i++) {
      const editor = page.getByRole('textbox');
      const startTime = Date.now();
      
      // 执行编辑操作
      await editor.fill(`# Edit ${i}\n\nContent ${i}`);
      await page.waitForSelector('.slide-preview-content');
      
      editTimes.push(Date.now() - startTime);
    }
    
    // 验证编辑性能是否保持稳定
    const avgTime = editTimes.reduce((a, b) => a + b) / editTimes.length;
    expect(avgTime).toBeLessThan(100); // 平均编辑时间小于 100ms
    
    // 验证性能是否随时间保持稳定
    const firstHalfAvg = editTimes.slice(0, 25).reduce((a, b) => a + b) / 25;
    const secondHalfAvg = editTimes.slice(25).reduce((a, b) => a + b) / 25;
    expect(Math.abs(firstHalfAvg - secondHalfAvg)).toBeLessThan(20); // 性能波动小于 20ms
  });

  test('should handle memory usage efficiently', async ({ page }) => {
    // 获取初始内存使用情况
    const initialMemory = await page.evaluate(() => performance.memory.usedJSHeapSize);
    
    // 执行内存密集型操作
    for (let i = 0; i < 10; i++) {
      await page.click('button:has-text("+")');
      const editor = page.getByRole('textbox');
      await editor.fill(`# Slide ${i}\n\n${Array(100).fill('Content').join('\n')}`);
    }
    
    // 获取最终内存使用情况
    const finalMemory = await page.evaluate(() => performance.memory.usedJSHeapSize);
    
    // 验证内存增长是否在合理范围内（小于 50MB）
    const memoryIncrease = (finalMemory - initialMemory) / (1024 * 1024);
    expect(memoryIncrease).toBeLessThan(50);
  });
}); 