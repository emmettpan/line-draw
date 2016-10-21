var isMouseDown = false;
var previousWasMouseDown = false;
var allMyPoints = new Array();
var firstPoints = new Array();  // array of first points when mouse down. helps track when to start drawing again
                                // after user unclicks then clicks again
                                // basically acts as history because this program will redraw everything when
                                // user lets go of mouse then clicks again

function getMousePos(canvas, evt) 
{
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function MouseDown()
{
    isMouseDown = true;
}

function MouseUp()
{
    isMouseDown = false;
}

function MouseOut()
{
    isMouseDown = false;
}

/*
 * This function is always running, so we need to track what is happening currently and
 * at the previous point (whether mouse was down or not). We cannot simply choose to lineTo
 * when mouse is down and moveTo when mouse is up because we do not yet know where the next
 * point is to lineTo/moveTo. So, we must create an array of all this points (a history of all
 * the points we've been to), and redraw everything as we keep going.
 */
function drawLines(c, e)
{
    // if user is not clicking, stop drawing
    if (!isMouseDown)
    {
        previousWasMouseDown = false;
        return;
    }

    // find out the mouse position x, y
    var point = getMousePos(c, e);
    var x = point.x;
    var y = point.y;

    var p = {xpos : x, ypos : y};

    // save all points where user first clicks down (to know when to start drawing again after each break)
    if (!previousWasMouseDown)
    {
        firstPoints.push(p);
    }

    // add each point when mouse is down to array of all points
    allMyPoints.push(p);

    var ctx = c.getContext("2d");
    ctx.beginPath();
    var fp = allMyPoints[0];
    ctx.moveTo(fp.xpos, fp.ypos);

    var idx;
    var skipIdx = 0;

    // redraw everytime user clicks down
    for (idx = 0; idx < allMyPoints.length; idx++)
    {
        // if at a point that user clicks down after having mouse unclicked, moveTo that position,
        // without drawing
        if (allMyPoints[idx] == firstPoints[skipIdx])
        {
            var cp = allMyPoints[idx];
            ctx.moveTo(cp.xpos, cp.ypos);
            skipIdx++;
        }

        var cp = allMyPoints[idx];
        ctx.lineTo(cp.xpos, cp.ypos);
        ctx.moveTo(cp.xpos, cp.ypos);
    }
    ctx.stroke();
    previousWasMouseDown = true;
}