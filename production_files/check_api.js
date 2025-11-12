// Production readiness checker for Q8 Fruit API
const https = require('https');

const API_BASE_URL = 'https://q8fruit.com/api';

const checkEndpoint = (endpoint, description) => {
  return new Promise((resolve) => {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🔍 Checking ${description}...`);
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ ${description}: OK`);
          try {
            const jsonData = JSON.parse(data);
            if (jsonData.success) {
              console.log(`   Data: ${JSON.stringify(jsonData.data || jsonData).substring(0, 100)}...`);
            }
          } catch (e) {
            console.log(`   Response: ${data.substring(0, 100)}...`);
          }
          resolve(true);
        } else {
          console.log(`❌ ${description}: Error ${res.statusCode}`);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.log(`❌ ${description}: ${err.message}`);
      resolve(false);
    });
  });
};

const runProductionCheck = async () => {
  console.log('🚀 Q8 Fruit API Production Check');
  console.log('================================');
  console.log(`API URL: ${API_BASE_URL}`);
  console.log('');
  
  const checks = [
    { endpoint: '/health', description: 'Health Check' },
    { endpoint: '/products', description: 'Products Endpoint' },
    { endpoint: '/orders', description: 'Orders Endpoint' },
    { endpoint: '/users', description: 'Users Endpoint' },
    { endpoint: '/settings/delivery', description: 'Settings Endpoint' }
  ];
  
  let passedChecks = 0;
  
  for (const check of checks) {
    const result = await checkEndpoint(check.endpoint, check.description);
    if (result) passedChecks++;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between checks
  }
  
  console.log('');
  console.log('📊 Summary:');
  console.log(`✅ Passed: ${passedChecks}/${checks.length}`);
  console.log(`❌ Failed: ${checks.length - passedChecks}/${checks.length}`);
  
  if (passedChecks === checks.length) {
    console.log('');
    console.log('🎉 All systems ready! API is fully operational.');
    console.log('📱 Mobile app can now connect to production server.');
  } else {
    console.log('');
    console.log('⚠️  Some endpoints need attention.');
    console.log('📋 Check the installation guide in production_files/INSTALL.md');
  }
};

// Run the check
runProductionCheck().catch(console.error);