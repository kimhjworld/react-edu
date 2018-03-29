import express from 'express';
import models from '../models';

/*************************************************************
*** multer 환경설정 추가
************************************************************/
//이미지 저장되는 위치 설정 (dirname : 현재 폴더가 있는 위치)
import path from 'path';
let uploadDir = path.join( __dirname , '../../uploads' );
import fs from 'fs'; // ?

//multer 셋팅
import multer from 'multer';
let storage = multer.diskStorage({
    //destination:도착지 , 파일이 저장될 위치
    destination : function (req, file, callback) {
        callback(null, uploadDir );
    },
    filename : function (req, file, callback) {
        callback(null, 'product-' + Date.now() + '.'+ file.mimetype.split('/')[1] );
    }
});
let upload = multer({ storage: storage });

/**/
const router = express.Router();

//미들웨어 만들어보기
function testMiddleWare(req, res, next){
  console.log("#####test middleware#####");
  next();
  //로그인이 꼭 해야하는 페이지일때 사용하기도함... ex)login require.
  //next () : 제어권 넘기기.... 이상이 없으면 다음으로 제어권 넘기기
}

//router.get('/products',  (req,res)=>{
router.get('/products', testMiddleWare, (req,res)=>{ //testMiddleWare TEST
    models.Products.findAll({

    }).then(function(products) {
        res.json({ products : products });
    });
});


router.post('/products', upload.single('thumbnail') , (req,res)=>{
    //router.post('/products', (req,res)=>에서  upload.single('thumbnail')추가
    models.Products.create({
      product_name : req.body.product_name,
      thumbnail : (req.file) ? req.file.filename : "",
      price : req.body.price ,
      sale_price : req.body.sale_price ,
      description : req.body.description
    }).then(function() {
        res.json({ message : "success" });
    });
});

router.get('/test', (req,res) =>{
  res.send('test app');
})

router.delete('/products/:id', (req,res)=>{
    models.Products.destroy({
        where: {
            id: req.params.id
        }
    }).then(function() {
        res.json({ message : "success" });
    });
});

router.get('/products/:id', (req,res)=>{
    models.Products.findById(req.params.id).then( (product) => {
        res.json({ product : product });
    });
});

//수정할떄
router.put('/products/:id', upload.single('thumbnail'), (req,res)=>{

    models.Products.findById(req.params.id).then( (product) => {

        if(req.file){  //요청중에 파일이 존재 할시 이전이미지 지운다.
            fs.unlinkSync( uploadDir + '/' + product.thumbnail );
        }
        models.Products.update(
            {
                product_name : req.body.product_name,
                thumbnail : (req.file) ? req.file.filename : product.thumbnail ,
                            //파일명이 이미 존재하면 덮어씌우고, 그렇지않으면 새파일명..
                price : req.body.price ,
                sale_price : req.body.sale_price ,
                description : req.body.description
            },
            {
                where : { id: req.params.id }
            }
        ).then(function() {
            res.json({ message : "success" });
        });

    });
});


export default router;
