BACKEND_SERVER_URL = "http://164.125.34.236:18945"

document.getElementById('mcts-seq-result-btn-load').onclick = function()
{
    mcts_seq_result_check_email_format();
    // Rerun Prism syntax highlighting on the current page
    //Prism.highlightAll();
}

function mcts_seq_result_check_email_format(){
    var email = document.getElementById('mcts-seq-result-email-load').value;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", BACKEND_SERVER_URL + "/mctseq/result/is_ready", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        email : email
    }));
    xhr.onload = function() {
        var data = JSON.parse(this.responseText);
        var status = data["status"];
        var msgs = data["error-msg"];
        if (status == "success"){
            mcts_seq_result_load_tasks();
        }else{
            sweetalarm_error_messages(msgs);
        }

    }
}

function mcts_seq_result_load_tasks(){
    var email = document.getElementById('mcts-seq-result-email-load').value;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", BACKEND_SERVER_URL + "/mctseq/result/tasks", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        email : email
    }));
    xhr.onload = function() {
        var data = JSON.parse(this.responseText);
        var status = data["status"];
        var tasks = data["tasks"];

        if (status == 'success'){
            // clear privious results...
            document.getElementById("mcts-seq-result-section-task-info").innerHTML = '';
            
            // add status of tasks
            //mcts_seq_result_task_status_element(tasks.length);
            
            // add task infos
            for (i = 0; i < tasks.length; i++) {
                mcts_seq_result_load_task_info(tasks[i], i);                    
            }
            
            reload();

        }else if (status == 'not-exists'){
            sweetalarm_error_messages("Tasks are not exist, please check your e-mail.");
        }else if (status == "error"){
            sweetalarm_error_messages(data["error-msg"]);
        }else{
            sweetalarm_error_messages("Unreachable Error");
        }

    }
}

function mcts_seq_result_load_task_info(out_url, out_idx){
    var email = document.getElementById('mcts-seq-result-email-load').value;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", BACKEND_SERVER_URL + "/mctseq/result/task/info", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        out_url : out_url
    }));
    xhr.onload = function() {
        var data = JSON.parse(this.responseText);
        var status = data["status"];
        var task_info = data["info"];
        console.log("[MCTSeq/load/task/info]", status, task_info);
        mcts_seq_result_add_task_info_in_container(task_info, out_idx);
    }
}

function mcts_seq_result_add_task_info_in_container(task_info, out_idx){
    var email = task_info["email"];
    var sub_time = task_info["submit-time"];
    var job_status = task_info["job-state"];
    var target_protein = task_info["target-protein"];
    var task_id = task_info["task-id"];
    mcts_seq_result_task_info_element(email, task_id, sub_time, job_status, target_protein, out_idx);

}

function mcts_seq_result_task_status_element(num_tasks){
    var article_message_is_primary = document.createElement('article');
    var div_message_body = document.createElement('div');
    article_message_is_primary.className = "message is-primary";
    div_message_body.className = "message-body";
    var task_status = num_tasks + " tasks founded.";
    div_message_body.innerHTML = task_status;
    article_message_is_primary.append(div_message_body);
    document.getElementById("mcts-seq-result-section-task-info").appendChild(article_message_is_primary);
}

function mcts_seq_result_task_info_element(email, task_id, sub_time, job_status, target_protein, out_idx){
    // element initialization
    var div_card_is_shady = document.createElement('div');
    var div_card_content = document.createElement('div');
    var div_content = document.createElement('div');
    var h4 = document.createElement('h4');
    var p = document.createElement('p');
    var pre = document.createElement('pre');
    var code = document.createElement('code');
    var span_button_is_info = document.createElement('span');
    var br = document.createElement('br')
    var script = document.createElement('script');
    
    // classname initialization
    div_card_is_shady.className = "card is-shady";
    div_card_content.className = "card-content";
    div_content.className = "content";
    span_button_is_info.className = "button is-info";
    code.className = "language-python";
    
    // class ID initialization
    var span_button_is_info_id = task_id + "-btn-" + out_idx ;
    var code_id = task_id + "-code-" + out_idx;
    span_button_is_info.setAttribute("id", span_button_is_info_id);
    code.setAttribute("id", code_id);
    code.setAttribute("class", "language-javascript");
    
    // innerHTML parameter initialization
    var title = "[" + sub_time + "] " + task_id;
    var subs = "E-mail: " + email + " / Job Status: " + job_status;
    var target_protein_subs = "Target Protein >> " + target_protein;
    Prism.highlightElement(target_protein_subs);
    console.log(Prism.highlightElement(target_protein_subs));
    
    // add parameters
    h4.innerHTML = title;
    p.innerHTML = subs;
    code.innerHTML = target_protein_subs;
    span_button_is_info.innerHTML = "more info ...";
    
//     var block = document.getElementById(code_id);
//     Prism.highlightElement(block);
//     Prism.highlightElement($(code_id)[0]);
    
    // button click listener
    span_button_is_info.onclick = function(){
        //swal("Next page!");
        //redirectPost('./result_viewer.html', {"e-mail": email, "task-id": task_id});
        window.location = './result_viewer.html?email=' + email + '&taskid=' + task_id + '&protein=' + target_protein + "&num_cands=10";
    };
    
    pre.append(code);
    div_content.append(h4);
    div_content.append(p);
    div_content.append(pre);
    div_content.append(span_button_is_info);
    div_card_content.append(div_content);
    div_card_is_shady.append(div_card_content);
    
    document.getElementById("mcts-seq-result-section-task-info").appendChild(div_card_is_shady);
    document.getElementById("mcts-seq-result-section-task-info").appendChild(br);
    console.log("add elements");
    
    
    
    
    
}


function redirectPost(url, data) {
    var form = document.createElement('form');
    document.body.appendChild(form);
    form.method = 'post';
    form.action = url;
    for (var name in data) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = data[name];
        form.appendChild(input);
    }
    form.submit();
}



function reload(){
    console.log("Prism-Highlight-All");
}

function sweetalarm_error_messages(msgs){
    swal({
        title: "Task load failed!",
        text: msgs,
        icon: "error",
        button: "Ok"
    })
}

   
    
// }

