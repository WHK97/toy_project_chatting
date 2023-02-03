const express =require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
app.use(session({secret : '비밀코드', resave : true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session()); 
app.set('view engine','ejs'); 
app.use(express.urlencoded({extended: true}));
app.use('/public',express.static('public'));
let db;
MongoClient.connect('mongodb+srv://admin:qwer1234@cluster0.bfin3cb.mongodb.net/?retryWrites=true&w=majority').then(client => {
    db = client.db('kakao');
  }).then(app.listen(8080, () => {
    console.log('8080 port on');
  })).catch(err => console.log(err));

app.get('/',function(req,res){
  res.render("index.ejs");

})
// 회원가입
app.get('/register',function(req,res){
  res.render('register.ejs');
});
app.post('/register',function(req,res){
  db.collection('user').insertOne({name:req.body.username,email:req.body.email,pw:req.body.pw},function(err,result){
  });
  res.redirect('/');
});
//로그인
app.post('/login',function(req,res){
  db.collection('user').findOne({},function(err,result){

  });
  res.redirect('friends.ejs');
})