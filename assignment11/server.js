const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'img/');
    },

    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  const imageFilter = (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

//ทำให้สมบูรณ์
app.post('/profilepic', (req,res) => {
    let upload = multer({storage: storage, fileFilter: imageFilter}).single('avatar');
    upload(req, res, (err) => {
        if(req.fileValidationError){
            return res.send(req.fileValidationError);
        }
        else if (!req.file){
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError){
            return res.send(err);
        }
        else if (err){
            return res.send(err);
        }
        // console.log(req.file.filename);
        updateImg(req.cookies.username, req.file.filename);
        res.cookie("img",req.file.filename);
        return res.redirect('feed.html')
    })
 })

//ทำให้สมบูรณ์
// ถ้าต้องการจะลบ cookie ให้ใช้
// res.clearCookie('username');
app.get('/logout', (req,res) => {
    res.clearCookie('username');
    res.clearCookie('img');
    return res.redirect('index.html');
})

//ทำให้สมบูรณ์
app.get('/readPost', async (req,res) => {
    let filepath = path.join(__dirname, 'js', 'postDB.json');
    let postin_ = await readJson(filepath);
    // console.log(postin_);
    res.send(postin_);
})

//ทำให้สมบูรณ์
app.post('/writePost',async (req,res) => {
    let msg = req.body;
    // console.log(msg);
    let filepath = path.join(__dirname, 'js', 'postDB.json');
    let read_ = await readJson(filepath);
    let jsondata = JSON.parse(read_);
    // console.log(jsondata);
    jsondata['post'+[Object.keys(jsondata).length + 1]] = msg;
    // console.log(jsondata);

    let postout_ = await writeJson(jsondata, filepath);
    console.log(postout_);
    res.json(postout_);
    res.end();
})

//ทำให้สมบูรณ์
app.post('/checkLogin',async (req,res) => {
    let userDBpath = path.join(__dirname, 'js', 'userDB.json');
    // console.log(userDBpath);
    let readUserdata = await readJson(userDBpath);
    // console.log(readUserdata);
    let jsondata = JSON.parse(readUserdata);
    // console.log(jsondata);
    let userDatakeys = Object.keys(jsondata);
    // console.log(userDatakeys);
    // console.log(Object.keys(jsondata)); //[ 'user1', 'user2', 'user3', 'user4', 'user5' ]
    let username = await req.body.username;
    // console.log(username);
    let password = await req.body.password;
    // console.log(password);
    for(let i = 0; i < userDatakeys.length ; i++)
    {
        // console.log(username == jsondata[userDatakeys[i]].username);
        // console.log(password == jsondata[userDatakeys[i]].password)
        // console.log('-------------');
        if(username == jsondata[userDatakeys[i]].username && password == jsondata[userDatakeys[i]].password){  
            res.cookie("username", username);
            res.cookie("img", jsondata[userDatakeys[i]].img);
            return res.redirect('feed.html');
        }
    }
    return res.redirect('index.html?error=1');
    // ถ้าเช็คแล้ว username และ password ถูกต้อง
    // return res.redirect('feed.html');
    // ถ้าเช็คแล้ว username และ password ไม่ถูกต้อง
    // return res.redirect('index.html?error=1')
})

//ทำให้สมบูรณ์
const readJson = (file_name) => {
    return new Promise((resolve, rejects) => {
        fs.readFile(file_name, 'utf8', (err, data) => {
            if(err){
                rejects(err);
            }else{
                resolve(data);
            }
        })
    })
}

//ทำให้สมบูรณ์
const writeJson = (data,file_name) => {
    data = JSON.stringify(data, null, " ");
    return new Promise((resolve, reject) => {
        fs.writeFile(file_name, data, (err) => {
          if (err) 
            reject(err);
          else
            console.log('saved');
            resolve(data);
        });
    })
}

//ทำให้สมบูรณ์
const updateImg = async (username, fileimg) => {
    let userDBpath = path.join(__dirname, 'js', 'userDB.json');
    let readUserdata = await readJson(userDBpath);
    let jsondata = JSON.parse(readUserdata);
    let userDatakeys = Object.keys(jsondata);
    for(let i = 0; i < userDatakeys.length; i++)
    {
        if(jsondata[userDatakeys[i]].username == username){
            jsondata[userDatakeys[i]].img = fileimg;
        }
    }
    await writeJson(jsondata, userDBpath);
}

 app.listen(port, hostname, () => {
        console.log(`Server running at   http://${hostname}:${port}/`);
});
