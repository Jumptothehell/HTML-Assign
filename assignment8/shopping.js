window.onload = pageLoad;

function pageLoad(){
	var xhr = new XMLHttpRequest();
    xhr.open("GET", "cloth.json");
    xhr.onload = function(){
        var jsondata = JSON.parse(xhr.responseText);
        showData(jsondata);
    };
    xhr.onerror = function() { alert("ERROR!"); }; 
    xhr.send();
}

function showData(data){
    var allbox = document.querySelectorAll("#layer div");
    var keys = Object.keys(data);
    for(var i = 0; i < keys.length; i++)
    {
        var pic = document.createElement("img");
        pic.id = "nav-top";
        pic.src = "pic/" + [keys[i]] + ".jpg";
        var Info = document.createElement("p")
        Info.innerHTML = data[keys[i]].brandname + "<br>" + 
        "price: " + data[keys[i]].price; 
        
        allbox[i].appendChild(pic);
        allbox[i].appendChild(Info); 
    }
}

