window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    cmbPayType.addEventListener("change", chngStatus);
    cmbCusNo.addEventListener("change", cmbCustomerCH);
    cmbPayMethod.addEventListener("change", cmbPayMethodCH);
    cmbResNo.addEventListener("change", fillDetails);
    txtAmount.addEventListener("keyup", calcBalance);

    privilages = httpRequest("../privilage?module=CustomerPayment", "GET");

    pstatuses = httpRequest("../paymentstatus/list", "GET");
    ptypes = httpRequest("../paymenttype/list", "GET");
    pmethods = httpRequest("../paymentmethod/list", "GET");
    customers = httpRequest("../customer/listbypending", "GET");
    employees = httpRequest("../employee/list", "GET");
    reservations = httpRequest("../reservation/list", "GET");

    valid = "2px solid green";
    invalid = "2px solid red";
    initial = "2px solid #d6d6c2";
    updated = "2px solid #ff9900";
    active = "#ff9900";

    loadForm();
    viewForm();
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
    cuspayments = new Array();
    var data = httpRequest("/cuspayment/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) cuspayments = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblCusPayment', cuspayments, fillForm, btnDeleteMC, viewitem);

    if (cuspayments.length != 0){
        for (var i =0; i<tblCusPayment.children[1].children.length;i++){
            tblCusPayment.children[1].children[i].lastChild.firstChild.style.display = "none";
            tblCusPayment.children[1].children[i].lastChild.firstChild.nextSibling.style.display = "none";
        }
    }
    clearSelection(tblCusPayment);

    if (activerowno != "") selectRow(tblCusPayment, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldcuspayment == null) {
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

function viewitem(cuspay, rowno) {

    cuspayment = JSON.parse(JSON.stringify(cuspay));

    tdnum.innerHTML = cuspayment.billno;
    tdpaiddate.innerHTML = cuspayment.paiddate;
    tdcus.innerHTML = cuspayment.customerId.cname;
    tdres.innerHTML = cuspayment.reservationId.regno;
    tdtot.innerHTML = cuspayment.totalamt;
    tdmethod.innerHTML = cuspayment.paymentmethodId.name;
    tdpaid.innerHTML = cuspayment.paidamt;
    tdbal.innerHTML = cuspayment.balance;

}

function printRow() {

    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<body><div style='margin-top: 150px'><h1>Cuspayment Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}

function loadForm() {
    cuspayment = new Object();
    oldcuspayment = null;

    fillCombo(cmbPayType, "Payment Type", ptypes, "name", "");
    fillCombo(cmbPayMethod, "Payment Method", pmethods, "name", "");
    fillCombo(cmbPayStatus, "Payment Status", pstatuses, "name", "");
    fillCombo(cmbResNo, "Reservation", reservations, "regno", "");
    fillCombo3(cmbCusNo, "Select Customer", customers, "regno","cname", "");
    fillCombo(cmbRegBy, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);

    cuspayment.employeeId=JSON.parse(cmbRegBy.value);

    var today = new Date();
    dtePaiddate.value = getDate(today);
    cuspayment.paiddate = dtePaiddate.value;

    // Get Next Number Form Data Base
    var cuspay = httpRequest("/cuspayment/nextnumber", "GET");
    txtNumber.value = cuspay.billno;
    cuspayment.billno = txtNumber.value;
    txtNumber.disabled = true;
    txtChqNo.disabled = true;
    dteChqDate.disabled = true;
    txtBank.disabled = true;
    txtBranch.disabled = true;
    txtAccNo.disabled = true;
    txtAccHoldName.disabled = true;

        txtTotal.value = "";
        txtAmount.value = "";
        txtBalance.value = "";
        txtChqNo.value = "";
        dteChqDate.value = "";
        txtBank.value = "";
        txtBranch.value = "";
        txtAccNo.value = "";
        txtAccHoldName.value = "";

         setStyle(initial);
         txtNumber.style.border = valid;
         dtePaiddate.style.border=valid;
         cmbRegBy.style.border=valid;

    disableButtons(false, true, true);
}

function setStyle(style) {

    txtNumber.style.border = style;
    cmbRegBy.style.border = style;
    dtePaiddate.style.border = style;
    cmbCusNo.style.border = style;
    cmbResNo.style.border = style;
    cmbPayType.style.border = style;
    cmbPayStatus.style.border = style;
    txtTotal.style.border = style;
    cmbPayMethod.style.border = style;
    txtAmount.style.border = style;
    txtBalance.style.border = style;
    txtChqNo.style.border = style;
    dteChqDate.style.border = style;
    txtBank.style.border = style;
    txtBranch.style.border = style;
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

//change payment status according to payment type
function chngStatus() {
    if(JSON.parse(cmbPayType.value).name != ""){
        fillCombo(cmbPayStatus, "Payment Status", pstatuses, "name", "Completed");
        cmbPayStatus.style.border = valid;
    }
    cuspayment.paymentstatusId=JSON.parse(cmbPayStatus.value);
}

function calcBalance() {

    var amt = parseFloat(txtAmount.value).toFixed(2);
    //console.log(txtTotal.value)
//&& amt <= txtTotal.value
    if(amt > 0 ){

        txtAmount.style.border = valid;
        cuspayment.paidamt = amt;

        txtBalance.value = txtTotal.value - txtAmount.value;

        txtBalance.style.border = valid;
        cuspayment.balance = txtBalance.value;

    }else {
        //alert("HAHA")
        txtAmount.style.border = invalid;
    }
}

function validate(id){
    if(id.value > 0 ){
        id.style.border = valid;
    }else
        id.style.border = invalid;

}

function fillDetails() {
    console.log(JSON.parse(cmbResNo.value));
    //var resstatus = res.resstatusId.id;

    txtRecieved.value = parseFloat(JSON.parse(cmbResNo.value).totalpayable).toFixed(2);
    cuspayment.totalamt = txtRecieved.value;
    txtRecieved.style.border = valid;


    var lastpayment = httpRequest("/cuspayment/lastpaymentbyreservation?reservationid="+JSON.parse(cmbResNo.value).id,"GET");
    if(lastpayment ==""){
        txtTotal.value = txtRecieved.value;
    }else {
        txtTotal.value = parseFloat(lastpayment.balance).toFixed(2);
    }

    //
    txtTotal.style.border = valid;
    cuspayment.balance = txtTotal.value;


//     if (resstatus == 7){
//
//     }
//
 }

function cmbCustomerCH() {
    res =  httpRequest("../reservation/bycustomer?customerid="+JSON.parse(cmbCusNo.value).id, "GET");
    fillCombo(cmbResNo, "Select Reservation", res, "regno", "");
    //cmbSerProvider.removeAttribute("disabled","disabled");

}

function cmbPayMethodCH() {
    if(JSON.parse(cmbPayMethod.value).name == "Cheque"){

        txtChqNo.disabled = false;
        dteChqDate.disabled = false;
    }else {
        txtChqNo.disabled = true;
        dteChqDate.disabled = true;
    }

    if(JSON.parse(cmbPayMethod.value).name == "Bank Transfer"){
        txtBank.disabled = false;
        txtBranch.disabled = false;
        txtAccNo.disabled = false;
        txtAccHoldName.disabled = false;
    }else {
        txtBank.disabled = true;
        txtBranch.disabled = true;
        txtAccNo.disabled = true;
        txtAccHoldName.disabled = true;
    }
}

function getErrors() {

    var errors = "";
    addvalue = "";

    if (cuspayment.customerId == null){
        errors = errors + "\n" + "Customer is Not Selected";
        cmbCusNo.style.border = invalid;
    }else
        addvalue = 1;

    if (cuspayment.reservationId == null){
        errors = errors + "\n" + "Reservation is Not Selected";
        cmbResNo.style.border = invalid;
    }else
        addvalue = 1;

    if (cuspayment.paymenttypeId == null){
        errors = errors + "\n" + "Payment Type Name is Not Selected";
        cmbPayType.style.border = invalid;
    }else
        addvalue = 1;

    if (cuspayment.paidamt  == null){
        errors = errors + "\n" + "Paid Amount is Not Entered";
        txtAmount.style.border = invalid;
    }
    else addvalue = 1;

    if (cuspayment.paymentmethodId == null){
        errors = errors + "\n" + "Payment Method is Not Selected";
        cmbPayMethod.style.border = invalid;
    }
    else addvalue = 1;

    return errors;

}

function btnAddMC() {
    if (getErrors() == "") {
        if (txtChqNo.value == "" || dteChqDate.value == "" || txtBank.value == "" || txtBranch.value == ""
            || txtAccNo.value == "" || txtAccHoldName.value == "") {
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
        title: "Are you sure to add following Payment...?",
        text: "\nReg No : " + cuspayment.billno +
            "\nCustomer Name : " + cuspayment.customerId.cname +
            "\nPayment Type : " + cuspayment.paymenttypeId.name +
            "\nTotal Amount : " + cuspayment.totalamt +
            "\nPaid Amount : " + cuspayment.paidamt +
            "\nBalance : " + cuspayment.balance +
            "\nPaid Date : " + cuspayment.paiddate,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/cuspayment", "POST", cuspayment);
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

    if (oldcuspayment == null && addvalue == "") {
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

function fillForm(cuspay, rowno) {
    activerowno = rowno;

    if (oldcuspayment == null) {
        filldata(cuspay);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(cuspay);
                viewForm();
            }

        });
    }

}

function filldata(cuspay) {
    viewForm();
    clearSelection(tblCusPayment);
    selectRow(tblCusPayment, activerowno, active);

    cuspayment = JSON.parse(JSON.stringify(cuspay));
    oldcuspayment = JSON.parse(JSON.stringify(cuspay));

    txtNumber.value = cuspayment.billno;
    txtNumber.disabled = false;

    cmbRegBy.value = cuspayment.employeeId.callingname;
    cmbRegBy.disabled = "disabled";

    dtePaiddate.value = cuspayment.paiddate;
    dtePaiddate.disabled = "disabled";

    cmbCusNo.value = cuspayment.customerId.cname;
    cmbResNo.value = cuspayment.reservationId.regno;
    cmbPayType.value = cuspayment.paymenttypeId.name;
    cmbPayStatus.value = cuspayment.paymentstatusId.name;
    txtTotal.value = cuspayment.totalamt;
    cmbPayMethod.value = cuspayment.paymentmethodId.name;
    txtAmount.value = cuspayment.paidamt;
    txtBalance.value = cuspayment.balance;
    txtChqNo.value = cuspayment.chqno;
    dteChqDate.value = cuspayment.chqdate;
    txtBank.value = cuspayment.bankname;
    txtBranch.value = cuspayment.branchname;
    txtAccNo.value = cuspayment.accno ;
    txtAccHoldName.value = cuspayment.accholdname;

    fillCombo3(cmbCusNo, "Customer Name", customers, "regno","cname", cuspayment.customerId.regno,cuspayment.customerId.cname);
    fillCombo(cmbPayType, "Payment Type", ptypes, "name", cuspayment.paymenttypeId.name);
    fillCombo(cmbResNo, "Reservation", reservations, "regno", cuspayment.reservationId.regno);
    fillCombo(cmbPayStatus, "Payment Status", pstatuses, "name", cuspayment.paymentstatusId.name);
    fillCombo(cmbPayMethod, "Payment Method", pmethods, "name", cuspayment.paymentmethodId.name);
    fillCombo(cmbRegBy, "", employees, "callingname", cuspayment.employeeId.callingname);

    disableButtons(true, false, false);
    setStyle(valid);

    if(cuspayment.description == null){
        txtDescription.style.border = initial;
        txtDescription.value = "";
    }

    if(cuspayment.chqno == null){
        txtChqNo.style.border = initial;
        txtChqNo.value = "";
    }

    if(cuspayment.chqdate == null){
        dteChqDate.style.border = initial;
        dteChqDate.value = "";

    }

    if(cuspayment.bankname == null){
        txtBank.style.border = initial;
        txtBank.value = "";
    }

    if(cuspayment.branchname == null){
        txtBranch.style.border = initial;
        txtBranch.value = "";
    }

    if(cuspayment.accno  == null){
        txtAccNo.style.border = initial;
        txtAccNo.value = "";
    }

    if(cuspayment.accholdname == null){
        txtAccHoldName.style.border = initial;
        txtAccHoldName.value = "";
    }
}

function getUpdates() {

    var updates = "";

    if (cuspayment != null && oldcuspayment != null) {

        if (cuspayment.ctypeId.name != oldcuspayment.ctypeId.name)
            updates = updates + "\nCuspayment Type is Changed";

        if (cuspayment.cstatusId.name != oldcuspayment.cstatusId.name)
            updates = updates + "\nCuspayment Status is Changed";

        if (cuspayment.cname != oldcuspayment.cname)
            updates = updates + "\nCuspayment Name is Changed";

        if (cuspayment.cemail != oldcuspayment.cemail)
            updates = updates + "\nCuspayment Email is Changed";

        if (cuspayment.cregionId.name != oldcuspayment.cregionId.name)
            updates = updates + "\nRegion is Changed";

        if (cuspayment.cmobile != oldcuspayment.cmobile)
            updates = updates + "\nCuspayment Mobile is Changed";

        if (cuspayment.caddress != oldcuspayment.caddress)
            updates = updates + "\nCuspayment Address is Changed";

        if (cuspayment.description != oldcuspayment.description)
            updates = updates + "\nDescription is Changed";

        if (cuspayment.cpname != oldcuspayment.cpname)
            updates = updates + "\nContact Person Name is Changed";

        if (cuspayment.cpemail != oldcuspayment.cpemail)
            updates = updates + "\nContact Person Email is Changed";
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
                title: "Are you sure to update following Payment details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/cuspayment", "PUT", cuspayment);
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

function btnDeleteMC(cuspay) {
    cuspayment = JSON.parse(JSON.stringify(cus));

    swal({
        title: "Are you sure to delete following Payment...?",
        text: "\nReg No : " + cuspayment.billno +
            "\nCustomer Name : " + cuspayment.customerId.cname +
            "\nPayment Type : " + cuspayment.paymenttypeId.name +
            "\nTotal Amount : " + cuspayment.totalamt +
            "\nPaid Amount : " + cuspayment.paidamt +
            "\nBalance : " + cuspayment.balance +
            "\nPaid Date : " + cuspayment.paiddate,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/cuspayment", "DELETE", cuspayment);
            if (responce == 0) {
                swal({
                    title: "Deleted Successfully....!",
                    text: "\n\n  Status change to deleted",
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

function btnPrintTableMC(cuspayment) {

    var newwindow = window.open();
    formattab = tblCusPayment.outerHTML;

    newwindow.document.write("" +
        "<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
        "<link rel='stylesheet' href='../plugin/bootstrap/css/bootstrap.min.css'/></head>" +
        "<body><div style='margin-top: 150px; '> <h1>Customer Payment Details : </h1></div>" +
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

    var cprop = tblCusPayment.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        cuspayments.sort(
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
        cuspayments.sort(
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
    fillTable('tblCusPayment', cuspayments, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblCusPayment);

    if (activerowno != "") selectRow(tblCusPayment, activerowno, active);


}