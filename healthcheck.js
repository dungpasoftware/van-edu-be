const http = require('http');

const options = {
  host: 'localhost',
  port: process.env.PORT || 3000,
  path: '/health',
  timeout: 5000,
  method: 'GET',
  headers: {
    'User-Agent': 'Docker-Health-Check'
  }
};

const request = http.request(options, (res) => {
  console.log(`Health check - STATUS: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const response = JSON.parse(data);
        console.log('Health check - Response:', response);
        process.exit(0);
      } catch (e) {
        console.log('Health check - Valid response but not JSON');
        process.exit(0);
      }
    } else {
      console.log('Health check - Unhealthy status code:', res.statusCode);
      process.exit(1);
    }
  });
});

request.on('error', (err) => {
  console.log('Health check - ERROR:', err.message);
  process.exit(1);
});

request.on('timeout', () => {
  console.log('Health check - TIMEOUT');
  request.destroy();
  process.exit(1);
});

request.setTimeout(options.timeout);
request.end(); 