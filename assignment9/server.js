const fs = require('fs');
const http = require('http');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    readMsg().then(editJson).then((out) => {
        console.log(out);
        res.write(out);
        res.end();
    });
    // readMsg().then((out) => {
    //     console.log(out);
    //     res.write(out);
    //     res.end();
    // })
    //ทำการเรียกใช้ promise ในนี้นะ
    //แสดงผลของ json ใหม่ที่เพิ่มจำนวนเสื้อผ้าไปแล้วบน browser
    //ผล json ที่ได้บน browser จะไม่สวย ดังนั้นเราสามารถแก้ได้โดยกำหนด argument ใน JSON.stringify()
    // จะได้ JSON.stringify(<ชื่อตัวแปร JS object>, null, " ")  โดย json string ที่ได้จะมี การเว้นวรรคและบรรทัด
});
let readMsg = () => {
    // อ่านไฟล์ cloth1.json
    return new Promise((resolve, rejects) => {
        fs.readFile('cloth1.json', 'utf8', (err, data) => {
            if (err){
                rejects(err);
            }else{
                resolve(data);
            }
        })   
    })
}
// console.log(typeof data.then(console.log));
// จำนวนเสื้อผ้าตามที่กำหนด
let editJson = (data) => { 
    const stock = {
        item1: 2,
        item2: 3,
        item3: 5,
        item4: 2,
        item5: 5,
        item6: 8,
        item7: 1,
        item8: 9,
        item9: 0
    }
    var jsondata = JSON.parse(data); // data from cloth1.
    var keysData = Object.keys(jsondata); // key from cloth1. (item1, item2, ...)
    var keysStock = Object.keys(stock); //key form const stock. (item1. item2, ...)
    for(var i = 0; i < keysData.length; i++)
    {
        jsondata[keysData[i]]["stock"] = stock[keysStock[i]];
    }
    var newdata = JSON.stringify(jsondata, null, " ");
    // readMsg().then(writeMsg).then((out) => console.log(out));
    return new Promise ((resolve, rejects) => {
        fs.writeFile('new_cloth.json', newdata, (err) => {
            if(err){
                rejects(err);
            }else{
                resolve(newdata);
            }
        })

    })
}
// let writeMsg = () =>{
//     //ทำการเขียนไฟล์ใหม่ขึ้นมา
//     return new Promise ((resolve, rejects) =>{
//         fs.writeFile('new_cloth.json', data, (err) => {
//             if(err){
//                 rejects(err);
//             }else{
//                 resolve(data);
//             }
//         })
//     })
// }

// readMsg().then(editJson).then(writeMsg).then((out)=>{
//     console.log(out);
// })
// readMsg().then(editJson).then((out) =>console.log(out));

server.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/`);
    });

