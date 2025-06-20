﻿# webhook-endpoint
before optimizing :
k6 Load Test Summary for /webhook/shiprocket Endpoint
Test Duration: 30 seconds

Concurrent Virtual Users (VUs): 10

Total Requests Sent: 300 POST requests

Requests per Second: Approximately 9.9 req/s

Success Rate: 100% (All 300 requests received HTTP 200 responses)

Response Validation: All responses contained the expected text "Webhook received"

Request Latency:

Average response time: ~10.5 ms

Median response time: ~5.8 ms

Maximum response time observed: 125.6 ms

90th percentile latency: ~17 ms

95th percentile latency: ~20 ms

Errors: No failed requests detected

Resource Usage: Data sent ~78 KB, data received ~73 KB over the test duration


after optimizing :
 ✅ Overall Test Summary
Test Duration: 30 seconds

Virtual Users (VUs): 10

Total Iterations (Requests): 300

Total Checks Passed: 600/600 (100%)

Failures: 0

📈 Performance Metrics
Average Response Time: 3.16 ms ✅ (significantly improved from ~10.5 ms earlier)

Median (p50): 2.72 ms

90th percentile (p90): 4.4 ms

95th percentile (p95): 5.07 ms

Max Response Time: 36.11 ms

Min Response Time: ~0 ms

📬 HTTP Requests
Total Requests Sent: 300

Request Failures: 0

Success Rate: 100%

🔗 Network Usage
Data Sent: 78 KB

Data Received: 73 KB
