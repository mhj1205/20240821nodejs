const http = require("http");
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

app.set('port', 3000);
console.log("__dirname: ", __dirname);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", express.static(path.join(__dirname, "public") ));
app.use(cors());

app.get("/home", (req, res) => {
    console.log("Get /home 요청 실행");
    const name = req.query.name;
    const age = req.query.name;
    req.app.render('home', {name, age}, (err, html)=>{
        res.end(html);
    });
});

app.get("/home2", (req, res) => {
    console.log("Get /home 요청 실행");
    res.send(req.query);
   });

const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log(`서버 실행 중>>> http://localhost:${app.get('port')}`);
});