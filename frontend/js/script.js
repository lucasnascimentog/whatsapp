const loginTela = document.querySelector('.login');
const loginForm = document.querySelector('.login__form');
const loginInput = document.querySelector('.login__input');

const chatTela = document.querySelector('.chat');
const chatForm = document.querySelector('.chat__form');
const chatInput = document.querySelector('.chat__input');
const chatMessages = document.querySelector('.chat__messages');


const user = {
    id: '',
    name: '',
    color: ''
}

const colors = [
    "cadetblue",
    "darkgoldenrod",
    "cornflowerblue",
    "darkkhaki",
    "hotpink",
    "gold"
]

const userColor = () => {
    i = Math.floor(Math.random()*colors.length);
    return colors[i]
}

let ws = '';

const createMessageSelfElement = (content) => {
    const div = document.createElement('div');

    div.classList.add('message--self')
    div.innerHTML = content
    return div
}

const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement('div');
    const span = document.createElement('span');

    div.classList.add('message--other')
    div.classList.add('message--self')
    span.classList.add('message--sender')
    span.style.color = senderColor

    div.appendChild(span)

    span.innerHTML = sender
    div.innerHTML += content
    return div
}

const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    })
}


const processMessage = ({data}) => {
    const { userId, userName, userColor, content } = (JSON.parse(data))

    const message = 
        userId == user.id
            ? createMessageSelfElement(content)
            : createMessageOtherElement(content, userName, userColor)
    chatMessages.appendChild(message)
    scrollScreen()
}

const handleLogin = (event) => {
    event.preventDefault();
    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = userColor();
    console.log(user);
    loginTela.style.display = "none";
    chatTela.style.display = "flex";
    
    ws = new WebSocket('ws://localhost:8080');
    ws.onmessage = processMessage
    
}

const sendMessage = (event) => {
    event.preventDefault();

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    }

    ws.send(JSON.stringify(message))
    chatInput.value = ''
}

loginForm.addEventListener('submit', handleLogin)
chatForm.addEventListener('submit', sendMessage)
