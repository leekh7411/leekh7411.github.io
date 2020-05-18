BACKEND_SERVER_URL = "//164.125.34.236:18945"

// MCTS-seq web-api button click listener
var mcts_seq_btn_submit = document.getElementById('mcts-seq-btn-submit');
mcts_seq_btn_submit.addEventListener('click', function(){
    
    var task_id     = document.getElementById('mcts-seq-input-id').value;
    var email       = document.getElementById('mcts-seq-input-email').value;
    var aptamer_len = document.getElementById('mcts-seq-input-len').value;
    var n_iters     = document.getElementById('mcts-seq-input-iter').value;
    var aa          = document.getElementById('mcts-seq-input-aa').value;
    //window.location.href = "./analysis_result.html";
    job_is_ready(task_id, email, aptamer_len, n_iters, aa);
    
    //alert(submit_log);
})

function job_is_ready(_taskid,_email,_aptamer_length,_n_iters,_protein){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", BACKEND_SERVER_URL + "/mctseq/is_ready", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        taskid         : _taskid,
        email          : _email,
        aptamer_length : _aptamer_length,
        n_iters        : _n_iters,
        protein        : _protein
    }));
    xhr.onload = function() {
        console.log(this.responseText);
        var data = JSON.parse(this.responseText);
        var status = data["status"];
        var msgs = data["error-msg"];
        if (status == "success"){
            sweetalarm_confirm_messeges(_taskid,_email,_aptamer_length,_n_iters,_protein);
        }else{
            sweetalarm_error_messages(msgs);
        }
        
    }
}

function job_submit(_taskid,_email,_aptamer_length,_n_iters,_protein){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", BACKEND_SERVER_URL + "/mctseq/simulation", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        taskid         : _taskid,
        email          : _email,
        aptamer_length : _aptamer_length,
        n_iters        : _n_iters,
        protein        : _protein
    }));
    xhr.onload = function() {
        
        var data = JSON.parse(this.responseText);
        var status = data["status"];
        var job_status = data["job-state"];
        console.log(this.responseText);
        console.log(job_status)
    }
}

function sweetalarm_error_messages(msgs){
    swal({
        title: "Task submission failed!",
        text: msgs,
        icon: "error",
        button: "Ok"
    })
}

function sweetalarm_confirm_messeges(taskid,email,aptamer_length,n_iters,protein){
    swal({
      title: "Submission is ready",
      text: "Please confirm again\n Your e-mail is " + email + " and \nTask ID is " + taskid,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
          swal("Please check your e-mail. \nAfter finish the job, we will send you the finish alram.", {
              title: "Task submission complete!",
              icon: "success",
          });
          // submit function 
          job_submit(taskid,email,aptamer_length,n_iters,protein)
      }
       
    });
}