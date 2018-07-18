const express=require("express");
let app= express();
const http=require("http").Server(app);
const io=require("socket.io")(http);

let messages=[],users=[];

app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.sendfile('index.html');
});

let checkMessageArr=function(messageArr){
    if(messageArr.length>98){
        messageArr.shift()
    }
};

let checkIfHasNick=function(msg){
    let nickname;
    if(msg.text.indexOf('@')!==-1){
        let start=msg.text.indexOf('@');
        if(msg.text.indexOf(' ')!==-1){
        nickname=msg.text.substring(start+1,msg.text.indexOf(' ',start));
        }
        else{
        nickname=msg.text.substring(start+1);
        }
        io.sockets.emit('msg nick',nickname,msg);
    }
}


io.on('connection',function(socket){
    var timerConnect,thisNick;

    socket.on('new user',function(userData){
        thisNick=userData['nick'];
        users.push(userData);
        io.sockets.emit('all users',users);
        io.sockets.emit('all messages',messages);
        io.sockets.emit('green messages');
        timerConnect=setTimeout(function(){
            for(let i=0;i<users.length;i++){
                if (users[i]['nick']==userData['nick']){
                    users[i]['status']='online';
                }
            }
            io.sockets.emit('all users',users);
        },60000);
    });
    
    socket.on('new message',function(msg){
        checkMessageArr(messages);
        messages.push(msg);
        io.sockets.emit('all messages',messages);
        checkIfHasNick(msg);
        io.sockets.emit('green messages');
    });

    socket.on('disconnect',function(){
        clearTimeout(timerConnect);
        messages.push({
            senderName:'ChatBot',
            text: thisNick+" has left the chat"
        });
        io.sockets.emit('all messages',messages);
        for(var i=0;i<users.length;i++){
            if(users[i]['nick']==thisNick){
                users[i]['status']='just left';
                users[i]['availibility']='offline';
                break;
            }
        }
        io.sockets.emit('all users',users);
        setTimeout(function(){
            users[i]['status']='offline';
            io.sockets.emit('all users',users);
    },60000);
    });
    
});
      



app.use(express.static('public'));
http.listen(1500,function(){
    console.log('we listen');
});