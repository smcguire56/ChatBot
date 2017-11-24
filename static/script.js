
// scripts file for Go chatbot 

// adapted from https://bootsnipp.com/snippets/featured/simple-chat
var name;
var me = {};
me.avatar = "img/person.png";
var you = {};
you.avatar = "img/bob.jpeg";

// this method will get the time of message sent 
function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

//-- No use time. It is a javaScript effect.
function insertChat(who, text, time = 0) {
    var control = "";
    var date = formatAMPM(new Date());

    // messaging service checks here if the user is bob or you.
    // it will print the message to the index
    if (who == "me") {
        control = '<li style="width:100%">' +
            '<div class="msj macro">' +
            '<div class="avatar"><img class="img-circle" style="width:100%;" src="' + me.avatar +
            '" /><\/div>' +
            '<div class="text text-l">' +
            '<p>' + name + '<\/p>' +
            '<p class="text-left">' + text + '<\/p>' +
            '<p><small>' + date + '<\/small><\/p>' +
            '<\/div>' +
            '<\/div>' +
            '<\/li>';
    } else {
        control = '<li style="width:100%;">' +
            '<div class="msj-rta macro">' +
            '<div class="text text-r">' +
            '<p class="text-right">Bob<\/p>' +
            '<p class="text-right">' + text + '<\/p>' +
            '<p><small>' + date + '<\/small><\/p>' +
            '<\/div>' +
            '<div class="avatar" style="padding:0px 0px 0px 10px !important"><img class="img-circle" style="width:100%;" src="' +
            you.avatar + '" /><\/div>' +
            '<\/li>';
    }
    setTimeout(
        function () { // add the message here and scroll to the bottom of the messages.
            $("ul").append(control);
            $("ul").animate({
                scrollTop: $("ul")[0].scrollHeight
            }, 500);
        }, time);

}

// clears the chat at the start.
function resetChat() {
    $("ul").empty();
}

// when the user click enter key, send whatever text is in the input to the chat bot
$(".mytext").on("keyup", function (e) {
    if (e.which == 13) {
        var text = $(this).val();
        if (text !== "") {
            insertChat("me", text);
            $(this).val('');
        }
    }
});

//-- Clear Chat
resetChat();

//-- Print Messages
var firstMessage = 0;
insertChat("you", "Hello, What is your name?", 0);

// add the messages in this function
function addtxt() {
    if (firstMessage == 0) {
        name = document.getElementById("mytext").value;
        // first message asking for user name and assigning it to them for the entire chat session.
        insertChat("you", "Hello " + name + ", What do you want to talk about?", 500);
        firstMessage++;
    } else // normal messages
    {
        // 
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                insertChat("you", xhttp.responseText, 500);
                if ($('#textToSpeech').prop('checked')) {
                    var msg = new SpeechSynthesisUtterance(xhttp.responseText);
                    msg.pitch = 0.3; //0 to 2
                    window.speechSynthesis.speak(msg);
                }
            }
        };

        xhttp.open("POST", "elizaRequests", true);
        xhttp.setRequestHeader("Cache-Control", "no-cache");
        xhttp.setRequestHeader("sendInput", document.getElementById("mytext").value);

        xhttp.send();
    }
}

$(document).keypress(function (e) {
    if (e.which == 13) {
        addtxt();
    }
});