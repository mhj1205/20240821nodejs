const http = require("http");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

app.set('port', 3000);
app.set("views", "views");
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(expressSession({
    secret:"my key",
    resave:true,
    saveUninitialized:true
}));

const memberList = [
    {no:101, id:"user01", password:"1234", name:"홍길동", email:"hong@gmail.com"},
    {no:102, id:"user02", password:"12345", name:"박길동", email:"park@gmail.com"},
    {no:103, id:"user03", password:"123", name:"정길동", email:"jeong@gmail.com"},
    {no:104, id:"user04", password:"123423", name:"이길동", email:"lee@gmail.com"},
];
let noCnt = 105;

// 쇼핑몰 상품 목록
const carList = [
    {_id:111, name:'SM5', price:3000, year:1999, company:'SAMSUNG'},
	{_id:112, name:'SM7', price:5000, year:2013, company:'SAMSUNG'},
    {_id:113, name:'SONATA', price:3000, year:2023, company:'HYUNDAI'},
    {_id:114, name:'GRANDEUR', price:4000, year:2022, company:'HYUNDAI'},
    {_id:115, name:'BMW', price:6000, year:2019, company:'BMW'},
    {_id:116, name:'SONATA', price:3200, year:2024, company:'HYUNDAI'}
];
let carSeq=117;

const router = express.Router();

router.route("/home").get((req,res)=>{
    req.app.render("home/Home", {}, (err,html)=>{
        res.end(html);
    })
});

router.route("/profile").get((req,res)=>{
    req.app.render("profile/Profile", {}, (err,html)=>{
        res.end(html);
    })
});


router.route("/member").get((req,res)=>{
    if(req.session.user !== undefined){
        const user = req.session.user;
        req.app.render("member/Member", {user}, (err,html)=>{
            res.end(html);
        });
    } else{
        res.redirect("/login");
    }
    
});
/////로그인 페이지
router.route("/login").get((req,res)=>{
    req.app.render("member/Login", {}, (err,html)=>{
        res.cookie('user', {
            id:'Testuser',
            name:'테스트 유저',
            authorized: true
        });
        res.end(html);
    });
});
router.route("/login").post((req,res)=>{
    console.log(req.body.id, req.body.password);
    const idx = memberList.findIndex(member=>member.id===req.body.id);
    if(idx != 1) {
        if(memberList[idx].password === req.body.password) {
            console.log("로그인 성공");
            req.session.user = {
                id: req.body.id,
                name: memberList[idx].name,
                email: memberList[idx].email, 
                no: memberList[idx].no
            }
            res.redirect("/member");
            res.redirect("/login");
        }else{
            console.log("존재하지 않는 계정입니다.");
            res.redirect("/login");
        }
    }
    res.redirect("/member");
});
router.route("/logout").get((req, res)=>{
    console.log("GET - /logout 호출 ...");
    // 로그인 된 상태라면 로그아웃
    if(!req.session.user) {
        console.log("아직 로그인 전 상태입니다.");
        res.redirect("/login");
        return;
    }
    // 세션의 user 정보를 제거 해서 logout처리
    req.session.destroy((err)=>{
        if(err) throw err;
        console.log("로그아웃 성공!");
        res.redirect("/login");
    });
});
/////회원가입 페이지
router.route("/joinus").get((req,res)=>{
    req.app.render("member/Joinus", {}, (err,html)=>{
        res.end(html);
    })
});
router.route("/joinus").post((req,res)=>{
    res.redirect("/member");
});


router.route("/gallery").get((req,res)=>{
    req.app.render("gallery/Gallery", {}, (err,html)=>{
        res.end(html);
    })
});


// ---- 쇼핑몰 기능
router.route("/shop").get((req,res)=> {
    req.app.render("shop/Shop", {carList}, (err, html)=>{
        if(err) throw err;
        res.end(html);
    });
});
router.route("/shop/insert").get((req,res)=> {
    req.app.render("shop/Insert", {}, (err, html)=>{
        res.end(html);
    });
});
router.route("/shop/modify").get((req,res)=> {
    const _id = parseInt(req.query._id);
    console.log(_id)
    const idx = carList.findIndex(car=>_id===car._id);
    console.log(idx);
    if(idx === -1) {
        console.log("상품이 존재 하지 않습니다.")
        res.redirect("/shop");
        return;
    }
    req.app.render("shop/Modify", {car:carList[idx]}, (err, html)=>{
        if(err) throw err;
        res.end(html);
    });
});
router.route("/shop/modify").post((req,res)=> {
    console.log("POST - /shop/modify 호출");
    console.dir(req.body);
    res.redirect('/shop');
});
router.route("/shop/detail").get((req,res)=> {
    // 쿼리로 전송된 데이터는 모두 문자열이다. 
    // parseInt() 필수 "56" <-- numeric
    const _id = parseInt(req.query._id);
    console.log(_id)
    const idx = carList.findIndex(car=>_id===car._id);
    console.log(idx);
    if(idx === -1) {
        console.log("상품이 존재 하지 않습니다.")
        res.redirect("/shop");
        return;
    }
    req.app.render("shop/Detail", {car:carList[idx]}, (err, html)=>{
        if(err) throw err;
        res.end(html);
    });
});
router.route("/shop/delete").get((req,res)=> {
    req.app.render("shop/Delete", {}, (err, html)=>{
        res.end(html);
    });
});
router.route("/shop/cart").get((req,res)=> {
    req.app.render("shop/Cart", {}, (err, html)=>{
        res.end(html);
    });
});

app.use('/', router);

const expressErrorHandler = require('express-error-handler');
//모든 라우터 처리 후 404 오류 페이지 처리
const errorHandler = expressErrorHandler({
    static : {
        '404':'./public/404.html'
    }
});
app.use(expressErrorHandler.httpError(404) );
app.use(errorHandler );

const server = http.createServer(app);
server.listen(app.get('port'), ()=>{
    console.log(`Run on server >>> http://localhost:${app.get('port')}`);
});