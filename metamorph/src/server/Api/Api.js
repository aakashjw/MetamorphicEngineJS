var recast = require('recast') ;
var escodegen = require('escodegen');
var esprima = require('esprima')

var Api = {}
var keyset = {}

Api.convertToAst = (code) => {
	var ast = esprima.parse(code);
	console.log(JSON.stringify(ast))
	return ast;
}

Api.morph = (ast) => {

		var body = ast.body
		
		    for(var line in body){
		    	console.log("line"+line)
				var currentLine = body[line];
				switch(currentLine.type){
		            case "VariableDeclaration":
					var declarations = currentLine.declarations;
					for(var i=0;i<declarations.length;i++){
						if(declarations[i].type == "VariableDeclarator"){
							if(keyset.hasOwnProperty(declarations[i].id.name)){
									//skip because it exists
									var keyArr = keyset[declarations[i].id.name];
									var newname = makeid();
									keyArr.push(newname);
									keyset[declarations[i].id.name] = keyArr;
									declarations[i].id.name = newname;
								}else{
									var keyArr = new Array();
									var newname = makeid();
									keyArr.push(newname);
									console.log("declarations[i].id.name new ",declarations[i].id.name)
									keyset[declarations[i].id.name] = keyArr;
									console.log("finding b",keyset)
									declarations[i].id.name = newname;
								}
								if(declarations[i].init.type == "BinaryExpression"){
								 	if(keyset.hasOwnProperty(declarations[i].init.right.name)){
								 		var keyArr = keyset[declarations[i].init.right.name]
											declarations[i].init.right.name = keyArr[keyArr.length-1]
										}
								 		parseBinaryOperations(declarations[i].init,keyset)
								 	
								}else if(declarations[i].init.type == "Identifier"){
									console.log("identifier it is",keyset)
										if(keyset.hasOwnProperty(declarations[i].init.name)){

											var keyArr = keyset[declarations[i].init.name]
											console.log("keyset[declarations[i].init.name]",keyset[declarations[i].init.name],keyArr[keyArr.length-1])
											declarations[i].init.name = keyArr[keyArr.length-1]
										}	
								}
							}
						}
					break;
		            
		            case "ExpressionStatement":
						var expression = currentLine.expression;
		                if(keyset.hasOwnProperty(expression.left.name)){
		                	var keyArr = keyset[expression.left.name]
		                	console.log(" expression.left.name",expression.left.name,keyArr[keyArr.length-1])
							expression.left.name = keyArr[keyArr.length-1];
						}
						if(expression.right.type == "Identifier"){
							    if(keyset.hasOwnProperty(expression.right.name)){
							    	var keyArr = keyset[expression.right.name]
									expression.right.name = keyArr[keyArr.length-1];
								}	
						}else if(expression.right.type == "BinaryExpression"){
								 	if(keyset.hasOwnProperty(expression.right.right.name)){
								 		var keyArr = keyset[expression.right.right.name]
											expression.right.right.name = keyArr[keyArr.length-1]
										}
								 		parseBinaryOperations(expression.right.right.name,keyset)
								 	
								} 
					break;
					case "FunctionDeclaration":
							var outerbody = currentLine.body;
							Api.morph(outerbody)
					break;
				}
			}
			
	return escodegen.generate(ast);
	//(recast.print(ast).code)
}

function parseBinaryOperations(exp,keyset){
		if(exp.left.type == "BinaryExpression"){
				console.log("keyset.hasOwnProperty(exp.left.right.name)",keyset.hasOwnProperty(exp.left.right.name))			
			if(exp.left.right.type == "Identifier" && keyset.hasOwnProperty(exp.left.right.name)){
				var keyArr = keyset[exp.left.right.name]
				exp.left.right.name = keyArr[keyArr.length-1];
				console.log("BinaryExpression left right",exp.left.right.name);
			}
			//console.log("BinaryExpression",exp.left);
			return parseBinaryOperations(exp.left,keyset);
		}else {
			if(keyset.hasOwnProperty(exp.left.name)){
				var keyArr = keyset[exp.left.name]
				exp.left.name = keyArr[keyArr.length-1];
				console.log("BinaryExpression left",exp.left.name) 
			}
			if(keyset.hasOwnProperty(exp.right.name)){
				var keyArr = keyset[exp.right.name]
				exp.right.name = keyArr[keyArr.length-1];
				console.log("BinaryExpression right",exp.right.name)
			}			
		}
}


function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  for (var i = 0; i < 3; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
	

module.exports.Api = Api