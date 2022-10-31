var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);

var fs = require('fs');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))


// read from file to user
//ทำให้สมบูรณ์
app.get('/inmsg', async (req, res) => {
  let msgin_ = await readMsg();
})

//from user, write data to file
//ทำให้สมบูรณ์
app.post('/outmsg', async (req, res) => {
  let msgout_ = await req.body;
  let writemsg_ = await writeMsg;
  console.log(msgout_);
  res.json(msgout_);
})

// read json data from file
//ทำให้สมบูรณ์
const readMsg = () => {
  return new Promise((resolve,reject) => {
    fs.readFile('log.json', 'utf8', (err, data) => {
      if(err){
        reject(err)
      }
      else{
        resolve(data);
      }
    });    
  })
} 

// update json data
//ทำให้สมบูรณ์
// const updateMsg = (new_msg, data1) => {
//   return new Promise((resolve,reject) => { 
      
//   });
// }

// write json data to file
//ทำให้สมบูรณ์
const writeMsg = (data) => {
  return new Promise((resolve,reject) => {
    fs.writeFile('log.json', data, (err) => {
      if(err){
          rejects(err);
      }else{
          resolve(data);
      }
    });
  })
}
var server = http.listen(3001, () => {
  console.log('server is running on port http://localhost:'+ server.address().port);
});