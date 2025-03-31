$(document).ready(function () {
    $("#main_div").mousedown(function (e) {
        // If click mouse down click is not on any div
        if (!e.target.closest(".element_div")) {
            $(".ghost-select").addClass("ghost-active");
            $(".ghost-select").css({ 'left': e.pageX, 'top': e.pageY });
            initialW = e.pageX;
            initialH = e.pageY;
            // reset all check boxes to initial condition: unchecked and div to no highlight
            $(".element_link").find('input[type=checkbox]').prop('checked', false);
            $(".element_div").css({ "border-width": "0px", "background-color": "#9bc5c5" });

            console.log("attach handler");
            $(document).bind("mouseup", selectElements);
            $(document).bind("mousemove", openSelector);
        }
    });

});

function selectElements(e) {
    $("#score>span").text('0');
    $(document).unbind("mousemove", openSelector);
    $(document).unbind("mouseup", selectElements);
    $(".ghost-select").removeClass("ghost-active");
    $(".ghost-select").width(0).height(0);
}

function openSelector(e) {
    var w = Math.abs(initialW - e.pageX);
    var h = Math.abs(initialH - e.pageY);
    $(".ghost-select").css({
        'width': w,
        'height': h
    });
    // console.log("mouse pos:", e.pageX, e.pageY);
    if (e.pageX <= initialW && e.pageY >= initialH) {
        $(".ghost-select").css({
            'left': e.pageX
        });
    } else if (e.pageY <= initialH && e.pageX >= initialW) {
        $(".ghost-select").css({
            'top': e.pageY
        });
    } else if (e.pageY < initialH && e.pageY < initialW) {
        // console.log("Moving up")
        $(".ghost-select").css({
            'left': e.pageX,
            "top": e.pageY
        });
    }

    $(".element_link").each(function () {
        var aElem = $(".ghost-select");
        var bElem = $(this);
        var result = doObjectsCollide(aElem, bElem);
        var id = $(this).find('input[type=checkbox]').attr("id");
        var div_id = "div_" + id;
        div = document.getElementById(div_id);
        // the div is colliding with drag select box then take decision to check it
        if (result == true) {
            // see if the div was already checked then no need to check it again
            if (window.checkedArray.includes(id)) { }
            // if wasn't checked then change the property to checked and change other props of div to highlight it
            else {
                // change the checkbox property to checked true
                $(this).find('input[type=checkbox]').prop('checked', true);
                 // Append the item name in the list of all checked elements
                window.checkedArray.push(id);
                // $(div_id).css({"border": "solid 2px orange", "background-color":"#9bc5c58e"});
                // div.style.borderColor = "orange";
                // div.style.borderWidth = "2px";
                div.style.backgroundColor = "#a9c59b";
            }
            // console.log(window.checkedArray);
        }
        // If the div is not colliding with select box then take decision to uncheck it
        else {
            // see if the div was already unchecked, then no need to uncheck again
            if (!window.checkedArray.includes(id)) { }
            // if wasn't unchecked then change the property to unchecked and remove other props of div that highlight it
            else {
                // change the checkbox property to checked false
                $(this).find('input[type=checkbox]').prop('checked', false);
                // remove the item name from list of all checked elements
                window.checkedArray.splice(window.checkedArray.indexOf(this.id), 1);
                // set the colors to previous, unhighlighted version
                // $(div_id).css({"border": "solid 0px orange", "background-color":"#9bc5c5"});
                // div.style.borderColor = "orange";
                // div.style.borderWidth = "0px";
                div.style.backgroundColor = "#9bc5c5";
            }
        }
    });
}


function doObjectsCollide(a, b) { // a and b are your objects
    //console.log(a.offset().top,a.position().top, b.position().top, a.width(),a.height(), b.width(),b.height());
    var aTop = a.offset().top;
    var aLeft = a.offset().left;
    var bTop = b.offset().top;
    var bLeft = b.offset().left;
    var select_flag = !(((aTop + a.height()) < (bTop)) ||
        (aTop > (bTop + b.height())) ||
        ((aLeft + a.width()) < bLeft) ||
        (aLeft > (bLeft + b.width())));
    // console.log(select_flag,b);

    return !(
        ((aTop + a.height()) < (bTop)) ||
        (aTop > (bTop + b.height())) ||
        ((aLeft + a.width()) < bLeft) ||
        (aLeft > (bLeft + b.width()))
    );
}



// -- add listener to select checkboxes on mouse drag---
function mouse_drag_select() {
    $(document).on('mousedown', function () {
        window.mouseIsDown = true;
    });
    $(document).on('mouseup', function () {
        window.mouseIsDown = false;
    });

    $('.element_link').on('mouseenter', function () {
        if (window.mouseIsDown) {
            $(this).find('input[type=checkbox]').prop('checked', true);
            var id = $(this).find('input[type=checkbox]').attr("id");
            var div_id = "div_" + id;
            // window.checkedArray.push($(this).find('input[type=checkbox]').attr("id"));
            if (window.checkedArray.includes(id)) { }
            else {
                window.checkedArray.push(id);
                document.getElementById(div_id).style.borderColor = "orange";
                document.getElementById(div_id).style.borderWidth = "2px";
                document.getElementById(div_id).style.backgroundColor = "#9bc5c58e";


            }
            console.log(window.checkedArray);

        }
    });
}