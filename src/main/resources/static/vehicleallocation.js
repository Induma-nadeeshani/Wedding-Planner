window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    txtSearchName.addEventListener("keyup", btnSearchMC);

    cmbRes.addEventListener("change", cmbReservationCH);
    cmbPkg.addEventListener("change", cmbPkgCH);
    cmbEvent.addEventListener("change", cmbEventCH);

    privilages = httpRequest("../privilage?module=VehicleAllocation", "GET");

    reservations = httpRequest("../reservation/listbyvehres", "GET");
    packages = httpRequest("../providerpackage/listbyvehiclepkgs", "GET");
    events = httpRequest("../event/list", "GET");
    employees = httpRequest("../employee/list", "GET");
    vehicles = httpRequest("../vehicle/list", "GET");
    drivers = httpRequest("../employee/listbydesignation", "GET");

    valid = "2px solid green";
    invalid = "2px solid red";
    initial = "2px solid #d6d6c2";
    updated = "2px solid #ff9900";
    active = "#ff9900";

    viewForm();
    loadForm();
    loadView();
    disableButtons(false, true, true);

}

function loadView() {

    //Search Area
    txtSearchName.value = "";
    txtSearchName.style.background = "";

    //Table Area
    activerowno = "";
    activepage = 1;
    var query = "&searchtext=";
    loadTable(1, cmbPageSize.value, query);
}

function loadTable(page, size, query) {
    page = page - 1;
    vehicleallocation = new Array();
    allocatedvehicle = new Array();

    var data = httpRequest("/vehicleallocation/findAll?page=" + page + "&size=" + size + query, "GET");

    if (data.content != undefined)
        vehicleallocations = data.content;

    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblVehicleAllocation', vehicleallocations, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblVehicleAllocation);

    if (activerowno != "") selectRow(tblVehicleAllocation, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldvehicleallocation == null) {
        paginate = true;
    } else {
        if (getErrors() == '' && getUpdates() == '') {
            paginate = true;
        } else {
            paginate = window.confirm("Form has Some Errors or Update Values. " +
                "Are you sure to discard that changes ?");
        }
    }
    if (paginate) {
        activepage = page;
        activerowno = ""
        loadSearchedTable();
        loadForm();
    }

}

function viewitem(vehallo, rowno) {

    vehicleallocation = JSON.parse(JSON.stringify(vehallo));


    tdresno.innerHTML = vehicleallocation.reservationId.regno;
    tdevent.innerHTML = vehicleallocation.eventId.name;
    tdeventdate.innerHTML = vehicleallocation.eventdate;
    tdstime.innerHTML = vehicleallocation.starttime;
    tdetime.innerHTML = vehicleallocation.endtime;

}

function printRow() {

    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<body><div style='margin-top: 150px'><h1>Vehicle Allocation Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}

function loadForm() {
    vehicleallocation = new Object();
    oldvehicleallocation = null;

    vehicleallocation.allocatedVehicleList = new Array();

    fillCombo3(cmbRes, "Select Reservation", reservations, "regno", "customerId.cname");
    fillCombo(cmbPkg, "Select Package ", packages, "name", "");
    fillCombo3(cmbVehicle, "Select Vehicle ", vehicles, "vnumber","vname", "");
    fillCombo(cmbDriver, "Select Driver ", drivers, "callingname", "");
    fillCombo(cmbEvent, "Select Event ", events, "name", "");
    fillCombo(cmbRegBy, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    vehicleallocation.employeeId = JSON.parse(cmbRegBy.value);

    //Autofill date
    var today = new Date();
    dteRegDate.value = getDate(today);
    vehicleallocation.regdate = dteRegDate.value;

    dteEventDate.value = "";
    timStart.value = "";
    timEnd.value = "";

    setStyle(initial);

    dteRegDate.style.border=valid;
    cmbRegBy.style.border=valid;

    disableButtons(false, true, true);
}

function setStyle(style) {

    cmbRegBy.style.border = style;
    dteRegDate.style.border = style;
    cmbRes.style.border = style;
    cmbPkg.style.border = style;
    cmbVehicle.style.border = style;
    cmbDriver.style.border = style;
    cmbEvent.style.border = style;
    dteEventDate.style.border = style;
    timStart.style.border = style;
    timEnd.style.border = style;
    //txtDescription.style.border = style;

}

function disableButtons(add, upd, del) {

    if (add || !privilages.add) {
        btnAdd.setAttribute("disabled", "disabled");
        $('#btnAdd').css('cursor', 'not-allowed');
    } else {
        btnAdd.removeAttribute("disabled");
        $('#btnAdd').css('cursor', 'pointer')
    }

    if (upd || !privilages.update) {
        btnUpdate.setAttribute("disabled", "disabled");
        $('#btnUpdate').css('cursor', 'not-allowed');
    } else {
        btnUpdate.removeAttribute("disabled");
        $('#btnUpdate').css('cursor', 'pointer');
    }

    if (!privilages.update) {
        $(".buttonup").prop('disabled', true);
        $(".buttonup").css('cursor', 'not-allowed');
    } else {
        $(".buttonup").removeAttr("disabled");
        $(".buttonup").css('cursor', 'pointer');
    }

    if (!privilages.delete) {
        $(".buttondel").prop('disabled', true);
        $(".buttondel").css('cursor', 'not-allowed');
    } else {
        $(".buttondel").removeAttr("disabled");
        $(".buttondel").css('cursor', 'pointer');
    }

}

//Inner Vehicle Form
function refreshInnerForm() {

    fillCombo3(cmbVehicle,"Select Vehicle",vehicles,"vnumber","vname");
    fillCombo(cmbDriver,"Select Driver",drivers,"callingname");

    cmbVehicle.style.border = initial;
    cmbDriver.style.border = initial;

    fillInnerTable("tblInnerVehicle",vehicleallocation.allocatedVehicleList,modifyInnerForm,deleteInnerForm);

    if (vehicleallocation.allocatedVehicleList.length != 0) {
        for (var i = 0; i < tblInnerVehicle.children[1].children.length; i++) {
            tblInnerVehicle.children[1].children[i].lastChild.firstChild.style.display = "none";
        }
    }

    // btnInnerAdd.removeAttribute("disabled","disabled");
    // btnInnerUpdate.setAttribute("disabled","disabled");

}

function getInnerErrors() {
    var serErr = "";
    addServalue = "";

    if (allocatedvehicle.vehicleId == null){
        serErr = serErr + "\n" + "Vehicle is Not Selected";
        cmbVehicle.style.border = invalid;
    }else
        addServalue = 1;

    if (allocatedvehicle.driverId == null){
        serErr = serErr + "\n" + "Driver is Not Selected";
        cmbDriver.style.border = invalid;
    }else
        addServalue = 1;

    return serErr;
}

function btnInnerAddMC() {
    allocatedvehicle = new Object();

    allocatedvehicle.vehicleId = JSON.parse(cmbVehicle.value);
    allocatedvehicle.driverId = JSON.parse(cmbDriver.value);

        vehExs = false;
        for (index in vehicleallocation.allocatedVehicleList) {
            if (vehicleallocation.allocatedVehicleList[index].vehicleId.vname == JSON.parse(cmbVehicle.value).vname) {

                vehExs = true;
                break;
            }
        }

        drvExs = false;
        for (index in vehicleallocation.allocatedVehicleList) {
            if (vehicleallocation.allocatedVehicleList[index].driverId.callingname == JSON.parse(cmbDriver.value).callingname) {

                drvExs = true;
                break;
            }
        }

        if(vehExs || drvExs){
            swal({
                title: "This Vehicle or Driver is Already Selected",
                text:"\n",
                icon:"warning",
                buttons:false,
                timer: 1200,
            });
        }else{
            vehicleallocation.allocatedVehicleList.push(allocatedvehicle);
            refreshInnerForm();
        }

}

function btnInnerClearMC() {
    check = getInnerErrors();

    if(addServalue == ""){

        swal({
            title: "Are you sure to clear this Inner form...?",
            text:"\n",
            icon:"warning",
            buttons:true,

        }).then((willUpdate) => {
            if(willUpdate){
                refreshInnerForm();
            }
        });
    }
}

function modifyInnerForm(allocatedvehicles,indx) {
    selectedInnerRow = indx;

    fillCombo3(cmbVehicle,"Select Vehicle",vehicles,"vnumber","vname",allocatedvehicle.vehicleId.vnumber,"vname",allocatedvehicle.vehicleId.vname);
    fillCombo(cmbDriver,"Select Driver",drivers,"callingname",allocatedvehicle.driverId.callingname);

    cmbVehicle.style.border = valid;
    cmbDriver.style.border = valid;

    btnInnerAdd.setAttribute("disabled","disabled");
    btnInnerUpdate.removeAttribute("disabled","disabled");
}

function btnInnerUpdateMC() {
    innerUpdates = getInnerUpdate(vehicleallocation.allocatedVehicleList[selectedInnerRow]);

    if(innerUpdates=""){
        swal({
            title: "Nothing Updated",
            text:"\n",
            icon:"warning",
            buttons:false,
            timer: 1200,
        });
    }else{
        swal({
            title: "Are you sure to update followings...?",
            text:"\n"+ innerUpdates,
            icon:"warning",
            buttons:false,
            timer: 1200,
        })
            .then((willUpdate) => {
                if(willUpdate){
                    vehicleallocation.allocatedVehicleList[selectedInnerRow].vehicleId = JSON.parse(cmbVehicle.value);
                    vehicleallocation.allocatedVehicleList[selectedInnerRow].driverId = JSON.parse(cmbDriver.value);
                    refreshInnerForm();
                }
            });
    }
}

function getInnerUpdate(allocatedvehicle) {
    var updates = "";
    if(allocatedvehicle.vehicleId.vna,e != JSON.parse(cmbVehicle.value)){
        updates = updates + "\nVehicle is Updated";
        cmbVehicle.style.border = updated;
    }

    if(allocatedvehicle.driverId.callingname != JSON.parse(cmbDriver.value)){
        updates = updates + "\nEvent is Not Selected";
        cmbDriver.style.border = updated;
    }

    return updates;
}

function deleteInnerForm(vehicleallocation ,indx) {
    swal({
        title: "Do you want to remove the selected Vehicle and Driver?",
        text:"\n",
        icon:"warning",
        buttons:true,
    }).then((willDelete) => {
        if(willDelete){
            vehicleallocation.allocatedVehicleList.splice(indx,1);
            refreshInnerForm();

        }
    })


}


function getErrors() {

    var errors = "";
    addvalue = "";

    if (vehicleallocation.reservationId  == null){
        errors = errors + "\n" + "Reservation is Not Selected";
        cmbRes.style.border = invalid;
    }else
        addvalue = 1;

    if (vehicleallocation.eventId == null){
        errors = errors + "\n" + "Event is Not Selected";
        cmbEvent.style.border = invalid;
    }else
        addvalue = 1;

    if (vehicleallocation.eventdate  == null){
        errors = errors + "\n" + "Event Date is Not Entered";
        dteEventDate.style.border = invalid;
    }else
        addvalue = 1;

    if (vehicleallocation.starttime == null){
        errors = errors + "\n" + "Start Time is Not Entered";
        timStart.style.border = invalid;
    }else
        addvalue = 1;

    if (vehicleallocation.endtime  == null){
        errors = errors + "\n" + "End Time is Not Entered";
        timEnd.style.border = invalid;
    }
    else addvalue = 1;

    if (vehicleallocation.allocatedVehicleList.length == 0){
        errors = errors + "\n" + "Vehicles or drivers are Not Selected";
        cmbVehicle.style.border = invalid;
        cmbDriver.style.border = invalid;
    }
    else addvalue = 1;

    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (txtDescription.value == "") {
            swal({
                title: "Are you sure to continue...?",
                text: "Form has some empty fields.....",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    savedata();
                }
            });

        } else {
            savedata();
        }
    } else {
        swal({
            title: "You have following errors",
            text: "\n" + getErrors(),
            icon: "error",
            button: true,
        });

    }
}

function savedata() {

    swal({
        title: "Are you sure to add following Allocation...?",
        text: "\nReservation ID : " + vehicleallocation.reservationId.regno +
            "\nEvent : " + vehicleallocation.eventId.name+
            "\nEvent Date : " + vehicleallocation.eventdate+
            "\nStart Time : " + vehicleallocation.starttime+
            "\nEnd Time : " + vehicleallocation.endtime,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/vehicleallocation", "POST", vehicleallocation);
            if (response == "0") {
                swal({
                    position: 'center',
                    icon: 'success',
                    title: 'Your work has been Done \n Saved Successfully..!',
                    text: '\n',
                    button: false,
                    timer: 1200
                });
                loadForm();
                activerowno = 1;
                loadSearchedTable();
            } else swal({
                title: 'Save not Success... , You have following errors', icon: "error",
                text: '\n ' + response,
                button: true
            });
        }
    });

}

function btnClearMC() {
    //Get Confirmation from the User window.confirm();
    checkerr = getErrors();

    if (oldvehicleallocation == null && addvalue == "") {
        loadForm();
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                loadForm();
            }

        });
    }
}

function fillForm(vallo, rowno) {
    activerowno = rowno;

    if (oldvehicleallocation == null) {
        filldata(sp);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(vallo);
                viewForm();
            }

        });
    }

}

function filldata(vallo) {
    viewForm();
    clearSelection(tblVehicleAllocation);
    selectRow(tblVehicleAllocation, activerowno, active);

    vehicleallocation = JSON.parse(JSON.stringify(vallo));
    oldvehicleallocation = JSON.parse(JSON.stringify(vallo));

    cmbRegBy.value = vehicleallocation.employeeId.callingname;
    cmbRegBy.disabled = "disabled";
    dteRegDate.value = vehicleallocation.regdate;
    dteRegDate.disabled = "disabled";

    cmbRes.value = vehicleallocation.reservationId.regno;
    cmbEvent.value = vehicleallocation.eventId.name;
    dteEventDate.value = vehicleallocation.eventdate;
    timStart.value = vehicleallocation.starttime;
    timEnd.value = vehicleallocation.timEnd;
    txtDescription.value = vehicleallocation.description;

    fillCombo(cmbRes, "Reservation", reservations, "regno", vehicleallocation.reservationId .regno);
    fillCombo(cmbEvent, "Event", events, "name", vehicleallocation.eventId.name);
    fillCombo(cmbRegBy, "", employees, "callingname", vehicleallocation.employeeId.callingname);

    disableButtons(true, false, false);
    disableFields();
    setStyle(valid);

    if(vehicleallocation.description == null){
        txtDescription.style.border = initial;
    }

}

function cmbReservationCH() {

    package =  httpRequest("../providerpackage/vehbyreservation?reservationid="+JSON.parse(cmbRes.value).id, "GET");
    fillCombo(cmbPkg, "Select Package", package, "name", "");

    var events = httpRequest("/event/reservedevents?&reservationid="+JSON.parse(cmbRes.value).id,"GET");
    fillCombo(cmbEvent, "Select Event", events, "name", "");

}

function cmbPkgCH() {



}

function cmbEventCH(){
    var events = httpRequest("/eventreservation/reservedeventsbypkg?&reservationid="+JSON.parse(cmbRes.value).id+"&eventid="+JSON.parse(cmbEvent.value).id,"GET");
    console.log(events.eventdate);
    console.log(JSON.parse(cmbRes.value).id)
    console.log(JSON.parse(cmbEvent.value).id)

    dteEventDate.value = events.eventdate;
    vehicleallocation.eventdate = dteEventDate.value;
    dteEventDate.style.border = valid;

    timStart.value = events.starttime;
    vehicleallocation.starttime = timStart.value;
    timStart.style.border = valid;

    timEnd.value = events.endtime;
    vehicleallocation.endtime = timEnd.value;
    timEnd.style.border = valid;
    console.log(timStart.value)

    //fill vehicle combo
    var vtype = JSON.parse(cmbPkg.value).name.split("-");
   console.log(vtype[2])
    //var availablevehicles = httpRequest("/vehicle/listbyavailable?date="+dteEventDate.value+"&stime="+timStart.value+"&etime="+timEnd.value+"&vtype="+vtype[2],"GET");
    var availablevehicles = httpRequest("/vehicle/listbyavailable?date="+dteEventDate.value+"&vtype="+vtype[2],"GET");
    fillCombo3(cmbVehicle, "Select Vehicle", availablevehicles, "vnumber","vname", "");

     var availabledrivers = httpRequest("/employee/drvlistbyavailable?eventdate="+dteEventDate.value,"GET");
    fillCombo(cmbDriver, "Select Driver", availabledrivers, "callingname", "");

}

function loadVehicles() {
    /*var availabledrivers = httpRequest("/driver/listbyavailable?date="+dteEventDate.value+"&stime="+timStart.value+"&etime="+timEnd.value,"GET");
    fillCombo(cmbDriver, "Select Driver", availabledrivers, "callingname", "");
*/

}

function getUpdates() {

    var updates = "";

    if (vehicleallocation != null && oldvehicleallocation != null) {
        if (vehicleallocation.reservationId.regno != oldvehicleallocation.reservationId.regno)
            updates = updates + "\nReservation is Changed";

        if (vehicleallocation.eventId.name != oldvehicleallocation.eventId.name)
            updates = updates + "\nEvent is Changed";

        if (vehicleallocation.eventdate != oldvehicleallocation.eventdate)
            updates = updates + "\nEvent Date is Changed";

        if (vehicleallocation.starttime != oldvehicleallocation.starttime)
            updates = updates + "\nStart Time is Changed";

        if (vehicleallocation.endtime  != oldvehicleallocation.endtime )
            updates = updates + "\nEnd Time is Changed";

        if(isEqual(vehicleallocation.allocatedVehicleList,oldvehicleallocation.allocatedVehicleList,"vehicleId"))
            updates = updates + "\n Vehicles are Changed";

        if(isEqual(vehicleallocation.allocatedVehicleList,oldvehicleallocation.allocatedVehicleList,"driverId"))
            updates = updates + "\n Drivers are Changed";
    }
    return updates;

}

function btnUpdateMC() {
    var errors = getErrors();
    if (errors == "") {
        var updates = getUpdates();
        if (updates == "")
            swal({
                title: 'Nothing Updated..!', icon: "warning",
                text: '\n',
                button: false,
                timer: 1200
            });
        else {
            swal({
                title: "Are you sure to update following Allocation details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/vehicleallocation", "PUT", vehicleallocation);
                        if (response == "0") {
                            swal({
                                position: 'center',
                                icon: 'success',
                                title: 'Your work has been Done \n Update SuccessFully..!',
                                text: '\n',
                                button: false,
                                timer: 1200
                            });
                            loadForm();
                            loadSearchedTable();

                        } else window.alert("Failed to Update as \n\n" + response);
                    }
                });
        }
    } else
        swal({
            title: 'You have following errors in your form', icon: "error",
            text: '\n ' + getErrors(),
            button: true
        });

}

function btnDeleteMC(vallo) {
    vehicleallocation = JSON.parse(JSON.stringify(vallo));

    swal({
        title: "Are you sure to delete following Allocation...?",
        text: "\n Reservation : " + vehicleallocation.reservationId.regno +
            "\n Event : " + vehicleallocation.eventId.name +
            "\n Event Date: " + vehicleallocation.eventdate +
            "\n Start Time : " + vehicleallocation.starttime +
            "\n End Time : " + vehicleallocation.endtime,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/vehicleallocation", "DELETE", vehicleallocation);
            if (responce == 0) {
                swal({
                    title: "Deleted Successfully....!",
                    text: "\n\n  Status change to delete",
                    icon: "success", button: false, timer: 1200,
                });
                loadForm();
                loadSearchedTable();
            } else {
                swal({
                    title: "You have following erros....!",
                    text: "\n\n" + responce,
                    icon: "error", button: true,
                });
            }
        }
    });

}

function loadSearchedTable() {

    var searchtext = txtSearchName.value;

    var query = "&searchtext=";

    if (searchtext != "")
        query = "&searchtext=" + searchtext;
    //window.alert(query);
    loadTable(activepage, cmbPageSize.value, query);

    disableButtons(false, true, true);

}

function btnSearchMC() {
    activepage = 1;
    loadSearchedTable();
}

function btnSearchClearMC() {
    loadView();
}

function btnPrintTableMC(vallo) {

    var newwindow = window.open();
    formattab = tblVehicleAllocation.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../plugin/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Allocation Details : </h1></div>" +
        "<div>" + formattab + "</div>" +
        "</body>" +
        "</html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}

function sortTable(cind) {
    cindex = cind;

    var cprop = tblVehicleAllocation.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        vehicleallocations.sort(
            function (a, b) {
                if (a[cprop] < b[cprop]) {
                    return -1;
                } else if (a[cprop] > b[cprop]) {
                    return 1;
                } else {
                    return 0;
                }
            }
        );
    } else {
        vehicleallocations.sort(
            function (a, b) {
                if (a[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)] < b[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)]) {
                    return -1;
                } else if (a[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)] > b[cprop.substring(0, cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.') + 1)]) {
                    return 1;
                } else {
                    return 0;
                }
            }
        );
    }
    fillTable('tblVehicleAllocation', vehicleallocations, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblVehicleAllocation);

    if (activerowno != "") selectRow(tblVehicleAllocation, activerowno, active);



}