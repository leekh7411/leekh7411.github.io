// MCTS-seq web-api button click listener
var mcts_seq_btn_submit = document.getElementById('mcts-seq-btn-submit');
mcts_seq_btn_submit.addEventListener('click', function(){
    
    var mcts_seq_input_task_id     = document.getElementById('mcts-seq-input-id').value;
    var mcts_seq_input_email       = document.getElementById('mcts-seq-input-email').value;
    var mcts_seq_input_aptamer_len = document.getElementById('mcts-seq-input-len').value;
    var mcts_seq_input_n_iters     = document.getElementById('mcts-seq-input-iter').value;
    var mcts_seq_input_aa          = document.getElementById('mcts-seq-input-aa').value;
    
    // TODO 1. check input data for submit before...
    // - alert if wrong data input 
    var submit_log = "Aptamer searching job submitted.\n"
    submit_log += "- USER EMAIL: " + mcts_seq_input_email +"\n"
    submit_log += "- USER AA: " + mcts_seq_input_aa +"\n"
    alert(submit_log);
    
    //window.location.href = "./analysis_result.html";
    job_submit(mcts_seq_input_email, mcts_seq_input_aa);
})

function job_submit(_email, _protein){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://164.125.34.236:18945/mctseq/simulation", true);
    //xhr.open("POST", "https://postman-echo.com/post", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        email: _email,
        protein: _protein
    }));
    xhr.onload = function() {
      console.log("HELLO")
      console.log(this.responseText);
      var data = JSON.parse(this.responseText);
      console.log(data);
    }
}
