import express from 'express';
import models from '../models';
import request from 'request';
import cheerio from 'cheerio';
import removeEmpty from '../libs/removeEmpty';
const router = express.Router();

router.post('/complete', (req,res)=>{
    models.Checkout.create({
        imp_uid : req.body.imp_uid,
        merchant_uid : req.body.merchant_uid,
        paid_amount : req.body.paid_amount,
        apply_num : req.body.apply_num,

        buyer_email : req.body.buyer_email,
        buyer_name : req.body.buyer_name,
        buyer_tel : req.body.buyer_tel,
        buyer_addr : req.body.buyer_addr,
        buyer_postcode : req.body.buyer_postcode,
        status : req.body.status,


    }).then(function() {
        res.json({ message : "success" });
    });
});


router.post('/mobile_complete', (req,res)=>{
    models.Checkout.create({
        imp_uid : req.body.imp_uid,
        merchant_uid : req.body.merchant_uid,
        paid_amount : req.body.paid_amount,
        apply_num : req.body.apply_num,

        buyer_email : req.body.buyer_email,
        buyer_name : req.body.buyer_name,
        buyer_tel : req.body.buyer_tel,
        buyer_addr : req.body.buyer_addr,
        buyer_postcode : req.body.buyer_postcode,
        status : req.body.status,

    }).then(function() {
        //res.redirect('/');
        res.json({message : "success"});
    });
});

router.get('/shipping/:invc_no', (req,res)=>{
    //npm request : url로 호출해서 데이터를 긁어옴
    //npm cheerio : 데이터의 원하는 위치를 가져옴
    //대한통운의 현재 배송위치 크롤링 주소
    var url = "https://www.doortodoor.co.kr/parcel/doortodoor.do?fsp_action=PARC_ACT_002&fsp_cmd=retrieveInvNoACT&invc_no=" + req.params.invc_no ;
    var result = []; //최종 보내는 데이터
    request(url, (error, response, body) => {
        //한글 변환
        var $ = cheerio.load(body, { decodeEntities: false });

        var tdElements = $(".board_area").find("table.mb15 tbody tr td"); //td의 데이터를 전부 긁어온다
        // console.log(tdElements[0]) 로 찍어본다.

        //한 row가 4개의 칼럼으로 이루어져 있으므로
        // 4로 나눠서 각각의 줄을 저장한 한줄을 만든다
        for( var i=0 ; i<tdElements.length ; i++ ){

            if(i%4===0){
                var temp = {}; //임시로 한줄을 담을 변수
                temp["step"] = removeEmpty(tdElements[i].children[0].data);
                //removeEmpty의 경우 step의 경우 공백이 많이 포함됨
            }else if(i%4===1){
                temp["date"] = tdElements[i].children[0].data;
            }else if(i%4===2){

                //여기는 children을 1,2한게 배송상태와 두번째줄의 경우 담당자의 이름 br로 나뉘어져있다.
                // 0번째는 배송상태, 1은 br, 2는 담당자 이름
                temp["status"] = tdElements[i].children[0].data;
                if(tdElements[i].children.length>1){
                    temp["status"] += tdElements[i].children[2].data;
                }

            }else if(i%4===3){
                temp["location"] = tdElements[i].children[1].children[0].data;
                result.push(temp); //한줄을 다 넣으면 result의 한줄을 푸시한다
                temp = {}; //임시변수 초기화
            }
        }

        res.json(result); //최종값 전달
    });
});

router.get('/order', (req,res)=>{
    models.Checkout.findAll({

    }).then(function(orderList) {
        res.json({ orderList : orderList });
    });
});

router.get('/order/:id', (req,res)=>{
    models.Checkout.findById(req.params.id).then( (order) => {
        res.json({ order : order });
    });
});

router.put('/order/:id', (req,res)=>{
    models.Checkout.update(
        {
            status : req.body.status,
            song_jang : req.body.song_jang,
        },
        {
            where : { id: req.params.id }
        }
    ).then(function() {
        res.json({ message : "success" });
    });
});
export default router;
