const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = '/home/gunmetal/.gemini/antigravity/brain/0a59ce7c-7d4f-40d0-95c9-c43827fc86b0';

async function captureSections() {
    console.log('Starting Playwright for sectional capture (light theme)...');

    const browser = await chromium.launch({
        executablePath: '/usr/bin/google-chrome',
        headless: true
    });

    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        colorScheme: 'light',
    });

    await context.addInitScript(() => {
        localStorage.setItem('theme', 'light');
    });

    const page = await context.newPage();

    console.log('Navigating to landing page...');
    await page.goto('http://localhost:3000', { waitUntil: 'load', timeout: 60000 });
    await page.waitForTimeout(2000); // Allow animations to settle

    const sections = [
        { id: '#about', name: 'section_about.png' },
        { id: '#experience', name: 'section_experience.png' },
        { id: '#projects', name: 'section_projects.png' },
        { id: '#blog', name: 'section_blog.png' },
        { id: '#leadership', name: 'section_leadership.png' },
        { id: '#contact', name: 'section_contact.png' }
    ];

    // Also capture the Hero separately since it might not have an ID or relies on main content
    console.log('Capturing Hero section...');
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(OUT_DIR, 'section_hero.png'), clip: { x: 0, y: 0, width: 1440, height: 900 } });

    for (const section of sections) {
        try {
            console.log(`Capturing ${ section.id }...`);
            const element = await page.locator(section.id);

            if (await element.count() > 0) {
                // Ensure element is visible
                await element.scrollIntoViewIfNeeded();
                await page.waitForTimeout(1000); // Allow scrolling & animations

                await element.screenshot({ path: path.join(OUT_DIR, section.name) });
                console.log(`Saved ${ section.name }`);
            } else {
                console.log(`Section ${ section.id } not found.`);
            }
        } catch (e) {
            console.error(`Failed to capture ${ section.id }:`, e.message);
        }
    }

    await browser.close();
    console.log('Sectional capture complete.');
}

captureSections().catch(console.error);
