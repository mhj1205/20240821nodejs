// node.js 프로젝트와 mongodb 연동 테스트
/*
const mongojs = require("mongojs");

const db = mongojs('vehicle', ['car']);

db.car.find(function(er, data) {
    console.log(data);
});
*/

const mongojs = require("mongojs");
const db = mongojs('vehicle', ['car']);

const express = require('express');
const app = express();
const http = require('http');

app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");

app.get('/car', (req, res) => {
    db.car.find(function(err, carList) {
        req.app.render('car_list', {carList}, (err, html)=>{
            res.end(html);
        });
    });
});

const server = http.createServer(app);
server.listen(3000, () => {
    console.log('서버 실행 중 ...');
});