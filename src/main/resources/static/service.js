window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    txtSearchName.addEventListener("keyup", btnSearchMC);

    privilages = httpRequest("../privilage?module=Service", "GET");

    sstatuses = httpRequest("../sstatus/list", "GET");
    stypes = httpRequest("../stype/list","GET");
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
    selectDeleteRow();

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
    services = new Array();
    var data = httpRequest("/service/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) services = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblService', services, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblService);
    selectDeleteRow();

    if (activerowno != "") selectRow(tblService, activerowno, active);

}

function selectDeleteRow() {
    for (index in services) {
        if (services[index].sstatusId.name == "Deleted") {
            tblService.children[1].children[index].style.color = "#f00";
            tblService.children[1].children[index].style.border = "2px solid red";
            tblService.children[1].children[index].lastChild.children[1].disabled = true;
            tblService.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";
        }
    }
}

function paginate(page) {
    var paginate;
    if (oldservice == null) {
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

function viewitem(ser, rowno) {

    service = JSON.parse(JSON.stringify(ser));

    tdnum.setAttribute('value', customer.regno);
    /*tdctype.innerHTML = customer.ctypeId.name;
    tdcstatus.innerHTML = customer.cstatusId.name;
    tdcname.innerHTML = customer.cname;
    tdcemail.innerHTML = customer.cemail;
    tdcregion.innerHTML = customer.cregionId.name;
    tdcmobile.innerHTML = customer.cmobile;
    tdcaddress.innerHTML = customer.caddress;
    tddescript.innerHTML = customer.description;
    tdcpname.innerHTML = customer.cpname;
    tdcpemail.innerHTML = customer.cpemail;
    tdnic.innerHTML = customer.nic;
    tdcpmobile.innerHTML = customer.cpmobile;
    tdcpland.innerHTML = customer.cpland;*/

    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<body><div style='margin-top: 150px'><h1>Service Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}

function loadForm() {
    service = new Object();
    oldservice = null;
    cmbSerStatus.setAttribute("disabled","disabled");

    txtSerCharge.value = "0.0";
    txtSerCharge.style.border = valid;

    fillCombo(cmbSerStatus, "Service Status", sstatuses, "name", "Available");
    fillCombo(cmbSerType, "Service Type", stypes, "name", "");
    fillCombo(cmbRegBy, "", employees, "callingname", "Admin");

    service.employeeId = JSON.parse(cmbRegBy.value);
    service.sstatusId = JSON.parse(cmbSerStatus.value);

    var today = new Date();
    dteRegDate.value = getDate(today);
    service.regdate = dteRegDate.value;

    // Get Next Number Form Data Base
    var ser = httpRequest("/service/nextnumber", "GET");
    txtNumber.value = ser.servicecode;
    service.servicecode = txtNumber.value;
    txtNumber.disabled = true;

    txtSerName.value = "";

    setStyle(initial);
         txtNumber.style.border = valid;
         dteRegDate.style.border=valid;
         cmbRegBy.style.border=valid;
         cmbSerStatus.style.border=valid;

    disableButtons(false, true, true);
}

function setStyle(style) {

    txtNumber.style.border = style;
    cmbRegBy.style.border = style;
    dteRegDate.style.border = style;
    cmbSerType.style.border = style;
    cmbSerStatus.style.border = style;
    txtSerName.style.border = style;
    txtSerCharge.style.border = style;

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

    if (service.stypeId == null){
        errors = errors + "\n" + "Service Type is Not Selected";
        cmbSerType.style.border = invalid;
    }else
        addvalue = 1;

    if (service.servicename == null){
        errors = errors + "\n" + "Service Name is Not Entered";
        txtSerName.style.border = invalid;
    }else
        addvalue = 1;


    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (txtSerCharge.value == "") {
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
        title: "Are you sure to add following Service...?",
        text: "\nService Code : " + service.servicecode +
            "\nService Status : " + service.sstatusId.name +
            "\nService Type : " + service.stypeId.name +
            "\nService Name : " + service.servicename+
            "\nService Charge : " + service.servicecharge ,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/service", "POST", service);
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

    if (oldservice == null && addvalue == "") {
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

function fillForm(ser, rowno) {
    activerowno = rowno;

    if (oldservice == null) {
        filldata(ser);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(ser);
                viewForm();
            }

        });
    }

}

function filldata(ser) {
    viewForm();
    clearSelection(tblService);
    selectDeleteRow();
    selectRow(tblService, activerowno, active);
    cmbSerStatus.removeAttr("disabled","disabled");

    service = JSON.parse(JSON.stringify(ser));
    oldservice = JSON.parse(JSON.stringify(ser));

    txtNumber.value = service.servicecode;
    txtNumber.disabled = "disabled";
    cmbRegBy.value = service.employeeId.callingname;
    cmbRegBy.disabled = "disabled";
    dteRegDate.value = service.regdate;
    dteRegDate.disabled = "disabled";

    cmbSerType.value = service.stypeId.name;
    cmbSerStatus.value = service.sstatusId.name;
    txtSerName.value = service.servicename;
    txtSerCharge.value = service.servicecharge;

    fillCombo(cmbSerStatus, "Service Status", sstatuses, "name", service.sstatusId.name);
    fillCombo(cmbSerType, "Service Type", stypes, "name", service.stypeId.name);
    fillCombo(cmbRegBy, "", employees, "callingname", service.employeeId.callingname);

    disableButtons(true, false, false);
    setStyle(valid);
}

function getUpdates() {

    var updates = "";

    if (service != null && oldservice != null) {

        //Employee No & Photo
        if (service.sstatusId.name != oldservice.sstatusId.name)
            updates = updates + "\nService Status is Changed";

        if (service.stypeId.name != oldservice.stypeId.name)
            updates = updates + "\nService Type is Changed";

        if (service.servicename != oldservice.servicename)
            updates = updates + "\nService Name is Changed";

        if (service.servicecharge != oldservice.servicecharge)
            updates = updates + "\nService Charge is Changed";

        if (service.description != oldservice.description)
            updates = updates + "\nDescription is Changed";
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
                title: "Are you sure to update following service details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/service", "PUT", service);
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

function btnDeleteMC(ser) {
    service = JSON.parse(JSON.stringify(ser));

    swal({
        title: "Are you sure to delete following Service...?",
        text: "\n Service Code : " + service.servicecode +
            "\n Service Name : " + service.servicename +
            "\n Service Type : " + service.stypeId.name +
            "\n Service Charge : " + service.servicecharge +
            "\n Service Status : " + service.sstatusId.name,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/service", "DELETE", service);
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
    selectDeleteRow();

}

function btnSearchMC() {
    activepage = 1;
    loadSearchedTable();
}

function btnSearchClearMC() {
    loadView();
}

function btnPrintTableMC(service) {

    var newwindow = window.open();
    formattab = tblService.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../plugin/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Service Details : </h1></div>" +
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

    var cprop = tblService.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        services.sort(
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
        services.sort(
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
    fillTable('tblService', services, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblService);
    selectDeleteRow();

    if (activerowno != "") selectRow(tblService, activerowno, active);


}