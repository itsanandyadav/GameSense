var cur_url = window.location.href;
var srctext = document.getElementById('output').innerHTML;
var farm_srctext = document.getElementById('farm_log').innerHTML;
// var full_log = "";
// var short_log = "";

var cur_tab;


// funtion to extract lines with tags only out of full log
function tags(text) {
    var re = /(?=((#PASS#)|(#FAIL#)|(#WARN#)|(#INFO#))).*(?=\n)/g;
    var newtext = text.match(re);
    if (newtext == null) {
        short_log = "\nNo checkers caught, go to full log."
    } else {
        short_log = "\n" + newtext.join("\r\n") + "\n";
    }
    return short_log
}


function tag_paths(input_text) {
    // First / in key is start of regex, last / is end of regex and g tells to search globally in all the text don't return on first found
    // (?=\/) starts the regex match with / for path. \ is just escape char.
    // . is to match anything in between. * allows it to match zero to infinite times. ? makes it non-greedy. Means shortest matches will be returned
    // (?=\s) is to match space but will not be included.
    // return will be from / to before first space.
    let key = /(?=\/).*?(?=\s)/g;
    
    // passing key as regex input. And execute function. m is input to the function and is the returned match.
    let newText = input_text.replace(key, function (m) {
        // console.log(m);
        return "<a class='path'>" + m + "</a>";
    });

    return newText
}

// funtion to extract lines with tags only out of full log
function get_status(text, n_pass, n_fail) {
    var re = /(SIMSTART)|(SIMSTOP)|(Exiting)/g;
    var sim_state = text.match(re);
    var tail = text.slice(text.lastIndexOf("\n")).substring(40, 100);
    var reg = /\(([^)]+)\)/;

    var status;
    var clr = "black";
    var ele = document.getElementById("status_div"); //.style.display = "none";
    if (sim_state == null) {
        status = "";
        ele.style.display = "none";
    } else {
        ele.style.display = "block";
        if (sim_state.includes("Exiting")) {
            if (sim_state.includes("SIMSTOP")) {
                status = "Sim Completed";
                clr = "green";

            } else if (sim_state.includes("SIMSTART")) {
                status = "Runtime Error";
                clr = "red";
            } else {
                status = "Compilation Fail";
                clr = "red";
            }
            var sim_time = tail.match(reg)[1];
        } else {
            status = "Running";
            clr = "green";
            var sim_time = get_elapsed_time()
        }
    }

    if (sim_time == undefined) {
        time = ": NA"
    } else { time = sim_time }
    //time extraction

    var txt = "<h3>" + status + "</h3>";
    txt = txt + "Total : " + (n_pass + n_fail) + "<br>";
    txt = txt + "<Pass>Pass : </Pass>" + (n_pass) + "<br>";
    txt = txt + "<Fail>Fail : </Fail>" + (n_fail) + "<br>";
    txt = txt + "<br>Time " + (time) + "<br>";
    ele.innerHTML = txt;
    ele.getElementsByTagName("h3")[0].style.color = clr;

    return sim_time
}

function get_elapsed_time() {
    var time_src = srctext.split("\n", 3)[2];
    var t0 = time_src.substring(38, 50) + time_src.substring(53, 62);
    var delta_time = Math.abs(new Date() - new Date(t0));
    var hours = Math.floor(delta_time / 3.6e6);
    var minutes = Math.floor((delta_time % 3.6e6) / 6e4);
    var seconds = Math.floor((delta_time % 6e4) / 1000);
    var duration = ": " + ("00" + hours).slice(-2) + ": " + ("00" + minutes).slice(-2) + ": " + ("00" + seconds).slice(-2);
    return duration;
}


// Funtion to highlight tags
function hi_tags(text) {
    var n_pass = 0;
    var n_fail = 0;

    var key = '#PASS#';
    var regex = new RegExp(key, 'g');
    var newText = text.replace(regex, function() { n_pass++; return "<logPass>" + key + "</logPass>"; });
    text = newText;

    key = '#FAIL#';
    regex = new RegExp(key, 'g');
    newText = text.replace(regex, function() { n_fail++; return '<logFail>' + key + '</logFail>'; });
    text = newText;

    key = '#WARN#';
    regex = new RegExp(key, 'g');
    newText = text.replace(regex, '<logWarn>' + key + '</logWarn>');
    text = newText;

    key = '#INFO#';
    regex = new RegExp(key, 'g');
    newText = text.replace(regex, '<logInfo>' + key + '</logInfo>');
    text = newText;

    key = '\n';
    LineNumber = 1;
    regex = new RegExp(key, 'g');

    newText = text.replace(regex, function() { return key + "<line_no>  " + LineNumber++ + "\t</line_no>"; });
    text = newText.substring(1);
    return { "text": text, "n_pass": n_pass, "n_fail": n_fail }
}

// function to add tabs
function add_tab(element_name, parent_id) {
    var element_tab = document.createElement("div"); // div for testcase
    var tab_txt = document.createTextNode(element_name);
    element_tab.appendChild(tab_txt);
    element_tab.className = "tab";
    element_tab.id = element_name;
    parent_id.appendChild(element_tab);
    document.getElementById(element_name).addEventListener('click', function() {
        change_tabs(element_name);
    });
}


function change_tabs(id) {
    var tabs = document.getElementsByClassName("tab")
    for (i = 0; i < tab_names.length; ++i) {
        tabs[i].style.backgroundColor = "#609794";

    }
    document.getElementById(id).style.backgroundColor = "#d2dce0";

    if (id == "Job_1.0") {
        document.getElementById('output').innerHTML = short_log;
    } else if (id == "Job_1.0_full") {
        document.getElementById('output').innerHTML = full_log;
    } else if (id == "farm_log") {
        document.getElementById('output').innerHTML = farm_full_log;
        var file_paths = document.getElementsByClassName("path");
        add_link_to_path_tags(file_paths);
    }
    window.cur_tab = id;
    sessionStorage.setItem("pre_tab", id)
    $("#output").scrollTop(sessionStorage.getItem(id));
}

function click() {
    $("#somebutton").css("color", "green");
    localStorage.setItem("btncolor", "green");
}


var parent_div = document.getElementById('tab_container');
var tab_names = ["farm_log", "Job_1.0_full", "Job_1.0"];
for (i = 0; i < tab_names.length; ++i) {
    add_tab(tab_names[i], parent_div);
}

let full_text = hi_tags("\n" + srctext);
var full_log = full_text["text"];
var n_pass = full_text["n_pass"];
var n_fail = full_text["n_fail"];

var short_log = hi_tags(tags(srctext))["text"];
var farm_full_log = hi_tags(tag_paths("\n" + farm_srctext))["text"];


var pre_tab = sessionStorage.getItem("pre_tab");
if (pre_tab == null) {
    change_tabs("Job_1.0");
} else {
    change_tabs(pre_tab);
}



// Get the button:
let mybutton = document.getElementById("top_myBtn");
let scroll_element = document.getElementById('output');
// When the user scrolls down 20px from the top of the document, show the button
// window.onscroll = function() {scrollFunction()};
scroll_element.addEventListener('scroll', function() { scrollFunction() });

function scrollFunction() {
    console.log("scroll detected")
    if (scroll_element.scrollTop > 200) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "block";
    }
}

// Function to got to top of the page
function topFunction() {
    scroll_element.scrollTop = 0; // To go to top
    // scroll_element.scrollTop = scroll_element.scrollHeight;
}

// Function to got to top of the page
function botFunction() {
    // scroll_element.scrollTop = 0; // To go to top
    scroll_element.scrollTop = scroll_element.scrollHeight;
}

// This is to save scroll position to session storage



function add_link_to_path_tags(elements) {
    for (let i = 0; i < elements.length; i++) {
        ele = elements[i];
        cur_path = "/ams_sim/read_file";
        path = ele.innerHTML.trim();
        url = cur_path + "?file_path=" + path;
        ele.href = url;
        ele.target="_blank";
    }
}

var file_paths = document.getElementsByClassName("path");
add_link_to_path_tags(file_paths);

// Adding info for testcase status
get_status(srctext, n_pass, n_fail);


$("#output").on("scroll", function() {
    sessionStorage.setItem(cur_tab, $("#output").scrollTop());
});