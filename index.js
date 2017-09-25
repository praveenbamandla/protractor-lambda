
process.env.LD_LIBRARY_PATH = './bin';

const child = require('child_process');
const fs = require('fs');
const request = require('request');
const cachePath = '/tmp';

exports.handler = (event, context, callback) => {
  
  var out = '';
  var input = JSON.parse(event.body);
  var specFile = cachePath+'/'+input.id+'/script.js';
  
  context.callbackWaitsForEmptyEventLoop = false;
  
  if (!fs.existsSync(cachePath+'/'+input.id)) { 
      fs.mkdirSync(cachePath+'/'+input.id);
  }
  
  fs.writeFileSync(specFile, Buffer.from(input.script, 'base64'));

  var protractor_cp = child.spawn('node',['node_modules/protractor/bin/protractor','conf.js','--specs',specFile,'--fileId',input.id,'--baseUrl',input.baseUrl]);
  
  protractor_cp.stderr.on('data',function(data){
	  out += data.toString('utf8');	  
  });
  
  protractor_cp.stdout.on('data',function(data){
	  out += data.toString('utf8');	  
  });
  
  protractor_cp.on('exit',function(code){
	  
	  
	 var minfo = process.memoryUsage();
	 var used = minfo.rss/1024/1024;
   var results = new Buffer(fs.readFileSync(cachePath+'/'+input.id+'/junit.xml')).toString('base64');
   
    child.execSync('rm -rf '+cachePath+'/'+input.id);
        
		request.post(
		  {
		    url:'https://requestb.in/18jotgw1', 
		    form: {
		        logs:out,
		        exitCode:code,
		        memory:used,
		        result:results
		    }
		  }, function(err,httpResponse,body){ 
			
			callback(null, 
			   {
					statusCode: '200',
					body: out,
					headers: {
						'Content-Type': 'text/plain',
					}
				}
			);
			
		});
	
  });
  
};
