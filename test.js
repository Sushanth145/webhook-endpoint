import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10,        
  duration: '30s' 
};

export default function () {
  const url = 'http://localhost:3000/webhook/shiprocket'; // change if deployed elsewhere

  const payload = JSON.stringify({
    order_id: `ORD${Math.floor(Math.random() * 10000)}`,
    status: 'Out for Delivery',
    tracking_number: `TRK${Math.floor(Math.random() * 100000)}`,
    timestamp: new Date().toISOString()
  });

  const params = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  let res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response contains "Webhook received"': (r) => r.body.includes('Webhook received')
  });

  sleep(1); // wait 1 second between iterations
}
