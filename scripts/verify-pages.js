const http = require('http');

const pages = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/blog',
  '/blog/omnichannel-social-strategy-2026',
  '/help',
  '/contact',
  '/privacy',
  '/terms',
  '/dashboard',
  '/dashboard/accounts',
  '/dashboard/posts',
  '/dashboard/stories',
  '/dashboard/calendar',
  '/dashboard/inbox',
  '/dashboard/analytics',
  '/dashboard/team',
  '/dashboard/media',
  '/dashboard/reports',
  '/dashboard/blog-admin',
  '/dashboard/settings/profile',
  '/dashboard/settings/security',
  '/dashboard/settings/billing',
];

async function checkUrl(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          path,
          statusCode: res.statusCode,
          hasViewport: data.includes('name="viewport"'),
          hasThemeTokens: data.includes('dark:') || data.includes('bg-'),
          length: data.length,
        });
      });
    }).on('error', (err) => {
      resolve({ path, statusCode: 500, error: err.message });
    });
  });
}

async function run() {
  console.log('🔍 Auditing all 24 core pages on production server...');
  let allPass = true;
  for (const page of pages) {
    const res = await checkUrl(page);
    const pass = res.statusCode === 200 && res.length > 500;
    if (!pass) allPass = false;
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${res.path} -> Status: ${res.statusCode}, Bytes: ${res.length}, Viewport: ${res.hasViewport}`);
  }

  if (allPass) {
    console.log('\n🎉 ALL 24 PRODUCTION ROUTES VERIFIED WITH STATUS 200 OK!');
    process.exit(0);
  } else {
    console.error('\n❌ SOME PAGES FAILED AUDIT');
    process.exit(1);
  }
}

run();
