
const jasmineReporters = require('jasmine-reporters');
const yargs = require('yargs');

const reportsPath = '/tmp/'+yargs.argv.fileId;

const baseUrl = yargs.argv.baseUrl || '';

exports.config = {
  directConnect: true,
  chromeDriver:'./bin/chromedriver',
	baseUrl: baseUrl,
  framework: 'jasmine2',
  
   onPrepare: function() {
   	
   		var jUnitReporter = new jasmineReporters.JUnitXmlReporter({
              savePath: reportsPath,
              consolidateAll: true,
							filePrefix:'junit'
      });
      
      jasmine.getEnv().addReporter(jUnitReporter);
   	
   },
  

  specs: [
    'spec.js'
  ],

  capabilities: {
	  browserName: 'chrome',
	  binary: __dirname+'/bin/headless_shell',
	  chromeOptions: {
		 binary:'./bin/headless_shell',
			args: [
			  '--headless', // Redundant?
			  //`--remote-debugging-port=${CHROME_REMOTE_DEBUGGING_PORT}`,

			  '--disable-gpu', // TODO: should we do this?
			  '--window-size=1280x1696', // Letter size
			  '--no-sandbox',
			  '--user-data-dir=/tmp/user-data',
			  '--hide-scrollbars',
			  '--enable-logging',
			  '--log-level=0',
			  '--v=99',
			  '--single-process',
			  '--data-path=/tmp/data-path',

			  '--ignore-certificate-errors', // Dangerous?

			  // '--no-zygote', // Disables the use of a zygote process for forking child processes. Instead, child processes will be forked and exec'd directly. Note that --no-sandbox should also be used together with this flag because the sandbox needs the zygote to work.

			  '--homedir=/tmp',
			  // '--media-cache-size=0',
			  // '--disable-lru-snapshot-cache',
			  // '--disable-setuid-sandbox',
			  // '--disk-cache-size=0',
			  '--disk-cache-dir=/tmp/cache-dir',
			  // '--use-simple-cache-backend',
			  // '--enable-low-end-device-mode',

			  // '--trace-startup=*,disabled-by-default-memory-infra',
			  //'--trace-startup=*',
		 
		 ]
	   }
  }
};
