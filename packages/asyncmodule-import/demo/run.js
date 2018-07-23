require("babel-register");
var fs = require("fs");
var path = require('path');
var babel = require("babel-core");
var asyncimportloader = require("../index");

fs.readFile(path.join(__dirname, 'asyncImport.js'), function(err, data) {
    if(err) throw err;
    var src = data.toString();
    var out = babel.transform(src, {
        plugins: ['syntax-dynamic-import', [
                asyncimportloader
            ]
        ]
    });
    console.log('< ------- common before ------->');
    console.log(src);
    console.log('< ------- common after ------->');
    console.log(out.code);
});

fs.readFile(path.join(__dirname, 'asyncImport.js'), function(err, data) {
    if(err) throw err;
    var src = data.toString();
    var out = babel.transform(src, {
        plugins: ['syntax-dynamic-import', [
                asyncimportloader, {
                    importCss: true
                }
            ]
        ]
    });
    console.log('< ------- before importCss------->');
    console.log(src);
    console.log('< ------- after importCss------->');
    console.log(out.code);
    
});