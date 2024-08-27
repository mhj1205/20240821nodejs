const http = require('http');
const express = require('express');
const app = express();
const mongojs = require("mongojs");
const db = mongojs('vehicle', ['car']);
const path = require("path");

app.set('port', 3000);
app.set("view engine", "ejs");
app.set('views',path.join(__dirname, "../views"));

app.get('/', (req,res)=>{
    if(db) {
        db.car.find((err,result)=>{
            if(err) throw err;
            req.app.render("CarList", {carList: result}, (err2, html)=>{
                if(err2) throw err2;
                res.end(html);
            });

        });
    } else {
        res.end("db가 연결되지 않았습니다.");
    }
});

const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log(`서버 실행 중 >>> http://localhost:${app.get('port')}`);
});

