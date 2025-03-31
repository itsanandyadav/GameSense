// function to show dropdown when button is clicked
function showDropdown(ele) {
    // document.getElementById("home").classList.toggle("show");
    // $(this).siblings(".dropdown-content").classList.toggle("show")
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
        dropdowns[i].classList.remove("show");
    }
    let nextSibling = ele.nextElementSibling.classList.toggle("show");
    // console.log("check : ", nextSibling, ele);

}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches(".dropbtn")) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
            }
        }
    }
};


// functions for header buttons
document.getElementById("Home1").onclick = function () { alert("testing alerts home1") };
document.getElementById("About2").onclick = function () { alert("testing alerts about2") };
document.getElementById("option_alerts").onclick = function () { alert("testing alerts") };
document.getElementById("option_status").onclick = function () { toggle_show_status() };
document.getElementById("option_refresh").onclick = function () { location.reload(); };
document.getElementById("option_select").onclick = function () { display_checkbox(); };


function set_home_url(){
    document.getElementById("home_url").href = window.location.origin;
}

set_home_url();
// -- function to delte file or folder ---//

function toggle_show_status() {
    // alert("ww");
    var ele = document.getElementById("status_box");
    if (ele.style.display == 'none') {
        ele.style.display = 'block';
        ele.setAttribute("show", "1");
    } else {
        ele.style.display = 'none';
        ele.setAttribute("show", "0");
    }

}

function display_checkbox() {
    // alert("ww");
    if ($('.selectbox').css('display') == 'none') {
        $('.selectbox').css('display', 'block');

    } else {
        $('.selectbox').css('display', 'none');
    }
}


var modifying = 0;
document.getElementById("option_delete").onclick = function () {
    // array of files/folders to delete
    window.modifying = 1;
    filenameArray = checkedArray;
    console.log("Deleting : ", filenameArray)
    for (let i = 0; i < filenameArray.length; i++) {
        item = filenameArray[i];
        $.ajax({
            type: "POST",
            url: "/drive/delete_item",
            beforeSend: function () { console.log("Deleting : ", item) },
            data: JSON.stringify({ "path": dir_path, "filename": item }),
            contentType: "application/json",
            dataType: 'json',
            success: function (response) {
                console.log(response);
                window.data = response;
                set_status("<red> DELETE</red> : " + filenameArray[i]);
                // alert(filenameArray[i] +" Deleted !!");
                // get_dir_contents(dir_path,parent_div);
            },
            complete: function (response) { // display success response
                set_status(response.responseJSON["message"]);
                console.log("complete : ",response);
                
                // set_status("<green> Uploaded</green> : " + response["filename"]);
            },
        });
    }
};

var updating_dir_contents = 0;
function get_dir_contents(dir_path, parent_div) {
    window.modifying = 0;
    $.ajax({
        type: "POST",
        url: '/drive/dir_contents',
        data: JSON.stringify({ "path": dir_path }),
        contentType: "application/json",
        dataType: 'json',
        success: function (dir_data) {
            console.log("updating dir contents");
            parent_div.innerHTML = "";
            populate_device_html(dir_data, parent_div);
        },
        // complete: function () { document.getElementById(tc_name).style.borderColor = "#3c4649"; }
    });

}


$(document).ajaxStop(function () {
    // This equality is to ensure this is not execute with any ajax stop event, should only happen when updating all function runs
    // if ((window.modifying == 1)) {
    // location.reload();
    // get_dir_contents(dir_path,parent_div);
    parent_div.innerHTML = "";
    populate_device_html(data, parent_div);

});


/*
/// after that once file is selected ajax will upload file automatically 
document.getElementById("file").onchange = function () {
    var form_data = new FormData();
    var file_count = document.getElementById('file').files.length;

    if (file_count == 0) {
        // $('#msg').html('<span style="color:red">Select at least one file</span>');
        return;
    }

    for (var x = 0; x < file_count; x++) {
        form_data.append("files[]", document.getElementById('file').files[x]);
    }
    form_data.append("path", dir_path);
    form_data.append("user", "Anand");

    $.ajax({
        url: "/drive/upload_ajax", // point to server-side URL
        dataType: 'json', // what to expect back from server
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        beforeSend: function () { console.log("Uploading file") },
        type: 'post',
        success: function (response) { // display success response
            console.log(response);
            // alert("Uploaded !!");
            window.data = response;
            set_status("<red> DELETE</red> : "+filenameArray[i]);
        },
        error: function (response) {
            console.log(response); // display error response
        },
    });
};


*/

