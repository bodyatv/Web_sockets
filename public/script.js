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
    let textInput=this.document.getElementById("message");

    let name,nick,thisConnectionStatus,typingSms,currColorEl;
    let greenMsgArr=[];

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

    socket.on('green messages',function(){
        let messagesArr=messagesBlock.childNodes;
        for(let i=0;i<messagesArr.length;i++){
            for(let k=0;k<greenMsgArr.length;k++){
                if(messagesArr[i].childNodes[1].innerHTML==greenMsgArr[k].text){
                    messagesArr[i].classList.add('green');
                }
            }
        }
        
        
    });
    
    socket.on('msg nick',function(nickname,msg){
        if(nick===nickname){
            greenMsgArr.push(msg);
        }
    });
     
    socket.on('typing',function(nickname){
        if(nick!=nickname){
            console.log('here typing');
            typingSms=document.createElement('div');
            typingSms.className="typing_sms";
            typingSms.innerHTML=`<h6>${nickname} is typing...</h6>`;
            messagesBlock.appendChild(typingSms); 

        }

    });

    socket.on('not typing',function(nickname){
        if(nick!=nickname){
            typingSms.innerHTML="";
        }
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
            socket.emit('not typing',nick);
    }

    textInput.onfocus=function(){
        socket.emit('typing',nick);
    }



    
    
};































