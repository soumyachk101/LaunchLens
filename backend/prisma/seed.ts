import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultRules = [
  {
    key: 'env_missing_nextauth_url',
    title: 'NEXTAUTH_URL is missing or misconfigured',
    category: 'auth_config',
    severity: 'high',
    platformsJson: ['vercel', 'railway', 'netlify'],
    frameworksJson: ['nextjs'],
    patternsJson: ['NEXTAUTH_URL', 'Invalid URL', 'callback', 'redirect_uri_mismatch', 'CLIENT_FETCH_ERROR'],
    negativePatternsJson: [],
    recommendationsJson: [
      'Log in to your platform dashboard, select your project, and open "Environment Variables" settings.',
      'Add a new environment variable: NEXTAUTH_URL set to your deployment domain (e.g. https://my-app.vercel.app).',
      'In the GitHub Developer panel or auth provider console, update the OAuth homepage and redirect Callback URL to match your domain (e.g. https://my-app.vercel.app/api/auth/callback/github).',
      'Trigger a new redeploy to apply the updated environment variables.'
    ],
    validationJson: [
      'Attempt sign in inside a new Incognito tab.',
      'Check the callback URL returned in browser network logs to verify it matches the current domain.'
    ]
  },
  {
    key: 'db_prisma_timeout',
    title: 'PostgreSQL Database URL or Network Connection Timeout',
    category: 'db_conn',
    severity: 'critical',
    platformsJson: ['vercel', 'railway', 'netlify', 'node'],
    frameworksJson: ['nextjs', 'react', 'node', 'express'],
    patternsJson: ['PrismaClientInitializationError', 'reach database server', 'Connection timed out', 'Invalid value for DATABASE_URL', 'ECONNREFUSED'],
    negativePatternsJson: [],
    recommendationsJson: [
      'Confirm that your PostgreSQL database service is active, running, and not suspended by the hosting provider.',
      'If using private internal networking (e.g., postgres.railway.internal) from outside the platform private network VPC, switch your DATABASE_URL reference to the public database TCP host address.',
      'Ensure the DATABASE_URL connection string username, password, port, and database name are correct.',
      'Verify that local env vars are synchronized with your production database server parameters.'
    ],
    validationJson: [
      'Run a direct connection test using a psql terminal client: psql <DATABASE_URL>',
      'Check database firewall/allowlist settings to ensure traffic from your server host is permitted.'
    ]
  },
  {
    key: 'api_cors_blocked',
    title: 'Cross-Origin Resource Sharing (CORS) Policy Block',
    category: 'api_cors',
    severity: 'medium',
    platformsJson: ['vercel', 'netlify', 'node'],
    frameworksJson: ['nextjs', 'react', 'node', 'express'],
    patternsJson: ['blocked by CORS policy', 'No \'Access-Control-Allow-Origin\' header is present', 'CORS preflight channel failed'],
    negativePatternsJson: [],
    recommendationsJson: [
      'Locate CORS configs or cors() middleware setup on your API backend server.',
      'Add the frontend deployment origin URL (e.g. https://my-app.netlify.app) to the allowed CORS origins list.',
      'Ensure the API server responds to OPTIONS preflight requests with appropriate allow-origin headers.'
    ],
    validationJson: [
      'Execute a fetch request from browser console to confirm the Access-Control-Allow-Origin header is present on responses.',
      'Verify preflight request headers in browser Network inspection tools.'
    ]
  },
  {
    key: 'build_missing_module',
    title: 'Build dependency failure / Cannot find module',
    category: 'build_dep',
    severity: 'high',
    platformsJson: ['vercel', 'railway', 'netlify'],
    frameworksJson: ['nextjs', 'react', 'node'],
    patternsJson: ['Cannot find module', 'Module not found', 'npm ERR!', 'yarn error', 'failed to compile', 'Missing dependency'],
    negativePatternsJson: [],
    recommendationsJson: [
      'Confirm that the missing package is listed under "dependencies" or "devDependencies" in your package.json.',
      'Verify you did not accidentally import a dev dependency in production code.',
      'Run npm install locally and test compile (npm run build) to ensure lockfiles are synchronized before pushing.'
    ],
    validationJson: [
      'Check package-lock.json or yarn.lock changes to ensure the dependency is saved.',
      'Confirm the package name matches spelling exactly.'
    ]
  },
  {
    key: 'dns_ssl_failed',
    title: 'DNS custom domain propagation or SSL Handshake failure',
    category: 'dns_ssl',
    severity: 'high',
    platformsJson: ['vercel', 'railway', 'netlify', 'cloudflare'],
    frameworksJson: ['nextjs', 'react', 'node'],
    patternsJson: ['DNS resolution failed', 'SSL handshake', 'certificate expired', 'ERR_NAME_NOT_RESOLVED', 'untrusted certificate'],
    negativePatternsJson: [],
    recommendationsJson: [
      'Open your DNS provider panel (e.g. GoDaddy, Namecheap) and check that CNAME or A records point correctly to the platform hosts.',
      'Wait for DNS propagation (can take up to 24-48 hours, though usually faster).',
      'Verify that SSL certificates have generated correctly on your platform project panel.'
    ],
    validationJson: [
      'Run lookup test: nslookup <your-domain.com>',
      'Verify SSL validity by checking the lock icon details in the browser url bar.'
    ]
  }
];

async function main() {
  console.log('Seeding rules library...');

  for (const rule of defaultRules) {
    await prisma.rule.upsert({
      where: { key: rule.key },
      update: {
        title: rule.title,
        category: rule.category,
        severity: rule.severity,
        platformsJson: rule.platformsJson,
        frameworksJson: rule.frameworksJson,
        patternsJson: rule.patternsJson,
        negativePatternsJson: rule.negativePatternsJson,
        recommendationsJson: rule.recommendationsJson,
        validationJson: rule.validationJson,
      },
      create: {
        key: rule.key,
        title: rule.title,
        category: rule.category,
        severity: rule.severity,
        platformsJson: rule.platformsJson,
        frameworksJson: rule.frameworksJson,
        patternsJson: rule.patternsJson,
        negativePatternsJson: rule.negativePatternsJson,
        recommendationsJson: rule.recommendationsJson,
        validationJson: rule.validationJson,
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
