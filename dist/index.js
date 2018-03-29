'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _models = require('./models');

var _models2 = _interopRequireDefault(_models);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _admin = require('./routes/admin');

var _admin2 = _interopRequireDefault(_admin);

var _accounts = require('./routes/accounts');

var _accounts2 = _interopRequireDefault(_accounts);

var _checkout = require('./routes/checkout');

var _checkout2 = _interopRequireDefault(_checkout);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _auth = require('./routes/auth');

var _auth2 = _interopRequireDefault(_auth);

var _socket = require('socket.io');

var _socketConnection = require('./libs/socketConnection');

var _socketConnection2 = _interopRequireDefault(_socketConnection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//sesscion 쓸거....
var app = (0, _express2.default)();

//facebook module


//라우팅에서 쓸거 import..


var port = 3000;

// DB authentication
_models2.default.sequelize.authenticate().then(function () {
    console.log('Connection has been established successfully.');
    return _models2.default.sequelize.sync();
    //return db.sequelize.drop();  //drop table
}).then(function () {
    console.log('DB Sync complete.');
}).catch(function (err) {
    console.error('Unable to connect to the database:', err);
});

// logger
app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json()); //bodyParser : 미들웨어...
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use((0, _cookieParser2.default)()); //이부분 삽입


// SERVE STATIC FILES - REACT PROJECT
app.use('/', _express2.default.static(_path2.default.join(__dirname, '../public')));

//업로드 path 추가 (라우팅보다 먼저 있어야함)
app.use('/uploads', _express2.default.static(_path2.default.join(__dirname, '../uploads')));

//업로드 path 추가
app.use('/uploads', _express2.default.static(_path2.default.join(__dirname, '../uploads')));

//session 관련 셋팅----------------------------------------
app.use((0, _expressSession2.default)({
    secret: 'ebay',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 2000 * 60 * 60 //지속시간 2시간
    }
}));

//passport 적용
app.use(_passport2.default.initialize());
app.use(_passport2.default.session());

//-------------------------------------------------------------

//라우팅
app.use('/api/admin', _admin2.default);
app.use('/api/accounts', _accounts2.default);
app.use('/api/auth', _auth2.default); //페이스북관련로그인설정
app.use('/api/checkout', _checkout2.default);

app.get('*', function (req, res) {
    res.sendFile(_path2.default.resolve(__dirname, '../public', 'index.html'));
});

app.get('/', function (req, res) {
    res.send('Es6 export Import');
});

var server = app.listen(port, function () {
    console.log('Express listening on port', port);
});

var io = (0, _socket.listen)(server);
(0, _socketConnection2.default)(io);