const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { decode } = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number
  }
})

// 비밀번호 암호화
userSchema.pre('save', function( next ) {
  var user = this;

  // 비밀번호 변경할때만
  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err);
      bcrypt.hash(user.password, salt, function(err, hash) { // hash = 암호화된 비밀번호
        if(err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function(plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    console.log(isMatch);
    if(err) return cb(err);
    cb(null, isMatch);
  })
}
  // jsonwebtoken을 이용해서 token 생성
userSchema.methods.generateToken = function(cb) {
  var user = this;

  var token = jwt.sign(user._id.toHexString(), 'secretToken')
  user.token = token
  user.save(function(err, user) {
    if(err) return cb(err);
    cb(null, user);
  })
}

userSchema.statics.findByToken = function(token, cb) {
  var user = this;

  // token을 decode
  jwt.verify(token, 'secretToken', function(err, decoded) {
    // 유저 email을 이용해서 유저를 찾은 다음
    // client에서 가져온 token과 DB에 보관된 token이 일치하는지 확인

    user.findOne({ "_id": decoded, "token": token }, function(err, user) {
      if(err) return cb(err);
      cb(null, user);
    })
  })
};

const User = mongoose.model('User', userSchema);

module.exports = { User };