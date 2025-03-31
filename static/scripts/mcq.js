

var json_data = poll_data;
var sr_q = 1;
var mcq = "What is your favourite team?";
var nu_options = 4;// numer of options
var options = ["Red", "green", "yellow", "blue"];
var imp = "*";


// ======= create multiple choice options

function create_mcq(sr, question, options, imp) {

    var id = `question${sr}`;
    var q_txt = `<div class="form_section mcq",id="${id}">
    <h3>${sr}. ${question} <span style="color: red;">${imp}</span></h3>`

    for (var option in options) {
        var option_txt = `<label><input type="radio" name=${id} value="${options[option]}" id="" required>${options[option]}</label>
    <br>` ;
        q_txt = q_txt + option_txt;
    }

    q_txt = q_txt + "</div>";
    return q_txt
}

function add_mcq(parent_element, question_info) {

    var sr = question_info["sr"];
    var question_text = question_info["question"];
    // var nu_options = question_info["nu_options"];
    var options = question_info["options"];
    var imp = question_info["imp"];

    var element_div = document.createElement("div");
    element_div.innerHTML = create_mcq(sr, question_text, options, imp);
    parent_element.appendChild(element_div);
}




// ======= create multiple choice options

function create_dropdown(sr, question, options, imp) {

    var id = `question${sr}`;
    var q_txt = `<div class="form_section dropdown",id="${id}">
    <h3>${sr}. ${question} <span style="color: red;">${imp}</span></h3>`;

    q_txt = q_txt + `<select name="${id}">`;
    q_txt = q_txt + `<option value="">--Please choose an option--</option>`;
    for (var option in options) {
        var option_txt = `<option value="${options[option]}">${options[option]}</option>`;
        q_txt = q_txt + option_txt;
    }
    q_txt = q_txt + "</select></div>";
    return q_txt
}

function add_dropdown(parent_element, question_info) {
    var sr = question_info["sr"];
    var question_text = question_info["question"];
    // var nu_options = question_info["nu_options"];
    var options = question_info["options"];
    var imp = question_info["imp"];

    var element_div = document.createElement("div");
    element_div.innerHTML = create_dropdown(sr, question_text, options, imp);
    parent_element.appendChild(element_div);
}

// ======= create dropdown type questions






// ==============================================

function create_poll(poll_info) {
    document.getElementById('about_poll').innerText = poll_info["about_poll"];

    var parent_element = document.getElementById('div_questions');
    for (var question_info in poll_info) {
        console.log(question_info)
        if (question_info.includes("question")) {

            if (poll_info[question_info]["type"] == "mcq") {
                add_mcq(parent_element, poll_info[question_info]);
            }
            else if (poll_info[question_info]["type"] == "dropdown") {
                add_dropdown(parent_element, poll_info[question_info]);
            }
        }
    }
}


create_poll(json_data)

