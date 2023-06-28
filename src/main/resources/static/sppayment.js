window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    cmbPayMethod.addEventListener("change", cmbPayMethodCH);
    mnthPaymentMnth.addEventListener("change", calcPrice);
    txtAmount.addEventListener("keyup", calcBal);

    privilages = httpRequest("../privilage?module=SpPayment", "GET");

    pstatuses = httpRequest("../paymentstatus/list", "GET");
    pmethods = httpRequest("../paymentmethod/list", "GET");
    serviceproviders = httpRequest("../serviceprovider/list", "GET");
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
    sppayments = new Array();
    var data = httpRequest("/sppayment/findAll?page=" + page + "&size=" + size + query, "GET");
    if (data.content != undefined) sppayments = data.content;
    createPagination('pagination', data.totalPages, data.number + 1, paginate);

    fillTable('tblSpPayment', sppayments, fillForm, btnDeleteMC, viewitem);
    if (sppayments.length != 0){
        for (var i =0; i<tblSpPayment.children[1].children.length;i++){
            tblSpPayment.children[1].children[i].lastChild.firstChild.style.display = "none";
            tblSpPayment.children[1].children[i].lastChild.firstChild.nextSibling.style.display = "none";
        }
    }
    clearSelection(tblSpPayment);

    if (activerowno != "") selectRow(tblSpPayment, activerowno, active);

}

function paginate(page) {
    var paginate;
    if (oldsppayment == null) {
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

function viewitem(sppay, rowno) {

    tdnum.innerHTML = sppayment.spbillno;
    tdpaiddate.innerHTML = sppayment.paiddate;
    tdsp.innerHTML = sppayment.serviceproviderId.name;
    tdmonth.innerHTML = sppayment.month;
    tdmonthamt.innerHTML = sppayment.totalamount;
    tdmethod.innerHTML = sppayment.paymentmathodId;
    tdpaid.innerHTML = sppayment.paidamount;
    tdbal.innerHTML = sppayment.balance;
}

function printRow() {

    var format = printformtable.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<body><div style='margin-top: 150px'><h1>Service Provider Payment Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>printformtable.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);
}

function loadForm() {
    sppayment = new Object();
    oldsppayment = null;

    fillCombo(cmbPayMethod, "Payment Method", pmethods, "name", "");
    fillCombo(cmbPayStatus, "Payment Status", pstatuses, "name", "Completed");
    fillCombo(cmbSerProvider, "Service Provider", serviceproviders, "name", "");
    fillCombo(cmbRegBy, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);

    sppayment.employeeId=JSON.parse(cmbRegBy.value);
    sppayment.paymentstatusId=JSON.parse(cmbPayStatus.value);

    var today = new Date();
    dtePaiddate.value = getDate(today);
    sppayment.paiddate = dtePaiddate.value;

    // Get Next Number Form Data Base
    var sppay = httpRequest("/sppayment/nextnumber", "GET");
    txtNumber.value = sppay.spbillno;
    sppayment.spbillno = txtNumber.value;

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
    mnthPaymentMnth.value = "";
    txtAmount.value = "";
    txtmnthlyamt.value = "";

    setStyle(initial);
    txtNumber.style.border = valid;
    dtePaiddate.style.border=valid;
    cmbRegBy.style.border=valid;
    cmbPayStatus.style.border=valid;

    disableButtons(false, true, true);
}

function setStyle(style) {

    txtNumber.style.border = style;
    cmbRegBy.style.border = style;
    dtePaiddate.style.border = style;
    cmbSerProvider.style.border = style;
    mnthPaymentMnth.style.border = style;
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
    txtmnthlyamt.style.border = style;

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
function calcBal(){

    var amt = parseFloat(txtAmount.value).toFixed(2);
    //console.log(txtTotal.value)

//&& amt >= txtTotal.value
    if(amt > 0  ){

        console.log(amt);

    txtAmount.style.border = valid;
    sppayment.paidamount = amt;

    txtBalance.value = txtTotal.value - txtAmount.value;

    txtBalance.style.border = valid;
    sppayment.balance = txtBalance.value;

}else {
    //txtAmount.style.border = invalid;
}
}

function calcPrice(){

    payment =  httpRequest("../servicereservation/byproviderandmnth?providerid="+JSON.parse(cmbSerProvider.value).id+"&month="+mnthPaymentMnth.value, "GET");
    total = 0.00;

    for(var index in payment){
        total = parseFloat(total) + parseFloat(payment[index].pkgprice) + parseFloat(payment[index].addtionalfeaturescharge);
    }

    //console.log(total)
    txtmnthlyamt.value = total;
    txtmnthlyamt.style.border = valid;

    var lastpayment = httpRequest("/sppayment/lastpaymentbyspreservation?serviceproviderid="+JSON.parse(cmbSerProvider.value).id,"GET");
    console.log(lastpayment);

    if(lastpayment == ""){
        txtTotal.value = total;
        sppayment.totalamount = total;
    }else {
        total = parseFloat(total) + parseFloat(lastpayment.balance)
        txtTotal.value = parseFloat(total).toFixed(2);
    }
    sppayment.totalamount = txtTotal.value;
        txtTotal.style.border = valid;

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

    if (sppayment.serviceproviderId == null){
        errors = errors + "\n" + "Service Provider is Not Selected";
        cmbSerProvider.style.border = invalid;
    }else
        addvalue = 1;

    if (sppayment.month == null){
        errors = errors + "\n" + "Payment Month is Not Selected";
        mnthPaymentMnth.style.border = invalid;
    }else
        addvalue = 1;

    if (sppayment.paymentstatusId == null){
        errors = errors + "\n" + "Payment Status is Not Selected";
        cmbPayStatus.style.border = invalid;
    }else
        addvalue = 1;

    if (sppayment.paidamount  == null){
        errors = errors + "\n" + "Paid Amount is Not Entered";
        txtAmount.style.border = invalid;
    }
    else addvalue = 1;

    if (sppayment.paymentmethodId == null){
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
        text: "\nReg No : " + sppayment.spbillno +
            "\nTotal Amount : " + sppayment.totalamount +
            "\nPaid Amount : " + sppayment.paidamount +
            "\nBalance : " + sppayment.balance +
            "\nPaid Date : " + sppayment.paiddate,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/sppayment", "POST", sppayment);
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

    if (oldsppayment == null && addvalue == "") {
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

function fillForm(sppay, rowno) {
    activerowno = rowno;

    if (oldsppayment == null) {
        filldata(sppay);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(sppay);
                viewForm();
            }

        });
    }

}

function filldata(sppay) {
    viewForm();
    clearSelection(tblSpPayment);
    selectRow(tblSpPayment, activerowno, active);

    sppayment = JSON.parse(JSON.stringify(sppay));
    oldsppayment = JSON.parse(JSON.stringify(sppay));

    txtNumber.value = sppayment.cusbillno;
    txtNumber.disabled = false;

    cmbRegBy.value = sppayment.employeeId.callingname;
    cmbRegBy.disabled = "disabled";

    dtePaiddate.value = sppayment.paiddate;
    dtePaiddate.disabled = "disabled";

    cmbSerProvider.value = sppayment.serviceproviderId.name;
    mnthPaymentMnth.value = sppayment.month;
    cmbPayStatus.value = sppayment.paymentstatusId.name;
    txtTotal.value = sppayment.totalamount;
    cmbPayMethod.value = sppayment.paymentmethodId.name;
    txtAmount.value = sppayment.paidamount;
    txtBalance.value = sppayment.balance;
    txtChqNo.value = sppayment.chqno;
    dteChqDate.value = sppayment.chqdate;
    txtBank.value = sppayment.bankname;
    txtBranch.value = sppayment.branchname;
    txtAccNo.value = sppayment.accno ;
    txtAccHoldName.value = sppayment.accholdname;

    fillCombo(cmbSerProvider, "Service Provider", providers, "name", sppayment.serviceproviderId.name);
    fillCombo(cmbPayStatus, "Payment Status", pstatuses, "name", sppayment.paymentstatusId.name);
    fillCombo(cmbPayMethod, "Payment Method", pmethods, "name", sppayment.paymentmethodId.name);
    fillCombo(cmbRegBy, "", employees, "callingname", sppayment.employeeId.callingname);

    disableButtons(true, false, false);
    disableFields();
    setStyle(valid);

    if(sppayment.description == null){
        txtDescription.style.border = initial;
    }

    if(sppayment.chqno == null){
        txtChqNo.style.border = initial;
    }

    if(sppayment.chqdate == null){
        dteChqDate.style.border = initial;
    }

    if(sppayment.bankname == null){
        txtBank.style.border = initial;
    }

    if(sppayment.branchname == null){
        txtBranch.style.border = initial;
    }

    if(sppayment.accno  == null){
        txtAccNo.style.border = initial;
    }

    if(sppayment.accholdname == null){
        txtAccHoldName.style.border = initial;
    }
}

// function validate(){
//     if(txtAmount.value > 0 ){
//         txtAmount.style.border = valid;
//     }else
//         txtAmount.style.border = invalid;
//
// }

function getUpdates() {

    var updates = "";

    if (sppayment != null && oldsppayment != null) {

        if (sppayment.ctypeId.name != oldsppayment.ctypeId.name)
            updates = updates + "\nCuspayment Type is Changed";

        if (sppayment.cstatusId.name != oldsppayment.cstatusId.name)
            updates = updates + "\nCuspayment Status is Changed";

        if (sppayment.cname != oldsppayment.cname)
            updates = updates + "\nCuspayment Name is Changed";

        if (sppayment.cemail != oldsppayment.cemail)
            updates = updates + "\nCuspayment Email is Changed";

        if (sppayment.cregionId.name != oldsppayment.cregionId.name)
            updates = updates + "\nRegion is Changed";

        if (sppayment.cmobile != oldsppayment.cmobile)
            updates = updates + "\nCuspayment Mobile is Changed";

        if (sppayment.caddress != oldsppayment.caddress)
            updates = updates + "\nCuspayment Address is Changed";

        if (sppayment.description != oldsppayment.description)
            updates = updates + "\nDescription is Changed";

        if (sppayment.cpname != oldsppayment.cpname)
            updates = updates + "\nContact Person Name is Changed";

        if (sppayment.cpemail != oldsppayment.cpemail)
            updates = updates + "\nContact Person Email is Changed";

        if (sppayment.nic != oldsppayment.nic)
            updates = updates + "\nNIC is Changed";

        if (sppayment.cpmobile != oldsppayment.cpmobile)
            updates = updates + "\nContact Person Mobile Number is Changed";

        if (sppayment.cpland != oldsppayment.cpland)
            updates = updates + "\nContact Person Land Number is Changed";

        if (sppayment.cpaddress != oldsppayment.cpaddress)
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
                title: "Are you sure to update following sppayment details...?",
                text: "\n" + getUpdates(),
                icon: "warning", buttons: true, dangerMode: true,
            })
                .then((willDelete) => {
                    if (willDelete) {
                        var response = httpRequest("/sppayment", "PUT", sppayment);
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

function btnDeleteMC(sppay) {
    sppayment = JSON.parse(JSON.stringify(cus));

    swal({
        title: "Are you sure to delete following Cuspayment...?",
        text: "\nReg No : " + sppayment.cusbillno +
            "\nCustomer Name : " + sppayment.customerId.cname +
            "\nPayment Type : " + sppayment.paymenttypeId.name +
            "\nTotal Amount : " + sppayment.totalamount +
            "\nPaid Amount : " + sppayment.paidamount +
            "\nBalance : " + sppayment.balance +
            "\nPaid Date : " + sppayment.paiddate,
        icon: "warning", buttons: true, dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var responce = httpRequest("/sppayment", "DELETE", sppayment);
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

function btnPrintTableMC(sppayment) {

    var newwindow = window.open();
    formattab = tblSpPayment.outerHTML;

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

    var cprop = tblSpPayment.firstChild.firstChild.children[cindex].getAttribute('property');

    if (cprop.indexOf('.') == -1) {
        sppayments.sort(
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
        sppayments.sort(
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
    fillTable('tblSpPayment', sppayments, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblSpPayment);

    if (activerowno != "") selectRow(tblSpPayment, activerowno, active);


}