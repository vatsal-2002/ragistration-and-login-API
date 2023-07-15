const http = require('http');
const app = require('./app'); 
const sever = http.createServer(app);

sever.listen(3000, console.log('app running'));

