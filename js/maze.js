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
    this.walls = [1,1,1,1];
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
}

circleGraph = new Graph(10);

//create cells based on width
//based on cell number you can draw lines around it
//
function drawGrid(){


}


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
drawCircle();
