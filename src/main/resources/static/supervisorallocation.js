window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    cmbRes.addEventListener("change", cmbReservationCH);
    cmbEvent.addEventListener("change", fillDetails);
    txtSearchName.addEventListener("keyup", btnSearchMC);
   // timEnd.addEventListener("change", loadSupervisors);

    privilages = httpRequest("../privilage?module=SupervisorAllocation", "GET");

    reservations = httpRequest("../reservation/listbystatus", "GET");
    events = httpRequest("../event/list", "GET");
    supervisors = httpRequest("../employee/supervisorlist", "GET");
    employees = httpRequest("../employee/list", "GET");

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
    supervisorallocations = new Array();

    var data = httpRequest("/supervisorallocation/findAll?page=" + page + "&size=" + size + query, "GET");

    if (data.content != undefined)
        supervisorallocations = data.content;

    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblSupervisorAllocation', supervisorallocations, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblSupervisorAllocation);

    if (activerowno != "") selectRow(tblSupervisorAllocation, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldsupervisorallocation == null) {
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

    supervisorallocation = JSON.parse(JSON.stringify(vehallo));

    tdresno.innerHTML = supervisorallocation.reservationId.regno;
    tdevent.innerHTML = supervisorallocation.eventId.name;
    tdeventdate.innerHTML = supervisorallocation.eventdate;
    tdstime.innerHTML = supervisorallocation.starttime;
    tdetime.innerHTML = supervisorallocation.endtime;
    tdsup.innerHTML = supervisorallocation.supervisorId.callingname;

}

function printRow() {

    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<body><div style='margin-top: 150px'><h1>Customer Payment Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}

function loadForm() {
    supervisorallocation = new Object();
    oldsupervisorallocation = null;

    fillCombo3(cmbRes, "Select Reservation", reservations, "regno", "customerId.cname");
    fillCombo(cmbEvent, "Select Event ", events, "name", "");
    fillCombo(cmbSupervisor, "Select Supervisor ", supervisors, "callingname", "");
    fillCombo(cmbRegBy, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    supervisorallocation.employeeId = JSON.parse(cmbRegBy.value);

    //Autofill date
    var today = new Date();
    dteRegDate.value = getDate(today);
    supervisorallocation.reserveddate = dteRegDate.value;

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
    cmbEvent.style.border = style;
    dteEventDate.style.border = style;
    timStart.style.border = style;
    timEnd.style.border = style;
    txtDescription.style.border = style;
    cmbSupervisor.style.border = style;

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

function getErrors() {

    var errors = "";
    addvalue = "";

    if (supervisorallocation.reservationId  == null){
        errors = errors + "\n" + "Reservation is Not Selected";
        cmbRes.style.border = invalid;
    }else
        addvalue = 1;

    if (supervisorallocation.eventId == null){
        errors = errors + "\n" + "Event is Not Selected";
        cmbEvent.style.border = invalid;
    }else
        addvalue = 1;

    if (supervisorallocation.eventdate == null){
        errors = errors + "\n" + "Event Date is Not Entered";
        dteEventDate.style.border = invalid;
    }else
        addvalue = 1;

    if (supervisorallocation.starttime == null){
        errors = errors + "\n" + "Start Time  is Not Entered";
        timStart.style.border = invalid;
    }else
        addvalue = 1;

    if (supervisorallocation.endtime  == null){
        errors = errors + "\n" + "End Time is Not Entered";
        timEnd.style.border = invalid;
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
        text: "\nReservation ID : " + supervisorallocation.reservationId.regno +
            "\nEvent : " + supervisorallocation.eventId.name+
             "\nSupervisor : " + supervisorallocation.supervisorId.callingname+
            "\nEvent Date : " + supervisorallocation.eventdate+
            "\nStart Time : " + supervisorallocation.starttime+
            "\nEnd Time : " + supervisorallocation.endtime,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/supervisorallocation", "POST", supervisorallocation);
            if (response == "0") {
                swal({
                    position: 'center',
                    icon: 'success',
                    title: 'Your work has been Done \n Saved Successfully..!',
                    text: '\n',
                    button: false,
                    timer: 1200
                });

                location.reload();
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

    if (oldsupervisorallocation == null && addvalue == "") {
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

function fillForm(supallo, rowno) {
    activerowno = rowno;

    if (oldsupervisorallocation == null) {
        filldata(sp);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(supallo);
                viewForm();
            }

        });
    }

}

function filldata(supallo) {
    viewForm();
    clearSelection(tblSupervisorAllocation);
    selectRow(tblSupervisorAllocation, activerowno, active);

    supervisorallocation = JSON.parse(JSON.stringify(supallo));
    oldsupervisorallocation = JSON.parse(JSON.stringify(supallo));

    cmbRegBy.value = supervisorallocation.employeeId.callingname;
    cmbRegBy.disabled = "disabled";
    dteRegDate.value = supervisorallocation.reserveddate;
    dteRegDate.disabled = "disabled";

    cmbRes.value = supervisorallocation.reservationId.regno;
    cmbEvent.value = supervisorallocation.eventId.name;
    dteEventDate.value = supervisorallocation.eventdate;
    timStart.value = supervisorallocation.starttime;
    timEnd.value = supervisorallocation.endtime;
    //txtDescription.value = supervisorallocation.description;

    fillCombo(cmbRes, "Reservation", reservations, "regno", supervisorallocation.reservationId .regno);
    fillCombo(cmbEvent, "Event", events, "name", supervisorallocation.eventId.name);
    fillCombo(cmbRegBy, "", employees, "callingname", supervisorallocation.employeeId.callingname);

    disableButtons(true, false, false);
    disableFields();
    setStyle(valid);

    if(supervisorallocation.description == null){
        txtDescription.style.border = initial;
    }

}

function cmbReservationCH() {
    var events = httpRequest("/event/reservedevents?&reservationid="+JSON.parse(cmbRes.value).id,"GET");
    fillCombo(cmbEvent, "Select Event", events, "name", "");

}

function fillDetails() {

    var eventres = httpRequest("/eventreservation/reservedeventsbypkg?&reservationid="+JSON.parse(cmbRes.value).id+"&eventid="+JSON.parse(cmbEvent.value).id,"GET");

    dteEventDate.value = eventres.eventdate;
    supervisorallocation.eventdate =  dteEventDate.value;
    dteEventDate.style.border = valid;

    timStart.value = eventres.starttime;
    supervisorallocation.starttime =  timStart.value;
    timStart.style.border = valid;

    timEnd.value = eventres.endtime;
    supervisorallocation.endtime =  timEnd.value;
    timEnd.style.border = valid;
    //console.log(dteEventDate.value)

    var supervisors = httpRequest("/employee/listbysupavailable?date="+dteEventDate.value,"GET");
    fillCombo(cmbSupervisor, "Select Supervisor", supervisors, "callingname", "");

    // var supervisors = httpRequest("/employee/listbyavailability?date="+dteEventDate.value,"GET");
    // fillCombo(cmbSupervisor, "Select Supervisor", supervisors, "callingname", "");


}
function loadSupervisors() {
    var availablesupervisors = httpRequest("/employee/listbyavailable?&stime="+dteEventDate.value,"GET");

    }

function getUpdates() {

    var updates = "";

    if (supervisorallocation != null && oldsupervisorallocation != null) {
        if (supervisorallocation.reservationId.regno != oldsupervisorallocation.reservationId.regno)
            updates = updates + "\nReservation is Changed";

        if (supervisorallocation.eventId.name != oldsupervisorallocation.eventId.name)
            updates = updates + "\nEvent is Changed";

        if (supervisorallocation.eventdate != oldsupervisorallocation.eventdate)
            updates = updates + "\nEvent Date is Changed";

        if (supervisorallocation.starttime != oldsupervisorallocation.starttime)
            updates = updates + "\nStart Time is Changed";

        if (supervisorallocation.endtime  != oldsupervisorallocation.endtime)
            updates = updates + "\nEnd Time is Changed";

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
                        var response = httpRequest("/supervisorallocation", "PUT", supervisorallocation);
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

function btnDeleteMC(supallo) {
    supervisorallocation = JSON.parse(JSON.stringify(supallo));

    swal({
        title: "Are you sure to delete following Allocation...?",
        text: "\n Reservation : " + supervisorallocation.reservationId.regno +
            "\n Event : " + supervisorallocation.eventId.name +
            "\n Event Date: " + supervisorallocation.eventdate +
            "\n Start Time : " + supervisorallocation.starttime +
            "\n End Time : " + supervisorallocation.endtime,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/supervisorallocation", "DELETE", supervisorallocation);
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

function btnPrintTableMC(supallo) {

    var newwindow = window.open();
    formattab = tblSupervisorAllocation.outerHTML;

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

    var cprop = tblSupervisorAllocation.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        supervisorallocations.sort(
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
        supervisorallocations.sort(
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
    fillTable('tblSupervisorAllocation', supervisorallocations, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblSupervisorAllocation);

    if (activerowno != "") selectRow(tblSupervisorAllocation, activerowno, active);



}