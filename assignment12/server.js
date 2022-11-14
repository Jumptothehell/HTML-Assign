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
    password: "marrode9202",
    database: "userdb"
})

con.connect(err => {
    if(err) throw(err);
    else{
        console.log("MySQL connected");
    }
})

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
    let sql = "CREATE TABLE IF NOT EXISTS userinfo (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(200), email VARCHAR(200),password VARCHAR(45))";
    let result = await queryDB(sql);
    sql = `INSERT INTO userinfo (username, email, password) VALUES ("${req.body.username}", "${req.body.email}", "${req.body.password}")`;
    result = await queryDB(sql);
    console.log("New record created successfullyone");
    res.end("New record created successfully");
})

//ทำให้สมบูรณ์
app.post('/profilepic', (req,res) => {
    
})

const updateImg = async (username, filen) => {
    
}

//ทำให้สมบูรณ์
app.get('/logout', (req,res) => {
    
    return res.redirect('login.html');
})

//ทำให้สมบูรณ์
app.get('/readPost', async (req,res) => {
    
})

//ทำให้สมบูรณ์
app.post('/writePost',async (req,res) => {
    
})

//ทำให้สมบูรณ์
app.post('/checkLogin',async (req,res) => {
    // ถ้าเช็คแล้ว username และ password ถูกต้อง
    // return res.redirect('feed.html');
    // ถ้าเช็คแล้ว username และ password ไม่ถูกต้อง
    // return res.redirect('login.html?error=1')
    
})


 app.listen(port, hostname, () => {
        console.log(`Server running at   http://${hostname}:${port}/register.html`);
});
