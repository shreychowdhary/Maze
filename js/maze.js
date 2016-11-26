var canvas = document.getElementById("myCanvas");

if(window.outerWidth > window.outerHeight){
    canvas.width = window.outerHeight * .5;
    canvas.height = window.outerHeight * .5;
}
else{
    canvas.width = window.outerWidth * .5;
    canvas.height = window.outerWidth * .5;
}

canvas.width = 400;
canvas.height = 400;

radius = Math.floor(canvas.width/2);



var Cell = function(x,y,degrees) {
    this.x = x;
    this.y = y;
    this.degrees = degrees;
    this.visited = false;
    this.neighbors = [];
}

var Graph = function(maxArc){
    this.startCell = new Cell(0,0,360);
    this.cells = [];
    this.cells.length = 18;

    degrees = 90;
    this.cells[0] = [];
    this.cells[0][0] = this.startCell;
    for(y = 1; y < 18; y++){
        if(degrees/360*radius*(y+1)/20 > maxArc){
            degrees = degrees/2;
        }
        this.cells[y] = [];
        this.cells[y].length = 360/degrees;
        console.log(this.cells[y].length);
        for(x = 0; x < 360/degrees; x++){
            this.cells[y][x] = new Cell(x,y,degrees);
        }
    }

    this.startCell.neighbors = [this.cells[1][0],null,null,null];
    this.startCell.visited = true;
    for(y = 1; y < this.cells.length; y++){
        for(x = 0; x < this.cells[y].length; x++){
            this.cells[y][x].neighbors.push(null,null,null);
            if(y < this.cells.length-1 && this.cells[y+1].length > this.cells[y].length){
                this.cells[y][x].neighbors.push(null,null);
            }
            else{
                this.cells[y][x].neighbors.push(null);
            }
        }
    }
    this.exitCell = this.cells[17][0];
    this.exitCell.neighbors[3] = 0;
}

circleGraph = new Graph(10);
cellPath = [circleGraph.startCell];
solvePath = [];

function generateMaze(curCell){
    if(curCell == circleGraph.startCell){
        console.log("done");
        return;
    }
    if(curCell == circleGraph.exitCell){
        solvePath = cellPath.slice();
    }
    curCell.visited = true;
    x = curCell.x;
    y = curCell.y;
    nearBy = [];
    //goes left,down,right,(top) or (top right, top left)
    nearBy.push(circleGraph.cells[y][mod(x-1,circleGraph.cells[y].length)]);
    if(y == 1){
        nearBy.push(circleGraph.cells[0][0]);
    }
    else if(circleGraph.cells[y] > circleGraph.cells[y-1]){
        nearBy.push(circleGraph.cells[y-1][Math.floor(x/2)]);
    }
    else{
        nearBy.push(circleGraph.cells[y-1][x]);
    }
    nearBy.push(circleGraph.cells[y][mod(x+1,circleGraph.cells[y].length)]);
    if(y < circleGraph.cells.length-1){
        if(circleGraph.cells[y+1] > circleGraph.cells[y]){
            nearBy.push(circleGraph.cells[y+1][x*2]);
            nearBy.push(circleGraph.cells[y+1][x*2+1]);
        }
        else{
            nearBy.push(circleGraph.cells[y+1][x]);
        }
    }

    visitable = [];
    for(i = 0; i < nearBy.length; i++){
        if(!nearBy[i].visited){
            visitable.push(nearBy[i]);
        }
    }

    lastCell = cellPath[cellPath.length-1];
    if(visitable.length > 0 && curCell != circleGraph.exitCell){

        nextCell = visitable[Math.floor(Math.random() * visitable.length)];
        curCell.neighbors[nearBy.indexOf(nextCell)] = nextCell;
        curCell.neighbors[nearBy.indexOf(lastCell)] = lastCell;
        cellPath.push(curCell);
        generateMaze(nextCell);
    }
    else{
        cellPath.pop();
        curCell.neighbors[nearBy.indexOf(lastCell)] = lastCell;
        generateMaze(lastCell);
    }
}
generateMaze(circleGraph.cells[1][0],circleGraph.startCell);

//create cells based on width
//based on cell number you can draw lines around it
//
function drawGrid(){
    context = canvas.getContext("2d");
    context.lineWidth = 4;
    context.lineCap = "round";
    context.strokeStyle="white";
    context.fillStyle="white";
    context.arc(radius, radius, radius*.9, 0, 2 * Math.PI);
    context.fill();
    context.strokeStyle="black";
    context.fillStyle="black";
    context.beginPath();
    context.arc(radius,radius,radius*.01,0,2*Math.PI);
    context.stroke();
    context.fill();
    //draw start circle
    for(i = 1; i < 4; i++){
        context.beginPath();
        context.arc(radius,radius,radius*.05,i*Math.PI/2,(i+1)*Math.PI/2);
        context.stroke();
    }

    for(y = 1; y < circleGraph.cells.length; y++){
        for(x = 0; x < circleGraph.cells[y].length; x++){
            /*if(solvePath.includes(circleGraph.cells[y][x])){
                 context.strokeStyle = '#ff0000';
            }
            else{
                 context.strokeStyle = '#000000';
            }*/
            curDegrees = circleGraph.cells[y][x].degrees;
            neighbors = circleGraph.cells[y][x].neighbors;
            //outer arc
            //left and right
            if(circleGraph.cells[y][x].neighbors.length == 5){
                //topleft
                if(neighbors[4] == null){
                    context.beginPath();
                    context.arc(radius,radius,radius*(y+1)/20,(curDegrees*x)/180*Math.PI,(curDegrees*x)/180*Math.PI+(curDegrees)/360*Math.PI);
                    context.stroke();
                }
                //topright
                if(neighbors[3] == null){
                    context.beginPath();
                    context.arc(radius,radius,radius*(y+1)/20,(curDegrees*x)/180*Math.PI+(curDegrees)/360*Math.PI,(curDegrees*(x+1))/180*Math.PI);
                    context.stroke();
                }
            }
            else{
                if(neighbors[3] == null){
                    context.beginPath();
                    context.arc(radius,radius,radius*(y+1)/20,(curDegrees*x)/180*Math.PI,(curDegrees*(x+1))/180*Math.PI);
                    context.stroke();
                }
            }
            if(neighbors[0] == null){
                context.beginPath();
                context.moveTo(radius*(y/20)*Math.cos(curDegrees*x/180*Math.PI) + radius,radius*(y/20)*Math.sin(curDegrees*x/180*Math.PI) + radius);
                context.lineTo(radius*((y+1)/20)*Math.cos(curDegrees*x/180*Math.PI) + radius,radius*((y+1)/20)*Math.sin(curDegrees*x/180*Math.PI) + radius);
                context.stroke();
            }
            if(neighbors[2] == null){
                context.beginPath();
                context.moveTo(radius*(y/20)*Math.cos(curDegrees*(x+1)/180*Math.PI) + radius,radius*(y/20)*Math.sin(curDegrees*(x+1)/180*Math.PI) + radius);
                context.lineTo(radius*((y+1)/20)*Math.cos(curDegrees*(x+1)/180*Math.PI) + radius,radius*((y+1)/20)*Math.sin(curDegrees*(x+1)/180*Math.PI) + radius);
                context.stroke();
            }
        }
    }
}

drawGrid();
context = canvas.getContext("2d");
Queue = [];
Queue.push([Math.floor(radius*.03+radius),radius]);
tImgData = context.getImageData(0,0,1,1);
tImgData.data[0] = 0;
tImgData.data[1] = 255;
tImgData.data[2] = 255;
tImgData.data[3] = 255;
context.putImageData(tImgData,x,y);
FloodFill();
function FloodFill(){
    pixel = Queue.shift();
    eImgData = context.getImageData(pixel[0]-1,pixel[1],1,1);
    if((pixel[0] > .1*radius && eImgData.data[0] == 255 && eImgData.data[1] == 255 && eImgData.data[2] == 255) || (wImgData.data[3] > 0 && wImgData.data[3] < 200)){
        context.putImageData(tImgData,pixel[0]-1,pixel[1]);
        Queue.push([pixel[0]-1,pixel[1]]);
    }
    wImgData = context.getImageData(pixel[0]+1,pixel[1],1,1);
    if((pixel[0] < 1.9*radius && wImgData.data[0] == 255 && wImgData.data[1] == 255 && wImgData.data[2] == 255) || (wImgData.data[3] > 0 && wImgData.data[3] < 200)){
        context.putImageData(tImgData,pixel[0]+1,pixel[1]);
        Queue.push([pixel[0]+1,pixel[1]]);
    }
    nImgData = context.getImageData(pixel[0],pixel[1]-1,1,1);
    if((pixel[1] > .1*radius && nImgData.data[0] == 255 && nImgData.data[1] == 255 && nImgData.data[2] == 255) || (wImgData.data[3] > 0 && wImgData.data[3] < 200)){
        context.putImageData(tImgData,pixel[0],pixel[1]-1);
        Queue.push([pixel[0],pixel[1]-1]);
    }
    sImgData = context.getImageData(pixel[0],pixel[1]+1,1,1);
    if((pixel[1] < 1.9*radius && sImgData.data[0] == 255 && sImgData.data[1] == 255 && sImgData.data[2] == 255) || (sImgData.data[3] > 0 && wImgData.data[3] < 200)){
        context.putImageData(tImgData,pixel[0],pixel[1]+1);
        Queue.push([pixel[0],pixel[1]+1]);
    }
    if(Queue.length > 0){
        setTimeout(FloodFill,1);
    }
}


function mod(n, m) {
        return ((n % m) + m) % m;
}
