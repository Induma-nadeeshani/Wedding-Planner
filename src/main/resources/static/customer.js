window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {


    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    txtSearchName.addEventListener("keyup", btnSearchMC);

    cmbCusType.addEventListener("change", disableFields);
//  cmbCusRegion.addEventListener("change", fillCode);

    privilages = httpRequest("../privilage?module=Customer", "GET");

    ctypes = httpRequest("../ctype/list", "GET");
    cstatuses = httpRequest("../cstatus/list", "GET");
    employees = httpRequest("../employee/list", "GET");
   // cregions = httpRequest("../cregion/list", "GET");

    //Apply select2 into select box

    $('.js-example-basic-single').select2({
        placeholder: " Select a country",
        allowClear: true
    });

    valid = "2px solid green";
    invalid = "2px solid red";
    initial = "2px solid #d6d6c2";
    updated = "2px solid #ff9900";
    active = "#ff9900";

    loadForm();
    viewForm();
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
    customers = new Array();
    var data = httpRequest("/customer/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) customers = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblCustomer', customers, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblCustomer);
    selectDeleteRow();

    if (activerowno != "") selectRow(tblCustomer, activerowno, active);

}

function selectDeleteRow() {
    for (index in customers) {
        if (customers[index].cstatusId.name == "Deleted") {
            tblCustomer.children[1].children[index].style.color = "#f00";
            tblCustomer.children[1].children[index].style.border = "2px solid red";
            tblCustomer.children[1].children[index].lastChild.children[1].disabled = true;
            tblCustomer.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";
        }
    }
}

function paginate(page) {
    var paginate;
    if (oldcustomer == null) {
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

function viewitem(cus, rowno) {

    customer = JSON.parse(JSON.stringify(cus));
    console.log(customer);

    tdnum.setAttribute('value', customer.regno);
    tdctype.innerHTML = customer.ctypeId.name;
    tdcstatus.innerHTML = customer.cstatusId.name;
    tdcname.innerHTML = customer.cname;
    tdcemail.innerHTML = customer.cemail;
   // tdcregion.innerHTML = customer.cregionId.name;
    tdcmobile.innerHTML = customer.cmobile;
    tdcaddress.innerHTML = customer.caddress;
    tddescript.innerHTML = customer.description;
    tdcpname.innerHTML = customer.cpname;
    tdcpemail.innerHTML = customer.cpemail;
    tdnic.innerHTML = customer.nic;
    tdcpmobile.innerHTML = customer.cpmobile;
    tdcpland.innerHTML = customer.cpland;
    tdcpaddress.innerHTML = customer.cpaddress;

}

function printRow() {

    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<body><div style='margin-top: 150px'><h1>Customer Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}

function loadForm() {
    customer = new Object();
    oldcustomer = null;

    fillCombo(cmbCusType, "Customer Type", ctypes, "name", "");
    fillCombo(cmbCusStatus, "Customer Status", cstatuses, "name", "Active");
    //fillCombo(cmbCusRegion, "Customer Region", cregions, "name", "Sri Lanka");
    fillCombo(cmbRegBy, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);

    //customer.cregionId.name = "Sri Lanka";
    customer.cstatusId=JSON.parse(cmbCusStatus.value);
   // customer.cregionId=JSON.parse(cmbCusRegion.value);
    customer.employeeId=JSON.parse(cmbRegBy.value);

    var today = new Date();
    dteRegDate.value = getDate(today);
    customer.regdate = dteRegDate.value;

    // Get Next Number Form Data Base
    var cus = httpRequest("/customer/nextnumber", "GET");
    txtNumber.value = cus.regno;
    customer.regno = txtNumber.value;
    txtNumber.disabled = true;

         txtCusName.value = "";
         txtCusEmail.value = "";
         txtCusMobile.value = "";
         txtAddress.value = "";
         txtDescription.value = "";
         txtCpName.value = "";
         txtCpEmail.value = "";
         txtNIC.value = "";
         txtCusNIC.value = "";
         txtCpMobile.value = "";
         txtCpLand.value = "";
         txtCpAddress.value = "";

         setStyle(initial);
         $('.select2-container').css('border', valid);
         //txtCusMobileCode.style.border = valid;
         txtNumber.style.border = valid;
         dteRegDate.style.border=valid;
         cmbRegBy.style.border=valid;
         cmbCusStatus.style.border=valid;

        cmbCusType.disabled = false;
        cmbCusStatus.setAttribute("disabled","disabled");
        disableButtons(false, true, true);
}

function setStyle(style) {

    txtNumber.style.border = style;
    cmbRegBy.style.border = style;
    dteRegDate.style.border = style;
    cmbCusType.style.border = style;
    cmbCusStatus.style.border = style;
    txtCusName.style.border = style;
    txtCusEmail.style.border = style;
    //cmbCusRegion.style.border = style;
    txtCusMobile.style.border = style;
    //txtCusMobileCode.style.border = style;
    txtAddress.style.border = style;
    txtDescription.style.border = style;
    txtCpName.style.border = style;
    txtCpEmail.style.border = style;
    txtNIC.style.border = style;
    txtCusNIC.style.border = style;
    txtCpMobile.style.border = style;
    txtCpLand.style.border = style;
    txtCpAddress.style.border = style;

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
    var type = JSON.parse(cmbCusType.value);

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

        txtCpAddress.setAttribute("disabled","disabled");
        txtCpAddress.setAttribute("required","required");
        icnCpAddress.removeAttribute("style", "color:red");

        txtNIC.style.display = "none";
        icnNIC.style.display = "none";
        txtCusNIC.style.display = "block";
        icnCusNIC.style.display = "block";


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

        txtCpAddress.removeAttribute("disabled","disabled");
        txtCpAddress.removeAttribute("required","required");
        icnCpAddress.setAttribute("style", "color:red");

        txtCusNIC.style.display = "none";
        icnCusNIC.style.display = "none";
        txtNIC.style.display = "block";
        icnNIC.style.display = "block";

    }

}

// function fillCode() {
//     code = JSON.parse($('.js-example-basic-single').val()).code;
//     //alert(code);
//     txtCusMobileCode.value = code;
//
//     customer.cregionId.code = code;
// }

function getErrors() {

    var errors = "";
    addvalue = "";

    if (customer.ctypeId == null){
        errors = errors + "\n" + "Customer Type is Not Selected";
        cmbCusType.style.border = invalid;
    }else
        addvalue = 1;

    if (customer.cname == null){
        errors = errors + "\n" + "Customer Name is Not Entered";
        txtCusName.style.border = invalid;
    }else
        addvalue = 1;

    if (customer.cmobile == null){
        errors = errors + "\n" + "Customer Mobile is Not Entered";
        txtCusMobile.style.border = invalid;
    }else
        addvalue = 1;

    if (customer.caddress == null){
        errors = errors + "\n" + "Customer Address is Not Entered";
        txtAddress.style.border = invalid;
    }
    else addvalue = 1;

    if (customer.nic == null){
        errors = errors + "\n" + "NIC is Invalid";
        txtNIC.style.border = invalid;
    }
    else addvalue = 1;

if (customer.nic == null){
        errors = errors + "\n" + "NIC is Invalid";
        txtCusNIC.style.border = invalid;
    }
    else addvalue = 1;


    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (txtCusEmail.value == "" || txtDescription.value == "" || txtCpName.value == "" || txtCpEmail.value == ""
            || txtCpMobile.value == "" || txtCpLand.value == "" || txtCpAddress.value == "") {
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
        title: "Are you sure to add following Customer...?",
        text: "\nReg No : " + customer.regno +
            "\nCustomer Type : " + customer.ctypeId.name +
            "\nCustomer Status : " + customer.cstatusId.name +
            "\nCustomer Name : " + customer.cname +
            //"\nCustomer Region : " + customer.cregionId.name +
            "\nCustomer Mobile : " + customer.cmobile +
            "\nCustomer Address : " + customer.caddress +
            "\nNIC : " + customer.nic,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/customer", "POST", customer);
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

    if (oldcustomer == null && addvalue == "") {
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

function fillForm(cus, rowno) {
    activerowno = rowno;

    if (oldcustomer == null) {
        filldata(cus);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(cus);
                viewForm();
            }

        });
    }

}

function filldata(cus) {
    viewForm();
    clearSelection(tblCustomer);
    selectDeleteRow();
    selectRow(tblCustomer, activerowno, active);

    customer = JSON.parse(JSON.stringify(cus));
    oldcustomer = JSON.parse(JSON.stringify(cus));

    txtNumber.value = customer.regno;
    txtNumber.disabled = false;
    cmbRegBy.value = customer.employeeId.callingname;
    cmbRegBy.disabled = "disabled";
    dteRegDate.value = customer.regdate;
    dteRegDate.disabled = "disabled";
    cmbCusType.value = customer.ctypeId.name;
    cmbCusStatus.value = customer.cstatusId.name;
    txtCusName.value = customer.cname;
    txtCusEmail.value = customer.cemail;
    //cmbCusRegion.value = customer.cregionId.name;
    //txtCusMobileCode.value = customer.cregionId.code;
    txtCusMobile.value = customer.cmobile;
    txtAddress.value = customer.caddress;
    txtDescription.value = customer.description;
    txtCpName.value = customer.cpname;
    txtCpEmail.value = customer.cpemail;
    txtNIC.value = customer.nic;
    txtCusNIC.value = customer.nic;
    txtCpMobile.value = customer.cpmobile;
    txtCpLand.value = customer.cpland;
    txtCpAddress.value = customer.cpaddress;
    // tdtobepaid.value = customer.tobepaid;
    // tdpoints.value = customer.points;

    fillCombo(cmbCusType, "Customer Type", ctypes, "name", customer.ctypeId.name);
    fillCombo(cmbCusStatus, "Customer Status", cstatuses, "name", customer.cstatusId.name);
    //fillCombo(cmbCusRegion, "Customer Region", cregions, "name", customer.cregionId.name);
    fillCombo(cmbRegBy, "", employees, "callingname", customer.employeeId.callingname);

    disableButtons(true, false, false);
    disableFields();
    setStyle(valid);

    cmbCusType.disabled = "disabled";
    cmbCusStatus.removeAttribute("disabled","disabled");

    if(customer.description == null){
        txtDescription.style.border = initial;
        txtDescription.value = "";
    }

    if(customer.cemail == null){
        txtCusEmail.style.border = initial;
        txtCusEmail.value = "";
    }

    if(customer.cpname == null){
        txtCpName.style.border = initial;
        txtCpName.value = "";
    }

    if(customer.cpmobile == null){
        txtCpMobile.style.border = initial;
        txtCpMobile.value = "";
    }

    if(customer.cpaddress == null){
        txtCpAddress.style.border = initial;
        txtCpAddress.value = "";
    }

    if(customer.cpemail == null){
        txtCpEmail.style.border = initial;
        txtCpEmail.value = "";
    }

    if(customer.cpland == null){
        txtCpLand.style.border = initial;
        txtCpLand.value = "";
    }

}

function getUpdates() {

    var updates = "";

    if (customer != null && oldcustomer != null) {

        if (customer.ctypeId.name != oldcustomer.ctypeId.name)
            updates = updates + "\nCustomer Type is Changed";

        if (customer.cstatusId.name != oldcustomer.cstatusId.name)
            updates = updates + "\nCustomer Status is Changed";

        if (customer.cname != oldcustomer.cname)
            updates = updates + "\nCustomer Name is Changed";

        if (customer.cemail != oldcustomer.cemail)
            updates = updates + "\nCustomer Email is Changed";

        // if (customer.cregionId.name != oldcustomer.cregionId.name)
        //     updates = updates + "\nRegion is Changed";

        if (customer.cmobile != oldcustomer.cmobile)
            updates = updates + "\nCustomer Mobile is Changed";

        if (customer.caddress != oldcustomer.caddress)
            updates = updates + "\nCustomer Address is Changed";

        if (customer.description != oldcustomer.description)
            updates = updates + "\nDescription is Changed";

        if (customer.cpname != oldcustomer.cpname)
            updates = updates + "\nContact Person Name is Changed";

        if (customer.cpemail != oldcustomer.cpemail)
            updates = updates + "\nContact Person Email is Changed";

        if (customer.nic != oldcustomer.nic)
            updates = updates + "\nNIC is Changed";

        if (customer.cpmobile != oldcustomer.cpmobile)
            updates = updates + "\nContact Person Mobile Number is Changed";

        if (customer.cpland != oldcustomer.cpland)
            updates = updates + "\nContact Person Land Number is Changed";

        if (customer.cpaddress != oldcustomer.cpaddress)
            updates = updates + "\nContact Person Address is Changed";
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
                title: "Are you sure to update following customer details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/customer", "PUT", customer);
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

function btnDeleteMC(cus) {
    customer = JSON.parse(JSON.stringify(cus));

    swal({
        title: "Are you sure to delete following Customer...?",
        text: "\n Customer Number : " + customer.regno +
            "\n Customer Name : " + customer.cname +
            "\n Customer Type : " + customer.ctypeId.name +
            "\n Customer Status : " + customer.cstatusId.name,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/customer", "DELETE", customer);
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

function btnPrintTableMC(customer) {

    var newwindow = window.open();
    formattab = tblCustomer.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../plugin/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Customer Details : </h1></div>" +
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

    var cprop = tblCustomer.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        customers.sort(
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
        customers.sort(
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
    fillTable('tblCustomer', customers, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblCustomer);
    selectDeleteRow();

    if (activerowno != "") selectRow(tblCustomer, activerowno, active);


}