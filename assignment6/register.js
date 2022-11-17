window.onload = pageLoad;
function pageLoad(){
    var form = document.getElementById("myForm");
    form.onsubmit = validateForm;
}

function validateForm() {
    var x = document.forms["myForm"]["password"];
    var re_x = document.forms["myForm"]["repassword"];

    if(x.value !== re_x.value){
        var Errmsg = document.getElementById("errormsg");
        Errmsg.innerHTML = "Password not match. Please try again."
        return false;
    }
}