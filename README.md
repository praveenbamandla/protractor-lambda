# Protractor Lambda

A serverless solution for running Protractor end-to-end tests on AWS Lambda using headless Chrome. This project enables you to execute browser automation tests in a scalable, cost-effective manner without managing servers.

## Features

- 🚀 **Serverless**: Run Protractor tests on AWS Lambda without server management
- 🌐 **Headless Chrome**: Uses headless Chrome optimized for Lambda environment
- 📊 **JUnit Reports**: Generates JUnit XML test reports for integration with CI/CD
- 🔄 **Dynamic Tests**: Accept test scripts as base64 encoded input
- 📈 **Memory Monitoring**: Tracks memory usage during test execution
- 🎯 **Configurable**: Support for custom base URLs and test specifications

## Prerequisites

- Node.js (version 6.10+ for Lambda compatibility)
- AWS Account with Lambda access
- Basic knowledge of Protractor and AWS Lambda

## Installation

1. Clone the repository:
```bash
git clone https://github.com/praveenbamandla/protractor-lambda.git
cd protractor-lambda
```

2. Install dependencies:
```bash
npm install
```

3. The project includes pre-built Chrome binaries in the `bin/` directory optimized for AWS Lambda.

## Usage

### Lambda Function Input

The Lambda function expects a JSON payload with the following structure:

```json
{
  "body": "{\"id\":\"unique-test-id\",\"script\":\"<base64-encoded-test-script>\",\"baseUrl\":\"https://your-app-url.com\"}"
}
```

#### Input Parameters:
- `id`: Unique identifier for the test run
- `script`: Base64 encoded Protractor test script
- `baseUrl`: Base URL for the application under test

### Example Test Script

```javascript
describe('Calculator Tests', function() {
  beforeEach(function() {
    browser.get('/calculator');
  });

  it('should add two numbers', function() {
    element(by.model('first')).sendKeys(4);
    element(by.model('second')).sendKeys(5);
    element(by.id('gobutton')).click();
    
    expect(element(by.binding('latest')).getText()).toEqual('9');
  });
});
```

### Lambda Function Output

The function returns:
- **statusCode**: HTTP status code (200 for success)
- **body**: Console output from test execution
- **headers**: Content-Type set to text/plain

Additionally, test results are posted to a configured webhook with:
- `logs`: Complete test execution logs
- `exitCode`: Protractor exit code
- `memory`: Memory usage in MB
- `result`: Base64 encoded JUnit XML report

## Configuration

### Protractor Configuration (`conf.js`)

The configuration is optimized for Lambda environment with:
- Headless Chrome with specific flags for Lambda
- JUnit XML reporter for test results
- Custom Chrome binary path
- Memory and performance optimizations

### Key Chrome Flags:
- `--headless`: Run Chrome in headless mode
- `--no-sandbox`: Required for Lambda environment
- `--single-process`: Optimize for Lambda constraints
- `--disable-gpu`: Disable GPU acceleration

## Deployment

### AWS Lambda Deployment

1. **Create deployment package**:
```bash
# The project includes a pre-built package in prod/protractor_lambda.zip
```

2. **Deploy via AWS CLI**:
```bash
aws lambda create-function \
  --function-name protractor-tests \
  --runtime nodejs14.x \
  --role arn:aws:iam::ACCOUNT:role/lambda-execution-role \
  --handler index.handler \
  --zip-file fileb://prod/protractor_lambda.zip \
  --timeout 300 \
  --memory-size 1024
```

3. **Configure environment variables** (optional):
```bash
aws lambda update-function-configuration \
  --function-name protractor-tests \
  --environment Variables='{NODE_ENV=production}'
```

### Memory and Timeout Recommendations

- **Memory**: 1024MB minimum (1536MB recommended for complex tests)
- **Timeout**: 300 seconds (5 minutes) for most test suites
- **Runtime**: Node.js 14.x or compatible

## Project Structure

```
protractor-lambda/
├── bin/                    # Chrome binaries and dependencies
│   ├── chromedriver       # ChromeDriver executable
│   ├── chrome.zip         # Chrome browser package
│   └── lib*.so.*          # Required libraries
├── prod/                  # Production deployment package
│   └── protractor_lambda.zip
├── index.js               # Main Lambda handler
├── conf.js                # Protractor configuration
├── spec.js                # Sample test specification
├── package.json           # Project dependencies
└── README.md              # This file
```

## Examples

### Running Sample Test

The included `spec.js` demonstrates testing a calculator application:

```javascript
// Base64 encode your test script
const testScript = Buffer.from(fs.readFileSync('spec.js')).toString('base64');

// Lambda event payload
const event = {
  body: JSON.stringify({
    id: 'test-' + Date.now(),
    script: testScript,
    baseUrl: 'http://juliemr.github.io/protractor-demo/'
  })
};
```

### Integration with CI/CD

Use the Lambda function in your CI/CD pipeline:

```yaml
# GitHub Actions example
- name: Run E2E Tests
  run: |
    aws lambda invoke \
      --function-name protractor-tests \
      --payload '{"body":"{\"id\":\"ci-${{ github.run_id }}\",\"script\":\"$TEST_SCRIPT\",\"baseUrl\":\"${{ env.APP_URL }}\"}"}' \
      response.json
```

## Troubleshooting

### Common Issues

1. **Memory Errors**: Increase Lambda memory allocation
2. **Timeout**: Increase Lambda timeout setting
3. **Chrome Binary Issues**: Ensure bin/ directory is included in deployment
4. **Permission Errors**: Verify Lambda execution role has necessary permissions

### Debug Mode

Enable verbose logging by modifying Chrome flags in `conf.js`:
```javascript
'--enable-logging',
'--log-level=0',
'--v=99'
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Test changes with sample applications
- Update documentation for new features
- Ensure compatibility with AWS Lambda constraints

## License

This project is licensed under the ISC License. See the [package.json](package.json) file for details.

## Acknowledgments

- [Protractor](https://www.protractortest.org/) - End-to-end testing framework
- [AWS Lambda](https://aws.amazon.com/lambda/) - Serverless compute platform
- [Chrome Headless](https://developers.google.com/web/updates/2017/04/headless-chrome) - Headless browser automation

## Author

**Praveen Bamandlapally**

---

For questions or support, please open an issue in the GitHub repository.