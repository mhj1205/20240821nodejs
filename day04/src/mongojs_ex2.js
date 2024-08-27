const http = require('http');
const express = require('express');
const app = express();

const mongojs = require("mongojs");
const db = mongojs('vehicle', ['car']);

app.set('port', 3000);

app.get('/', (req,res)=>{
    if(db) {
        db.car.find((err,result)=>{
            if(err) throw err;
            let html = '<table border="1">';
            result.forEach((car, i)=>{
                html += `<tr><td>${car.name}</td><td>${car.price}</td>
                <td>${car.company}</td><td>${car.year}</td></tr>`;
            });
            html += "</table>";
            res.end(html);
        });
    } else {
        res.end("db가 연결되지 않았습니다.");
    }
});

const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log(`서버 실행 중 >>> http://localhost:${app.get('port')}`);
});

