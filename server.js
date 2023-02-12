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
  db.collection('login').insertOne({name:req.body.name,id:req.body.id,pw:req.body.pw},function(err,result){
  });
  res.redirect('/');
});
//로그인
app.post('/login',passport.authenticate('local',{failureRedirect:'/fail'}), function(req,res){

  res.redirect('friends.ejs');
})
passport.use(new LocalStrategy({
  usernameField: 'id',
  passwordField: 'pw',
  session: true,
  passReqToCallback: false,
}, function (입력한아이디, 입력한비번, done) {
  //console.log(입력한아이디, 입력한비번);
  db.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
    if (에러) return done(에러)

    if (!결과) return done(null, false, { message: '존재하지않는 아이디요' })
    if (입력한비번 == 결과.pw) {
      return done(null, 결과)
    } else {
      return done(null, false, { message: '비번틀렸어요' })
    }
  })
}));