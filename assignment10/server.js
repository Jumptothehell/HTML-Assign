var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);

var fs = require('fs');
const { json } = require('body-parser');
const { Console } = require('console');
const { rejects } = require('assert');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))


// read from file to user
//ทำให้สมบูรณ์
app.get('/inmsg', async (req, res) => {
  let msgin_ = await readMsg();
  res.send(msgin_);
})

//from user, wdrite data to file
//ทำให้สมบูรณ์
app.post('/outmsg', async (req, res) => {
  let newMsg = await req.body;
  let msgin_ = await readMsg();
  // console.log(typeof(msgin_));
  let msgUpdate = await updateMsg(newMsg, msgin_);
  let writeMsgUpdate = await writeMsg(msgUpdate)
  // console.log(msgUpdate);
  res.json(writeMsgUpdate);
  res.end();
  // console.log(writedMsg);

  // let msgout_ = await writeMsg(await updateMsg(newMsg, msgin_));

  //console.log(msgout_);
  //res.json(msgout_);
})

// read json data from file
//ทำให้สมบูรณ์
const readMsg = () => {
  return new Promise((resolve,reject) => {
    fs.readFile('log.json', 'utf8', (err, data) => {
      if(err){
        reject(err);
      }
      else{
        resolve(data);
      }
    });    
  })
} 

// update json data
// ทำให้สมบูรณ์
const updateMsg = (new_msg, data1) => {
  return new Promise((resolve,reject) => {
    var data = JSON.parse(data1); // --> it Obj
    data.dataMsg.push(new_msg);
    // console.log(data.dataMsg.length);
    // console.log(data.dataMsg);
    resolve(data);

  });
}
// write json data to file
//ทำให้สมบูรณ์
const writeMsg = (data) => {
  data = JSON.stringify(data, null, " ");
  return new Promise((resolve,reject) => {
    fs.writeFile('log.json', data, (err) => {
      if(err){
        rejects(err);
      }else{
          resolve(data)
      }
    });
  })
}
var server = http.listen(3001, () => {
  console.log('server is running on port http://localhost:'+ server.address().port);
});