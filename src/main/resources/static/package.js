
window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    txtSearchName.addEventListener("keyup", btnSearchMC);

    privilages = httpRequest("../privilage?module=Package", "GET");

    pkgstatuses = httpRequest("../pkgstatus/list", "GET");
    events = httpRequest("../event/list", "GET");
    services = httpRequest("../service/list", "GET");
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
    packages = new Array();

    var data = httpRequest("/package/findAll?page=" + page + "&size=" + size + query, "GET");

    if (data.content != undefined)
        packages = data.content;

    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblPackage', packages, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblPackage);
    selectDeleteRow();

    if (activerowno != "") selectRow(tblPackage, activerowno, active);

}

function selectDeleteRow() {
    for (index in packages) {
        if (packages[index].pkgstatusId.name == "Deleted") {
            tblPackage.children[1].children[index].style.color = "#f00";
            tblPackage.children[1].children[index].style.border = "2px solid red";
            tblPackage.children[1].children[index].lastChild.children[1].disabled = true;
            tblPackage.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";
        }
    }
}

function paginate(page) {
    var paginate;
    if (oldpackage == null) {
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

function viewitem(res, rowno) {

    package = JSON.parse(JSON.stringify(pkg));

    // tdnum.setAttribute('value', package.regno);
    // tdctype.innerHTML = package.sptypeId.name;
    // tdcstatus.innerHTML = package.spstatusId.name;
    // tdcname.innerHTML = package.name;
    // tdcemail.innerHTML = package.email;
    // tdcmobile.innerHTML = package.mobile;
    // tdcaddress.innerHTML = package.caddress;
    // tddescript.innerHTML = package.description;
    // tdcpname.innerHTML = package.cpname;
    // tdcpemail.innerHTML = package.cpemail;
    // tdnic.innerHTML = package.nic;
    // tdcpmobile.innerHTML = package.cpmobile;
    // tdcpland.innerHTML = package.cpland;
    // //tdcpaddress.innerHTML = package.cpaddress;

    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<body><div style='margin-top: 150px'><h1>Package Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}

function loadForm() {
    package = new Object();
    oldpackage = null;

    package.eventList = new Array();//assosiation list for events
    package.serviceList = new Array();//assosiation list for service

    fillCombo(cmbRegBy, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    fillCombo(cmbPkgStatus, "Package Status", pkgstatuses, "name", "Available");
    fillCombo(cmbEvent, "Event", events, "name", "");
    fillCombo(cmbService, "Service", services, "servicename", "");

    package.pkgstatusId=JSON.parse(cmbPkgStatus.value);
    package.employeeId=JSON.parse(cmbRegBy.value);

    //Autofill date
    var today = new Date();
    dteRegDate.value = getDate(today);
    package.regdate = dteRegDate.value;

    // Get Next Number Form Data Base
    var res = httpRequest("/package/nextnumber", "GET");
    txtNumber.value = res.regno;
    package.regno = txtNumber.value;
    txtNumber.disabled = true;
    cmbPkgStatus.disabled = true;
    cmbPkgStatus.discountedprice = true;

    txtPkgName.value = "";
    txtPriceMin.value = "";
    txtPriceMax.value = "";
    txtDescription.value = "";

    setStyle(initial);
    txtNumber.style.border = valid;
    dteRegDate.style.border=valid;
    cmbRegBy.style.border=valid;
    cmbPkgStatus.style.border=valid;

     disableButtons(false, true, true);
     refreshInnerServiceForm();
     refreshInnerEventForm();
}

//Inner Event Form
function refreshInnerEventForm() {

    event = new Object();

    fillCombo(cmbEvent,"Select Event",events,"name");
    
    cmbEvent.style.border = initial;

    fillInnerTable("tblInnerEvent",package.eventList,modifyInnerEventForm,deleteInnerEventForm);
    btnInnerAdd.removeAttribute("disabled","disabled");

}

function modifyInnerEventForm() {

}

function deleteInnerEventForm() {

}

function getInnerEventErrors() {
    var eventErrors = "";
    addEventvalue = "";

    if (package.eventId == null){
        eventErrors = eventErrors + "\n" + "Event is Not Selected";
        cmbEvent.style.border = invalid;
    }else
        addEventvalue = 1;
    
    return eventErrors;
}

function btnInnerEventAddMC() {
    if (getInnerEventErrors() == "") {
        eventpackage.eventId = JSON.parse(cmbEvent.value);
        
    eventExs = false;
    for (index in package.eventPackageList) {
        if (package.eventPackageList[index].eventId.name == JSON.parse(cmbEvent.value).name ) {
            eventExs = true;
            break;
        }
    }

        if(eventExs){
            swal({
                title: "This Event is Already Selected",
                text:"\n",
                icon:"warning",
                buttons:false,
                timer: 1200,
            });
        }else{
            package.eventList.push(eventpackage);
            refreshInnerEventForm();
            }
    }else{
        swal({
            title: "You have following errors",
            text:"\n" + getInnerEventErrors(),
            icon:"warning",
            buttons:true,

        })
    }
}

function btnInnerEventClearMC() {

    check = getInnerEventErrors();

    if (addEventvalue == ""){

    swal({
        title: "Are you sure to clear this Inner form...?",
        text:"\n",
        icon:"warning",
        buttons:true,

    }).then((willUpdate) => {
        if(willUpdate){
            refreshInnerEventForm();
            }
        });
    }
}

//Inner Service Package Form
function refreshInnerServiceForm() {

    service = new Object();

    fillCombo(cmbService,"Select Service",services,"servicename");
    txtSerCharge.value = "";

    cmbService.style.border = initial;
    txtSerCharge.style.border = initial;

    fillInnerTable("tblInnerService",package.serviceList,modifyInnerServiceForm,deleteInnerServiceForm);

    if(package.serviceList.length != 0) {
        for (index in package.servicePackageList) {
            total = parseFloat(total) + parseFloat(package.serviceList[index].reservedserprice);
        }
    }
    btnInnerServiceAdd.removeAttribute("disabled","disabled");
    btnInnerServiceUpdate.setAttribute("disabled","disabled");

}

function getInnerServiceErrors() {
    var serErr = "";
    addServalue = "";

    if (package.serviceId == null){
        serErr = serErr + "\n" + "Service is Not Selected";
        cmbService.style.border = invalid;
    }else
        addServalue = 1;


    if (package.servicecharge == null){
        serErr = serErr + "\n" + "Service Charge is Not Entered";
        txtSerCharge.style.border = invalid;
    }else
        addServalue = 1;

    return serErr;
}

function btnInnerServiceAddMC() {

    if (getInnerServiceErrors() == "") {

    package.serviceId = JSON.parse(cmbService.value);
    package.servicecharge = txtSerCharge.value;

    serviceExs = false;
    for (index in package.serviceList) {
        if (package.serviceList[index].serviceId.servicename == JSON.parse(cmbService.value).servicename) {

            serviceExs = true;
            break;
        }
    }
    if(serviceExs){
        swal({
            title: "This Service is Already Selected",
            text:"\n",
            icon:"warning",
            buttons:false,
            timer: 1200,
        });
    }else{
        package.serviceList.push(service);
        refreshInnerServiceForm();
        }
    }else{
        swal({
            title: "You have following errors",
            text:"\n" + getInnerErrors(),
            icon:"warning",
            buttons:true,

        })
    }
}

function btnInnerServiceClearMC() {
    check = getInnerErrors();

    if(addServalue == ""){

    swal({
        title: "Are you sure to clear this Inner form...?",
        text:"\n",
        icon:"warning",
        buttons:true,

    }).then((willUpdate) => {
        if(willUpdate){
            refreshInnerServiceForm();
        }
        });
    }
}

function modifyInnerServiceForm() {
    selectedInnerRow = indx;

    fillCombo(cmbService,"Select Service",services,"servicename",package.serviceId.servicename);
    txtSerCharge.value = package.servicecharge;

    cmbService.style.border = valid;
    txtSerCharge.style.border = valid;

    btnInnerServiceAdd.setAttribute("disabled","disabled");
    btnInnerServiceUpdate.removeAttribute("disabled","disabled");
}

function deleteInnerServiceForm(){

}

function btnInnerServiceUpdateMC() {
    innerUpdates = getInnerServiceUpdate(package.serviceList[selectedInnerRow]);

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
                    package.serviceList[selectedInnerRow].serviceId = JSON.parse(cmbService.value);
                    package.serviceList[selectedInnerRow].servicecharge = txtSerCharge.value;
                    refreshInnerEventForm();
                }
            });
    }
}

function getInnerServiceUpdate(servicepackage) {
    var updates = "";
    if(package.serviceId.servicename != JSON.parse(cmbService.value)){
        updates = updates + "\nService is Not Selected";
        cmbService.style.border = updated;
    }

    if(package.servicecharge != txtSerCharge.value){
        updates = updates + "\nService Charge is Not Entered";
        txtSerCharge.style.border = updated;
    }

    return updates;
}



function setStyle(style) {

    txtNumber.style.border = style;
    cmbRegBy.style.border = style;
    dteRegDate.style.border = style;
    cmbPkgStatus.style.border = style;
    txtPkgName.style.border = style;
    txtPriceMin.style.border = style;
    txtPriceMax.style.border = style;
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

function getErrors() {

    var errors = "";
    addvalue = "";

    if (package.name == null){
        errors = errors + "\n" + "Package Name is Not Entered";
        txtPkgName.style.border = invalid;
    }else
        addvalue = 1;

    if (package.name == null){
        errors = errors + "\n" + "Price Range is Not Entered";
        txtPriceMin.style.border = invalid;
    }else
        addvalue = 1;

    if (package.name == null){
        errors = errors + "\n" + "Price Range is Not Entered";
        txtPriceMax.style.border = invalid;
    }else
        addvalue = 1;

    if (package.eventList.length == 0){
        errors = errors + "\n" + "Package Event is not Completed";
    }else
        addvalue = 1;

    if (package.serviceList.length == 0){
        errors = errors + "\n" + "Package Service is not Completed";
    }else
        addvalue = 1;

    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (txtDescription.value == "" || txtDiscount.value == "" ) {
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
        title: "Are you sure to add following Package...?",
        text: "\nReg No : " + package.regno +
            "\nPackage Name : " + package.name +
            "\nPackage Status : " + package.pkgstatusId.name ,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/package", "POST", package);
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

    if (oldpackage == null && addvalue == "") {
        loadForm();
    } else {
        swal({
            title: "Form has some values...! Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                loadForm();
            }

        });
    }
}

function fillForm(res, rowno) {
    activerowno = rowno;

    if (oldpackage == null) {
        filldata(res);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(res);
                viewForm();
            }

        });
    }

}

function filldata(res) {
    viewForm();
    clearSelection(tblPackage);
    selectDeleteRow();
    selectRow(tblPackage, activerowno, active);
    cmbPkgStatus.disabled = false;

    package = JSON.parse(JSON.stringify(res));
    oldpackage = JSON.parse(JSON.stringify(res));

    txtNumber.value = package.regno;
    txtNumber.disabled = false;
    cmbRegBy.value = package.employeeId.callingname;
    cmbRegBy.disabled = "disabled";
    dteRegDate.value = package.regdate;
    dteRegDate.disabled = "disabled";

    cmbPkgStatus.disabled = false;

    cmbPkgStatus.value = package.pkgstatusId.name;
    txtPkgName.value = package.name;
    //txtDescription.value = package.description;

    fillCombo(cmbPkgStatus, "Package Status", pkgstatuses, "name", package.pkgstatusId .name);
    fillCombo(cmbRegBy, "", employees, "callingname", package.employeeId.callingname);

    refreshInnerServiceForm();
    refreshInnerEventForm();

    disableButtons(true, false, false);
    setStyle(valid);

    if(package.description == null){
        txtDescription.style.border = initial;
    }
}

function getUpdates() {

    var updates = "";

    if (package != null && oldpackage != null) {
        if (package.regno != oldpackage.regno)
            updates = updates + "\nPackage Number is Changed";

        if (package.name != oldpackage.name)
            updates = updates + "\nPackage Name is Changed";

        if (package.resstatusId.name != oldpackage.resstatusId.name)
            updates = updates + "\nPackage Status is Changed";

        if(isEqual(package.eventPackageList,oldpackage.eventPackageList,"eventId"))
            updates = updates + "\nReserved Event details are Changed";

        if(isEqual(package.servicePackageList,oldpackage.servicePackageList,"serviceId"))
            updates = updates + "\nReserved Service details are Changed";

        if (package.totalprice  != oldpackage.totalprice )
            updates = updates + "\nPrice Range is Changed";

        if (package.description != oldpackage.description)
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
                    title: "Are you sure to update following Package details...?",
                    text: "\n" + getUpdates(),
                    icon: "warning", buttons: true, dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/package", "PUT", package);
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

function btnDeleteMC(pkg){
        package = JSON.parse(JSON.stringify(pkg));

        swal({
            title: "Are you sure to delete following Package...?",
            text: "\n Package Number : " + package.regno +
                "\n Package Name : " + package.name +
                "\n Package Status : " + package.pkgstatusId.name+
                "\n Price Range : " + package.totalpayable,
            icon: "warning", buttons: true, dangerMode: true,

        }).then((willDelete) => {
            if (willDelete) {
                var responce = httpRequest("/package", "DELETE", package);
                if (responce == 0) {
                    swal({
                        title: "Deleted Successfully....!",
                        text: "\n\n  Status change to deleted",
                        icon: "success", button: false, timer: 1400,
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

function btnPrintTableMC(package) {

        var newwindow = window.open();
        formattab = tblPackage.outerHTML;

        newwindow.document.write("" +
            "<html>" +
            "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
            "<link rel='stylesheet' href='../plugin/bootstrap/css/bootstrap.min.css'/></head>" +
            "<body><div style='margin-top: 150px; '> <h1>Package Details : </h1></div>" +
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

        var cprop = tblPackage.firstChild.firstChild.children[cindex].getAttribute('property');

        if (cprop.indexOf('.') == -1) {
            packages.sort(
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
            packages.sort(
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
        fillTable('tblPackage', packages, fillForm, btnDeleteMC, viewitem);
        clearSelection(tblPackage);
        selectDeleteRow();

        if (activerowno != "") selectRow(tblPackage, activerowno, active);



}