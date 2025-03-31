// data is taken from html file
var list_elements = data["tc"];
var device = data["device"];
var parent = data["parent"];
var list_of_tescase_name = [];
var clr_green = '#18de1b';
var clr_red = '#c53434';
var clr_blank = '#a8b3b1';
// var t = new Date();
window.sessionStorage.setItem("t0", 0);


var local_saved_status = JSON.parse(window.localStorage.getItem(device));
if (local_saved_status[parent] === undefined) {
    local_saved_status[parent] = {}
    window.localStorage.setItem(device, JSON.stringify(local_saved_status));
}


function add_link(sr, element_name, parent_id) {

    var element_div = document.createElement("div"); // div for testcase
    var element_link = document.createElement("a");
    var link_txt = document.createTextNode(sr + ". " + element_name);
    var p_bar_div = document.createElement("div"); // div for testcase

    element_link.appendChild(link_txt);
    element_link.href = window.location.href + "/" + element_name + "/Job_1.0";
    element_div.appendChild(element_link);
    element_div.appendChild(p_bar_div);

    // element_link.id = "element_link";
    element_link.className = "element_link";
    element_link.target = "_blank";
    element_link.rel = "noopener noreferrer";
    p_bar_div.id = element_name;
    p_bar_div.className = "p_bar";
    element_div.className = "element_div";
    parent_id.appendChild(element_div);
}

function add_progress_bar(check_points, parent_id_name) {
    for (let i in check_points) {
        var parent_div_id = document.getElementById(parent_id_name);
        var bar_div = document.createElement("div");
        if (check_points[i] == "FAIL") {
            var bar_txt = document.createTextNode(" ");
        } else {
            var bar_txt = document.createTextNode(check_points[i]);
        }
        bar_div.className = check_points[i] + " block";
        bar_div.appendChild(bar_txt);
        parent_div_id.appendChild(bar_div);
    }
}

function save_to_local_storage(tc_name, status) {
    var local_saved_status = JSON.parse(window.localStorage.getItem(device));
    local_saved_status[parent][tc_name] = status;
    console.log(local_saved_status)
    window.localStorage.setItem(device, JSON.stringify(local_saved_status));
}

var parent_div = document.getElementById('testcase');
var n_elements = list_elements.length;
var check_points = ["Farm_build", "SIMSTART", "FAIL", "SIMSTOP", "Exiting"]
var n_cp = check_points.length;
var cp_ids = [".Farm_build", ".SIMSTART", ".FAIL", ".SIMSTOP", ".Exiting"]

for (let i = 0; i < n_elements; i++) {
    // to capture strin between  "__" and ".log" using without "<" before first "=" will lead to include "__" in the match
    var test_case_name = list_elements[i].match(/(?<=__).*(?=.log)/g)[0];
    list_of_tescase_name = list_of_tescase_name.concat([test_case_name]);
    add_link(i + 1, test_case_name, parent_div);
    add_progress_bar(check_points, test_case_name);
    // var x = document.querySelector("#tc_1").querySelector(".SIMSTOP");
    // console.log(x)
}

function update_p_bar(status, testcase_name) {
    var x = document.querySelector("#" + testcase_name);
    var farm = 0;
    var start = 0;
    var fail = 0;
    var stop = 0;
    var nf = "| ";
    nf = nf.repeat(Math.min((status.filter(x => x == "#FAIL#").length), 11));
    // Indicates that xrun log is not created means there is some error in farm build.
    var n = status.length;
    if (status.includes("FARM_FAIL")) {
        x.querySelector(cp_ids[0]).style.background = clr_red;
        x.querySelector(cp_ids[1]).style.background = clr_red;
        x.querySelector(cp_ids[1]).innerHTML = "";
        x.querySelector(cp_ids[2]).style.background = clr_red;
        x.querySelector(cp_ids[2]).innerHTML = "";
        x.querySelector(cp_ids[3]).style.background = clr_red;
        x.querySelector(cp_ids[3]).innerHTML = "";
        x.querySelector(cp_ids[4]).style.background = clr_red;
        x.querySelector(cp_ids[4]).innerHTML = "";
    } else {
        if (status.includes(check_points[1 - 1])) {
            farm = 1;
            x.querySelector(cp_ids[0]).style.background = clr_green;
            x.querySelector(cp_ids[1]).style.background = clr_blank;
            x.querySelector(cp_ids[1]).innerHTML = check_points[1];
            x.querySelector(cp_ids[2]).style.background = clr_blank;
            x.querySelector(cp_ids[2]).innerHTML = "";
            x.querySelector(cp_ids[3]).style.background = clr_blank;
            x.querySelector(cp_ids[3]).innerHTML = check_points[3];
            x.querySelector(cp_ids[4]).style.background = clr_blank;
            x.querySelector(cp_ids[4]).innerHTML = check_points[4];
        }

        if (status.includes(check_points[2 - 1])) {
            start = 1;
            x.querySelector(cp_ids[0]).style.background = clr_green;
            x.querySelector(cp_ids[1]).style.background = clr_green;
            x.querySelector(cp_ids[2]).style.background = clr_blank;
            x.querySelector(cp_ids[3]).style.background = clr_blank;
            x.querySelector(cp_ids[4]).style.background = clr_blank;
        }

        if (status.includes("#FAIL#")) {
            fail = 1;
            //  correct this string f
            x.querySelector(cp_ids[0]).style.background = clr_green;
            x.querySelector(cp_ids[1]).style.background = clr_green;
            x.querySelector(cp_ids[2]).style.background = clr_green;
            x.querySelector(cp_ids[2]).innerHTML = nf;
            x.querySelector(cp_ids[3]).style.background = clr_blank;
            x.querySelector(cp_ids[4]).style.background = clr_blank;
        }

        if (status.includes(check_points[n_cp - 2])) {
            stop = 1;
            x.querySelector(cp_ids[0]).style.background = clr_green;
            x.querySelector(cp_ids[1]).style.background = clr_green;
            x.querySelector(cp_ids[2]).style.background = clr_green;
            x.querySelector(cp_ids[3]).style.background = clr_green;
            x.querySelector(cp_ids[4]).style.background = clr_blank;
        }
        // case exiting
        if (status.includes(check_points[n_cp - 1])) {
            if (start == 0) {
                x.querySelector(cp_ids[1]).style.background = clr_red;
                x.querySelector(cp_ids[1]).innerHTML = "";
                x.querySelector(cp_ids[2]).style.background = clr_red;
                x.querySelector(cp_ids[2]).innerHTML = "";
                x.querySelector(cp_ids[3]).style.background = clr_red;
                x.querySelector(cp_ids[3]).innerHTML = "";
                x.querySelector(cp_ids[4]).style.background = clr_red;
            } else if (stop == 0) {
                x.querySelector(cp_ids[2]).style.background = clr_green;
                x.querySelector(cp_ids[3]).style.background = clr_red;
                x.querySelector(cp_ids[3]).innerHTML = "";
                x.querySelector(cp_ids[4]).style.background = clr_red;
            } else {
                x.querySelector(cp_ids[4]).style.background = clr_green;
            }
        }
    }

}


function reset_status() {
    for (let i = 0; i < n_elements; i++) {
        id = "#" + list_of_tescase_name[i];
        $(id).css("border-color", "orange");
    }

}

function before_updating_all() {
    $("#update_all").css({ "color": "orange", "border-color": "orange" });
    document.getElementById('update_all').getElementsByTagName('span')[0].innerText = "Updating...";
    $("#loading_bar").css({
        "animationPlayState": "running",
        "display": "block"
    });
    reset_status();
}

function after_updating_all() {
    $("#update_all").css({ "color": "white", "border-color": "#98a3a3" });
    $("#loading_bar").css({
        "animationPlayState": "paused",
        "display": "none"
    });
    document.getElementById('update_all').getElementsByTagName('span')[0].innerText = "Update All";
}

var busy = 0;
// Same as below function but it will be executed when update all button will be clicked.
function update_all() {
    var local_saved_status = JSON.parse(window.localStorage.getItem(device));
    var t0 = parseInt(window.sessionStorage.getItem("t0"), 10);
    if ((window.busy == 0) && ((Date.now() - t0) > 60 * 1000)) {
        window.busy = 1;
        before_updating_all();
        for (let i = 0; i < n_elements; i++) {
            server_data = { "device": device, "parent": parent, "testcase_name": list_of_tescase_name[i] };
            $.ajax({
                type: "POST",
                url: "/ams_sim/tc_status",
                data: JSON.stringify(server_data),
                contentType: "application/json",
                dataType: 'json',
                success: function(status) {
                    // console.log(status[0]); //contains text about the status
                    var tc_name = list_of_tescase_name[i];
                    update_p_bar(status[1], list_of_tescase_name[i]);
                    local_saved_status[parent][tc_name] = status[1];
                    window.localStorage.setItem(device, JSON.stringify(local_saved_status));
                    document.getElementById('update_all').getElementsByTagName('span')[0].innerText = "Updating..." + i;
                },
                complete: function() { $("#" + list_of_tescase_name[i]).css("border-color", "#3c4649"); }
            });
        }
    } else { console.log("Busy!!"); }
}

$(document).ajaxStop(function() {
    // This equality is to ensure this is not execute with any ajax stop event, should only happen when updating all function runs
    if (window.busy == 1) {
        window.busy = 0;
        window.sessionStorage.setItem("t0", Date.now());
        after_updating_all();
    }
});

// This will always be active. Whenever a status will be clicked corresponding status will be fetched.
$(".p_bar").click(function() {
    tc_name = this.id
    id = "#" + tc_name;
    $.ajax({
        type: "POST",
        url: "/ams_sim/tc_status",
        beforeSend: function() { document.getElementById(tc_name).style.borderColor = "orange"; },
        data: JSON.stringify({ "device": device, "parent": parent, "testcase_name": tc_name }),
        contentType: "application/json",
        dataType: 'json',
        success: function(status) {
            console.log(status[0]);
            update_p_bar(status[1], tc_name);
            save_to_local_storage(tc_name, status[1]);
        },
        complete: function() { document.getElementById(tc_name).style.borderColor = "#3c4649"; }
    });
})

function reload_all() {
    var local_saved_status = JSON.parse(window.localStorage.getItem(device));
    for (let i = 0; i < n_elements; i++) {
        var temp_status = local_saved_status[parent][list_of_tescase_name[i]];
        if (temp_status === undefined) {} else {
            update_p_bar(temp_status, list_of_tescase_name[i]);
        }
    }
}

reload_all();

// const interval = setInterval(function () {
//     update_all();
//     console.log("Status Updated")
//   }, 5000);