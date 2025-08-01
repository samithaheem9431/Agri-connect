const axios = require('axios');

// Test the AI chatbot with various agriculture queries
async function testAIChatbot() {
  const baseURL = 'http://localhost:5000/api/query';
  
  const testQueries = [
    "How to grow wheat?",
    "What causes rust disease in plants?",
    "Best soil pH for corn?",
    "How to manage drought conditions?",
    "What fertilizer should I use for soybeans?",
    "How to control pests in rice fields?",
    "Irrigation tips for vegetable gardens"
  ];

  console.log('🌾 Testing AgriConnect AI Chatbot\n');
  console.log('=' .repeat(50));

  for (let i = 0; i < testQueries.length; i++) {
    const query = testQueries[i];
    console.log(`\n${i + 1}. Testing: "${query}"`);
    console.log('-'.repeat(40));

    try {
      const response = await axios.post(baseURL, {
        text: query
      });

      if (response.data.success) {
        console.log('✅ Response received successfully');
        console.log('📝 AI Response:');
        console.log(response.data.response.substring(0, 200) + '...');
        console.log(`⏰ Timestamp: ${response.data.timestamp}`);
      } else {
        console.log('❌ Failed to get response');
        console.log('Error:', response.data.error);
      }
    } catch (error) {
      console.log('❌ Request failed');
      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Error:', error.response.data.error);
      } else {
        console.log('Error:', error.message);
      }
    }

    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n' + '='.repeat(50));
  console.log('🏁 Testing completed!');
}

// Test health endpoint
async function testHealthEndpoint() {
  console.log('\n🏥 Testing Health Endpoint');
  console.log('-'.repeat(30));

  try {
    const response = await axios.get('http://localhost:5000/api/query/health');
    console.log('✅ Health check passed');
    console.log('Message:', response.data.message);
    console.log('Timestamp:', response.data.timestamp);
  } catch (error) {
    console.log('❌ Health check failed');
    console.log('Error:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting AI Chatbot Tests...\n');
  
  // Test health endpoint first
  await testHealthEndpoint();
  
  // Test AI queries
  await testAIChatbot();
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get('http://localhost:5000/');
    console.log('✅ Server is running');
    return true;
  } catch (error) {
    console.log('❌ Server is not running. Please start the backend server first:');
    console.log('   cd backend && npm start');
    return false;
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  }
}

main().catch(console.error);