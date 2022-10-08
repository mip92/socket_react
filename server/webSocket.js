const ws = require('ws')

const wss = new ws.Server({
    port: 5000
}, () => console.log('server started on ' + 5000 + ' port'))

const rooms = {}
wss.on('connection', function connection(ws) {
    const uuid = Math.random()
    const leave = room => {
        if (!rooms[room][uuid]) return;
        if (Object.keys(rooms[room]).length === 1) delete rooms[room];
        else delete rooms[room][uuid];
    };
    ws.on('message', function (mess) {
        let message = JSON.parse(mess)
        switch (message.event) {
            case'message':
                Object.entries(rooms[message.roomName]).forEach(([, ws]) => ws.send(JSON.stringify(message)));
                break;
            case 'connection':
                if (!rooms[message.roomName]) rooms[message.roomName] = {};

                if (!rooms[message.roomName][uuid]) rooms[message.roomName][uuid] = ws;
                console.log(Object.keys(rooms[message.roomName]))
                if(Object.keys(rooms[message.roomName]).length===1){
                    const m={...message,figure: 'x'}
                    Object.entries(rooms[message.roomName]).forEach(([, ws]) => ws.send(JSON.stringify(m)));
                } else{
                    const m={...message,figure: '0'}
                    Object.entries(rooms[message.roomName]).forEach(([, ws]) => ws.send(JSON.stringify(m)));
                }
                break;
            case 'leave':
                leave(message.roomName)
                break;
            case 'game':
                if (!rooms[message.roomName]) rooms[message.roomName] = {};
                if (!rooms[message.roomName][uuid]) rooms[message.roomName][uuid] = ws;
                Object.entries(rooms[message.roomName]).forEach(([, ws]) => ws.send(JSON.stringify(message)));
                break;
        }
    })
})

const message = {
    event: 'message/connection',
    id: 123,
    date: '8.13.2022',
    userName: 'mip92',
    roomName: 'room',
    message: 'hello world'
}