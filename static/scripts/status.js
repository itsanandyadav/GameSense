// hide status box after 5s;
const myTimeout = window.setTimeout(hide_status, 10000);
clearTimeout(myTimeout);
//-- function to show status in status box
function set_status(item) {
    // reset the auto hide timer for status box
    clearTimeout(window.myTimeout);
    // show status box
    show_status()
    if (window.status_array.length >= 30) {
        // if more than 30 items are there then remove oldest:first item 
        window.status_array.shift();
    }
    // and then add in the end
    window.status_array.push(item);
    // join all of them with line break and show in status box
    document.getElementById("status_box").innerHTML = window.status_array.join("<br>")
    // start the autohide timer for 10s
    window.myTimeout = window.setTimeout(hide_status, 10000);
}

// this hides the status box
function hide_status() {
    var ele = document.getElementById("status_box");
    // if it is not enabled as show using menu option 
    if (ele.getAttribute("show") == "0") {
        // then hide, when time reaches end value.
        ele.style.display = "none";
    }
}

// show status bos
function show_status() {
    document.getElementById("status_box").style.display = "block";
}
// this will trigger if innerhtml is modified.
document.getElementById("status_box").addEventListener('DOMSubtreeModified', show_status);


var long_text = "xmvlog: *W,MACCDF (-DEFINE macro,1|12): The text macro 'sanity_check'\
 has also been defined on the command line using the -DEFINE command line option.  \
 The compiler will ignore the definition for -DEFINE option found on the command line \
 after the first definitionfile: /sim/amd_dv/DRV81008/debug/Latest/create/\
 functional_81008/sanity_check/Job_1.0/netlist/cirNetlist.vams"
// set_status(long_text);

//======= adding upload progress bar to status box======
// not used now. will be deleted in later version
function add_upload_status(element_name, message) {

    var parent_id = document.getElementById('status_box');
    var element_div = document.createElement("div");
    var element_msg = document.createElement("p");
    var element_pbar = document.createElement("div");
    var link_txt = document.createTextNode(message);

    element_msg.appendChild(link_txt);
    element_div.append(element_pbar);

    element_msg.className = "message";
    element_div.className = "p_pbar";
    element_pbar.className = "pbar";
    element_pbar.id = "pbar_" + element_name;

    parent_id.appendChild(element_msg);
    parent_id.appendChild(element_div);
}
// function to update the straight progress bar
function update_pbar(id) {
    var ele = document.getElementById(id);
    ele.style.width = width + "%";
}


//======= adding upload progress in circular bar ======
function add_round_pbar(element_name, parent_div) {
    var element_div = document.createElement("div");
    element_div.id = "div_" + element_name;
    element_div.className = "element_div file round_pbar"; // file is type

    var element_round = document.createElement("div");
    element_round.className = "circular-progress";

    var p_value = document.createElement("p");
    p_value.className = "progress-value";

    var f_size = document.createElement("p");
    f_size.className = "file-size";


    var link_txt = document.createTextNode(element_name);
    var p_txt = document.createElement("p");
    p_txt.appendChild(link_txt);

    element_round.appendChild(p_value);
    element_round.appendChild(f_size);
    element_div.appendChild(element_round);
    element_div.appendChild(p_txt);

    parent_div.appendChild(element_div);
}

// ============= show size of files to upload=======
// Convert the file size to a readable format
function formatFileSize(bytes) {
    var sufixes = ['B', 'kB', 'MB', 'GB', 'TB'];
    var i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sufixes[i]}`;
};


// function to update the round status and show percentage
function update_round_pbar(id,percent,size){
    var parent = document.getElementById(id);
    let circularProgress = parent.querySelector(".circular-progress");
    let progressValue = parent.querySelector(".progress-value");
    let fileSize = parent.querySelector(".file-size");
    progressValue.textContent = `${percent}%`
    fileSize.textContent = formatFileSize(size);
    circularProgress.style.background = `conic-gradient(#116fba ${percent * 3.6}deg, #7cedfc 0deg)`;
}
// ================Testing round pbar===================
// add_round_pbar("test.png", parent_div);
// update_round_pbar("div_test.png",100,305800);
// add_round_pbar("test1.png", parent_div);
// var parent_d = document.getElementById("div_test_line2_line3.png");
// let circularProgress = parent_d.querySelector(".circular-progress"),
//     progressValue = parent_d.querySelector(".progress-value");

// let progressStartValue = 0,
//     progressEndValue = 75,
//     speed = 10;

// let progress = setInterval(() => {
//     progressStartValue++;

//     progressValue.textContent = `${progressStartValue}%`
//     circularProgress.style.background = `conic-gradient(#116fba ${progressStartValue * 3.6}deg, #7cedfc 0deg)`

//     if (progressStartValue == progressEndValue) {
//         clearInterval(progress);
//     }
// }, speed);

//================ decode upload response===========
//          NOT IMPLEMENTED YET


// Display the file size
// sizeEle.innerHTML = formatFileSize(files[0].size);
// ============
