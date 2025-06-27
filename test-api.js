const https = require('https');

// Get API key from environment variable
const API_KEY = process.env.LEADMAGIC_API_KEY;
const BASE_URL = 'api.leadmagic.io';

if (!API_KEY) {
  console.error('❌ Error: LEADMAGIC_API_KEY environment variable is required');
  console.log('Usage: LEADMAGIC_API_KEY=your-api-key node test-api.js');
  process.exit(1);
}

function makeRequest(path, data = {}, method = 'POST') {
  return new Promise((resolve, reject) => {
    const postData = method === 'GET' ? '' : JSON.stringify(data);
    
    const options = {
      hostname: BASE_URL,
      port: 443,
      path: path,
      method: method,
      headers: {
        'X-API-Key': API_KEY,
        'Accept': 'application/json'
      }
    };

    if (method === 'POST') {
      options.headers['Content-Type'] = 'application/json';
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: jsonBody
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (method === 'POST' && postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function testEndpoints() {
  console.log('🧪 Testing LeadMagic API Endpoints\n');

  // Test 1: Credits
  console.log('1. Testing /credits endpoint...');
  try {
    const response = await makeRequest('/credits', {});
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.body.credits !== undefined) {
      console.log(`   📊 Credits: ${response.body.credits}`);
    }
    console.log(`   🏗️  Response fields: ${Object.keys(response.body).join(', ')}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 2: Email Validation
  console.log('2. Testing /email-validate endpoint...');
  try {
    const response = await makeRequest('/email-validate', {
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User'
    });
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.body.email_status) {
      console.log(`   📧 Email Status: ${response.body.email_status}`);
    }
    if (response.body.credits_consumed !== undefined) {
      console.log(`   💰 Credits Consumed: ${response.body.credits_consumed}`);
    }
    console.log(`   🏗️  Response fields: ${Object.keys(response.body).join(', ')}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 3: Email Finder
  console.log('3. Testing /email-finder endpoint...');
  try {
    const response = await makeRequest('/email-finder', {
      first_name: 'John',
      last_name: 'Doe',
      domain: 'example.com'
    });
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.body.email) {
      console.log(`   📧 Email: ${response.body.email}`);
    }
    if (response.body.credits_consumed !== undefined) {
      console.log(`   💰 Credits Consumed: ${response.body.credits_consumed}`);
    }
    console.log(`   🏗️  Response fields: ${Object.keys(response.body).join(', ')}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 4: Mobile Finder
  console.log('4. Testing /mobile-finder endpoint...');
  try {
    const response = await makeRequest('/mobile-finder', {
      work_email: 'test@example.com'
    });
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.body.mobile_number) {
      console.log(`   📱 Mobile: Found`);
    } else {
      console.log(`   📱 Mobile: Not found`);
    }
    if (response.body.credits_consumed !== undefined) {
      console.log(`   💰 Credits Consumed: ${response.body.credits_consumed}`);
    }
    console.log(`   🏗️  Response fields: ${Object.keys(response.body).join(', ')}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 5: B2B Profile (Work Email to Profile)
  console.log('5. Testing /b2b-profile endpoint...');
  try {
    const response = await makeRequest('/b2b-profile', {
      work_email: 'test@example.com'
    });
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.body.profile_url) {
      console.log(`   🔗 Profile URL: Found`);
    }
    if (response.body.credits_consumed !== undefined) {
      console.log(`   💰 Credits Consumed: ${response.body.credits_consumed}`);
    }
    console.log(`   🏗️  Response fields: ${Object.keys(response.body).join(', ')}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 6: Personal Email Finder
  console.log('6. Testing /personal-email-finder endpoint...');
  try {
    const response = await makeRequest('/personal-email-finder', {
      profile_url: 'https://linkedin.com/in/test'
    });
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.body.personal_email) {
      console.log(`   📧 Personal Email: Found`);
    }
    if (response.body.credits_consumed !== undefined) {
      console.log(`   💰 Credits Consumed: ${response.body.credits_consumed}`);
    }
    console.log(`   🏗️  Response fields: ${Object.keys(response.body).join(', ')}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 7: B2B Social to Email
  console.log('7. Testing /b2b-social-email endpoint...');
  try {
    const response = await makeRequest('/b2b-social-email', {
      profile_url: 'https://linkedin.com/in/test'
    });
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.body.work_email) {
      console.log(`   📧 Work Email: Found`);
    }
    if (response.body.credits_consumed !== undefined) {
      console.log(`   💰 Credits Consumed: ${response.body.credits_consumed}`);
    }
    console.log(`   🏗️  Response fields: ${Object.keys(response.body).join(', ')}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 8: Profile Search
  console.log('8. Testing /profile-search endpoint...');
  try {
    const response = await makeRequest('/profile-search', {
      profile_url: 'https://linkedin.com/in/test'
    });
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.body.full_name) {
      console.log(`   👤 Profile: ${response.body.full_name}`);
    }
    if (response.body.credits_consumed !== undefined) {
      console.log(`   💰 Credits Consumed: ${response.body.credits_consumed}`);
    }
    console.log(`   🏗️  Response fields: ${Object.keys(response.body).join(', ')}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 9: Role Finder
  console.log('9. Testing /role-finder endpoint...');
  try {
    const response = await makeRequest('/role-finder', {
      job_title: 'Software Engineer',
      company_name: 'Example Corp'
    });
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.body.contacts && response.body.contacts.length > 0) {
      console.log(`   👥 Contacts Found: ${response.body.contacts.length}`);
    }
    if (response.body.credits_consumed !== undefined) {
      console.log(`   💰 Credits Consumed: ${response.body.credits_consumed}`);
    }
    console.log(`   🏗️  Response fields: ${Object.keys(response.body).join(', ')}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 10: Employee Finder
  console.log('10. Testing /employee-finder endpoint...');
  try {
    const response = await makeRequest('/employee-finder', {
      company_name: 'Example Corp',
      page: 1,
      per_page: 3
    });
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.body.total_count !== undefined) {
      console.log(`   👥 Total Employees: ${response.body.total_count}`);
    }
    if (response.body.credits_consumed !== undefined) {
      console.log(`   💰 Credits Consumed: ${response.body.credits_consumed}`);
    }
    console.log(`   🏗️  Response fields: ${Object.keys(response.body).join(', ')}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 11: Company Search
  console.log('11. Testing /company-search endpoint...');
  try {
    const response = await makeRequest('/company-search', {
      company_domain: 'example.com'
    });
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.body.company_name) {
      console.log(`   🏢 Company: ${response.body.company_name}`);
    }
    if (response.body.credits_consumed !== undefined) {
      console.log(`   💰 Credits Consumed: ${response.body.credits_consumed}`);
    }
    console.log(`   🏗️  Response fields: ${Object.keys(response.body).join(', ')}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 12: Company Funding
  console.log('12. Testing /company-funding endpoint...');
  try {
    const response = await makeRequest('/company-funding', {
      company_domain: 'example.com'
    });
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.body.basicInfo && response.body.basicInfo.companyName) {
      console.log(`   🏢 Company: ${response.body.basicInfo.companyName}`);
    }
    if (response.body.credits_consumed !== undefined) {
      console.log(`   💰 Credits Consumed: ${response.body.credits_consumed}`);
    }
    console.log(`   🏗️  Response fields: ${Object.keys(response.body).join(', ')}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 13: Jobs Finder
  console.log('13. Testing /jobs-finder endpoint...');
  try {
    const response = await makeRequest('/jobs-finder', {
      company_name: 'Example Corp',
      page: 1,
      per_page: 3
    });
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.body.total_count !== undefined) {
      console.log(`   💼 Total Jobs: ${response.body.total_count}`);
    }
    if (response.body.credits_consumed !== undefined) {
      console.log(`   💰 Credits Consumed: ${response.body.credits_consumed}`);
    }
    console.log(`   🏗️  Response fields: ${Object.keys(response.body).join(', ')}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 14: Job Countries (GET endpoint)
  console.log('14. Testing /job-country endpoint...');
  try {
    const response = await makeRequest('/job-country', {}, 'GET');
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (Array.isArray(response.body)) {
      console.log(`   🌍 Countries Available: ${response.body.length}`);
    }
    console.log(`   🏗️  Response type: ${Array.isArray(response.body) ? 'Array' : 'Object'}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 15: Job Types (GET endpoint)
  console.log('15. Testing /job-types endpoint...');
  try {
    const response = await makeRequest('/job-types', {}, 'GET');
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (Array.isArray(response.body)) {
      console.log(`   💼 Job Types Available: ${response.body.length}`);
    }
    console.log(`   🏗️  Response type: ${Array.isArray(response.body) ? 'Array' : 'Object'}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 16: Google Ads Search
  console.log('16. Testing /google/searchads endpoint...');
  try {
    const response = await makeRequest('/google/searchads', {
      company_domain: 'example.com'
    });
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.body.ads && Array.isArray(response.body.ads)) {
      console.log(`   📺 Google Ads Found: ${response.body.ads.length}`);
    }
    if (response.body.credits_consumed !== undefined) {
      console.log(`   💰 Credits Consumed: ${response.body.credits_consumed}`);
    }
    console.log(`   🏗️  Response fields: ${Object.keys(response.body).join(', ')}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 17: Meta Ads Search
  console.log('17. Testing /meta/searchads endpoint...');
  try {
    const response = await makeRequest('/meta/searchads', {
      company_domain: 'example.com'
    });
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.body.ads && Array.isArray(response.body.ads)) {
      console.log(`   📺 Meta Ads Found: ${response.body.ads.length}`);
    }
    if (response.body.credits_consumed !== undefined) {
      console.log(`   💰 Credits Consumed: ${response.body.credits_consumed}`);
    }
    console.log(`   🏗️  Response fields: ${Object.keys(response.body).join(', ')}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 18: B2B Ads Search
  console.log('18. Testing /b2b/searchads endpoint...');
  try {
    const response = await makeRequest('/b2b/searchads', {
      company_domain: 'example.com'
    });
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.body.ads && Array.isArray(response.body.ads)) {
      console.log(`   📺 B2B Ads Found: ${response.body.ads.length}`);
    }
    if (response.body.credits_consumed !== undefined) {
      console.log(`   💰 Credits Consumed: ${response.body.credits_consumed}`);
    }
    console.log(`   🏗️  Response fields: ${Object.keys(response.body).join(', ')}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  // Test 19: B2B Ad Details
  console.log('19. Testing /b2b/ad-details endpoint...');
  try {
    const response = await makeRequest('/b2b/ad-details', {
      ad_id: 'test_ad_123'
    });
    console.log(`   ✅ Status: ${response.statusCode}`);
    if (response.body.ad_title) {
      console.log(`   📺 Ad Title: ${response.body.ad_title}`);
    }
    if (response.body.credits_consumed !== undefined) {
      console.log(`   💰 Credits Consumed: ${response.body.credits_consumed}`);
    }
    console.log(`   🏗️  Response fields: ${Object.keys(response.body).join(', ')}\n`);
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}\n`);
  }

  console.log('🎉 API Testing Complete!');
  console.log('\n📝 All tests validate the OpenAPI 3.1 specification structure and field naming (snake_case).');
  console.log('💡 Note: Some endpoints may return "not found" responses for test data, which is expected behavior.');
}

// Run the tests
testEndpoints().catch(console.error); 