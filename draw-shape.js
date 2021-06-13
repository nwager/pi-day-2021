/*
    Thanks to https://stackoverflow.com/a/11354824 for the inscribed polygons.
    Thanks to https://youtu.be/_rJdkhlWZVQ for the math.
    Thanks to https://stackoverflow.com/a/2901298 for numberWithCommas().
*/

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

var centerX = canvas.width/2;
var centerY = canvas.height/2;
var radius = 0.45 * Math.min(canvas.width, canvas.height);

var numSidesText = document.getElementById("n_sides");
var numSides = 6;

const polygonColor = "#ff0000"
const circleColor = "#feffff"

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // draw circle
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, radius, 0, 2*Math.PI);
    ctx.strokeStyle = circleColor;
    ctx.stroke();
    ctx.fillStyle = circleColor;
    ctx.textBaseline = "alphabetic";
    ctx.font = "192px serif";
    ctx.textAlign = "center";
    ctx.fillText("π", canvas.width/2, canvas.height/2);
    ctx.font = "48px serif";
    ctx.textBaseline = "top";
    ctx.fillText("3/14/21", canvas.width/2, canvas.height/2 + 24);

    // draw polygon
    if (numSides <= 1536) {
        drawInscribed(numSides);
    } else {
        ctx.beginPath();
        ctx.arc(canvas.width/2, canvas.height/2, radius, 0, 2*Math.PI);
        ctx.strokeStyle = polygonColor;
        ctx.stroke();
    }

    // pi = approx. circumference / diameter
    // diameter = 2
    var approxCircumference = calculate(numSides) * numSides;
    var approxPi = approxCircumference / 2;
    document.getElementById("approx_pi").innerHTML = approxPi;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function double() {
    var n2 = numSides * 2;
    if (n2 > 6) {
        numSides = n2;
        updateNum(numSides);
    } else {
        numSides = 6;
        updateNum(numSides);
    }
    update();
}

function halve() {
    if (numSides > 6) {
        numSides /= 2;
        updateNum(numSides);
        update();
    }
}

function updateNum(n) {
    document.getElementById("n_sides").innerHTML = numberWithCommas(n);
}

function drawInscribed(n) {
    ctx.beginPath();
    ctx.moveTo(canvas.width/2 + radius, canvas.height/2); // start on far right edge
    var theta = 2*Math.PI / n; // end angle for first side
    for (var i = 0; i < n; i++) {
        var targetX = canvas.width/2 + radius*Math.cos(theta);
        var targetY = canvas.height/2 + radius*Math.sin(theta);
        ctx.lineTo(targetX, targetY);

        // points on circle
        if (n <= 384) {
            var rectWidth = n > 192 ? 2 : 3;
            ctx.fillStyle = polygonColor;
            ctx.fillRect(targetX - (rectWidth/2), targetY - (rectWidth/2), rectWidth, rectWidth);
        }
        theta += 2*Math.PI / n; // increment angle for each side
    }
    ctx.strokeStyle = polygonColor;
    ctx.lineWidth = 1;
    ctx.stroke();
}

/*
    Returns side length of polygon with n sides, recursively doubling number of sides.
    Stops when it reaches a hexagon (6 sides) which has side length 1.
*/
function calculate(n) {
    if (n % 6 != 0) {
        return 0; // uh oh!
    } else if (n == 6) {
        return 1;
    } else {
        var s1 = calculate(n/2);
        var a = Math.sqrt(1 - Math.pow(s1/2, 2));
        var b = 1 - a;
        return Math.sqrt(Math.pow(b, 2) + Math.pow(s1/2, 2));
    }
}
