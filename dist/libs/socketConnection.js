'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (io) {
    io.on('connection', function (socket) {
        socket.on('chat message', function (data) {
            io.emit('server message', data.message);
        });
    });
};