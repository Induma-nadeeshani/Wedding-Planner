window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    txtSearchName.addEventListener("keyup", btnSearchMC);

    privilages = httpRequest("../privilage?module=Driver", "GET");

    dstatuses = httpRequest("../dstatus/list", "GET");
    employees = httpRequest("../employee/list", "GET");

    driverslist = httpRequest("../employee/listbydesignation","GET");
    //console.log("111",driverslist);

    //Apply select2 into select box
    $(".js-example-basic-single").select2({
        placeholder: " Select the Employee",
        allowClear: true
    });

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
    drivers = new Array();
    var data = httpRequest("/driver/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) drivers = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblDriver', drivers, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblDriver);
    selectDeleteRow();

    if (activerowno != "") selectRow(tblDriver, activerowno, active);

}

function selectDeleteRow() {
    for (index in drivers) {
        if (drivers[index].dstatusId.name == "Deleted") {
            tblDriver.children[1].children[index].style.color = "#f00";
            tblDriver.children[1].children[index].style.border = "2px solid red";
            tblDriver.children[1].children[index].lastChild.children[1].disabled = true;
            tblDriver.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";
        }
    }
}

function paginate(page) {
    var paginate;
    if (olddriver == null) {
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

function viewitem(drv, rowno) {

    driver = JSON.parse(JSON.stringify(drv));

    tdnum.setAttribute('value', driver.regno);
    tddstatus.innerHTML = driver.dstatusId.name;
    tddname.innerHTML = driver.dname;
    tdnic.innerHTML = driver.nic;
    tddmobile.innerHTML = driver.dmobile;
    tdlicense.innerHTML = driver.licenseno;
    tdperday.innerHTML = driver.chargeperday;
    tddescript.innerHTML = driver.description;
}

function printRow() {
    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<body><div style='margin-top: 150px'><h1>Driver Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}

function loadForm() {
    driver = new Object();
    olddriver = null;

    fillCombo(cmbDrvStatus, "Driver Status", dstatuses, "name", "Active");
    fillCombo(cmbRegBy, "", employees, "callingname", "admin");
    fillCombo(cmbEmpNumber,"",driverslist,"callingname","");
    
    driver.dstatusId=JSON.parse(cmbDrvStatus.value);
    driver.employeeId = JSON.parse(cmbRegBy.value);

    var today = new Date();
    dteRegDate.value = getDate(today);
    driver.regdate = dteRegDate.value;

    // Get Next Number Form Data Base
    var drv = httpRequest("/driver/nextnumber", "GET");
    txtNumber.value = drv.regno;
    driver.regno = txtNumber.value;
    txtNumber.disabled = true;

    txtDrvName.value = "";
    txtNIC.value = "";
    cmbEmpNumber.value = "";
    txtLicenseNo
    txtPerDay.value = "";
    txtDescription.value = "";
    txtDrvMobile.value = "";
    //removeFileValue();//to Remove flePhoto

    setStyle(initial);
         txtNumber.style.border = valid;
         dteRegDate.style.border=valid;
         cmbRegBy.style.border=valid;
         cmbDrvStatus.style.border=valid;

    disableButtons(false, true, true);
}

function setStyle(style) {

    cmbRegBy.style.border = style;
    dteRegDate.style.border = style;
    txtNumber.style.border = style;
    cmbEmpNumber.style.border = style;
    txtDrvName.style.border = style;
    txtNIC.style.border = style;
    txtDrvMobile.style.border = style;
    cmbDrvStatus.style.border = style;
    txtLicenseNo.style.border = style;
    txtPerDay.style.border = style;
    txtDescription.style.border = style;

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

function disableFields() {
    var type = JSON.parse(cmbEmpNumber.value);
    if (chargeperday){
        txtPerDay.setAttribute("disabled","disabled");
        txtNIC.setAttribute("disabled","disabled");
        txtDrvMobile.setAttribute("disabled","disabled");
        flePhoto.setAttribute("disabled","disabled");

    }

}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (driver.dname == null){
        errors = errors + "\n" + "Driver Name is Not Entered";
        txtDrvName.style.border = invalid;
    }else
        addvalue = 1;

    if (driver.dmobile == null){
        errors = errors + "\n" + "Driver Mobile is Not Entered";
        txtDrvMobile.style.border = invalid;
    }else
        addvalue = 1;

    if (driver.licenseno == null){
        errors = errors + "\n" + "Driver's License Number is Not Entered";
        txtLicenseNo.style.border = invalid;
    }
    else addvalue = 1;

    if (driver.nic == null){
        errors = errors + "\n" + "NIC is Invalid";
        txtNIC.style.border = invalid;
    }
    else addvalue = 1;


    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (txtPerDay.value == "" || txtDescription.value == "" || flePhoto.value == null || cmbEmpNumber.value == "") {
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
        title: "Are you sure to add following Driver...?",
        text: "\nReg No : " + driver.regno +
            "\nDriver Status : " + driver.dstatusId.name +
            "\nDriver Name : " + driver.dname +
            "\nNIC : " + driver.nic+
            "\nDriver Mobile : " + driver.dmobile +
            "\nDriver's License No. : " + driver.licenseno ,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/driver", "POST", driver);
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

    if (olddriver == null && addvalue == "") {
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

function fillForm(drv, rowno) {
    activerowno = rowno;

    if (olddriver == null) {
        filldata(drv);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(drv);
                viewForm();
            }

        });
    }

}

function filldata(drv) {
    viewForm();
    clearSelection(tblDriver);
    selectDeleteRow();
    selectRow(tblDriver, activerowno, active);

    driver = JSON.parse(JSON.stringify(drv));
    olddriver = JSON.parse(JSON.stringify(drv));

    txtNumber.value = driver.regno;
    txtNumber.disabled = "disabled";
    cmbRegBy.value = driver.employeeId.callingname;
    cmbRegBy.disabled = "disabled";
    dteRegDate.value = driver.regdate;
    dteRegDate.disabled = "disabled";
    //Employee No. & Photo.................
    cmbDrvStatus.value = driver.dstatusId.name;
    txtDrvName.value = driver.dname;
    txtNIC.value = driver.nic;
    txtDrvMobile.value = driver.dmobile;
    txtLicenseNo.value = driver.licenseno;
    txtPerDay.value = driver.chargeperday;
    txtDescription.value = driver.description;

    fillCombo(cmbDrvStatus, "Driver Status", dstatuses, "name", driver.dstatusId.name);
    fillCombo(cmbRegBy, "", employees, "callingname", driver.employeeId.callingname);
    //fillCombo(cmbEmpNumber, "", driverslist, "name", driver.employeeId.callingname);

    disableButtons(true, false, false);
    setStyle(valid);

    if(driver.description == null){
        txtDescription.style.border = initial;
    }
}

function getUpdates() {

    var updates = "";

    if (driver != null && olddriver != null) {

        //Employee No & Photo
        if (driver.dstatusId.name != olddriver.dstatusId.name)
            updates = updates + "\nDriver Status is Changed";

        if (driver.dname != olddriver.dname)
            updates = updates + "\nDriver Name is Changed";

        if (driver.nic != olddriver.nic)
            updates = updates + "\nNIC is Changed";

        if (driver.dmobile != olddriver.dmobile)
            updates = updates + "\nDriver Mobile is Changed";

        if (driver.licenseno != olddriver.licenseno)
            updates = updates + "\nDriver Licence Number is Changed";

        if (driver.chargeperday != olddriver.chargeperday)
            updates = updates + "\nCharge per Day is Changed";

        if (driver.description != olddriver.description)
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
                title: "Are you sure to update following driver details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/driver", "PUT", driver);
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

function btnDeleteMC(drv) {
    driver = JSON.parse(JSON.stringify(drv));

    swal({
        title: "Are you sure to delete following Driver...?",
        text: "\n Driver Number : " + driver.regno +
            "\n Driver Name : " + driver.dname +
            "\n Driver Type : " + driver.nic +
            "\n Driver Status : " + driver.dstatusId.name,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/driver", "DELETE", driver);
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

function btnPrintTableMC(driver) {

    var newwindow = window.open();
    formattab = tblDriver.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../plugin/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Driver Details : </h1></div>" +
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

    var cprop = tblDriver.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        drivers.sort(
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
        drivers.sort(
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
    fillTable('tblDriver', drivers, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblDriver);
    selectDeleteRow();

    if (activerowno != "") selectRow(tblDriver, activerowno, active);


}