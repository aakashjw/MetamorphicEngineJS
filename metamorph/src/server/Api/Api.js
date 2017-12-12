var recast = require('recast') ;
var escodegen = require('escodegen');
var esprima = require('esprima')

var Api = {}
var keyset = {}
var dependency = {}

Api.convertToAst = (code) => {
	var ast = esprima.parse(code);
	console.log(JSON.stringify(ast))
	keyset = {}
	return ast;
}

Api.renameVariables = (ast) => {

		var body = ast.body
		//console.log("main body",body)
		    for(var line in body){
		    	//console.log("line"+line+"body[line]"+JSON.stringify(body)+body[line])
				var currentLine = body[line] || body;
				switch(currentLine.type){
		            case "VariableDeclaration":
					var declarations = currentLine.declarations;
					for(var i=0;i<declarations.length;i++){
						if(declarations[i].type == "VariableDeclarator"){
							if(declarations[i].init.type == "BinaryExpression"){
								 	if(keyset.hasOwnProperty(declarations[i].init.right.name)){
								 		var keyArr = keyset[declarations[i].init.right.name]
											declarations[i].init.right.name = keyArr[keyArr.length-1]
										}else{
											var keyArr = new Array();
											var newname = makeid();
											keyArr.push(newname);
											keyset[declarations[i].init.right.name] = keyArr;
											declarations[i].init.right.name = newname;
										}
								 		parseBinaryOperations(declarations[i].init,keyset)
								 	
								}else if(declarations[i].init.type == "Identifier"){
									//console.log("identifier it is",keyset)
										if(keyset.hasOwnProperty(declarations[i].init.name)){

											var keyArr = keyset[declarations[i].init.name]
											//console.log("keyset[declarations[i].init.name]",keyset[declarations[i].init.name],keyArr[keyArr.length-1])
											declarations[i].init.name = keyArr[keyArr.length-1]
										}	
								}else if(declarations[i].init.type == "UpdateExpression"){
										if(keyset.hasOwnProperty(declarations[i].init.argument.name)){
											 		var keyArr = keyset[declarations[i].init.argument.name]
														declarations[i].init.argument.name = keyArr[keyArr.length-1]
													}else{
														var keyArr = new Array();
														var newname = makeid();
														keyArr.push(newname);
														keyset[declarations[i].init.argument.name] = keyArr;
														declarations[i].init.argumen.tname = newname;
													}
									}
								if(keyset.hasOwnProperty(declarations[i].id.name)){
									var keyArr = keyset[declarations[i].id.name];
									var newname = makeid();
									keyArr.push(newname);
									keyset[declarations[i].id.name] = keyArr;
									declarations[i].id.name = newname;
								}else{
									var keyArr = new Array();
									var newname = makeid();
									keyArr.push(newname);
									//console.log("declarations[i].id.name new ",declarations[i].id.name)
									keyset[declarations[i].id.name] = keyArr;
									//console.log("finding b",keyset)
									declarations[i].id.name = newname;
								}
								
							}
						}
					break;
		            
		            case "ExpressionStatement":
		            //console.log("in expression statement\n")
						var expression = currentLine.expression;

						if(expression.type == "AssignmentExpression"){
							//console.log("keyset",keyset,expression.left.name)
								 	if(keyset.hasOwnProperty(expression.left.name)){
								 		//console.log("has hasOwnProperty",keyset)
								 		var keyArr = keyset[expression.left.name]
											expression.left.name = keyArr[keyArr.length-1]
											//console.log("expression.left.name"+expression.left.name)
										}else{
											var keyArr = new Array();
											var newname = makeid();
											keyArr.push(newname);
											//console.log("declarations[i].id.name new ",declarations[i].id.name)
											keyset[expression.left.name] = keyArr;
											expression.left.name = newname;

										}
								 		//parseBinaryOperations(expression.right.right.name,keyset)
									if(expression.right.type == "Identifier"){
										    if(keyset.hasOwnProperty(expression.right.name)){
										    	var keyArr = keyset[expression.right.name]
												expression.right.name = keyArr[keyArr.length-1];
											}	
									}else if(expression.right.type == "BinaryExpression"){
											 	if(keyset.hasOwnProperty(expression.right.name)){
											 			var keyArr = keyset[expression.right.name]
														expression.right.name = keyArr[keyArr.length-1]
													}else{
														var keyArr = new Array();
														var newname = makeid();
														keyArr.push(newname);
														keyset[expression.right.name] = keyArr;
														expression.right.name = newname;
													}
											 		parseBinaryOperations(expression.right,keyset)
									}else if(expression.right.type == "UnaryExpression"){
										if(keyset.hasOwnProperty(expression.right.argument.name)){
											 		var keyArr = keyset[expression.right.argument.name]
														expression.right.argument.name = keyArr[keyArr.length-1]
													}
									}else if(expression.right.type == "CallExpression"){
										if(expression.right.callee.type == "Identifier"){
											//console.log(keyset[expression.callee.name],expression.callee.name,"keyset[expression.callee.name]")
											if(keyset.hasOwnProperty(expression.right.callee.name)){
												var keyArr = keyset[expression.right.callee.name]
												expression.right.callee.name = keyArr[keyArr.length-1];
											}
										}
									}


						}else if(expression.type == "CallExpression"){
							if(expression.callee.type == "Identifier"){
								//console.log(keyset[expression.callee.name],expression.callee.name,"keyset[expression.callee.name]")
								if(keyset.hasOwnProperty(expression.callee.name)){
									var keyArr = keyset[expression.callee.name]
									expression.callee.name = keyArr[keyArr.length-1];
								}
							}
						}
					break;
					case "FunctionDeclaration":
							if(currentLine.id.name == "Identifier"){
							    if(keyset.hasOwnProperty(currentLine.id.name)){
							    	var keyArr = keyset[currentLine.id.name]
									currentLine.id.name = keyArr[keyArr.length-1];
								}	
							}else{
								var keyArr = new Array();
								var newname = makeid();
								keyArr.push(newname);
								//console.log("declarations[i].id.name new ",declarations[i].id.name)
								keyset[currentLine.id.name] = keyArr;
								currentLine.id.name = newname;
							}
							var outerbody = currentLine.body;
							Api.renameVariables(outerbody);
							var functionbody = outerbody.body;
							//console.log("body is"+JSON.stringify(body))
							for (var i = 0; i < functionbody.length ; i++) {
								switch(functionbody[i].type){
									case "VariableDeclaration":
									//console.log("case VariableDeclaration")
									for (var j in functionbody[i].declarations) {
										if(functionbody[i].declarations[j].type == "VariableDeclarator" ){
											for(var keys in keyset){
												if(keyset[keys].includes(functionbody[i].declarations[j].id.name)){
													//console.log(functionbody[i].declarations[j].id.name)
													keyset[keys].pop();
												}
											}
										}
									}
									break;
								

								} 
							}

					break;
					case "ReturnStatement":
					//console.log("return statement")
						if(currentLine.argument.type == "Identifier"){
							if(keyset.hasOwnProperty(currentLine.argument.name)){
						    	var keyArr = keyset[currentLine.argument.name]
								currentLine.argument.name = keyArr[keyArr.length-1];
							}else{
								Api.renameVariables(currentLine.argument);
							}
					}
									
					break;

				}
			}
			//ast = insertNoOperation(ast)
		return ast;
	//return escodegen.generate(ast);
	//(recast.print(ast).code)
}

function parseBinaryOperations(exp,keyset){
		if(exp.left.type == "BinaryExpression"){
				//console.log("keyset.hasOwnProperty(exp.left.right.name)",keyset.hasOwnProperty(exp.left.right.name))			
			if(exp.left.right.type == "Identifier" && keyset.hasOwnProperty(exp.left.right.name)){
				console.log("received exp.left.right.name as"+keyset[exp.left.right.name])

				var keyArr = keyset[exp.left.right.name]
				exp.left.right.name = keyArr[keyArr.length-1];
				//console.log("BinaryExpression left right",exp.left.right.name);
			}else{
				var keyArr = new Array();
				var newname = makeid();
				keyArr.push(newname);
				//console.log("declarations[i].id.name new ",declarations[i].id.name)
				console.log("exp.left.right.name"+exp.left.right.name+newname)
				keyset[exp.left.right.name] = keyArr;
				//console.log("finding b",keyset)
				exp.left.right.name = newname;
			}
			//console.log("BinaryExpression",exp.left);
			return parseBinaryOperations(exp.left,keyset);
		}else {
			if(keyset.hasOwnProperty(exp.left.name)){
				var keyArr = keyset[exp.left.name]
				console.log("keyArr[keyArr.length-1]"+keyArr[keyArr.length-1])
				exp.left.name = keyArr[keyArr.length-1];
				//console.log("BinaryExpression left",exp.left.name) 
			}else{
				var keyArr = new Array();
				var newname = makeid();
				keyArr.push(newname);
				//console.log("declarations[i].id.name new ",declarations[i].id.name)
				console.log("exp.left.name"+exp.left.name+newname)
				keyset[exp.left.name] = keyArr;
				//console.log("finding b",keyset)
				exp.left.name = newname;
			}
			console.log("keyset[exp.right.name]"+exp.right.name)
			if(keyset.hasOwnProperty(exp.right.name)){
				var keyArr = keyset[exp.right.name]
				exp.right.name = keyArr[keyArr.length-1];
				//console.log("BinaryExpression right",exp.right.name)
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
Api.insertNoOperation = function(ast){
	var emptyFunc = {
        "type": "ExpressionStatement",
        "expression": {
            "type": "CallExpression",
            "callee": {
                "type": "Identifier",
                "name": "setTimeout"
            },
            "arguments": [{
                "type": "FunctionExpression",
                "id": null,
                "params": [],
                "body": {
                    "type": "BlockStatement",
                    "body": []
                },
                "generator": false,
                "expression": false,
                "async": false
            }, {
                "type": "Literal",
                "value": 10000,
                "raw": "10000"
            }]
        }
    }
    //ast.body.splice(0, 0,emptyFunc)	
    //console.log(ast.body)
    var count = getRandomArbitrary(0,ast.body.length)
	for (var i = 0; i <count; i++) {
		ast.body.splice(getRandomArbitrary(0,ast.body.length), 0, emptyFunc)	
	}
	
	return ast;
}
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
Api.instructionSubstitution = function(ast){
var body = ast.body
		//console.log("main body",body)
		    for(var line in body){
		    	//console.log("line"+line+"body[line]"+JSON.stringify(body)+body[line])
				var currentLine = body[line] || body;
				switch(currentLine.type){
		            case "VariableDeclaration":
					var declarations = currentLine.declarations;
					for(var i=0;i<declarations.length;i++){
						if(declarations[i].type == "VariableDeclarator"){
							if(declarations[i].init.type == "BinaryExpression"){
								substitute(declarations[i].init)
							}
						}
					}
					break;
					case "ExpressionStatement":
						var expression = currentLine.expression;

						if(expression.type == "AssignmentExpression"){
							if(expression.right.type == "BinaryExpression"){
								substitute(expression.right)
							}
						}
					break
					case "FunctionDeclaration":
						var outerbody = currentLine.body;
						Api.instructionSubstitution(outerbody);
							
					break;
				}
			}
			console.log("ast after instructionSubstitution",JSON.stringify(ast))
			return ast

}


function substitute(obj){
	let type;
	let value;
	switch(obj.operator){
		case "+":
		obj.operator = "-";
		type = obj.right.type;
		value = (type == "Identifier") ? obj.right.name : obj.right.value;
			obj.right = 	{
						                    "type": "UnaryExpression",
						                    "operator": "-",
						                    "argument": {
						                        "type": type,
						                        "name": value,
						                        "value":value													                    },
						                    "prefix": true
						                	} 
		break;

		case "-":
		obj.operator = "+";
		type = obj.right.type;
		value = (type == "Identifier") ? obj.right.name : obj.right.value;
		obj.right = 	{
						                    "type": "UnaryExpression",
						                    "operator": "-",
						                    "argument": {
						                        "type": type,
						                        "name": value,
						                        "value":value													                    },
						                    "prefix": true
						                	} 

		break;

		case "*":
			type = obj.right.type
			value = (type == "Identifier") ? obj.right.name : obj.right.value;
			obj.right = 		{
							                    "type": "BinaryExpression",
							                    "operator": "+",
							                    "left": {
							                        "type": "BinaryExpression",
							                        "operator": "/",
							                        "left": {
							                            "type": type,
							                            "name":value,
							                            "value": value,
							                            "raw": value
							                        },
							                        "right": {
							                            "type": "Literal",
							                            "value": 2,
							                            "raw": "2"
							                        }
							                    },
							                    "right": {
							                        "type": "BinaryExpression",
							                        "operator": "/",
							                        "left": {
							                            "type": type,
							                            "value": value,
							                            "name":value,
							                            "raw": value
							                        },
							                        "right": {
							                            "type": "Literal",
							                            "value": 2,
							                            "raw": "2"
							                        }
							                    }
							                }
		break;

		case "/":
			obj.operator = "*";
			type = obj.right.type
			value = (type == "Identifier") ? obj.right.name : obj.right.value;
			obj.right =			{
	            "type": "BinaryExpression",
	            "operator": "/",
	            "left": {
	                "type": "Literal",
	                "value": 1,
	                "raw": "1"
	            },
	            "right": {
	                "type": type,
	                "value": value,
	                "name":value,
	                "raw": value
	            }
	        }
		break;
	}
}
Api.instructionReordering = function(ast){
	var body = ast.body
		console.log("main body",body)
		    for(var line in body){
		    	//console.log("line"+line+"body[line]"+JSON.stringify(body)+body[line])
				var currentLine = body[line] || body;
				//console.log(body[1],"body.length")
				if(line == body.length - 1){
					console.log("reached the end")
					break;
				}

				switch(currentLine.type){
		            case "VariableDeclaration":
		            let next = Number(line)+1;
		            console.log("VariableDeclaration",line,next,JSON.stringify(body[next]))
							if(body[next] && body[next].type == "VariableDeclaration"){
									swap(body,line)
							}
					break;

					case "FunctionDeclaration":
						var outerbody = currentLine.body;
						Api.instructionReordering(outerbody);
							
					break;
				}
			}
			console.log("ast after instructionSubstitution",JSON.stringify(ast))
			return ast
}
function swap(body,index){
	let temp = {}
	let next = Number(index)+1
	temp = body[index]
	body[index] = body[next]
	body[next] = temp;
}
Api.morph = function(ast){
var ast;
ast = Api.renameVariables(ast);
ast = Api.insertNoOperation(ast);
ast = Api.instructionSubstitution(ast);
ast = Api.instructionReordering(ast);
return escodegen.generate(ast);

}
module.exports.Api = Api