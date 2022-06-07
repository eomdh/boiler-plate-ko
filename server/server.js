const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth')

const { User } = require("./models/User");

app.use(cookieParser());
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {})
  .then(() => console.log('MongoDB Connected..'))
  .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/api/hello', (req, res) => {
  res.send('cors test');
})

app.post('api/user/register', (req, res) => {
  // 회원가입에 필요한 정보를 client에서 가져오면
  // 그것들을 DB에 넣어줌

  const user = new User(req.body);

  user.save((err, user) => {
    if(err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    });
  });
});

app.post('api/user/login', (req, res) => {
  // login 요청된 email을 DB에서 찾기
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user) {
      return res.json({
        loginSuccess: false,
        message: "이메일을 확인해주세요."
      });
    };
    // 요청된 email이 DB에 있다면 password 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch) return res.json({
        login: false,
        message: "비밀번호가 틀렸습니다."
      });
      // password가 맞다면 token 생성
      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err)
        
        // token을 쿠키에 저장
        res.cookie("x_auth", user.token)
        .status(200)
        .json({ loginSuccess: true, userId: user._id })
      });
    });
  });
});


app.get('/api/user/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true, // role 1 : admin, role 0 : user
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  });
});

app.get('/api/user/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
      if(err) return res.json({ success: false, err});
      return res.status(200).send({
        success: true
      })
    })
})

app.listen(port, () => console.log(`listening on port ${port}!`));