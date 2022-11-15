const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3000;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'public/img/');
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

// ใส่ค่าตามที่เราตั้งไว้ใน mysql
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234567890",
    database: "userdb"
})

con.connect(err => {
    if(err) throw(err);
    else{
        console.log("MySQL connected");
    }
})

let userinfo_table = 'userinfo';
let userpost_table = 'userpost';

const queryDB = (sql) => {
    return new Promise((resolve,reject) => {
        // query method
        con.query(sql, (err,result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

app.post('/regisDB', async (req,res) => {
    let sql = "CREATE TABLE IF NOT EXISTS userinfo (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(200), email VARCHAR(200), password VARCHAR(45), img VARCHAR(200))";
    let result = await queryDB(sql);
    sql = `INSERT INTO userinfo (username, email, password, img) VALUES ("${req.body.username}", "${req.body.email}", "${req.body.password}", "avatar.png")`;
    result = await queryDB(sql);
    console.log("New record created successfully one");

    // console.log(req.body.username);
    res.cookie("username",req.body.username);
    return res.redirect('login.html')
})

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
        // console.log(req.cookies.username);
        updateImg (req.cookies.username, req.file.filename);
        res.cookie("img", req.file.filename);
        return res.redirect('feed.html');
    })
})

const updateImg = async (username, filen) => {
    let sql = `UPDATE ${userinfo_table} SET img = '${filen}' WHERE username = '${username}'`;
    // let sql = `UPDATE ${userinfo_table} SET img = '${req.file.filename}' WHERE username = '${req.cookies.username}'`;
    let result = await queryDB(sql);
    console.log('img update!');
}

//ทำให้สมบูรณ์
app.get('/logout', (req,res) => {
    res.clearCookie('username');
    res.clearCookie('img');
    return res.redirect('login.html');
})

//ทำให้สมบูรณ์
app.get('/readPost', async (req,res) => {
    let sql = `SELECT id, username, post FROM ${userpost_table}`;
    let result = await queryDB(sql);
    // console.log(result); //RowDataPacket { id: 10, username: '3', post: 'dd' }
    result = Object.assign({}, result);
    let string = JSON.stringify(result, null, " ");
    // console.log(result); //'0': RowDataPacket { id: 10, username: '3', post: 'dd' }
    // console.log(typeof(result)); //object
    res.send(string);
    // res.json(result);
})

//ทำให้สมบูรณ์
app.post('/writePost',async (req,res) => {
    let sql = "CREATE TABLE IF NOT EXISTS userpost (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(200), post VARCHAR(1000))";
    let result = await queryDB(sql);
    sql = `INSERT INTO userpost (username, post) VALUES ("${req.cookies.username}", "${req.body.post}")`;
    result = await queryDB(sql);
    // console.log('username is: ' + req.cookies.username);
    // console.log('post body is: ' + req.body.post);
    // console.log(result);
    let sqlselect = `SELECT id, username, post FROM ${userpost_table}`;
    let resultselect = await queryDB(sqlselect);
    resultselect = Object.assign({}, resultselect);
    // console.log(resultselect);

    // console.log('string : ' + string);

    // console.log(Object.keys(json));
    // for(let i = 0; i < Object.keys(json).length; i++)
    // {
    //     console.log(json[i]);
    //     console.log(json[i].post);
    //     console.log(i);
    // }
    // let string = JSON.stringify(resultselect, null, " ");
    // let jsondata = JSON.parse(string);
    // console.log(jsondata);
    // res.json(jsondata);
    // res.end();
    // console.log(resultselect);
    res.json(resultselect);
    res.end();
})

//ทำให้สมบูรณ์
app.post('/checkLogin',async (req,res) => {
    let username = req.body.username;
    // console.log(username);
    let password = req.body.password;
    // console.log(password);

    let sql = `SELECT username, password, img FROM ${userinfo_table}`;
    let result = await queryDB(sql);//--> object
    // console.log(typeof(result)); 
    // console.log(result);
    // console.log(result[2]); //RowDataPacket { username: 'keroro', password: 'green' }
    // console.log(result.length); //15
    for(let i = 0; i < result.length; i++)
    {
        // console.log(result[i].username == username && result[i].password == password);
        // console.log('--------------');
        if(result[i].username == username && result[i].password == password){
            // console.log(result[i].username);
            // console.log(result[i].img);
            res.cookie("username", username);
            res.cookie("img", result[i].img);
            return res.redirect('feed.html');
        }
        // console.log(i);
        // console.log(result[i]); //RowDataPacket { username: 'a', password: '1234' }
        // console.log('--------------')
    }
    return res.redirect('login.html?error=1')
    // ถ้าเช็คแล้ว username และ password ถูกต้อง
    // return res.redirect('feed.html');
    // ถ้าเช็คแล้ว username และ password ไม่ถูกต้อง
    // return res.redirect('login.html?error=1')
    
})


 app.listen(port, hostname, () => {
        console.log(`Server running at   http://${hostname}:${port}/register.html`);
});
