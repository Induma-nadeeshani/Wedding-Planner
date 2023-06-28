window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    txtSearchName.addEventListener("keyup", btnSearchMC);

    cmbSpType.addEventListener("change", disableFields);

    privilages = httpRequest("../privilage?module=ServiceProvider", "GET");

    sptypes = httpRequest("../sptype/list", "GET");
    spstatuses = httpRequest("../spstatus/list", "GET");
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
    serviceproviders = new Array();

    var data = httpRequest("/serviceprovider/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) serviceproviders = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblServiceprovider', serviceproviders, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblServiceprovider);
    selectDeleteRow();

    if (activerowno != "") selectRow(tblServiceprovider, activerowno, active);

}

function selectDeleteRow() {
    for (index in serviceproviders) {
        if (serviceproviders[index].spstatusId.name == "Deleted") {
            tblServiceprovider.children[1].children[index].style.color = "#f00";
            tblServiceprovider.children[1].children[index].style.border = "2px solid red";
            tblServiceprovider.children[1].children[index].lastChild.children[1].disabled = true;
            tblServiceprovider.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";
        }
    }
}

function paginate(page) {
    var paginate;
    if (oldserviceprovider == null) {
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

function viewitem(sp, rowno) {

    serviceprovider = JSON.parse(JSON.stringify(sp));

    tdnum.setAttribute('value', serviceprovider.regno);
    // tdctype.innerHTML = serviceprovider.sptypeId.name;
    // tdcstatus.innerHTML = serviceprovider.spstatusId.name;
    // tdcname.innerHTML = serviceprovider.name;
    // tdcemail.innerHTML = serviceprovider.email;
    // tdcmobile.innerHTML = serviceprovider.mobile;
    // tdcaddress.innerHTML = serviceprovider.caddress;
    // tddescript.innerHTML = serviceprovider.description;
    // tdcpname.innerHTML = serviceprovider.cpname;
    // tdcpemail.innerHTML = serviceprovider.cpemail;
    // tdnic.innerHTML = serviceprovider.nic;
    // tdcpmobile.innerHTML = serviceprovider.cpmobile;
    // tdcpland.innerHTML = serviceprovider.cpland;
    // //tdcpaddress.innerHTML = serviceprovider.cpaddress;
}

function printRow() {

    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<body><div style='margin-top: 150px'><h1>Service Provider Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}

function loadForm() {
    serviceprovider = new Object();
    oldserviceprovider = null;

    serviceprovider.provideList = new Array();//assosiation list

    fillCombo(cmbSpType, "Provider Type", sptypes, "name", "");
    fillCombo(cmbRegBy, "", employees, "callingname", "Admin");
    fillCombo(cmbSpStatus, "Provider Status", spstatuses, "name", "Available");
    serviceprovider.spstatusId=JSON.parse(cmbSpStatus.value);
    serviceprovider.employeeId=JSON.parse(cmbRegBy.value);

    //Autofill date
    var today = new Date();
    dteRegDate.value = getDate(today);
    serviceprovider.regdate = dteRegDate.value;

    // Get Next Number Form Data Base
    var sp = httpRequest("/serviceprovider/nextnumber", "GET");
    txtNumber.value = sp.regno;
    serviceprovider.regno = txtNumber.value;
    txtNumber.disabled = true;

    cmbSpStatus.disabled = true;

    txtSpName.value = "";
    txtSpEmail.value = "";
    txtSpMobile.value = "";
    txtBRno.value = "";
    txtAddress.value = "";
    txtDescription.value = "";
    txtCpName.value = "";
    txtCpEmail.value = "";
    txtNIC.value = "";
    txtCpMobile.value = "";
    txtBankName.value = "";
    txtBranchName.value = "";
    txtAccNo.value = "";
    txtAccHoldName.value = "";

    setStyle(initial);

    txtNumber.style.border = valid;
    dteRegDate.style.border=valid;
    cmbRegBy.style.border=valid;
    cmbSpStatus.style.border=valid;

     cmbSpType.disabled = false;

     disableButtons(false, true, true);
     refreshInnerForm();
}

function refreshInnerForm() {
    fillCombo(cmbServices,"Select Service",services,"servicename");
    cmbServices.style.border = initial;

    fillInnerTable("tblInnerService",serviceprovider.provideList,modifyInnerForm,deleteInnerForm);

    if (serviceprovider.provideList.length != 0) {
        for (var i = 0; i < tblInnerService.children[1].children.length; i++) {
            tblInnerService.children[1].children[i].lastChild.firstChild.style.display = "none";
        }
    }

}

function btnInnerAddMC() {
    provide = new Object();
    provide.serviceId = JSON.parse(cmbServices.value);

    serviceExs = false;
    for (index in serviceprovider.provideList) {
        if (serviceprovider.provideList[index].serviceId.servicename == JSON.parse(cmbServices.value).servicename) {
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
        serviceprovider.provideList.push(provide);
        refreshInnerForm();
        }

}

function btnInnerClearMC() {

    if (addEventvalue == ""){

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

function modifyInnerForm(){

}

function deleteInnerForm(provide , indx) {
    swal({
        title: "Do you wnt to remove the selected service?",
        text:"\n",
        icon:"warning",
        buttons:true,
    }).then((willDelete) => {
        if(willDelete){
            serviceprovider.provideList.splice(indx,1);
            refreshInnerForm();

        }
    })


}


function setStyle(style) {

    txtNumber.style.border = style;
    cmbRegBy.style.border = style;
    dteRegDate.style.border = style;
    cmbSpType.style.border = style;
    cmbSpStatus.style.border = style;
    txtSpName.style.border = style;
    txtSpEmail.style.border = style;
    txtSpMobile.style.border = style;
    txtBRno.style.border = style;
    txtAddress.style.border = style;
    txtDescription.style.border = style;
    txtCpName.style.border = style;
    txtCpEmail.style.border = style;
    txtNIC.style.border = style;
    txtCpMobile.style.border = style;
    txtBankName.style.border = style;
    txtBranchName.style.border = style;
    txtAccNo.style.border = style;
    txtAccHoldName.style.border = style;

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
    var type = JSON.parse(cmbSpType.value);

    if(type.name == "Individual"){

        txtCpName.setAttribute("disabled","disabled");
        txtCpName.setAttribute("required","required");
        icnCpName.removeAttribute("style", "color:red");

        txtCpEmail.setAttribute("disabled","disabled");
        txtCpEmail.setAttribute("required","required");
        icnCpEmail.removeAttribute("style", "color:red");

        txtCpMobile.setAttribute("disabled","disabled");
        txtCpMobile.setAttribute("required","required");
        icnCpMob.removeAttribute("style", "color:red");
        txtSpNIC.style.display = "block";
        icnSpNIC.style.display = "block";
        txtNIC.style.display = "none";
        icnNIC.style.display = "none";


    }else if(type.name == "Company"){

        txtCpName.removeAttribute("disabled","disabled");
        txtCpName.removeAttribute("required","required");
        icnCpName.setAttribute("style", "color:red");

        txtCpEmail.removeAttribute("disabled","disabled");
        txtCpEmail.removeAttribute("required","required");
        icnCpEmail.setAttribute("style", "color:red");

        txtCpMobile.removeAttribute("disabled","disabled");
        txtCpMobile.removeAttribute("required","required");
        icnCpMob.setAttribute("style", "color:red");

        txtSpNIC.style.display = "none";
        icnSpNIC.style.display = "none";
        txtNIC.display = "block";
        icnNIC.display = "block";

    }

}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (serviceprovider.sptypeId == null){
        errors = errors + "\n" + "Serviceprovider Type is Not Selected";
        cmbSpType.style.border = invalid;
    }else
        addvalue = 1;

    if (serviceprovider.name == null){
        errors = errors + "\n" + "Serviceprovider Name is Not Entered";
        txtSpName.style.border = invalid;
    }else
        addvalue = 1;

    if (serviceprovider.email == null){
        errors = errors + "\n" + "Service Provider Email is Not Entered";
        txtSpEmail.style.border = invalid;
    }else
        addvalue = 1;

    if (serviceprovider.brno == null){
        errors = errors + "\n" + "Service Provider Land is Not Entered";
        txtBRno.style.border = invalid;
    }else
        addvalue = 1;

    if (serviceprovider.mobile == null){
        errors = errors + "\n" + "Service Provider Mobile is Not Entered";
        txtSpMobile.style.border = invalid;
    }else
        addvalue = 1;

    if (serviceprovider.address == null){
        errors = errors + "\n" + "Service Provider Address is Not Entered";
        txtAddress.style.border = invalid;
    }
    else addvalue = 1;

    if (serviceprovider.provideList.length == 0){
        errors = errors + "\n" + "Provided Services are Not Selected";
        cmbServices.style.border = invalid;
    }
    else addvalue = 1;

    if (serviceprovider.bankname == null){
        errors = errors + "\n" + "Bank Name is Not Entered";
        txtBankName.style.border = invalid;
    }
    else addvalue = 1;

    if (serviceprovider.branch == null){
        errors = errors + "\n" + "Branch Name is Not Entered";
        txtBranchName.style.border = invalid;
    }
    else addvalue = 1;

    if (serviceprovider.accno == null){
        errors = errors + "\n" + "Account Number is Not Entered";
        txtAccNo.style.border = invalid;
    }
    else addvalue = 1;

    if (serviceprovider.accholdername == null){
        errors = errors + "\n" + "Account Holder Name is Not Entered";
        txtAccHoldName.style.border = invalid;
    }
    else addvalue = 1;

    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (txtCpName.value == "" || txtCpEmail.value == "" || txtNIC.value == ""|| txtDescription.value == "" || txtCpMobile.value == "" ) {
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
        title: "Are you sure to add following Service Provider...?",
        text: "\nReg No : " + serviceprovider.regno +
            "\nService Provider Name : " + serviceprovider.name +
            "\nBusiness Registration Number : " + serviceprovider.brno +
            "\nService Provider Type : " + serviceprovider.sptypeId.name +
            "\nService Provider Status : " + serviceprovider.spstatusId.name +
            "\nService Provider Mobile : " + serviceprovider.mobile ,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/serviceprovider", "POST", serviceprovider);
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

    if (oldserviceprovider == null && addvalue == "") {
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

function fillForm(sp, rowno) {
    activerowno = rowno;

    if (oldserviceprovider == null) {
        filldata(sp);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(sp);
                viewForm();
            }

        });
    }

}

function filldata(sp) {
    viewForm();
    clearSelection(tblServiceprovider);
    selectDeleteRow();
    selectRow(tblServiceprovider, activerowno, active);

    serviceprovider = JSON.parse(JSON.stringify(sp));
    oldserviceprovider = JSON.parse(JSON.stringify(sp));

    txtNumber.value = serviceprovider.regno;
    txtNumber.disabled = false;
    cmbRegBy.value = serviceprovider.employeeId.callingname;
    cmbRegBy.disabled = "disabled";
    dteRegDate.value = serviceprovider.regdate;
    dteRegDate.disabled = "disabled";
    cmbSpStatus.disabled = false;

    cmbSpType.value = serviceprovider.sptypeId.name;
    cmbSpStatus.value = serviceprovider.spstatusId.name;
    txtSpName.value = serviceprovider.name;
    txtSpEmail.value = serviceprovider.email;
    txtSpMobile.value = serviceprovider.mobile;
    txtBRno.value = serviceprovider.brno;
    txtAddress.value = serviceprovider.address;
    txtDescription.value = serviceprovider.description;
    txtCpName.value = serviceprovider.cpname;
    txtCpEmail.value = serviceprovider.cpemail;
    txtBankName.value = serviceprovider.bankname;
    txtBranchName.value = serviceprovider.branch;
    txtAccNo.value = serviceprovider.accno;
    txtAccHoldName.value = serviceprovider.accholdername;
    // tdtobepaid.value = serviceprovider.tobepaid;
    // tdpoints.value = serviceprovider.points;

    if(serviceprovider.sptypeId.name == "Individual"){

        txtCpName.setAttribute("disabled","disabled");
        txtCpName.setAttribute("required","required");
        icnCpName.removeAttribute("style", "color:red");

        txtCpEmail.setAttribute("disabled","disabled");
        txtCpEmail.setAttribute("required","required");
        icnCpEmail.removeAttribute("style", "color:red");

        txtCpMobile.setAttribute("disabled","disabled");
        txtCpMobile.setAttribute("required","required");
        icnCpMob.removeAttribute("style", "color:red");
        txtSpNIC.style.display = "block";
        icnSpNIC.style.display = "block";
        txtNIC.style.display = "none";
        icnNIC.style.display = "none";

        txtNIC.value = "";
        txtSpNIC.value = serviceprovider.cpnic;

    }else if(serviceprovider.sptypeId.name == "Company"){

        txtCpName.removeAttribute("disabled","disabled");
        txtCpName.removeAttribute("required","required");
        icnCpName.setAttribute("style", "color:red");

        txtCpEmail.removeAttribute("disabled","disabled");
        txtCpEmail.removeAttribute("required","required");
        icnCpEmail.setAttribute("style", "color:red");

        txtCpMobile.removeAttribute("disabled","disabled");
        txtCpMobile.removeAttribute("required","required");
        icnCpMob.setAttribute("style", "color:red");

        txtSpNIC.style.display = "none";
        icnSpNIC.style.display = "none";
        txtNIC.display = "block";
        icnNIC.display = "block";

        txtNIC.value = serviceprovider.cpnic;
        txtSpNIC.value = "";

    }

    fillCombo(cmbSpType, "Serviceprovider Type", sptypes, "name", serviceprovider.sptypeId.name);
    fillCombo(cmbSpStatus, "Serviceprovider Status", spstatuses, "name", serviceprovider.spstatusId.name);
    fillCombo(cmbRegBy, "", employees, "callingname", serviceprovider.employeeId.callingname);

    refreshInnerForm();

    disableButtons(true, false, false);
    disableFields();
    setStyle(valid);

    cmbSpType.disabled = "disabled";

    if(serviceprovider.description == null){
        txtDescription.style.border = initial;
        txtDescription.value = "";
    }

    if(serviceprovider.cpemail == null){
        txtCpEmail.style.border = initial;
        txtCpEmail.value = "";
    }

    if(serviceprovider.cpname == null){
        txtCpName.style.border = initial;
        txtCpName.value = "";
    }

    if(serviceprovider.cpmobile == null){
        txtCpMobile.style.border = initial;
        txtCpMobile.value = "";
    }

    if(serviceprovider.cpnic == null){
        txtNIC.style.border = initial;
        txtDescription.value = "";
    }

}

function getUpdates() {

    var updates = "";

    if (serviceprovider != null && oldserviceprovider != null) {
        if (serviceprovider.sptypeId.name != oldserviceprovider.sptypeId.name)
            updates = updates + "\nService Provider Type is Changed";

        if (serviceprovider.spstatusId.name != oldserviceprovider.spstatusId.name)
            updates = updates + "\nService Provider Status is Changed";

        if (serviceprovider.name != oldserviceprovider.name)
            updates = updates + "\nService Provider Name is Changed";

        if (serviceprovider.email != oldserviceprovider.email)
            updates = updates + "\nServiceprovider Email is Changed";

        if (serviceprovider.mobile != oldserviceprovider.mobile)
            updates = updates + "\nServiceprovider Mobile is Changed";

        if (serviceprovider.address != oldserviceprovider.address)
            updates = updates + "\nServiceprovider Address is Changed";

        if (serviceprovider.brno != oldserviceprovider.brno)
            updates = updates + "\nBusiness Registration Number is Changed";

        if (serviceprovider.description != oldserviceprovider.description)
            updates = updates + "\nDescription is Changed";

        if (serviceprovider.cpname != oldserviceprovider.cpname)
            updates = updates + "\nContact Person Name is Changed";

        if (serviceprovider.cpemail != oldserviceprovider.cpemail)
            updates = updates + "\nContact Person Email is Changed";

        if (serviceprovider.cpnic != oldserviceprovider.cpnic)
            updates = updates + "\nNIC is Changed";

        if (serviceprovider.cpmobile != oldserviceprovider.cpmobile)
            updates = updates + "\nContact Person Mobile Number is Changed";

        if (serviceprovider.bankname != oldserviceprovider.bankname)
            updates = updates + "\nBank Name is Changed";

        if (serviceprovider.branch != oldserviceprovider.branch)
            updates = updates + "\nBranch Name is Changed";

        if (serviceprovider.accno != oldserviceprovider.accno)
            updates = updates + "\nAccount Number is Changed";

        if (serviceprovider.accholdername != oldserviceprovider.accholdername)
            updates = updates + "\nAccount Holder Name is Changed";

        if(isEqual(serviceprovider.provideList,oldserviceprovider.provideList,"serviceId"))
            updates = updates + "\nProvided Services are Changed";

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
                    title: "Are you sure to update following Service Provider details...?",
                    text: "\n" + getUpdates(),
                    icon: "warning", buttons: true, dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/serviceprovider", "PUT", serviceprovider);
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

function btnDeleteMC(sp) {
        serviceprovider = JSON.parse(JSON.stringify(sp));

        swal({
            title: "Are you sure to delete following Service Provider...?",
            text: "\n Service Provider Number : " + serviceprovider.regno +
                "\n Service Provider Name : " + serviceprovider.name +
                "\n Business Registration Number : " + serviceprovider.brno +
                "\n Service Provider Type : " + serviceprovider.sptypeId.name +
                "\n Service Provider Status : " + serviceprovider.spstatusId.name,
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                var responce = httpRequest("/serviceprovider", "DELETE", serviceprovider);
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

function btnPrintTableMC(serviceprovider) {

        var newwindow = window.open();
        formattab = tblServiceprovider.outerHTML;

        newwindow.document.write("" +
            "<html>" +
            "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
            "<link rel='stylesheet' href='../plugin/bootstrap/css/bootstrap.min.css'/></head>" +
            "<body><div style='margin-top: 150px; '> <h1>Serviceprovider Details : </h1></div>" +
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

        var cprop = tblServiceprovider.firstChild.firstChild.children[cindex].getAttribute('property');

        if (cprop.indexOf('.') == -1) {
            serviceproviders.sort(
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
            serviceproviders.sort(
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
        fillTable('tblServiceprovider', serviceproviders, fillForm, btnDeleteMC, viewitem);
        clearSelection(tblServiceprovider);
        selectDeleteRow();

        if (activerowno != "") selectRow(tblServiceprovider, activerowno, active);



}