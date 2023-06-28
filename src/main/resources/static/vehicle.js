window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    txtSearchName.addEventListener("keyup", btnSearchMC);
    chkDriver.addEventListener("change", chkDriverMC);
    cmbVCategory.addEventListener("change", cmbVCategoryCH);
    cmbBrand.addEventListener("change", cmbBrandCH);
    cmbBrand.addEventListener("change", fillName);

    privilages = httpRequest("../privilage?module=Vehicle", "GET");

    vstatuses = httpRequest("../vstatus/list", "GET");
    vcategories = httpRequest("../vcategory/list", "GET");
    vmodels = httpRequest("../vmodel/list", "GET");
    brands = httpRequest("../brand/list", "GET");
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
    vehicles = new Array();
    var data = httpRequest("/vehicle/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) vehicles = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblVehicle', vehicles, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblVehicle);
    selectDeleteRow();

    if (activerowno != "") selectRow(tblVehicle, activerowno, active);

}

function selectDeleteRow() {
    for (index in vehicles) {
        if (vehicles[index].vstatusId.name == "Deleted") {
            tblVehicle.children[1].children[index].style.color = "#f00";
            tblVehicle.children[1].children[index].style.border = "2px solid red";
            tblVehicle.children[1].children[index].lastChild.children[1].disabled = true;
            tblVehicle.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";
        }
    }
}

function paginate(page) {
    var paginate;
    if (oldvehicle == null) {
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

function viewitem(veh, rowno) {

    // vehicle = JSON.parse(JSON.stringify(veh));
    //
    // tdnum.setAttribute('value',vehicle.number);
    // tdfname.innerHTML = vehicle.fullname;
    // tdcname.innerHTML = vehicle.callingname;
    // tddob.innerHTML = vehicle.dobirth;
    // tdnic.innerHTML = vehicle.nic;
    // tdaddress.innerHTML = vehicle.address;
    // tdmobile.innerHTML = vehicle.mobile;
    // tdland.innerHTML = vehicle.land;
    // tdasdate.innerHTML = vehicle.regdate;
    // tddesc.innerHTML = vehicle.description;
    // tdphoto.src = atob(vehicle.photo);
    // tddesg.innerHTML = vehicle.designationId.name;
    // tdcvstatus.innerHTML = vehicle.civilstatusId.name;
    // tdgender.innerHTML = vehicle.genderId.name;
    // tdestatus.innerHTML = vehicle.vehiclestatusId.name;

    var format = printformtable.outerHTML;

    var newwindow=window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<body><div style='margin-top: 150px'><h1>Vehicle Details :</h1></div>" +
        "<div>"+format+"</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {newwindow.print(); newwindow.close();},100);
}

function loadForm() {
    vehicle = new Object();
    oldvehicle = null;

    fillCombo(cmbVCategory, "Vehicle Category", vcategories, "name", "");
    fillCombo(cmbVModel, "Vehicle Model", vmodels, "name", "");
    fillCombo(cmbBrand, "Vehicle Brand", brands, "name", "");
    fillCombo(cmbVStatus, "", vstatuses, "name", "Active");
    fillCombo(cmbRegBy, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    vehicle.vstatusId = JSON.parse(cmbVStatus.value);
    vehicle.employeeId = JSON.parse(cmbRegBy.value);

    var today = new Date();
    dteRegDate.value = getDate(today);
    vehicle.regdate = dteRegDate.value;

    txtVName.value = "";
    txtStartRate.value = "";
    txtPerHour.value = "";
    txtDrvNumber.value = "";
    txtDescription.value = "";
    removeFileValue();
    txtDrvNumber.disabled = "disabled";
    cmbVStatus.disabled = "disabled";
    txtVName.disabled = true;

    $('#chkDriver').bootstrapToggle('on');
    vehicle.withoutdriver = true;

    setStyle(initial);
    cmbVStatus.style.border = valid;
    dteRegDate.style.border = valid;
    cmbRegBy.style.border = valid;

    disableButtons(false, true, true);
}

function chkDriverMC() {
 if(chkDriver.checked)
    txtDrvNumber.disabled = true;
 else
     txtDrvNumber.disabled = false;
    //spanDrv.setAttribute("style","color:red");
}

function fillName() {
   var brand = JSON.parse(cmbBrand.value).name;
   var model = JSON.parse(cmbVModel.value).name;

   txtVName.value = brand + " " + model;
    txtVName.disabled = false;
}

function cmbVCategoryCH() {
    var brand = httpRequest("../vehicle/bycategory?categoryid="+JSON.parse(cmbVCategory.value).id,"GET");
    fillCombo(cmbBrand, "Vehicle Brand", brand, "name", "");

}

function cmbBrandCH() {
    var model = httpRequest("../vehicle/bybrand?brandid="+JSON.parse(cmbBrand.value).id,"GET");
    fillCombo(cmbVModel, "Vehicle Model", model, "name", "");

}

function setStyle(style) {

    txtNumber.style.border = style;
    cmbRegBy.style.border = style;
    dteRegDate.style.border = style;
    txtVName.style.border = style;
    cmbVStatus.style.border = style;
    cmbVCategory.style.border = style;
    cmbVModel.style.border = style;
    cmbBrand.style.border = style;
    txtStartRate.style.border = style;
    txtPerHour.style.border = style;
    chkDriver.style.border = style;
    txtDrvNumber.style.border = style;
    txtDescription.style.border = style;

}

function removeFileValue() {
    $('#flePhoto').val('');
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

    if (vehicle.vname == null) {
        errors = errors + "\n" + "Vehicle Name is Not Entered";
        txtVName.style.border = invalid;
    } else addvalue = 1;

    if (vehicle.vstatusId == null) {
        errors = errors + "\n" + "Vehicle Status is Not Selected";
        cmbVStatus.style.border = invalid;
    } else addvalue = 1;

    if (vehicle.vcategoryId == null) {
        errors = errors + "\n" + "Vehicle Category is Not Selected";
        cmbVCategory.style.border = invalid;
    } else addvalue = 1;

    if (vehicle.brandId == null) {
        errors = errors + "\n" + "Vehicle Calling Name Enter";
        cmbBrand.style.border = invalid;
    } else addvalue = 1;

    if (vehicle.startingrate == null) {
        errors = errors + "\n" + "Starting Rate is Not Entered";
        txtStartRate.style.border = invalid;
    } else addvalue = 1;

    if (vehicle.priceperhour == null) {
        errors = errors + "\n" + "Price Per Hours is Not Entered";
        txtPerHour.style.border = invalid;
    } else addvalue = 1;

    return errors;

}

function btnAddMC() {
    if(chkDriver.checked){
        vehicle.withoutdriver = true;
    }else
        vehicle.withoutdriver = false;

    if (getErrors() == "") {
        if (txtDrvNumber.value == "" || txtDescription.value == "") {
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
        title: "Are you sure to add following vehicle...?",
        text: "\nNumber : " + vehicle.number +
            "\nVehicle Name : " + vehicle.vname +
            "\nVehicle Status : " + vehicle.vstatusId.name +
            "\nVehicle Category : " + vehicle.vcategoryId.name +
            "\nVehicle Brand : " + vehicle.brandId.name +
            "\nStarting Rate : " + vehicle.startingrate +
            "\nPrice Per Hour : " + vehicle.priceperhour,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/vehicle", "POST", vehicle);
            if (response == "0") {
                swal({
                    position: 'center',
                    icon: 'success',
                    title: 'Your work has been Done \n Save SuccessFully..!',
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
    //Get Cofirmation from the User window.confirm();
    checkerr = getErrors();


    if (oldvehicle == null && addvalue == "") {
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

function fillForm(veh, rowno) {
    activerowno = rowno;

    if (oldvehicle == null) {
        filldata(veh);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(veh);
            }

        });
    }

}

function filldata(veh) {
    viewForm();
    clearSelection(tblVehicle);
    selectDeleteRow();
    selectRow(tblVehicle, activerowno, active);

    vehicle = JSON.parse(JSON.stringify(veh));
    oldvehicle = JSON.parse(JSON.stringify(veh));

    txtNumber.value = vehicle.number;
    txtNumber.disabled = "disabled";
    cmbRegBy.value = vehicle.employeeId;
    cmbRegBy.disabled = "disabled";
    dteRegDate.value = vehicle.regdate;
    dteRegDate.disabled = "disabled";

    txtVName.value = vehicle.vname;
    txtStartRate.value = vehicle.startingrate;
    txtPerHour.value = vehicle.priceperhour;
    txtDescription.value = vehicle.description;

    fillCombo(cmbBrand, "Vehicle Brand", brands, "name", vehicle.vmodelId.brandId.name);
    fillCombo(cmbVCategory, "Vehicle Category", vcategories, "name", vehicle.vmodelId.vcategoryId.name);
    //fillCombo(cmbVModel, "Vehicle Model", vmodels, "name", vehicle.civilstatusId.name);
    fillCombo(cmbVStatus, "", vstatuses, "name", vehicle.vstatusId.name);

    setDefaultFile('flePhoto', vehicle.photo);

    disableButtons(true, false, false);
    setStyle(valid);

    if (vehicle.description == null) {
        txtDescription.style.border = initial;
        txtDescription.value = "";
    }

    if (vehicle.driverId == null) {
        txtDrvNumber.style.border = initial;
        txtDrvNumber.value = "";
    }
}

function getUpdates() {

    var updates = "";

    if (vehicle != null && oldvehicle != null) {

        if (vehicle.number != oldvehicle.number)
            updates = updates + "\nNumber is Changed";

        if (vehicle.vname != oldvehicle.vname)
            updates = updates + "\nVehicle Name is Changed";


        if (vehicle.vcategoryId.name != oldvehicle.vcategoryId.name)
            updates = updates + "\nVehicle Category is Changed";

        if (vehicle.brandId.name != oldvehicle.brandId.name)
            updates = updates + "\nVehicle Brand is Changed";

        if (vehicle.startingrate != oldvehicle.startingrate)
            updates = updates + "\nStarting Rate is Changed";


        if (vehicle.priceperhour != oldvehicle.priceperhour)
            updates = updates + "\nPrice Per Hour is Changed";

        if (vehicle.photo != oldvehicle.photo)
            updates = updates + "\nPhoto is Changed";

        if (vehicle.description != oldvehicle.description)
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
                title: "Are you sure to update following Vehicle details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/vehicle", "PUT", vehicle);
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

function btnDeleteMC(veh) {
    vehicle = JSON.parse(JSON.stringify(veh));

    swal({
        title: "Are you sure to delete following vehicle...?",
        text: "\n Vehicle Number : " + vehicle.number +
            "\n Vehicle Name : " + vehicle.vname +
            "\n Vehicle Status : " + vehicle.vstatusId.name +
            "\n Vehicle Category : " + vehicle.vcategoryId.name +
            "\n Vehicle Brand : " + vehicle.brandId.name +
            "\n Starting Rate : " + vehicle.startingrate +
            "\n Price Per Hour : " + vehicle.priceperhour,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/vehicle", "DELETE", vehicle);
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

function btnPrintTableMC(vehicle) {

    var newwindow = window.open();
    formattab = tblVehicle.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../plugin/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Vehicle Details : </h1></div>" +
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

    var cprop = tblVehicle.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        vehicles.sort(
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
        vehicles.sort(
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
    fillTable('tblVehicle', vehicles, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblVehicle);
    selectDeleteRow();

    if (activerowno != "") selectRow(tblVehicle, activerowno, active);


}