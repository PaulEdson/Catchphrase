//connecting html elements and server
const canvas = document.getElementById('drawingboard');
var image = document.getElementById('sendingboard');
const tool = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');
const ctx2 = image.getContext('2d');
const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

let canvasOffsetX = canvas.offsetLeft;
let canvasOffsetY = canvas.offsetTop;

canvas.width = 800;
canvas.height = 800;

image.width = 800;
image.height = 800;

let isPainting = false;
let lineWidth = 5;
let startX;
let startY;

//using lineTo method to draw
const draw = (e)=>{
    if(!isPainting){
        return;
    }
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX - canvasOffsetX, e.clientY - canvasOffsetY + document.documentElement.scrollTop);
    ctx.stroke();
};


canvas.addEventListener('mousedown', (e) =>{
    isPainting = true;
    startX = e.clientX;
    startY = e.clientY;
});

canvas.addEventListener('mouseup', (e) =>{
    isPainting = false;
    ctx.stroke();
    ctx.beginPath();
});

tool.addEventListener('change', (e) => {
    if(e.target.id === 'stroke') {
        ctx.strokeStyle = e.target.value;
    }

    if(e.target.id === 'linewidth') {
        lineWidth = e.target.value;
        console.log(lineWidth);
    }
});

//converting image data to URL to send over server
tool.addEventListener('click', (e) => {
  //e.preventDefault();
  try{
    if (e.target.id === 'sendImg'){
      let drawingboardURL = canvas.toDataURL();
      socket.emit('image message', drawingboardURL);
    }
    if (e.target.id === 'clear'){
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  catch(error){
    var err = error.name +":"+ error.message;
    socket.emit('chat message', err);
  }
});

//recieving image from server
socket.on('image message', (imageData) => {
  var img = new Image;
  img.onload = () => { ctx2.drawImage(img, 0, 0); };
  img.src = imageData;
  ctx2.clearRect(0, 0, canvas.width, canvas.height);
});

//emitting chat message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
    console.log(document.documentElement.scrollTop);
});

//recieving chat message from server
socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    //window.scrollTo(0, document.body.scrollHeight);
});
  
canvas.addEventListener('mousemove', draw);