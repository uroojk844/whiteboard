var boardCount = 1;

var canvasHeight = document.getElementById('board1').offsetHeight;
var canvasWidth = document.getElementById('board1').offsetWidth;

document.getElementById('addBoard').addEventListener("click", function () {
    //tile creation
    newTile = document.createElement('div');
    newTile.classList.add('preview');
    newTile.innerHTML = ++boardCount;
    newTile.id = "tile" + boardCount;
    newTile.setAttribute("onclick", "openBoard(event, 'board" + boardCount + "')");

    //board creation
    newBoard = document.createElement('canvas');
    newBoard.height = canvasHeight;
    newBoard.width = canvasWidth;
    newBoard.classList.add('board');
    newBoard.id = "board" + boardCount;
    newBoard.style.display = "none";

    //close button
    closebtn = document.createElement('div');
    closebtn.classList.add("closeBoard");
    closebtn.classList.add("w3-red");
    closebtn.innerHTML = "&times;";
    closebtn.setAttribute("onclick", "deleteBoard('" + boardCount + "')");
    newTile.append(closebtn);

    document.querySelector('#sidebar').append(newTile);
    document.querySelector('#main').append(newBoard);
});

function deleteBoard(id) {
    if (boardCount > 1) {
        document.getElementById('tile' + id).remove();
        document.getElementById('board' + id).remove();
    }
}

var curtheme = 0;

function theme() {
    if (curtheme == 0) {
        document.body.style.backgroundColor = "#333";
        document.getElementById('sidebar').style.backgroundColor = "#333";
        curtheme = 1;
    } else {
        document.body.style.backgroundColor = "#fff";
        document.getElementById('sidebar').style.backgroundColor = "#fff";
        curtheme = 0;
    }
    document.querySelector('#theme').classList.toggle('fa-toggle-on');
}

var current = 'board1';

var canvas = document.getElementById(current);
var ctx = canvas.getContext("2d");
canvas.height = canvasHeight;
canvas.width = canvasWidth;

let painting = false;
let erasing = false;
let isPainting = true;

function startpos() {
    if(isPainting){
        painting = true;
    }else{
        erasing = true;
    }
    draw(e);
}

function stoppos() {
    painting = false;
    erasing = false;
    ctx.beginPath();
}

var penColor = '#000';

function newPen(x){
    isPainting = true;
    penColor = x;
    document.querySelector("#currentColor").style.backgroundColor = x;
    let colorpicker = document.querySelector('#colorPicker');
    colorpicker.style.display="none";
}

var penWidth = 1;

function newWidth(){
    penWidth = document.getElementById('penWidth').value;
    document.querySelector("#currentWidth").innerHTML = document.getElementById('penWidth').value;
}

function draw(e) {
    if (!painting) return;
    let change = ((window.innerWidth * 5) / 100) + 219;
    let x = (e.clientX || e.touches[0].clientX) - change;
    let y = (e.clientY || e.touches[0].clientY) - 74;
    if (window.innerWidth < 992) {
        change = ((window.innerWidth * 5) / 100) + 10;
        x = (e.clientX || e.touches[0].clientX) - change;
        y = (e.clientY || e.touches[0].clientY) - 74;
    }
    ctx.lineWidth = penWidth;
    ctx.lineCap = "round";
    ctx.lineTo(x, y);
    ctx.strokeStyle = penColor;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

function erase(e){
    if(erasing==false) return;
    let change = ((window.innerWidth * 5) / 100) + 219;
    let x = (e.clientX || e.touches[0].clientX) - change;
    let y = (e.clientY || e.touches[0].clientY) - 74;
    if (window.innerWidth < 992) {
        change = ((window.innerWidth * 5) / 100) + 10;
        x = (e.clientX || e.touches[0].clientX) - change;
        y = (e.clientY || e.touches[0].clientY) - 74;
    }
    ctx.clearRect(x-25, y-25, 50, 50);
}

function openBoard(evt, boardName) {
    // Declare all variables
    var i, board, preview;

    // Get all elements with class="board" and hide them
    board = document.getElementsByClassName("board");
    for (i = 0; i < board.length; i++) {
        board[i].style.display = "none";
    }
    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(boardName).style.display = "block";
    current = boardName;
    document.getElementById('wbNumber').innerHTML = boardName.slice(5);
    let sidebar = document.querySelector('#sidebar');
    sidebar.style.display="none";
}

document.querySelector("#eraser").addEventListener("click", function(){
    isPainting = false;
    let colorpicker = document.querySelector('#colorPicker');
    colorpicker.style.display="none";
});

window.addEventListener("mousemove", function(){
    canvas = document.getElementById(current);
    ctx = canvas.getContext("2d");
    if(isPainting){
    canvas.addEventListener("mousedown", startpos);
    canvas.addEventListener("mouseup", stoppos);
    canvas.addEventListener("mousemove", draw);
    //touch devices
    canvas.addEventListener("touchstart", startpos);
    canvas.addEventListener("touchend", stoppos);
    canvas.addEventListener("touchmove", draw);
    }else{
    canvas.addEventListener("mousedown", startpos);
    canvas.addEventListener("mouseup", stoppos);
    canvas.addEventListener("mousemove", erase);
    //touch devices
    canvas.addEventListener("touchstart", startpos);
    canvas.addEventListener("touchend", stoppos);
    canvas.addEventListener("touchmove", erase);
    }
});

function savePdf() {
    var d = new Date();
    var today = d.toLocaleDateString();
    var pageWidth = document.getElementById('board1').innerWidth*0.2645833333;          //1 pixel (X) = 0.2645833333 mm
    var pageHeight = document.getElementById('board1').innerHeight*0.2645833333;
    var tc = document.getElementsByTagName('canvas');
    let i;
    var doc = new jsPDF();
    for(i=0;i<tc.length;i++){
    var img = document.getElementById(tc[i].id).toDataURL();
    doc.addImage(img,'PNG',0,10);
    if(i<tc.length-1){
        doc.addPage();
    }
    }
    doc.save('Screenshots '+today+'.pdf');
    let colorpicker = document.querySelector('#colorPicker');
    colorpicker.style.display="none";
}

  if (window.innerWidth < 600) {
    var elem = document.documentElement;
    function openFullscreen() {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        elem.msRequestFullscreen();
      }
    }setInterval(openFullscreen, 500);
}