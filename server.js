const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname+'/dist/backend-serve'));
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/dist/backend-serve/app.js'));
});

app.listen(process.env.PORT || 3000);