const socket = io();

const form = document.getElementById('msg-form');
const input = document.getElementById('msg-input');
const nameIn = document.getElementById('name-input');
const messages = document.getElementById('messages');
const popupWrapper = document.getElementById("popup");
let prevName = '';

messages.scrollTo(0, messages.scrollHeight);

const addMessage = (name, msg, isSpecial) => {
    const item = document.createElement('div');
    item.classList.add("message");
    if (messages.childElementCount % 2 == 0) {
        item.classList.add("message-odd");
    }
    if(isSpecial){
        item.classList.add("message-special");
        item.textContent = msg;
    } else {
        item.textContent = name + ": " + msg;
    }
    messages.appendChild(item);
    messages.scrollTo(0, messages.scrollHeight);
}

async function requestMessages() {
    const response = await fetch('http://localhost:3000/messages', { method: "GET" });
    const data = await response.json();;
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        addMessage(element?.name, element?.msg, element?.special);
    }
}

const showError = (error) => {
    const background = document.createElement('div');
    background.classList.add("popup-background");

    const popup = document.createElement('div');
    popup.classList.add("popup-container");

    const message = document.createElement('div');
    message.classList.add("popup-msg");
    message.classList.add("error");
    message.textContent = error;

    const submitButton = document.createElement('button');
    submitButton.classList.add("popup-button");
    submitButton.textContent = "Submit";
    submitButton.onclick = () => {
        popupWrapper.removeChild(background);
    }

    popup.appendChild(message);
    popup.appendChild(submitButton);
    background.appendChild(popup);
    return background;
}

const showPopupEnterName = () => {
    const background = document.createElement('div');
    background.classList.add("popup-background");

    const popup = document.createElement('div');
    popup.classList.add("popup-container");

    const message = document.createElement('div');
    message.classList.add("popup-msg");
    message.textContent = "Enter name";

    const input = document.createElement('input');
    input.classList.add("popup-input");
    
    const submitButton = document.createElement('button');
    submitButton.classList.add("popup-button");
    submitButton.textContent = "Submit";
    submitButton.onclick = () => {
        nameIn.value = input.value;
        changeName().then(() => {
            popupWrapper.removeChild(background);
        }).catch((e) => {
        })
    }

    popup.appendChild(message);
    popup.appendChild(input);
    popup.appendChild(submitButton);
    background.appendChild(popup);
    return background;
}

const changeName = () => {
    return new Promise((resolve, reject) => {

        fetch('http://localhost:3000/setName', {
            method: "POST",
            body: JSON.stringify({ name: nameIn.value }), // данные могут быть 'строкой' или {объектом}!
            headers: {
                "Content-Type": "application/json",
            }
        }).then(response => {
            if (response.ok) {
                socket.emit('add name', nameIn.value);

                return response.json();
            }
            return Promise.reject(response);
        }).then(data => {
            socket.emit('add name', nameIn.value);
            if(!prevName){
                socket.emit('new user', nameIn.value);
            } else {
                socket.emit('change name', nameIn.value, prevName);
            }
            prevName = nameIn.value;
            resolve();
        }).catch((response) => {
            response.json().then((json) => {
                popupWrapper.appendChild(showError(json.error));
                nameIn.value = prevName;
                reject(json);
            })
        });
    });
};

nameIn.addEventListener('blur', () => {
    if(!nameIn.value){
        nameIn.value = prevName;
        return;
    }
    if (nameIn.value == prevName) {
        return;
    }
    changeName().catch(e => {
    });
});


requestMessages().then(() => {
    console.log("Success");
});

form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (nameIn.value !== prevName) {
        changeName().then(data => {
            if (input.value && nameIn.value) {
                socket.emit('chat message', nameIn.value, input.value);
                input.value = '';
            }
        }).catch(e => {
        });
        return;
    }
    if (input.value && nameIn.value) {
        socket.emit('chat message', nameIn.value, input.value);
        input.value = '';
    }
});

socket.on('chat message', function (name, msg) {
    addMessage(name, msg)
});

socket.on('new user', function (msg) {
    addMessage("", msg, true)
});

socket.on('change name', function (msg) {
    addMessage("", msg, true)
});

socket.on('disconnect user', function (msg) {
    addMessage("", msg, true)
});

popupWrapper.appendChild(showPopupEnterName());