

var user_data_json = leaderboard_data;
var parent_id_name = "points_table_div";



function add_table_row(aid, username, points_scored, max_score, parent_id_name) {

    var accuracy = 100 * points_scored / max_score;
    // console.log(accuracy)

    var element_div = document.createElement("div");
    element_div.className = "table_row";
    element_div.id = aid;
    var table_row_txt =
        `<div class="ind_block username">${username}</div>
    <div class="ind_block accuracy"> 
      <div class="progress" style="width:${accuracy}%">${accuracy}%</div>
    </div>
    <div class="ind_block points">${points_scored}|${max_score}</div>`;
    element_div.innerHTML = table_row_txt;
    var parent_element = document.getElementById(parent_id_name);
    parent_element.appendChild(element_div);
    return true
}


function create_leaderboard(user_data_json, parent_id_name) {


    var sorted_users = sort_object(user_data_json);
    for (var user in sorted_users) {
        // console.log(user);
        var username = user_data_json[user]["username"];
        // var accuracy = user_data_json[user]["accuracy"];
        var points_scored = user_data_json[user]["points"];
        var max_score = user_data_json[user]["max_points"];
        add_table_row(user, username, points_scored, max_score, parent_id_name);
    }
    return true
}

create_leaderboard(user_data_json, parent_id_name)



dict = {
    "x": 1,
    "y": 6,
    "z": 9,
    "a": 5,
    "b": 7,
    "c": 11,
    "d": 17,
    "t": 3
};

function sort_object(obj) {
    items = Object.keys(obj).map(function (key) {
        return [key, obj[key]["points"]];
    });
    // console.log("items:",items);
    items.sort(function (first, second) {
        return second[1] - first[1];
    });
    // console.log("items sorted:",items);
    sorted_obj = {}
    $.each(items, function (k, v) {
        use_key = v[0]
        use_value = v[1]
        sorted_obj[use_key] = use_value
    })
    return (sorted_obj)
}

// console.log(sort_object(user_data_json));






const form = document.getElementById('main_form');
form.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission
    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }
    console.log(data); // Output: { key1: 'value1', key2: 'value2', ... }
    localStorage.setItem("aid", data["aid"])
    localStorage.setItem("nickname", data["nickname"])

    // SUBMIT FORM
    $.ajax({
        type: "POST",
        url: "/leaderboard/save_poll_response",
        // beforeSend: function () { set_status("<red> DELETE</red> : " + item); },
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: 'json',
        success: function (responseJSON) {
            console.log("success:",responseJSON);
            // window.data = response;
        },
        complete: function (response) { // display success response
            // set_status(response.responseJSON["message"]);
            console.log("Response:",responseJSON["contents"]);
        },
    });

});

