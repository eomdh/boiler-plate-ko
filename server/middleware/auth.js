const { User } = require('../models/User');

// 인증처리
let auth = (req, res, next) => {
  // client에서 쿠키 가져옴
  let token = req.cookies.x_auth;

  // token을 복호화한 후 유저를 찾음
  User.findByToken(token, (err, user) => {
    if(err) throw err;
    if(!user) return res.json({
      isAuth: false,
      error: true
    })
    req.token = token;
    req.user = user;
    next();
  })

  // 유저가 있으면 인증 okay
  // 유저가 없으면 인증 no
};

module.exports = { auth };