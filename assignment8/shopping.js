window.onload = pageLoad;

function pageLoad(){
	var xhr = new XMLHttpRequest();
    xhr.open("GET", "cloth.json");
    xhr.onload = function(){
        var jsondata = JSON.parse(xhr.responseText);
        console.log(jsondata);
        display(jsondata);
    };
    xhr.onerror = function() { alert("ERROR!"); }; 
    xhr.send();
}

function showData(data){
	
}

