const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const { resolve } = require('path');
const { rejects } = require('assert');

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
    
    return res.redirect('feed.html')
 })

//ทำให้สมบูรณ์
// ถ้าต้องการจะลบ cookie ให้ใช้
// res.clearCookie('username');
app.get('/logout', (req,res) => {
    return res.redirect('index.html');
})

//ทำให้สมบูรณ์
app.get('/readPost', async (req,res) => {
    
})

//ทำให้สมบูรณ์
app.post('/writePost',async (req,res) => {
    
})

//ทำให้สมบูรณ์
app.post('/checkLogin',async (req,res) => {
    let jsonUseDBPath = await path.join(__dirname, 'js', 'userDB.json')
    let readUserDB = await readJson(jsonUseDBPath); //Object
    // console.log(typeof(readUserDB));
    // readUserDB.then((out) => console.log(out));
    readUserDB = await JSON.parse(readUserDB);
    // console.log(readUserDB);
    let keysUserData = await Object.keys(readUserDB); //[ 'user1', 'user2', 'user3', 'user4', 'user5' ]
    for(let i = 0; i < keysUserData.length; i++)
    {
        let username = await req.body.username;
        // console.log(username);
        let password = await req.body.password;
        // console.log(password)
        // console.log(readUserDB[keysUserData[i]]); //username: 'keroro', password: 'green', img: 'avatar.png' 
        // console.log(readUserDB[keysUserData[i]].username); //keroro
        if(readUserDB[keysUserData[i]].username == username && readUserDB[keysUserData[i]].password == password){
            // console.log('log in!');
            res.cookie("username",username);
            res.cookie("img",readUserDB[keysUserData[i]].img);
            return await res.redirect('feed.html');
            
        }else{
            // console.log('can not log in');
            return await res.redirect('index.html?error=1');
        }
    }
    // console.log(keysUserData);
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
    
}

//ทำให้สมบูรณ์
const updateImg = async (username, fileimg) => {
    
}

 app.listen(port, hostname, () => {
        console.log(`Server running at   http://${hostname}:${port}/`);
});
