var fetch = require('node-fetch');

var Api ={}

Api.getMorphedCode = function(code,callback){
	var result;
	code = encodeURIComponent(code); 
	fetch('http://localhost:4000/morphcode?body='+code).then(function(res) {
	    	console.log(res)
	    	return res.text();
	    }).then(function(body) {
	    	callback(body);
	    });	    
}

module.exports.Api = Api