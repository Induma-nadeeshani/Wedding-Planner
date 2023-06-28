window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {
    servicename = "";


    packages = httpRequest("../package/list", "GET");


}

