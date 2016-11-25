var canvas = document.getElementById("myCanvas");

if(window.outerWidth > window.outerHeight){
    canvas.width = window.outerHeight * .9;
    canvas.height = window.outerHeight * .9;
}
else{
    canvas.width = window.outerWidth * .9;
    canvas.height = window.outerWidth * .9;
}

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
}

circleGraph = new Graph(10);

function generateMaze(curCell,lastCell){
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

    if(visitable.length == 0){
        return;
    }

    nextCell = visitable[Math.floor(Math.random() * visitable.length)];
    curCell.neighbors[nearBy.indexOf(nextCell)] = nextCell;
    curCell.neighbors[nearBy.indexOf(lastCell)] = lastCell;
    console.log(curCell.neighbors);
    generateMaze(nextCell,curCell);
}
generateMaze(circleGraph.cells[1][0],circleGraph.startCell);


//create cells based on width
//based on cell number you can draw lines around it
//
function drawGrid(){
    context = canvas.getContext("2d");
    context.lineWidth = 5;
    context.lineCap = "round";

    context.beginPath();
    context.arc(radius,radius,radius*.01,0,2*Math.PI);
    context.stroke();
    context.fill();
    for(i = 1; i < 4; i++){
        context.beginPath();
        context.arc(radius,radius,radius*.05,i*Math.PI/2,(i+1)*Math.PI/2);
        context.stroke();
    }
}

drawGrid();

function drawCircle(){
    if(canvas.getContext){
		var context = canvas.getContext("2d");
        context.lineWidth = 5;
        context.lineCap = "round";
        for(i = .9; i > 0; i -= .05){
            context.beginPath();

            context.arc(radius,radius,radius*i,0,2*Math.PI);
            context.stroke();
        }

        context.beginPath();
        for(i = 1; i <= 18; i += 2){
            context.moveTo(radius + radius * i/20,radius);
            context.lineTo(radius * (i+1)/20 + radius,radius);
        }

		/*for(i = 0; i < Math.PI * 2 - .0001; i += degrees / 180 * Math.PI) {
			context.moveTo(Math.cos(i) * radius * .05 + radius, Math.sin(i) * radius * .05 + radius);
			context.lineTo(Math.cos(i) * radius * .95 + radius, Math.sin(i) * radius * .95 + radius);
		}*/
		context.stroke();

        context.beginPath();
        radius = Math.floor(canvas.width/2);
        context.arc(radius,radius,radius*.01,0,2*Math.PI);
        context.stroke();
        context.fill();
    }
}


function mod(n, m) {
        return ((n % m) + m) % m;
}
