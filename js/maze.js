var canvas = document.getElementById("myCanvas");

if(window.outerWidth > window.outerHeight){
    canvas.width = window.outerHeight*.9;
    canvas.height = window.outerHeight*.9;
}
else{
    canvas.width = window.outerWidth*.9;
    canvas.height = window.outerWidth*.9;
}


radius = Math.floor(canvas.width/2);
context = canvas.getContext("2d");
context.strokeStyle="white";
context.fillStyle="white";
context.arc(radius, radius, radius*.9, 0, 2 * Math.PI);
context.fill();

var Cell = function(x,y,degrees) {
    this.x = x;
    this.y = y;
    this.degrees = degrees;
    this.visited = false;
    this.neighbors = [];
    this.dist = 0;
}

var Pixel = function(x,y) {
    this.dist = 0;
    this.x = x;
    this.y = y;
    this.data = [0,0,0,0];
    this.visited = false;
}
var Graph = function(maxArc){
    this.startCell = new Cell(0,0,360);
    this.cells = [];
    this.cells.length = 18;

    degrees = 45;
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

circleGraph = new Graph(4);
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
            nearBy.push(circleGraph.cells[y+1][x*2+1]);
            nearBy.push(circleGraph.cells[y+1][x*2]);
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
    context.lineWidth = 3;
    context.lineCap = "round";
    context.strokeStyle="black";
    context.fillStyle="black";
    context.beginPath();
    context.arc(radius,radius,radius*.01,0,2*Math.PI);
    context.stroke();
    context.fill();
    //draw start circle
        context.beginPath();
        context.arc(radius,radius,radius*.05,0,(circleGraph.cells[1][0].degrees/180+.05)*Math.PI,true);
        context.stroke();

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
            if(neighbors.length > 4){
                //topleft
                if(neighbors[4] == null){
                    //context.strokeStyle="red";
                    context.beginPath();
                    context.arc(radius,radius,radius*(y+1)/20,(curDegrees*x)/180*Math.PI,(curDegrees*(x+.5))/180*Math.PI);
                    context.stroke();
                    context.strokeStyle="black";
                }
                //topright
                if(neighbors[3] == null){
                    //context.strokeStyle="blue";
                    context.beginPath();
                    context.arc(radius,radius,radius*(y+1)/20,(curDegrees*(x+.5))/180*Math.PI,(curDegrees*(x+1))/180*Math.PI);
                    context.stroke();
                    context.strokeStyle="black";
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
context.lineWidth = 0;
Path = [];
Queue = [];
Path.push(circleGraph.startCell);
Queue.push(circleGraph.startCell);
for(y = 0; y < circleGraph.cells.length; y++){
    for(x = 0; x < circleGraph.cells[y].length; x++){
        circleGraph.cells[y][x].visited = false;
    }
}
CellFloodFill();
function CellFloodFill(){
    context.lineWidth = 0;
    cell = Queue.shift();
    cell.visited = true;
    for(i = 0; i< cell.neighbors.length; i++){
        if(cell.neighbors[i] != null && cell.neighbors[i] != 0 && !cell.neighbors[i].visited && cell.neighbors[i] != circleGraph.startCell){
            cell.neighbors[i].visited = true;
            Path.push(cell.neighbors[i]);
            Queue.push(cell.neighbors[i]);
            x = cell.neighbors[i].x;
            y = cell.neighbors[i].y;
            curDegrees = cell.neighbors[i].degrees;
            cell.neighbors[i].dist = cell.dist+1;
            context.fillStyle = "hsl(" + cell.neighbors[i].dist*2%360+ ", 100%, 50%)";
            context.strokeStyle = "hsl(" + cell.neighbors[i].dist*2%360+ ", 100%, 50%)";
            context.beginPath();
            context.moveTo(radius*(y/20)*Math.cos(curDegrees*x/180*Math.PI) + radius,radius*(y/20)*Math.sin(curDegrees*x/180*Math.PI) + radius);
            context.arc(radius,radius,radius*(y+1)/20,(curDegrees*x)/180*Math.PI,(curDegrees*(x+1))/180*Math.PI);
            context.arc(radius,radius,radius*(y)/20,(curDegrees*(x+1))/180*Math.PI,(curDegrees*(x))/180*Math.PI,true);
            context.stroke();
            context.fill();
        }
    }
    drawGrid();
    if(Queue.length>0){
        setTimeout(CellFloodFill,3);
    }
    else{
        Solve(circleGraph.exitCell);
    }
}

function Solve(cell){
    curDegrees = cell.degrees;
    y = cell.y;
    x = cell.x;
    console.log(cell);
    context.strokeStyle="white";
    context.lineWidth = 2;
    context.beginPath();
    context.arc(radius*(y/20+.025)*Math.cos(curDegrees*(x+.5)/180*Math.PI) + radius,radius*(y/20+.025)*Math.sin(curDegrees*(x+.5)/180*Math.PI) + radius, 2, 0, 2*Math.PI);
    context.stroke();
    lowestDist = 1000;
    lowIndex = 0;
    for(i = 0; i < cell.neighbors.length; i++){
        if(cell.neighbors[i] != null && cell.neighbors[i].dist < lowestDist){
            lowestDist = cell.neighbors[i].dist;
            lowIndex = i;
        }
    }
    nextCell = cell.neighbors[lowIndex];
    if(nextCell != circleGraph.startCell){
        setTimeout(function(){Solve(nextCell);},100);
    }
}

canvasRawData = context.getImageData(0,0,canvas.width,canvas.height);

function isWhite(data){
    return (data[0] === 255 && data[1] === 255 && data[2] === 255) || (data[3] > 0 && data[3] < 255);
}


function mod(n, m) {
        return ((n % m) + m) % m;
}
