'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uploadDir = _path2.default.join(__dirname, '../../uploads');

/*************************************************************
*** multer 환경설정 추가
************************************************************/
//이미지 저장되는 위치 설정 (dirname : 현재 폴더가 있는 위치)
// ?

//multer 셋팅

var storage = _multer2.default.diskStorage({
    //destination:도착지 , 파일이 저장될 위치
    destination: function destination(req, file, callback) {
        callback(null, uploadDir);
    },
    filename: function filename(req, file, callback) {
        callback(null, 'product-' + Date.now() + '.' + file.mimetype.split('/')[1]);
    }
});
var upload = (0, _multer2.default)({ storage: storage });

/**/
var router = _express2.default.Router();

//미들웨어 만들어보기
function testMiddleWare(req, res, next) {
    console.log("#####test middleware#####");
    next();
    //로그인이 꼭 해야하는 페이지일때 사용하기도함... ex)login require.
    //next () : 제어권 넘기기.... 이상이 없으면 다음으로 제어권 넘기기
}

//router.get('/products',  (req,res)=>{
router.get('/products', testMiddleWare, function (req, res) {
    //testMiddleWare TEST
    _models2.default.Products.findAll({}).then(function (products) {
        res.json({ products: products });
    });
});

router.post('/products', upload.single('thumbnail'), function (req, res) {
    //router.post('/products', (req,res)=>에서  upload.single('thumbnail')추가
    _models2.default.Products.create({
        product_name: req.body.product_name,
        thumbnail: req.file ? req.file.filename : "",
        price: req.body.price,
        sale_price: req.body.sale_price,
        description: req.body.description
    }).then(function () {
        res.json({ message: "success" });
    });
});

router.get('/test', function (req, res) {
    res.send('test app');
});

router.delete('/products/:id', function (req, res) {
    _models2.default.Products.destroy({
        where: {
            id: req.params.id
        }
    }).then(function () {
        res.json({ message: "success" });
    });
});

router.get('/products/:id', function (req, res) {
    _models2.default.Products.findById(req.params.id).then(function (product) {
        res.json({ product: product });
    });
});

//수정할떄
router.put('/products/:id', upload.single('thumbnail'), function (req, res) {

    _models2.default.Products.findById(req.params.id).then(function (product) {

        if (req.file) {
            //요청중에 파일이 존재 할시 이전이미지 지운다.
            _fs2.default.unlinkSync(uploadDir + '/' + product.thumbnail);
        }
        _models2.default.Products.update({
            product_name: req.body.product_name,
            thumbnail: req.file ? req.file.filename : product.thumbnail,
            //파일명이 이미 존재하면 덮어씌우고, 그렇지않으면 새파일명..
            price: req.body.price,
            sale_price: req.body.sale_price,
            description: req.body.description
        }, {
            where: { id: req.params.id }
        }).then(function () {
            res.json({ message: "success" });
        });
    });
});

exports.default = router;