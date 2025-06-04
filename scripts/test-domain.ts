// scripts/test-domain.ts
// Run with: npx tsx scripts/test-domain.ts

import { vercelAPI } from '../src/lib/vercel';
import dns from 'dns';
import { promisify } from 'util';

const resolveTxt = promisify(dns.resolveTxt);
const resolveCname = promisify(dns.resolveCname);
const resolve4 = promisify(dns.resolve4);

async function testDomainSetup(domain: string) {
  console.log(`\n🔍 Testing domain: ${domain}`);
  console.log('='.repeat(50));

  // Test 1: Vercel API Connection
  console.log('\n1. Testing Vercel API connection...');
  try {
    const info = await vercelAPI.getDomainInfo(domain);
    if (info.success) {
      console.log('✅ Vercel API connected successfully');
      console.log('📊 Domain info:', JSON.stringify(info.data, null, 2));
    } else {
      console.log('❌ Vercel API failed:', info.error);
    }
  } catch (error) {
    console.log('❌ Vercel API error:', error);
  }

  // Test 2: DNS TXT Record Check
  console.log('\n2. Checking TXT record for ownership verification...');
  try {
    const txtRecords = await resolveTxt(`_linkbuilder-verify.${domain}`);
    console.log('✅ TXT records found:', txtRecords);
  } catch (error) {
    console.log('❌ TXT record not found or DNS error:', error);
  }

  // Test 3: DNS CNAME/A Record Check
  console.log('\n3. Checking domain pointing...');
  const isSubdomain = domain.split('.').length > 2;
  
  if (isSubdomain) {
    // Check CNAME for subdomain
    try {
      const cnameRecords = await resolveCname(domain);
      console.log('✅ CNAME records found:', cnameRecords);
      
      if (cnameRecords.includes('cname.vercel-dns.com')) {
        console.log('✅ Domain correctly points to Vercel');
      } else {
        console.log('⚠️ Domain doesn\'t point to Vercel CNAME target');
      }
    } catch (error) {
      console.log('❌ CNAME record not found:', error);
    }
  } else {
    // Check A record for root domain
    try {
      const aRecords = await resolve4(domain);
      console.log('✅ A records found:', aRecords);
      
      if (aRecords.includes('76.76.21.21')) {
        console.log('✅ Domain correctly points to Vercel IP');
      } else {
        console.log('⚠️ Domain doesn\'t point to Vercel IP');
      }
    } catch (error) {
      console.log('❌ A record not found:', error);
    }
  }

  // Test 4: HTTP/HTTPS Response
  console.log('\n4. Testing HTTP response...');
  try {
    const response = await fetch(`https://${domain}`, {
      method: 'HEAD',
      redirect: 'manual',
    });
    console.log(`✅ HTTPS response: ${response.status} ${response.statusText}`);
    console.log('📋 Response headers:');
    response.headers.forEach((value, key) => {
      console.log(`  ${key}: ${value}`);
    });
  } catch (error) {
    console.log('❌ HTTPS request failed:', error);
    
    // Try HTTP as fallback
    try {
      const httpResponse = await fetch(`http://${domain}`, {
        method: 'HEAD',
        redirect: 'manual',
      });
      console.log(`⚠️ HTTP response: ${httpResponse.status} ${httpResponse.statusText}`);
    } catch (httpError) {
      console.log('❌ HTTP request also failed:', httpError);
    }
  }

  // Test 5: SSL Certificate Check
  console.log('\n5. Testing SSL certificate...');
  try {
    const https = await import('https');
    const options = {
      hostname: domain,
      port: 443,
      path: '/',
      method: 'HEAD',
      timeout: 5000,
    };

    await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        console.log('✅ SSL certificate is valid');
        console.log(`📋 SSL info: ${res.socket.getPeerCertificate().subject.CN}`);
        resolve(res);
      });

      req.on('error', (error) => {
        console.log('❌ SSL certificate error:', error.message);
        reject(error);
      });

      req.on('timeout', () => {
        console.log('❌ SSL connection timeout');
        req.destroy();
        reject(new Error('Timeout'));
      });

      req.end();
    });
  } catch (error) {
    console.log('❌ SSL test failed:', error);
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Domain test completed for: ${domain}`);
}

async function addTestDomain(domain: string) {
  console.log(`\n🚀 Adding test domain to Vercel: ${domain}`);
  
  try {
    const result = await vercelAPI.addDomain(domain);
    if (result.success) {
      console.log('✅ Domain added successfully to Vercel');
      console.log('📊 Response:', JSON.stringify(result.data, null, 2));
    } else {
      console.log('❌ Failed to add domain:', result.error);
    }
  } catch (error) {
    console.log('❌ Error adding domain:', error);
  }
}

async function removeTestDomain(domain: string) {
  console.log(`\n🗑️ Removing test domain from Vercel: ${domain}`);
  
  try {
    const result = await vercelAPI.removeDomain(domain);
    if (result.success) {
      console.log('✅ Domain removed successfully from Vercel');
    } else {
      console.log('❌ Failed to remove domain:', result.error);
    }
  } catch (error) {
    console.log('❌ Error removing domain:', error);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const domain = args[1];

  if (!command || !domain) {
    console.log('Usage:');
    console.log('  npx tsx scripts/test-domain.ts test <domain>');
    console.log('  npx tsx scripts/test-domain.ts add <domain>');
    console.log('  npx tsx scripts/test-domain.ts remove <domain>');
    console.log('');
    console.log('Examples:');
    console.log('  npx tsx scripts/test-domain.ts test testprojecttestproject.site');
    console.log('  npx tsx scripts/test-domain.ts add testprojecttestproject.site');
    console.log('  npx tsx scripts/test-domain.ts remove testprojecttestproject.site');
    process.exit(1);
  }

  switch (command) {
    case 'test':
      await testDomainSetup(domain);
      break;
    case 'add':
      await addTestDomain(domain);
      break;
    case 'remove':
      await removeTestDomain(domain);
      break;
    default:
      console.log('❌ Unknown command. Use: test, add, or remove');
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}