var app = data["app"];
var users= data["users"]; // a list of users


var parent_div = document.getElementById('parent_div');

function add_link(element_name, parent_id) {

    var element_div = document.createElement("div");
    var element_link = document.createElement("a");
    var p_txt = document.createElement("p");
    var link_txt = document.createTextNode(element_name);


    var img = document.createElement('img');
    img.src = img_file_name(element_name);

    element_link.appendChild(img);
    p_txt.appendChild(link_txt);
    element_link.appendChild(p_txt);

    cur_path = "/drive/scan_dir";
    url = cur_path + "?path=" + element_name ;
    element_link.href = url;

    element_div.appendChild(element_link);

    element_link.className = "device_link";
    element_div.id = element_name;
    element_div.className = "device_div";
    parent_id.appendChild(element_div);
}

function img_file_name(filename) {
    image_name =  "/static/icons/users/"+filename+".png";
    return image_name
}

function add_user_button(element_name, parent_id) {

    var element_div = document.createElement("div");
    var element_button = document.createElement("button");
    var txt = document.createTextNode("+");
    element_button.appendChild(txt);
    // element_link.appendChild("Add Device");
    // element_link.href = window.location.href + element_name;

    element_div.appendChild(element_button);

    element_button.className = "add_button button";
    element_button.onclick = popup_form;
    element_button.title = "Add User";
    element_div.id = element_name;
    element_div.className = "add_folder";
    parent_id.appendChild(element_div);
}

var list = ["Anand","Yadav"];
function populate_device_html(item_list, parent_div) {
    for (var i in item_list) {
        console.log(item_list[i])
        add_link(item_list[i], parent_div)
    }

    add_user_button("Add_User", parent_div);
}

populate_device_html(users, parent_div);


//--- form to add folder-----
function popup_form() {
    // document.getElementById("new_folder_form").action = window.location.href;
    document.getElementById('id01').style.display = 'block';
    document.getElementById("new_path").value = dir_path;
    document.getElementById("new_folder_form").action = "/drive/make_folder";
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


//---function to add links to path tags so that it can be opened by clicking on it---
function add_link_to_path_tags(elements) {
    for (let i = 0; i < elements.length; i++) {
        ele = elements[i];
        cur_path = "/ams_sim/scan_dir";
        path = root_dir_path+"/"+ ele.innerHTML;
        url = cur_path + "?path=" + path;
        // console.log(url);
        ele.href = url;
        ele.target="_blank";
    }
}

// var file_paths = document.getElementsByClassName("device_link");
// add_link_to_path_tags(file_paths);



