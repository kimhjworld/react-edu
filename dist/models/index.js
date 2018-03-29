'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config(); // LOAD CONFIG

//env.... 
var sequelize = new _sequelize2.default(process.env.DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mssql',
    dialectOptions: {
        encrypt: true
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    port: 80
});

var db = [];

_fs2.default.readdirSync(__dirname).filter(function (file) {
    return file.indexOf('.js') && file !== 'index.js';
}).forEach(function (file) {
    var model = sequelize.import(_path2.default.join(__dirname, file));
    db[model.name] = model;
});

Object.keys(db).forEach(function (modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = _sequelize2.default;

exports.default = db;