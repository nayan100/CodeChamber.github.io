const { chromium } = require('playwright');
const path = require('path');

const urls = [
    { url: 'http://localhost:3000', name: 'public_landing' },
    { url: 'http://localhost:3000/admin/dashboard', name: 'admin_dashboard' },
    { url: 'http://localhost:3000/admin/projects', name: 'admin_projects' },
    { url: 'http://localhost:3000/admin/experience', name: 'admin_experience' },
    { url: 'http://localhost:3000/admin/skills', name: 'admin_skills' },
    { url: 'http://localhost:3000/admin/blog', name: 'admin_blog' },
    { url: 'http://localhost:3000/admin/messages', name: 'admin_messages' },
    { url: 'http://localhost:3000/admin/ai', name: 'admin_ai' }
];

const token = "eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..JHf1a4rMFfNe6Vmk.nJd9yGMyZ4qxOE09uNiwggoZ9vI5sxY8qKlwxeHUta_D3HNojEp4c2THWufPwizI2CujjNjErsO-RYAOSB-GGHlGBWpRghL1EBRBr9Zl-QobQGHkSPPxSNsV8YipqeNL-0WGUah3rnY.IoJVoDroDmbMvb8-UpkygA";

(async () => {
    const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
    const context = await browser.newContext({
        colorScheme: 'light'
    });

    await context.addInitScript(() => {
        window.localStorage.setItem('theme', 'light');
    });

    await context.addCookies([{
        name: 'next-auth.session-token',
        value: token,
        domain: 'localhost',
        path: '/',
        expires: -1,
        httpOnly: true,
        secure: false,
        sameSite: 'Lax'
    }]);

    for (const item of urls) {
        try {
            const page = await context.newPage();
            await page.setViewportSize({ width: 1440, height: 900 });
            await page.goto(item.url, { waitUntil: 'load', timeout: 60000 });
            await page.waitForTimeout(1000); // allow animations
            const outPath = path.join('/home/gunmetal/.gemini/antigravity/brain/0a59ce7c-7d4f-40d0-95c9-c43827fc86b0', `${ item.name }.png`);
            await page.screenshot({ path: outPath, fullPage: true });
            console.log(`Captured ${ item.name }.png`);
            await page.close();
        } catch (e) {
            console.error(`Error capturing ${ item.name }: ${ e.message }`);
        }
    }

    await browser.close();
})();
