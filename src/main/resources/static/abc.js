window.addEventListener("load", initialize);
window.addEventListener("load", currentTime);

//Initializing Functions
function initialize() {

    cmbGender.addEventListener("change", cmbGenderCH);

    genders = httpRequest("../gender/list", "GET");
    employees = httpRequest("../employee/list", "GET");

    valid = "2px solid green";
    invalid = "2px solid red";
    initial = "2px solid #d6d6c2";
    updated = "2px solid #ff9900";
    active = "#ff9900";

    fillCombo(cmbGender,"Select Gender",genders,"name","");
    fillCombo(cmbEmployee,"Select Employee",employees,"callingname","");
}

function cmbGenderCH() {
    var emp =  httpRequest("../employee/bygender?genderid="+JSON.parse(cmbGender.value).id, "GET");
    fillCombo(cmbEmployee, "Select Employee", emp, "callingname", "");

}

function currentTime() {
    var date = new Date(); /* creating object of Date class */
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    var midday = "AM";
    midday = (hour >= 12) ? "PM" : "AM"; /* assigning AM/PM */
    hour = (hour == 0) ? 12 : ((hour > 12) ? (hour - 12): hour); /* assigning hour in 12-hour format */
    hour = changeTime(hour);
    min = changeTime(min);
    sec = changeTime(sec);
    document.getElementById("digit_clock_time").innerText = hour + " : " + min + " : " + sec + " " + midday; /* adding time to the div */

    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    var curWeekDay = days[date.getDay()]; // get day
    var curDay = date.getDate();  // get date
    var curMonth = months[date.getMonth()]; // get month
    var curYear = date.getFullYear(); // get year
    var date = curWeekDay+", "+curDay+" "+curMonth+" "+curYear; // get full date
    document.getElementById("digit_clock_date").innerHTML = date;

    var t = setTimeout(currentTime, 1000); /* setting timer */
}

function changeTime(k) { /* appending 0 before time elements if less than 10 */
    if (k < 10) {
        return "0" + k;
    }
    else {
        return k;
    }
}
