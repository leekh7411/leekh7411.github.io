BACKEND_SERVER_URL = "http://164.125.34.236:18945"




window.onload = function initialize_result_viwer_page(){
    var cur_url = window.location.href;
    var vars = get_url_vars();
    var email = vars["email"];
    var protein = vars["protein"];
    var task_id = vars["taskid"];
    var num_cands = vars["num_cands"];
    mcts_seq_result_viewer_load_task_seq(email, task_id, protein, num_cands);
};

function mcts_seq_result_viewer_load_task_seq(email, task_id, protein, num_cands){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", BACKEND_SERVER_URL + "/mctseq/result/task/seqs", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        email : email,
        protein : protein,
        taskid : task_id,
        num_cands : num_cands
    }));
    
    xhr.onload = function() {
        var data = JSON.parse(this.responseText);
        var status = data["status"];
        var seqs = data["seqs"];
        
        if (status == 'success'){
            var max_bind_score = seqs["aptamer-maximum-binding-score"];
            var num_candidates = seqs["aptamer-num-candidates"];
            var cand_list = seqs["aptamer-list"];
            console.log(seqs);
            mcts_seq_result_viewer_draw_task_info(email, task_id, max_bind_score, num_candidates);
            mcts_seq_result_viewer_draw_target_protein(seqs["target-protein-seq"]);
            mcts_seq_result_viewer_draw_candidates(seqs["aptamer-list"], num_cands);
            
        }else if (status == 'not-exists'){
            sweetalarm_error_messages("Sequence outputs are not exist, please check again after finish the task.");
        }else if (status == "error"){
            sweetalarm_error_messages(data["error-msg"]);
        }else{
            sweetalarm_error_messages("Unreachable Error");
        }
        
    }
}


function mcts_seq_result_viewer_draw_target_protein(protein){
    var target_protein_code_id = 'mcts-seq-result-viewer-target-protein';
    var target_protein_code = document.getElementById(target_protein_code_id);
    target_protein_code.innerHTML = ">> Target Protein\n" + protein;
    var block = document.getElementById(target_protein_code_id);
    Prism.highlightElement(block);
    Prism.highlightElement($(target_protein_code_id)[0]);
}

function mcts_seq_result_viewer_draw_task_info(email, task_id, max_bind_score, num_candidates){
    var task_info_code_id = 'mcts-seq-result-viewer-task-info';
    var task_info_code = document.getElementById(task_info_code_id);
    task_info_code.innerHTML  = ""
    task_info_code.innerHTML += ">> E-mail" + "\n";
    task_info_code.innerHTML += email + "\n";
    task_info_code.innerHTML += ">> Task ID\n";
    task_info_code.innerHTML += task_id + "\n";
    task_info_code.innerHTML += ">> Maximum Binding Score (BS, from API classifier)\n";
    task_info_code.innerHTML += String(max_bind_score) + "\n";
    task_info_code.innerHTML += ">> Number of Aptamer Candidates (from MCTS-seq)\n";
    task_info_code.innerHTML += String(num_candidates);
        
    var block = document.getElementById(task_info_code_id);
    Prism.highlightElement(block);
    Prism.highlightElement($(task_info_code_id)[0]);
}


function mcts_seq_result_viewer_draw_candidates(aptamers, num_cands){
    var candidate_code_id = 'mcts-seq-result-viewer-candidates';
    var candidate_code = document.getElementById(candidate_code_id);
    candidate_code.innerHTML = "";
    var cnt = 0;
    for (i = aptamers.length-1; i >= 0; i--){
        var aptamer = aptamers[i];
        var score = aptamer[0];
        var seq = aptamer[1];
        var ss = aptamer[2];
        var mfe = aptamer[3];
        candidate_code.innerHTML += ">> TOP "+ (cnt+1) +" / BS " + score + " / MFE "+ mfe +"\n";
        candidate_code.innerHTML += seq + "\t";
        candidate_code.innerHTML += ss + "\n";
        cnt += 1;
        
        if (num_cands == cnt){
            break;
        }
        //break;
    } 
    
    var block = document.getElementById(candidate_code_id);
    Prism.highlightElement(block);
    Prism.highlightElement($(candidate_code_id)[0]);
}

function get_url_vars(){
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(m,key,value){vars[key] = value;});
    return vars;
};
