/*
var MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb://localhost', { useUnifiedTopology: true }, function (err, client) { 
    if (err) throw err; 
    var db = client.db('vehicle'); 
    db.collection('car').findOne({}, function (findErr, result) { 
        if (findErr) throw findErr; 
        console.log(result.name, result.price); 
        client.close(); 
    }); 
});
*/

const http = require('http');
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

app.set('port', 3000);
app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");

let db = null;

const connectionDB = async () => {
    try {
        const databaseUrl = 'mongodb://localhost:27017';
        const client = await MongoClient.connect(databaseUrl);
        console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
        db = client.db('vehicle');
    } catch (err) {
        console.error('MongoDB 연결 실패:', err);
    }
};

app.get('/car', async (req, res) => {
    if(db!==null) {
        const car = db.collection('car');
        const carList = await car.find({}).toArray();
        req.app.render('car_list', {carList}, (err, html) => {
            if (err) {
                res.status(500).send('템플릿 렌더링 중 오류가 발생했습니다.');
            } else {
                res.end(html);
            }
        });
    } else {
        res.status(500).send('데이터베이스 연결이 되어 있지 않습니다.');
    }
});

const server = http.createServer(app);
server.listen(app.get('port'), () => {
    console.log("서버 실행 중 ... http://localhost:" + app.get('port'));
    connectionDB();
});