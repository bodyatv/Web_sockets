window.onload=function(){

    let userName=document.getElementById("name");
    let userNick=document.getElementById("nick");
    let enterButton=document.getElementById("info_button");
    let message=document.getElementById("message");
    let messageButton=document.getElementById("sms_send");
    let messagesBlock=document.getElementsByClassName("prev_sms")[0];
    let loginForm=document.getElementsByClassName("register_block")[0];
    let chat=document.getElementsByClassName("chat")[0];
    let usersUl=document.getElementsByClassName("users")[0];

    let name,nick,thisConnectionStatus,typingSms,currColorEl;

    var socket=io.connect();

    socket.on('all users',function(users){
        usersUl.innerHTML='';
        for(let i=0;i<users.length;i++){
            let el=document.createElement('li');
            el.className="user";
            el.innerHTML=`<h3><div class=\"label ${users[i].availibility}\"></div><div>`+users[i].name+" ("+users[i].nick+`)</div><h5>${users[i].status}</h5></h3>`;
            usersUl.appendChild(el);
            }
    });

    socket.on('all messages',function(messages){
        messagesBlock.innerHTML="";
            for(let i=0;i<messages.length;i++){
                let el=document.createElement('div');
                el.className="sms";
                el.innerHTML=`<h5>${messages[i].senderName}</h5>`+`<h6>${messages[i].text}</h6>`;
                messagesBlock.appendChild(el);
        }
    });
    
    socket.on('typing sms',function(nick){
        console.log('we here');
        typingSms=document.createElement('div');
        typingSms.className="typing_sms";
        typingSms.innerHTML=`<h6>${nick} is typing...</h6>`;
        messagesBlock.appendChild(typingSms); 
    });

    socket.on('no typing',function(){
        typingSms.innerHTML="";
    });
    
    enterButton.onclick=function(){
        loginForm.classList.add('hide');
        chat.classList.remove('hide');    
        name=userName.value||"username";
        nick=userNick.value||"nick";
        thisConnectionStatus="just appeared";
        let data={
            name: name,
            nick: nick,
            status: thisConnectionStatus,
            availibility:'online'       
        }
        socket.emit('new user',data);
    };

    messageButton.onclick=function(){
            let data={
                senderName: name+`(${nick})`,
                text: message.value,
                date: new Date().getTime()
            }
            socket.emit('new message',data);
            message.value="";
    }

    
};






























