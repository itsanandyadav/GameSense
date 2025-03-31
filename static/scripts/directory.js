var parent_div = document.getElementById('parent_dir');

var dir_contents = data["contents"];
var user = data["user"];
var dir_path = data["path"];// full path including username/
var checkedArray = [];
var mouseIsDown;
var status_array = ["Responses:"];


function checkImage(url,def_url) {
    var image = new Image();
    var image_url = "nn";
    image.onload = function(url) {
      if (this.width > 0) {
        console.log("image exists, url:",url);
      }
    }
    image.onerror = function() {
        this.src = "/static/icons/type/unknown.png";
        // console.log("image doesn't exist, new url:",new_url);
    }
    image.src = url;
    // console.log("image_url:",image_url);
  }

function img_file_name(filename, type) {

    if (type == "file") {
        var ext = /^.+\.([^.]+)$/.exec(filename);

        if (ext == null) {
            image_name = "/static/icons/type/unknown.png";
        }
        else {
            // console.log(filename, " : ",ext[1]);
            image_name = "/static/icons/type/" + ext[1] + ".png";
        } 
    }
    else if (type == "dir") {
        image_name = "/static/icons/type/folder.png";
    }
    else {
        image_name = "/static/icons/type/unknown.png";
    }
    checkImage(image_name);
    // console.log("new_url:",abc);
    return image_name;
}

function add_link(element_name, type, parent_id) {

    var element_div = document.createElement("div");
    var element_link = document.createElement("a");
    var p_txt = document.createElement("p");
    var link_txt = document.createTextNode(element_name);

    var img = document.createElement('img');
    img.src = img_file_name(element_name, type);
    // if error comes on loading image the change the url to unknown.png image
    img.onerror = function(){this.src = "/static/icons/type/unknown.png"};

    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.className = "selectbox";
    checkbox.id = element_name;
    // checkbox.onmouseover=check(this);

    element_link.appendChild(checkbox);
    element_link.appendChild(img);
    p_txt.appendChild(link_txt);
    element_link.appendChild(p_txt);

    cur_path = "/drive/scan_dir";
    path = dir_path + "/" + element_name;
    url = cur_path + "?path=" + path;
    element_link.href = url;

    element_div.appendChild(element_link);
    // element_div.appendChild(link_txt);

    element_link.className = "element_link "// + type;
    element_div.id = "div_" + element_name;
    element_div.className = "element_div " + type;
    element_div.setAttribute("type",type);
    parent_id.appendChild(element_div);
}

function add_folder_button(element_name, parent_id) {

    var element_div = document.createElement("div");
    var element_button = document.createElement("button");
    var txt = document.createTextNode("+");
    element_button.appendChild(txt);

    element_button.className = "add_button button";
    element_button.onclick = popup_form;
    element_button.title = "Add Folder";
    element_div.appendChild(element_button);
    // element_div.id = element_name;
    element_div.className = "add_folder";
    parent_id.appendChild(element_div);
}

//--- add listener to get all the id of all link elemnets which has checkbox checked
function select_checkbox_1by1() {
    // $("#div_xls.png").css("background-color", "yellow");
    $(".selectbox").change(function () {
        var div_id = "div_" + this.id;
        if ((this).checked) {
            window.checkedArray.push(this.id);

            console.log("div id", div_id);
            // document.getElementById(div_id).style.borderColor = "orange";
            // document.getElementById(div_id).style.borderWidth = "2px";
            document.getElementById(div_id).style.backgroundColor = "#a9c59b";


        }
        else {
            window.checkedArray.splice(window.checkedArray.indexOf(this.id), 1);
            // document.getElementById(div_id).style.borderColor = "green";
            // document.getElementById(div_id).style.borderWidth = "0px";
            document.getElementById(div_id).style.backgroundColor = "#9bc5c5";

        }
        //you can call your function here if you need to act on this.
        console.log(checkedArray);
    });
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

function populate_device_html(response, parent_div) {
    var type = "dir"
    var contents = response["contents"][type];
    // console.log(contents)
    for (var i in contents) {
        // console.log(contents[i])
        add_link(contents[i], type, parent_div)
    }
    var type = "file"
    var contents = response["contents"][type];
    // console.log(contents)
    for (var i in contents) {
        // console.log(contents[i])
        add_link(contents[i], type, parent_div)
    }
    // add_folder_button("Add_Device", parent_div);

    // Adding listener to each checkbox
    window.checkedArray = [];
    select_checkbox_1by1();
    // mouse_drag_select();
}



populate_device_html(data, parent_div);

//--- form to add folder-----
function popup_form() {
    // document.getElementById("new_folder_form").action = window.location.href;
    document.getElementById('id01').style.display = 'block';
    document.getElementById("new_path").value = dir_path;
    document.getElementById("new_folder_form").action = "/poll_form_response";
    document.getElementById("new_folder_form").focus();
}

// Get the modal
var modal = document.getElementById('id01');
// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// ---- code to enable selecting checkboxes using mouse press and drag

//================ UPLOAD FEATURE =========================
///---- function to open file choser to upload file when upload button is clicked -----...
/// This method is provided in html to element with id=upload_btn
function thisFileUpload() {
    document.getElementById("file").click();
};
//---- function to to auto submit form when file is selected -----
// document.getElementById("file").onchange = function () {
//     document.getElementById("upload_form").submit();
// };

///--- This function is to post through ajax as soon file is selected.
// This is done through ajax post method so html form is not needed.
/// Thus html form is removed now. Only input to selete and that is invoked when upload button is clicked.
/// after that once file is selected ajax will upload file automatically 

var array_upload_files = [];
// document.getElementById("file").onchange = ajax_upload_function;
document.getElementById("file").onchange = upload_with_status;

function ajax_upload_function() {

    var file_count = document.getElementById('file').files.length;
    for (var x = 0; x < file_count; x++) {
        var form_data = new FormData();
        // form_data.append("files[]", document.getElementById('file').files[x]);
        form_data.append("files[]", document.getElementById('file').files[x]);
        filename = document.getElementById('file').files[x].name;
        form_data.append("filename", filename);
        form_data.append("path", dir_path);
        $.ajax({
            url: "/drive/upload_ajax", // point to server-side URL
            dataType: 'json', // what to expect back from server
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            beforeSend: function () {
                set_status("<yellow> Uploading</yellow> : " + filename);
            },
            type: 'post',
            success: function (response) { // display success response
                // console.log("x : ", x);
                // console.log(response);
                window.data = response;
                // set_status("<green> Uploaded</green> : " + response["filename"]);
            },
            error: function (response) {
                // set_status("<red>ERROR</red> : " + response["ERROR"]);
                // window.data = response;
                // console.log("Error : ",response); // display error response
            },
            complete: function (response) { // display success response
                set_status(response.responseJSON["message"]);
                console.log("complete : ", response);

                // set_status("<green> Uploaded</green> : " + response["filename"]);
            },
        });
    }
};

function upload_with_status() {
    var busy = 0;
    var file_count = document.getElementById('file').files.length;
    for (var x = 0; x < file_count; x++) {
        var form_data = new FormData();
        // form_data.append("files[]", document.getElementById('file').files[x]);
        form_data.append("files[]", document.getElementById('file').files[x]);
        filename = document.getElementById('file').files[x].name;
        form_data.append("filename", filename);
        form_data.append("path", dir_path);
        $.ajax({
            xhr: function () {
                var xhr = new window.XMLHttpRequest();
                xhr.fileName = document.getElementById('file').files[x].name;;
                xhr.fileSize = document.getElementById('file').files[x].size;;
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        var percentComplete = evt.loaded / evt.total;
                        percentComplete = parseInt(percentComplete * 100);
                        // console.log("Upload status:"+xhr.fileInfo+":"+ percentComplete +"% uploaded!");
                        update_round_pbar("div_"+xhr.fileName,percentComplete,xhr.fileSize);
                        // alert("Upload status : "+ percentComplete +"% uploaded!")
                        if (percentComplete === 100) {
                        }
                    }
                }, false);
                return xhr;
            },
            
            url: "/drive/upload_ajax", // point to server-side URL
            dataType: 'json', // what to expect back from server
            cache: false,
            contentType: false,
            processData: false,
            data: form_data,
            beforeSend: function () {
                add_round_pbar(filename,parent_div); // add round pbar element
                set_status("<yellow>Uploading:"+"</yellow>"+filename);
            },
            type: 'post',
            success: function (response) { // display success response
                // console.log("success:",response["contents"]);
                window.data = response;
            },
            error: function (response) { },
            complete: function (response) { // display success response
                set_status(response.responseJSON["message"]);
                // console.log("complete : ", response);
            },
        });
    }
}
//=========================================================


