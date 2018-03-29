'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportFacebook = require('passport-facebook');

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config(); // .env 파일에서 설정 가져옴

var router = _express2.default.Router();

_passport2.default.serializeUser(function (user, done) {
    done(null, user);
});

_passport2.default.deserializeUser(function (user, done) {
    done(null, user);
});

_passport2.default.use(new _passportFacebook.Strategy({
    // https://developers.facebook.com에서 appId 및 scretID 발급
    clientID: process.env.FACEBOOK_CLIENTID,
    clientSecret: process.env.FACEBOOK_SECRETCODE,
    callbackURL: "http://localhost:3000/api/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos', 'email'] //받고 싶은 필드 나열
}, function (accessToken, refreshToken, profile, done) {
    console.log(profile); //어떤 필드를 받는지 콘솔에 찍어본다
    _models2.default.Users.findOne({ // 기존에 User모델에 존재하는지 확인
        where: {
            username: "fb_" + profile.id
        }
    }).then(function (user) {
        if (!user) {
            //DB에 없으면 회원가입 후 로그인 성공페이지 이동
            _models2.default.Users.create({
                username: "fb_" + profile.id,
                password: "facebook_login",
                displayname: profile.displayName
            }).then(function (result) {
                done(null, result); //세션 등록
            });
        } else {
            //DB에 있으면 가져와서 세션등록
            done(null, user);
        }
    });
}));

//GET http://localhost:3000/api/auth/facebook 접근시 facebook으로 넘길 url 작성해줌
router.get('/facebook', _passport2.default.authenticate('facebook', { scope: 'email' }));

//인증후 페이스북에서 이 주소로 리턴해줌. 상단에 적은 callbackURL과 일치
router.get('/facebook/callback', _passport2.default.authenticate('facebook', {
    //successRedirect: '/api/auth/facebook/success', //성공시 이동
    successRedirect: '/', //성공시  root로 이동
    failureRedirect: '/api/auth/facebook/fail' //실패시 이동
}));

//로그인 성공시 이동할 주소
router.get('/facebook/success', function (req, res) {
    res.send(req.user);
});

//실패시 이동
router.get('/facebook/fail', function (req, res) {
    res.send('facebook login fail');
});

exports.default = router;