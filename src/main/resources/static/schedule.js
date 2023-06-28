window.addEventListener("load", initialize);



//btnPrint.addEventListener("click", btnPrintTableMC);


//Initializing Functions
function initialize() {

    privilages = httpRequest("../privilage?module=Customer", "GET");

    employees = httpRequest("../employee/list", "GET");
    reservations = httpRequest("../reservation/listforschedule", "GET");

    valid = "2px solid green";
    invalid = "2px solid red";
    initial = "2px solid #d6d6c2";
    updated = "2px solid #ff9900";
    active = "#ff9900";

    loadForm();

}

function loadForm() {

    fillCombo3(cmbRes, "Select Reservation", reservations, "regno", "customerId.cname");
    fillCombo(cmbRegBy, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);

    var today = new Date();
    dteRegDate.value = getDate(today);

        cmbRes.style.border=initial;
        dteRegDate.style.border=valid;
        cmbRegBy.style.border=valid;
         
}

function loadModalData() {

    var reservation = JSON.parse(cmbRes.value);
    //console.log(reservation);

    reservation = JSON.parse(JSON.stringify(reservation));
        //console.log("Res" +reservation.id);

    supallocation = httpRequest("/supervisorallocation/getbyreservation?resid="+reservation.id,"GET");
    console.log(supallocation);

    tdRno.innerHTML = reservation.regno;
    tdDate.innerHTML = reservation.regdate;
    tdAddBy.innerHTML = reservation.employeeId.callingname;

    tdcname.innerHTML = reservation.customerId.cname;
    tdcmobile.innerHTML = reservation.customerId.cmobile;
    tdcmail.innerHTML = reservation.customerId.cemail;

     tdsup.innerHTML = supallocation.supervisorId.callingname;
     tdsmobile.innerHTML = supallocation.supervisorId.mobile;
     tdsemail.innerHTML = supallocation.supervisorId.email;

   // diveventdetails
    var eventrlist = reservation.eventReservationList;

    diveventdetails.innerHTML = "";

    for(var index in eventrlist){
        var table = document.createElement('table');
        table.classList.add('table');
        table.classList.add('table-bordered');
        table.classList.add('table-striped');
        table.classList.add('table-hover');
        var thead =  document.createElement('thead');
        var tbody =  document.createElement('tbody');

        var trh = document.createElement('tr');
        var tdevn = document.createElement('th');
        tdevn.innerHTML = "Event Name : ";
        var tdevname = document.createElement('td');
        tdevname.innerHTML =  eventrlist[index].eventId.name;
        var tdevnd = document.createElement('th');
        tdevnd.innerHTML = "Event Date : ";
        var tdevdate = document.createElement('td');
        tdevdate.innerHTML =  eventrlist[index].eventdate;

        trh.appendChild(tdevn);
        trh.appendChild(tdevname);
        trh.appendChild(tdevnd);
        trh.appendChild(tdevdate);

        thead.appendChild(trh);

        var trh1 = document.createElement('tr');

        var tdevano = document.createElement('th');
        tdevano.innerHTML =  "No";

        var tdevaname = document.createElement('th');
        tdevaname.innerHTML =  "Activity Name";

        var tdevastime = document.createElement('th');
        tdevastime.innerHTML =  "Start Time";

        var tdevaetime = document.createElement('th');
        tdevaetime.innerHTML = "End Time";

        var tdevaslocation = document.createElement('th');
        tdevaslocation.innerHTML =  "Start Location";

        var tdevaelocation = document.createElement('th');
        tdevaelocation.innerHTML =  "End Location";

        var tdevadistance = document.createElement('th');
        tdevadistance.innerHTML =  "Distance";

        var tdevaduration = document.createElement('th');
        tdevaduration.innerHTML =  "Duration";

        trh1.appendChild(tdevano);
        trh1.appendChild(tdevaname);
        trh1.appendChild(tdevastime);
        trh1.appendChild(tdevaetime);
        trh1.appendChild(tdevaslocation);
        trh1.appendChild(tdevaelocation);
        trh1.appendChild(tdevadistance);
        trh1.appendChild(tdevaduration);
        thead.appendChild(trh1);

        table.appendChild(thead);

        ealist = eventrlist[index].eventActivityList;

        if(ealist.length != 0){
            for(var ind in ealist){
                    var trea = document.createElement('tr');
                    var tdeano = document.createElement('td');
                    tdeano.innerHTML =  parseInt(ind) + 1;
                console.log(ealist[ind].activityId.name)
                    var tdactivityname = document.createElement('td');
                        tdactivityname.innerHTML =  ealist[ind].activityId.name;

                    var tdactstarttime = document.createElement('td');
                        tdactstarttime.innerHTML = ealist[ind].actstarttime;

                    var tdactendtime = document.createElement('td');
                        tdactendtime.innerHTML =  ealist[ind].actendtime;

                    var tdstartlocation = document.createElement('td');
                        tdstartlocation.innerHTML =  ealist[ind].startlocation;

                    var tdendlocation = document.createElement('td');
                        tdendlocation.innerHTML =  ealist[ind].endlocation;

                    var tddistance = document.createElement('td');
                        tddistance.innerHTML = ealist[ind].distance;

                    var tdtraveltime = document.createElement('td');
                        tdtraveltime.innerHTML =  ealist[ind].traveltime;

                    trea.appendChild(tdeano);
                    trea.appendChild(tdactivityname);
                    trea.appendChild(tdactstarttime);
                    trea.appendChild(tdactendtime);
                    trea.appendChild(tdstartlocation);
                    trea.appendChild(tdendlocation);
                    trea.appendChild(tddistance);
                    trea.appendChild(tdtraveltime);

                    tbody.appendChild(trea);

                }

        }
        table.appendChild(tbody);
        diveventdetails.appendChild(table);
    }

    function btnPrintTableMC(schedule) {

        var newwindow = window.open();
        formattab = eventSchedule.outerHTML;

        newwindow.document.write("" +
            "<html>" +
            "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
            "<link rel='stylesheet' href='../plugin/bootstrap/css/bootstrap.min.css'/></head>" +
            "<body><div style='margin-top: 150px; '> <h1>Event Schedule : </h1></div>" +
            "<div>" + formattab + "</div>" +
            "</body>" +
            "</html>");
        setTimeout(function () {
            newwindow.print();
            newwindow.close();
        }, 100);
    }

}
