export default (io) => {
    io.on('connection', function(socket){
        socket.on('chat message', function(data){
            io.emit('server message', data.message);
        });
    });
}
