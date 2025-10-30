const fetch = require('node-fetch');

const API_URL = process.env.API_URL || 'http://user-api-backend-service:3000';
const INTERVAL = parseInt(process.env.INTERVAL || '10000'); // 10 seconds default

let requestCount = 0;

async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    console.log(`[${new Date().toISOString()}] Health check:`, data);
    return true;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Health check failed:`, error.message);
    return false;
  }
}

async function fetchUsers() {
  try {
    requestCount++;
    const response = await fetch(`${API_URL}/api/users`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`[${new Date().toISOString()}] Request #${requestCount} - Users fetched:`, data.count, 'users');
    
    // Log first user as example
    if (data.users && data.users.length > 0) {
      console.log(`  → Sample user: ${data.users[0].name} (${data.users[0].email})`);
    }
    
    return data;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Request #${requestCount} - Error fetching users:`, error.message);
    return null;
  }
}

async function createSampleUser() {
  try {
    const sampleUsers = [
      { name: 'Demo User 1', email: 'demo1@example.com', role: 'User' },
      { name: 'Demo User 2', email: 'demo2@example.com', role: 'Admin' },
      { name: 'Demo User 3', email: 'demo3@example.com', role: 'User' }
    ];
    
    const randomUser = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
    const response = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(randomUser)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const newUser = await response.json();
    console.log(`[${new Date().toISOString()}] Created user:`, newUser.name);
    return newUser;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error creating user:`, error.message);
    return null;
  }
}

async function run() {
  console.log('='.repeat(60));
  console.log('User API Client Service Starting...');
  console.log(`API URL: ${API_URL}`);
  console.log(`Poll Interval: ${INTERVAL}ms`);
  console.log('='.repeat(60));
  
  // Initial health check
  await checkHealth();
  
  // Periodic operations
  let operationCounter = 0;
  setInterval(async () => {
    operationCounter++;
    
    if (operationCounter % 3 === 0) {
      // Every 3rd cycle: create a sample user
      await createSampleUser();
    } else {
      // Other cycles: fetch users
      await fetchUsers();
    }
    
    // Health check every 5 cycles
    if (operationCounter % 5 === 0) {
      await checkHealth();
    }
  }, INTERVAL);
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log(`\n[${new Date().toISOString()}] Received SIGTERM, shutting down gracefully...`);
  console.log(`Total requests made: ${requestCount}`);
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log(`\n[${new Date().toISOString()}] Received SIGINT, shutting down gracefully...`);
  console.log(`Total requests made: ${requestCount}`);
  process.exit(0);
});

run().catch(console.error);
