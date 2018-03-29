'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (sequelize, DataTypes) {
    var Users = sequelize.define('Users', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        username: { type: DataTypes.STRING(1200) },
        password: { type: DataTypes.STRING(1200) },
        displayname: { type: DataTypes.STRING(1200) }
    });
    return Users;
};