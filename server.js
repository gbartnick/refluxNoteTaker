var fs = require("fs"),
    DataFilePath=__dirname+ '/data/MOCK_DATA.json',
    UserFilePath = __dirname+'/data/USER_DATA.json';


var express = require('express');
var app = express();

app.use('/', express.static(__dirname + '/'));
app.use('/libs', express.static(__dirname + '/node_modules'));

app.get('/api/note/list', function(req, res){
    var file = fs.readFileSync(DataFilePath, 'utf8');
    res.send(JSON.parse(file));
});

app.get('/api/user/list', function(req, res){
    var file = fs.readFileSync(UserFilePath, 'utf8');
    res.send(JSON.parse(file));
});


var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
});