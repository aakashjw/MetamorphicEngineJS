

var Api = require('./Api/Api.js').Api
var express = require('express')
var app = express()
var bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({
  extended: false
}));

app.get('/morphcode', function (req, res) {
	console.log(req.query.body)

	var code = req.query.body;
	code = decodeURIComponent(code);
	var ast = Api.convertToAst(code);
	var morphedcode = Api.morph(ast);
	//console.log(ast);
	console.log(morphedcode);

	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.send(morphedcode)
})



app.listen(4000)