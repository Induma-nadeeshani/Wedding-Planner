window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    txtSearchName.addEventListener("keyup", btnSearchMC);

    privilages = httpRequest("../privilage?module=ProviderPackage", "GET");

    pkgstatuses = httpRequest("../packagestatus/list", "GET");
    serviceproviders = httpRequest("../serviceprovider/list", "GET");
    services = httpRequest("../service/servicebyname", "GET");
    events = httpRequest("../event/list", "GET");
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
    providerpackages = new Array();

    var data = httpRequest("/providerpackage/findAll?page=" + page + "&size=" + size + query, "GET");

    if (data.content != undefined)
        providerpackages = data.content;

    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblProviderPackage', providerpackages, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblProviderPackage);
    selectDeleteRow();

    if (activerowno != "") selectRow(tblProviderPackage, activerowno, active);

}

function selectDeleteRow() {
    for (index in providerpackages) {
        if (providerpackages[index].packagestatusId .name == "Deleted") {
            tblProviderPackage.children[1].children[index].style.color = "#f00";
            tblProviderPackage.children[1].children[index].style.border = "2px solid red";
            tblProviderPackage.children[1].children[index].lastChild.children[1].disabled = true;
            tblProviderPackage.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";
        }
    }
}

function paginate(page) {
    var paginate;
    if (oldproviderpackage == null) {
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

function viewitem(pkg, rowno) {

    providerpackage = JSON.parse(JSON.stringify(pkg));

    // tdnum.setAttribute('value', providerpackage.regno);
    // tdctype.innerHTML = providerpackage.pkgtypeId.name;
    // tdcstatus.innerHTML = providerpackage.pkgstatusId.name;
    // tdcname.innerHTML = providerpackage.name;
    // tdcemail.innerHTML = providerpackage.email;
    // tdcmobile.innerHTML = providerpackage.mobile;
    // tdcaddress.innerHTML = providerpackage.caddress;
    // tddescript.innerHTML = providerpackage.description;
    // tdcpname.innerHTML = providerpackage.cpname;
    // tdcpemail.innerHTML = providerpackage.cpemail;
    // tdnic.innerHTML = providerpackage.nic;
    // tdcpmobile.innerHTML = providerpackage.cpmobile;
    // tdcpland.innerHTML = providerpackage.cpland;
    // //tdcpaddress.innerHTML = providerpackage.cpaddress;

}
function printRow() {

    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<body><div style='margin-top: 150px'><h1>Provider Package Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}

function loadForm() {
    providerpackage = new Object();
    oldproviderpackage = null;

    providerpackage.featuresList = new Array();//assosiation list

    fillCombo(cmbSerProvider, "Service Provider", serviceproviders, "name", "");
    fillCombo(cmbService, "Service", services, "servicename", "");
    fillCombo(cmbEvent, "Event", events, "name", "");
    fillCombo(cmbPkgStatus, "Package Status", pkgstatuses, "name", "Available");
    fillCombo(cmbRegBy, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    providerpackage.packagestatusId =JSON.parse(cmbPkgStatus.value);
    providerpackage.employeeId = JSON.parse(cmbRegBy.value);

    //Autofill date
    var today = new Date();
    dteRegDate.value = getDate(today);
    providerpackage.regdate = dteRegDate.value;
    txtStartDate.value = getDate(today);
    providerpackage.startdate = txtStartDate.value;

    cmbPkgStatus.disabled = true;

    txtCode.value = "";
    txtPkgName.value = "";
    txtPkgPrice.value = "";
    txtEndDate.value = "";
    txtDescription.value = "";

    setStyle(initial);

    dteRegDate.style.border=valid;
    cmbRegBy.style.border=valid;
    cmbPkgStatus.style.border=valid;
    txtStartDate.style.border=valid;

    disableButtons(false, true, true);
    refreshInnerForm();
}

function refreshInnerForm() {
    txtFeature.value = "";
    txtFeature.style.border = initial;

    fillInnerTable("tblInnerFeatures",providerpackage.featuresList,modifyInnerForm,deleteInnerForm);

}

function btnInnerAddMC() {
    feature = new Object();
    feature.name = txtFeature.value;

    if(txtFeature != ""){
     featureExs = false;
     for (index in providerpackage.featuresList) {
        if (providerpackage.featuresList[index].name == txtFeature.value) {
             featureExs = true;
             break;
         }
     }

    if(featureExs){
        swal({
            title: "This Feature is Already Selected",
            text:"\n",
            icon:"warning",
            buttons:false,
            timer: 1200,
        });
        }else{
        providerpackage.featuresList.push(feature);
        refreshInnerForm();
            }
    }else {
        txtFeature.focus();
        }
}

function modifyInnerForm(feature,indx) {
    selectedInnerRow = indx;

    txtFeature.value = feature.name;
    txtFeature.style.border = valid;

}

function btnInnerUpdateMC() {
    innerUpdates = getInnerUpdate();
    if(providerpackage.featuresList[index].featureId.name == txtFeature.value){
        swal({
            title: "Nothing Updated",
            text:"\n",
            icon:"warning",
            timer: 1200,
        })
    }else{
        swal({
            title: "Are you sure to update the selected Feature...?",
            text:"\n",
            icon:"warning",
            buttons:true,
        }).then((willDelete) => {
            if(willDelete){
                providerpackage.featuresList[selectedInnerRow].featureId.name = txtFeature.value;
                refreshInnerForm();

            }
        });
    }
}

function btnInnerClearMc(){
    swal({
        title: "Form has some values or updated values... Are you sure to discard the form ?",
        text:"\n",
        icon:"warning",
        buttons:true,
    }).then((willDelete) => {
        if(willDelete){
            refreshInnerForm();

        }
    });
}

function deleteInnerForm(feature , indx) {
    swal({
        title: "Do you want to remove the selected Feature?",
        text:"\n",
        icon:"warning",
        buttons:true,
    }).then((willDelete) => {
        if(willDelete){
            providerpackage.featuresList.splice(indx,1);
            refreshInnerForm();

        }
    });
}

function setStyle(style) {

    cmbRegBy.style.border = style;
    dteRegDate.style.border = style;
    txtCode.style.border = style;
    cmbSerProvider.style.border = style;
    cmbService.style.border = style;
    cmbEvent.style.border = style;
    txtPkgName.style.border = style;
    txtPkgPrice.style.border = style;
    cmbPkgStatus.style.border = style;
    txtStartDate.style.border = style;
    txtEndDate.style.border = style;
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

    if (providerpackage.code == null){
        errors = errors + "\n" + "Code is Not Entered";
        txtCode.style.border = invalid;
    }else
        addvalue = 1;

    if (providerpackage.serviceId == null){
        errors = errors + "\n" + "Service is Not Selected";
        cmbService.style.border = invalid;
    }else
        addvalue = 1;

    if (providerpackage.serviceproviderId == null){
        errors = errors + "\n" + "Service Provider is Not Selected";
        cmbSerProvider.style.border = invalid;
    }else
        addvalue = 1;

    if (providerpackage.name == null){
        errors = errors + "\n" + "Package Name is Not Entered";
        txtPkgName.style.border = invalid;
    }else
        addvalue = 1;

    if (providerpackage.price == null){
        errors = errors + "\n" + "Package Price is Not Entered";
        txtPkgPrice.style.border = invalid;
    }else
        addvalue = 1;

    if (providerpackage.startdate == null){
        errors = errors + "\n" + "Package Start Date is Not Entered";
        txtStartDate.style.border = invalid;
    }else
        addvalue = 1;

 if (providerpackage.enddate == null){
        errors = errors + "\n" + "Package End Date is Not Entered";
        txtEndDate.style.border = invalid;
    }else
        addvalue = 1;

    if (providerpackage.featuresList.length == 0){
        errors = errors + "\n" + "Features are Not Entered";
        txtFeature.style.border = invalid;
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
        title: "Are you sure to add following Provider Package...?",
        text: "\nCode : " + providerpackage.code +
            "\nService Provider : " + providerpackage.serviceproviderId.name +
            "\nService : " + providerpackage.serviceId.servicename +
            "\nProvider Package Name : " + providerpackage.name +
            "\nPrice : " + providerpackage.price  +
            "\nStatus : " + providerpackage.packagestatusId .name +
            "\nStart Date : " + providerpackage.startdate +
            "\nEnd Date : " + providerpackage.enddate ,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/providerpackage", "POST", providerpackage);
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

    if (oldproviderpackage == null && addvalue == "") {
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

    if (oldproviderpackage == null) {
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

function filldata(pkg) {
    viewForm();
    clearSelection(tblProviderPackage);
    selectDeleteRow();
    selectRow(tblProviderPackage, activerowno, active);

    providerpackage = JSON.parse(JSON.stringify(pkg));
    oldproviderpackage = JSON.parse(JSON.stringify(pkg));

    cmbRegBy.value = providerpackage.employeeId.callingname;
    cmbRegBy.disabled = "disabled";
    dteRegDate.value = providerpackage.regdate;
    dteRegDate.disabled = "disabled";
    cmbPkgStatus.disabled = false;


    txtCode.value = providerpackage.code;
    txtPkgName.value = providerpackage.name;
    txtPkgPrice.value = providerpackage.price;
    txtStartDate.value = providerpackage.startdate;
    txtEndDate.value = providerpackage.enddate;
    txtDescription.value = providerpackage.description;

    fillCombo(cmbService, "Service", services, "servicename", providerpackage.serviceId.servicename);
    fillCombo(cmbEvent, "Event", events, "name", providerpackage.eventId.name);
    fillCombo(cmbSerProvider, "Service Provider", serviceproviders, "name", providerpackage.serviceproviderId.name);
    fillCombo(cmbPkgStatus, "Providerpackage Status", pkgstatuses, "name", providerpackage.packagestatusId.name);
    fillCombo(cmbRegBy, "", employees, "callingname", providerpackage.employeeId.callingname);

    refreshInnerForm();

    disableButtons(true, false, false);
    setStyle(valid);

    if(providerpackage.description == null){
        txtDescription.style.border = initial;
        txtDescription.value = "";
    }
    if(providerpackage.eventId == null){
        cmbEvent.style.border = initial;
        cmbEvent.value = "";
    }

}

function getUpdates() {

    var updates = "";

    if (providerpackage != null && oldproviderpackage != null) {
        if (providerpackage.serviceId.servicename != oldproviderpackage.serviceId.servicename)
            updates = updates + "\nService is Changed";

        if (providerpackage.eventId.name != oldproviderpackage.eventId.name)
            updates = updates + "\nEvent is Changed";

        if (providerpackage.serviceproviderId.name != oldproviderpackage.serviceproviderId.name)
            updates = updates + "\nService Provider is Changed";

        if (providerpackage.name != oldproviderpackage.name)
            updates = updates + "\nPackage Name is Changed";

        if (providerpackage.code != oldproviderpackage.code)
            updates = updates + "\nPackage Code is Changed";

        if (providerpackage.packagestatusId.name != oldproviderpackage.packagestatusId.name)
            updates = updates + "\nPackage Status is Changed";

        if (providerpackage.price  != oldproviderpackage.price )
            updates = updates + "\nPackage Price is Changed";

        if (providerpackage.startdate != oldproviderpackage.startdate)
            updates = updates + "\nStart Date is Changed";

        if (providerpackage.enddate != oldproviderpackage.enddate)
            updates = updates + "\nEnd Date is Changed";

        if (providerpackage.description != oldproviderpackage.description)
            updates = updates + "\nDescription is Changed";

        if(isEqual(providerpackage.featuresList,oldproviderpackage.featuresList,"name"))
            updates = updates + "\nFeatures are Changed";

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
                title: "Are you sure to update following Provider Package details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/providerpackage", "PUT", providerpackage);
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

function btnDeleteMC(pkg) {
    providerpackage = JSON.parse(JSON.stringify(pkg));

    swal({
        title: "Are you sure to delete following Provider Package...?",
        text: "\n Package Code : " + providerpackage.code +
            "\n Service : " + providerpackage.serviceId .name +
            "\n Service Provider: " + providerpackage.serviceproviderId.name +
            "\n Package Name : " + providerpackage.name +
            "\n Package Status : " + providerpackage.packagestatusId.name,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/providerpackage", "DELETE", providerpackage);
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

function btnPrintTableMC(providerpackage) {

    var newwindow = window.open();
    formattab = tblProviderPackage.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../plugin/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Provider Package Details : </h1></div>" +
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

    var cprop = tblProviderPackage.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        providerpackages.sort(
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
        providerpackages.sort(
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
    fillTable('tblProviderPackage', providerpackages, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblProviderPackage);
    selectDeleteRow();

    if (activerowno != "") selectRow(tblProviderPackage, activerowno, active);



}