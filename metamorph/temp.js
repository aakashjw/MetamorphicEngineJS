function morph(ast){
var body = ast.body;

    for(var line in body){
		switch(line){
            case "VariableDeclaration":
			var declarations = line.declarations;
			for(var i=0;i<declarations.length;i++){
				if(declarations[i].type == "VariableDeclarator"){
					var id = declarations[i].id;
					id.name
				}
			}
			
			break;
            case "ExpressionStatement":
			break;

		}
}