const express = require('express');
const app = express();
const http = require('http');
const path = require('path');

const mongojs = require("mongojs");
const db = mongojs('vehicle', ['car']);

app.set('port', 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "../views") );

app.get('/car', (req, res) => {
    db.car.find(function(err, carList) {
        req.app.render('CarList', {carList}, (err, html)=>{
            res.end(html);
        });
    });
});

const server = http.createServer(app);
server.listen(app.get('port'), () => {
    console.log(`서버 실행 중 >>> http://localhost:${app.get('port')}`);
});