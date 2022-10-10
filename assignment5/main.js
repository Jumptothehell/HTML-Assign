function postFunction(){
    var InputText = document.getElementById("text1").value;
    var topic1 = document.getElementById("topic1");
    var comment1 = document.getElementById("comment1");
    var comment2 = document.getElementById("comment2");
    
    if(topic1.innerHTML === ""){
        topic1.innerHTML = InputText;
    } 
    else {
        if(comment1.innerHTML === ""){
            comment1.innerHTML = InputText;
        } 
        else {
            if(comment2.innerHTML === ""){
                comment2.innerHTML = InputText;
            }
            else{
            }
        }
    }
}
function clearFunction(){
    topic1.innerHTML = "";
    comment1.innerHTML = "";
    comment2.innerHTML = "";
}