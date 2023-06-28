
window.addEventListener("load", initialize);

//Initializing Functions
function initialize() {

    btnAdd.addEventListener("click", btnAddMC);
    btnClear.addEventListener("click", btnClearMC);
    btnUpdate.addEventListener("click", btnUpdateMC);

    txtSearchName.addEventListener("keyup", btnSearchMC);

    cmbService.addEventListener("change", fillSerCharge);
    cmbService.addEventListener("change", cmbServiceCH);
    cmbPkg.addEventListener("change", cmbPackageCH);

    cmbProviderPkg.addEventListener("change", calcReservedSerPrice);
    btnInnerEventAdd.addEventListener("click", fillSerEvent);
    btnInnerSerAdd.addEventListener("click", fillSerEvent);

    timStart.addEventListener("change", setETime);
    timEnd.addEventListener("change", settimEndCH);
    timActTimeFrom.addEventListener("change", setActtimStartCH);
    timActTimeTo.addEventListener("change", setActtimEndCH);
    cmbActivity.addEventListener("change", enterActivityCH);
    cmbEvent.addEventListener("change", enterEventCH);

    cmbSerProvider.addEventListener("change", cmbProviderCH);
    cmbCustomer.addEventListener("change", fillCustomer);
    cmbPkg.addEventListener("change", fillPkg);
    cmbFeature.addEventListener("change", fillAddFeatureCost);
    txtQty.addEventListener("keyup", calcLineTotal);
    txtDiscount.addEventListener("keyup", calcTotal);
    txtPrecent.addEventListener("keyup", addPrecent);

    timStart.addEventListener("change", setDuration);

    privilages = httpRequest("../privilage?module=Reservation", "GET");

    serviceproviders = httpRequest("../serviceprovider/list", "GET");
    packages = httpRequest("../package/list", "GET");
    addfeatures = httpRequest("../additionalfeatures/list", "GET");
    customers = httpRequest("../customer/list", "GET");
    resstatuses = httpRequest("../resstatus/list", "GET");
    events = httpRequest("../event/list", "GET");
    activity = httpRequest("../activity/list", "GET");
    services = httpRequest("../service/list", "GET");
    providerpackages = httpRequest("../providerpackage/list", "GET");
    employees = httpRequest("../employee/list", "GET");

    valid = "2px solid green";
    invalid = "2px solid red";
    initial = "2px solid #d6d6c2";
    updated = "2px solid #ff9900";
    active = "#ff9900";

    loadForm();
    loadView();
    changeTab('divevent');
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
    reservations = new Array();

    var data = httpRequest("/reservation/findAll?page=" + page + "&size=" + size + query, "GET");

    if (data.content != undefined)
        reservations = data.content;

    createPagination('pagination', data.totalPages, data.number + 1, paginate);
    fillTable('tblReservation', reservations, fillForm, btnDeleteMC, viewitem);
    clearSelection(tblReservation);
    selectDeleteRow();

    if (activerowno != "")
        selectRow(tblReservation, activerowno, active);

}

//dlt the selected row
function selectDeleteRow() {
    for (index in reservations) {
        if (reservations[index].resstatusId.name == "Deleted") {
            tblReservation.children[1].children[index].style.color = "#f00";
            tblReservation.children[1].children[index].style.border = "2px solid red";
            tblReservation.children[1].children[index].lastChild.children[1].disabled = true;
            tblReservation.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";
        }
    }
}

function paginate(page) {
    var paginate;
    if (oldreservation == null) {
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

    reservation = JSON.parse(JSON.stringify(res));

     tdres.innerHTML = reservation.regno;
     tdregdate.innerHTML = reservation.regdate;
     tdregby.innerHTML = reservation.employeeId.callingname;
     tdcus.innerHTML = reservation.customerId.cname;
     tdcontact.innerHTML = reservation.customerId.cmobile;
     tdemail.innerHTML = reservation.customerId.cemail;
     tdtotal.innerHTML = "Rs." + toDeimal(reservation.totalprice);
     tddiscount.innerHTML = "Rs." + toDeimal(reservation.discount);
     tdpayable.innerHTML = "Rs." + toDeimal(reservation.totalpayable);
     tdadvance.innerHTML = "Rs." + toDeimal(reservation.advance);

    //console.log(reservation)
    var eventrlist = reservation.eventReservationList;
    var servicerlist = reservation.serviceReservationList;

   // tblEventDetails
    for(var index in eventrlist){

        var tbody = tblEventDetails.children[1];
        tbody.innerHTML = "";

        var tr = document.createElement('tr');
        var tdid = document.createElement('td');
        tdid.innerHTML =  parseInt(index) + 1;

        var tdevname = document.createElement('td');
        tdevname.innerHTML =  eventrlist[index].eventId.name;

        var tdevdate = document.createElement('td');
        tdevdate.innerHTML =  eventrlist[index].eventdate;

        var tdevstime = document.createElement('td');
        tdevstime.innerHTML =  eventrlist[index].starttime;

        var tdevetime = document.createElement('td');
        tdevetime.innerHTML =  eventrlist[index].endtime;

        var tdevlocation = document.createElement('td');
        tdevlocation.innerHTML =  eventrlist[index].location;

        var tdevtservice = document.createElement('td');
        tdevtservice.colSpan = 5;

        if(servicerlist.length != 0){

            var tables = document.createElement('table');

            tables.classList.add('table');
            tables.classList.add('table-bordered');
            tables.classList.add('table-striped');
            tables.classList.add('table-hover');

            var theads = document.createElement('thead');
            var tbodys = document.createElement('tbody');
            tbodys.innerHTML = "";

            var trsrth = document.createElement('tr');
            var thsrid = document.createElement('th');
            thsrid.innerHTML = "Id";

            var thsrsname = document.createElement('th');
            thsrsname.innerHTML = "Service";

            var thsrscharge = document.createElement('th');
            thsrscharge.innerHTML = "Service Charge";

            var thsrsprovider = document.createElement('th');
            thsrsprovider.innerHTML = "Provider";

            var thsrppackage = document.createElement('th');
            thsrppackage.innerHTML = "Package";

            var thsrspprice = document.createElement('th');
            thsrspprice.innerHTML = "Package Price";

            var thsrsafprice = document.createElement('th');
            thsrsafprice.innerHTML = "Additional Charge";

            var thsrstcharge = document.createElement('th');
            thsrstcharge.innerHTML = "Total Charge";

            trsrth.appendChild(thsrid);
            trsrth.appendChild(thsrsname);
            trsrth.appendChild(thsrscharge);
            trsrth.appendChild(thsrsprovider);
            trsrth.appendChild(thsrppackage);
            trsrth.appendChild(thsrspprice);
            trsrth.appendChild(thsrsafprice);
            trsrth.appendChild(thsrstcharge);

            theads.appendChild(trsrth);
            tables.appendChild(theads)

            for(var ind in servicerlist){

                if(servicerlist[ind].eventId.name == eventrlist[index].eventId.name){

                    var trsrb = document.createElement('tr');
                    var tddsrid = document.createElement('td');

                    tddsrid.innerHTML =  parseInt(ind) + 1;

                    var tdsrsname = document.createElement('td');
                    tdsrsname.innerHTML =  servicerlist[index].serviceId.servicename;

                    var tdsrscharge = document.createElement('td');
                    tdsrscharge.innerHTML =  parseFloat(servicerlist[index].servicecharge).toFixed(2);

                    var tdsrsprovider = document.createElement('td');
                    tdsrsprovider.innerHTML =  servicerlist[index].providerpackageId.serviceproviderId.name;

                    var tdsrsppackage = document.createElement('td');
                    tdsrsppackage.innerHTML =  servicerlist[index].providerpackageId.name;

                    var tdsrsppchagre = document.createElement('td');
                    tdsrsppchagre.innerHTML =  parseFloat(servicerlist[index].providerpackageId.price).toFixed(2);

                    var tdsracharge = document.createElement('td');
                    if(servicerlist[index].addtionalfeaturescharge != null)
                        tdsracharge.innerHTML =  parseFloat(servicerlist[index].addtionalfeaturescharge).toFixed(2);
                    else  tdsracharge.innerHTML = "-";

                    var tdsrtcharge = document.createElement('td');
                    tdsrtcharge.innerHTML =  parseFloat(servicerlist[index].srlinetotal).toFixed(2);

                    trsrb.appendChild(tddsrid);
                    trsrb.appendChild(tdsrsname);
                    trsrb.appendChild(tdsrscharge);
                    trsrb.appendChild(tdsrsprovider);
                    trsrb.appendChild(tdsrsppackage);
                    trsrb.appendChild(tdsrsppchagre);
                    trsrb.appendChild(tdsracharge);
                    trsrb.appendChild(tdsrtcharge);

                    tbodys.appendChild(trsrb);
                }
            }

            tables.appendChild(tbodys);
            tdevtservice.appendChild(tables);

        }

        tr.appendChild(tdid);
        tr.appendChild(tdevname);
        tr.appendChild(tdevdate);
        tr.appendChild(tdevstime);
        tr.appendChild(tdevetime);
        tr.appendChild(tdevlocation);

        tr.appendChild(tdevtservice);

        tbody.appendChild(tr);
    }


    // tdnic.innerHTML = reservation.nic;
    // tdcpmobile.innerHTML = reservation.cpmobile;
    // tdcpland.innerHTML = reservation.cpland;
     //tdcpaddress.innerHTML = reservation.cpaddress;


}

function printRow() {
    var format = resPrintView.outerHTML;

    var newwindow = window.open();
    newwindow.document.write("<html>" +
        "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style></head>" +
        "<body><div style='margin-top: 150px'><h1>Reservation Details :</h1></div>" +
        "<div>" + format + "</div>" +
        "<script>resPrintView.removeAttribute('style')</script>" +
        "</body></html>");
    setTimeout(function () {
        newwindow.print();
        newwindow.close();
    }, 100);

}

function loadForm() {
    reservation = new Object();
    oldreservation = null;

    //timStart.min = "06:00";

    reservation.serviceReservationList = new Array();//assosiation list for service
    reservation.eventReservationList = new Array();//assosiation list for events

    fillCombo3(cmbCusNo, "Select Customer", customers, "regno","cname", "");
    fillCombo3(cmbCustomer, "Select Customer", customers, "regno","cname", "");
    fillCombo3(cmbCusNumber, "Select Customer", customers, "regno","cname", "");

    fillCombo(cmbPkg, "Select Package", packages, "name", "");
    fillCombo(cmbPackage, "Select Package", packages, "name", "");
    fillCombo(cmbResPkg, "Select Package", packages, "name", "");

    fillCombo(cmbFeature, "Feature", addfeatures, "name", "");
    fillCombo(cmbRegBy, "", employees, "callingname", session.getObject('activeuser').employeeId.callingname);
    fillCombo(cmbResStatus, "Reservation Status", resstatuses, "name", "Pending");
    fillCombo(cmbEvent, "Event", events, "name", "");
    fillCombo(cmbActivity, "Activity", activity, "name", "");
    fillCombo(cmbSerEvent, "Event", events, "name", "");
    fillCombo(cmbService, "Service", services, "servicename", "");
    fillCombo(cmbProviderPkg, "Package", providerpackages, "name", "");
    fillCombo(cmbSerProvider, "Provider", serviceproviders, "name", "");

    reservation.resstatusId=JSON.parse(cmbResStatus.value);
    reservation.employeeId=JSON.parse(cmbRegBy.value);

    //Autofill date
    var today = new Date();
    dteRegDate.value = getDate(today);
    reservation.regdate = dteRegDate.value;

    // Get Next Number Form Data Base
    var res = httpRequest("/reservation/nextnumber", "GET");
    txtNumber.value = res.regno;
    txtResId.value = res.regno;
    txtResNo.value = res.regno;
    reservation.regno = txtNumber.value;

    txtNumber.disabled = true;
    txtResNo.disabled = true;
    cmbResStatus.disabled = true;
    cmbSerProvider.setAttribute("disabled", "disabled");
    cmbProviderPkg.setAttribute("disabled", "disabled");
    cmbPkg.disabled = false;

    txtDiscount.value = "0.0";
    reservation.discount =parseFloat(txtDiscount.value);
    //console.log(reservation.discount);

    txtSerCharge.value = "";
    txtPkgPrice.value = "";
    txtReservedSerPrice.value = "";
    txtAddFeaturePrice.value = "";
    txtQty.value = "";
    txtLineTot.value = "";
    txtNetTot.value = "";
    txtTotAmt.value = "";
    txtAddCost.value = "";
    dteDate.value = "";
    timStart.value = "";
    timEnd.value = "";
    eventLoc.value = "";
    txtEvent.value = "";
    txtActivity.value = "";
    txtActLocFrom.value = "";
    txtActLocTo.value = "";
    timActTimeFrom.value = "";
    timActTimeTo.value = "";
    txtDistance.value = "";
    timTravelTime.value = "";
    txtTotal.value = "";
    txtTotPayable.value = "";
    txtAdvance.value = "";
    txtPrecent.value = "";
    txtDescription.value = "";

    setStyle(initial);

    txtResId.style.border = valid;
    txtNumber.style.border = valid;
    txtResNo.style.border = valid;
    dteRegDate.style.border=valid;
    cmbRegBy.style.border=valid;
    cmbResStatus.style.border=valid;
    txtDiscount.style.border=valid;

    disableButtons(false, true, true);
    refreshInnerSerForm();
    refreshInnerEventForm();
}

function setStyle(style) {

    txtResId.style.border = style;
    cmbCusNo.style.border = style;
    cmbPackage.style.border = style;
    txtResNo.style.border = style;
    cmbCustomer.style.border = style;
    cmbPkg.style.border = style;
    cmbService.style.border = style;
    cmbSerProvider.style.border = style;
    cmbProviderPkg.style.border = style;
    txtSerCharge.style.border = style;
    txtPkgPrice.style.border = style;
    txtReservedSerPrice.style.border = style;
    cmbFeature.style.border = style;
    txtAddFeaturePrice.style.border = style;
    txtQty.style.border = style;
    txtLineTot.style.border = style;
    txtNetTot.style.border = style;
    txtTotAmt.style.border = style;
    txtAddCost.style.border = style;
    cmbEvent.style.border = style;
    cmbSerEvent.style.border = style;
    dteDate.style.border = style;
    timStart.style.border = style;
    timEnd.style.border = style;
    eventLoc.style.border = style;
    txtEvent.style.border = style;
    txtActivity.style.border = style;
    cmbActivity.style.border = style;
    txtActLocFrom.style.border = style;
    txtActLocTo.style.border = style;
    timActTimeFrom.style.border = style;
    timActTimeTo.style.border = style;
    txtDistance.style.border = style;
    timTravelTime.style.border = style;
    txtNumber.style.border = style;
    cmbRegBy.style.border = style;
    dteRegDate.style.border = style;
    cmbCusNumber.style.border = style;
    cmbResStatus.style.border = style;
    cmbResPkg.style.border = style;
    txtTotal.style.border = style;
    txtDiscount.style.border = style;
    txtTotPayable.style.border = style;
    txtAdvance.style.border = style;
    txtPrecent.style.border = style;
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

//Inner Service Reservation Form
function refreshInnerSerForm() {

    servicereservation = new Object();

    //assosiation list for additinal features
    servicereservation.additionalFeaturesDetailsList = new Array();
    total = 0.0;

    servicereservation.addtionalfeaturescharge = 0;
    txtAddCost.value = 0.0

    fillCombo(cmbService,"Select Service",services,"servicename");
    fillCombo(cmbProviderPkg,"Select Package",providerpackages,"name");
    fillCombo(cmbSerProvider,"Select Provider",serviceproviders,"name");
    fillCombo(cmbSerEvent,"Select Event",events,"name");

    txtPkgPrice.value = "";
    txtSerCharge.value = "";
    txtReservedSerPrice.value = "";
    txtAddCost.value = "";
    txtNetTot.value = "";
    txtTotAmt.value = "";

    cmbService.style.border = initial;
    cmbProviderPkg.style.border = initial;
    cmbSerProvider.style.border = initial;
    cmbSerEvent.style.border = initial;
    txtPkgPrice.style.border = initial;
    txtSerCharge.style.border = initial;
    txtReservedSerPrice.style.border = initial;
    txtNetTot.style.border = initial;
    txtTotAmt.style.border = initial;
    txtAddCost.style.border = initial;

    fillInnerTable("tblInnerService",reservation.serviceReservationList,modifyInnerSerForm,deleteInnerSerForm);

    if(reservation.serviceReservationList.length != 0){
        for(index in reservation.serviceReservationList){
            total = parseFloat(total) + parseFloat(reservation.serviceReservationList[index].srlinetotal);
        }

        txtTotAmt.value = toDeimal(total,2);
        txtTotal.value = txtTotAmt.value;
        txtTotPayable.value = txtTotAmt.value;

        reservation.totalprice = txtTotal.value;
        reservation.totalpayable = txtTotPayable.value;

        txtAdvance.value =toDeimal((txtTotPayable.value)*(0.5));
        reservation.advance = txtAdvance.value;

        txtAdvance.style.border = valid;
        txtTotal.style.border = valid;
        txtTotAmt.style.border = valid;
        txtTotPayable.style.border = valid;

    }

    btnInnerSerAdd.removeAttribute("disabled","disabled");
    btnInnerSerUpdate.setAttribute("disabled","disabled");

    refreshInnerAddFeaForm();

}

function getInnerSerErrors() {
    var serErr = "";
    addServalue = "";

    if (servicereservation.serviceId == null){
        serErr = serErr + "\n" + "Service is Not Selected";
        cmbService.style.border = invalid;
    }else
        addServalue = 1;

    if (reservation.customerId == null){
        serErr = serErr + "\n" + "Customer is Not Selected";
        cmbCusNumber.style.border = invalid;
    }else
        addServalue = 1;

    if (servicereservation.eventId == null){
        serErr = serErr + "\n" + "Event is Not Selected";
        cmbSerEvent.style.border = invalid;
    }else
        addServalue = 1;

    if (servicereservation.providerpackageId == null){
        serErr = serErr + "\n" + "Package is Not Entered";
        cmbProviderPkg.style.border = invalid;
    }else
        addServalue = 1;

    return serErr;
}

function btnInnerSerAddMC() {

    if (getInnerSerErrors() == "") {

        servicereservation.serviceId = JSON.parse(cmbService.value);
        servicereservation.providerpackageId = JSON.parse(cmbProviderPkg.value);
        servicereservation.eventId = JSON.parse(cmbSerEvent.value);
        servicereservation.pkgprice = parseFloat(txtPkgPrice.value).toFixed(2);

        serviceExs = false;
        for (index in reservation.serviceReservationList) {
            if (reservation.serviceReservationList[index].serviceId.servicename == JSON.parse(cmbService.value).servicename) {

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
            reservation.serviceReservationList.push(servicereservation);
            refreshInnerSerForm();
        }
    }else{
        swal({
            title: "You have following errors",
            text:"\n" + getInnerSerErrors(),
            icon:"warning",
            buttons:true,

        })
    }

}

function btnInnerSerClearMC() {
    check = getInnerSerErrors();

    if(addServalue == ""){

        swal({
            title: "Are you sure to clear this Inner form...?",
            text:"\n",
            icon:"warning",
            buttons:true,

        }).then((willUpdate) => {
            if(willUpdate){
                refreshInnerSerForm();
            }
        });
    }
}

function modifyInnerSerForm(servicereservation,indx) {
    selectedInnerRow = indx;

    fillCombo(cmbService,"Select Service",services,"servicename",servicereservation.serviceId.servicename);
    fillCombo(cmbSerProvider,"Select Provider",serviceproviders,"name",servicereservation.providerpackageId.serviceproviderId.name);
    fillCombo(cmbProviderPkg,"Select Package",providerpackages,"name",servicereservation.providerpackageId.name);
    fillCombo(cmbSerEvent,"Select Event",events,"name",servicereservation.eventId.name);
    txtPkgPrice.value = servicereservation.pkgprice;
    txtSerCharge.value = servicereservation.servicecharge;
    txtReservedSerPrice.value = servicereservation.reservedserprice;
    txtNetTot.value = servicereservation.srlinetotal;
    txtAddCost.value = servicereservation.addtionalfeaturescharge;

    cmbService.style.border = valid;
    cmbSerEvent.style.border = valid;
    cmbProviderPkg.style.border = valid;
    cmbSerProvider.style.border = valid;
    txtPkgPrice.style.border = valid;
    txtSerCharge.style.border = valid;
    txtAddCost.style.border = valid;
    txtReservedSerPrice.style.border = valid;
    txtNetTot.style.border = valid;
    txtTotAmt.style.border = valid;

    if(txtAddCost.value = 0.0){
        txtAddCost.style.border = initial;

    }

    btnInnerSerAdd.setAttribute("disabled","disabled");
    btnInnerSerUpdate.removeAttribute("disabled","disabled");
}

function btnInnerSerUpdateMC() {
    innerUpdates = getInnerSerUpdate(reservation.serviceReservationList[selectedInnerRow]);

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
            buttons:true,
        })
            .then((willUpdate) => {
                if(willUpdate){
                    reservation.serviceReservationList[selectedInnerRow].serviceId = JSON.parse(cmbService.value);
                    reservation.serviceReservationList[selectedInnerRow].providerpackageId = JSON.parse(cmbProviderPkg.value);
                    reservation.serviceReservationList[selectedInnerRow].eventId = JSON.parse(cmbSerEvent.value);
                    reservation.eventReservationList[selectedInnerRow].pkgprice = txtPkgPrice.value;
                    reservation.eventReservationList[selectedInnerRow].servicecharge = txtSerCharge.value;
                    refreshInnerSerForm();
                }
            });
    }
}

function getInnerSerUpdate(servicereservation) {
    var updates = "";
    if(servicereservation.serviceId.servicename != JSON.parse(cmbService.value)){
        updates = updates + "\nService is Updated";
        cmbService.style.border = updated;
    }

    if(servicereservation.eventId.name != JSON.parse(cmbSerEvent.value)){
        updates = updates + "\nEvent is Not Selected";
        cmbSerEvent.style.border = updated;
    }

    if(servicereservation.providerpackageId.name != JSON.parse(cmbProviderPkg.value)){
        updates = updates + "\nPackage is Not Selected";
        cmbProviderPkg.style.border = updated;
    }

    // if(servicereservation.providerpackageId.name != JSON.parse(cmbSerProvider.value)){
    //     updates = updates + "\nProvider is Not Selected";
    //     cmbSerProvider.style.border = updated;
    // }

    return updates;
}

function deleteInnerSerForm(reservationrow ,indx) {
    swal({
        title: "Do you want to remove the selected service?",
        text:"\n",
        icon:"warning",
        buttons:true,
    }).then((willDelete) => {
        if(willDelete){
            reservation.serviceReservationList.splice(indx,1);
            refreshInnerSerForm();

        }
    })


}


//InnerAdditional Features Form
function refreshInnerAddFeaForm() {

    additionalfeatures = new Object();
    var total =0.0;
    fillCombo(cmbFeature, "Feature", addfeatures, "name", "");

    txtAddFeaturePrice.value = "";
    txtQty.value = "";
    txtLineTot.value = "";

    cmbFeature.style.border = initial;
    txtAddFeaturePrice.style.border = initial;
    txtQty.style.border = initial;
    txtLineTot.style.border = initial;

    fillInnerTable("tblInnerFeature",servicereservation.additionalFeaturesDetailsList,modifyInnerAddFeaForm,deleteInnerAddFeaForm);

    if(servicereservation.additionalFeaturesDetailsList.length != 0){
         for(index in servicereservation.additionalFeaturesDetailsList){
            total = parseFloat(total) + parseFloat(servicereservation.additionalFeaturesDetailsList[index].linetotal);
            serviceTotal = parseFloat(servicereservation.reservedserprice) + parseFloat(total);
         }
        txtAddCost.value = toDeimal(total,2);
        servicereservation.addtionalfeaturescharge = txtAddCost.value;
        txtAddCost.style.border=valid;

        txtNetTot.value = toDeimal(serviceTotal,2);
        servicereservation.reservedserprice = txtNetTot.value;
        txtNetTot.style.border=valid;

    }else{
        txtAddCost.value = "";
        servicereservation.addtionalfeaturescharge= null;
    }

    btnInnerAddFeaClear.removeAttribute("disabled","disabled");
    btnInnerAddFeaUpdate.setAttribute("disabled","disabled");

}

function getInnerAddFeaErrors() {
    var addFeaErrors = "";
    addFeaturesvalue = "";

    if (additionalfeatures.addtionalfeaturesId == null){
        addFeaErrors = addFeaErrors + "\n" + "Feature is Not Selected";
        cmbFeature.style.border = invalid;
    }else
        addFeaturesvalue = 1;

    if (additionalfeatures.qty == null){
        addFeaErrors = addFeaErrors + "\n" + "Quantity is Not Entered";
        txtQty.style.border = invalid;
    }else
        addFeaturesvalue = 1;


    return addFeaErrors;
}

function btnInnerAddFeaAddMC() {

    if (getInnerAddFeaErrors() == "") {
        additionalfeatures.addtionalfeaturesId = JSON.parse(cmbFeature.value);
        additionalfeatures.qty = txtQty.value;

    eventExs = false;
    for (index in servicereservation.additionalFeaturesDetailsList) {
        if (servicereservation.additionalFeaturesDetailsList[index].addtionalfeaturesId.name == JSON.parse(cmbFeature.value).name ) {
            eventExs = true;
            break;
        }
    }

        if(eventExs){
            swal({
                title: "This Feature is Already Selected",
                text:"\n",
                icon:"warning",
                buttons:false,
                timer: 1200,
            });
        }else{
            servicereservation.additionalFeaturesDetailsList.push(additionalfeatures);
            refreshInnerAddFeaForm();
            }
    }else{
        swal({
            title: "You have following errors !!",
            text:"\n" + getInnerAddFeaErrors(),
            icon:"warning",
            buttons:true,

        })
    }
}

function btnInnerAddFeaClearMC() {

    check = getInnerAddFeaErrors();

    if (addFeaturesvalue == ""){

    swal({
        title: "Are you sure to clear this Inner form...?",
        text:"\n",
        icon:"warning",
        buttons:true,

    }).then((willUpdate) => {
        if(willUpdate){
            refreshInnerAddFeaForm();
            }
        });
    }
}

function modifyInnerAddFeaForm(additionalfeatures,indx) {
    selectedInnerRow = indx;

    fillCombo(cmbFeature,"Feature",addfeatures,"name",servicereservation.addtionalfeaturesId.name);

    txtAddFeaturePrice.value = additionalfeatures.addfeatureprice;
    txtQty.value = additionalfeatures.qty;
    txtLineTot.value = additionalfeatures.linetotal;

    cmbFeature.style.border = valid;
    txtAddFeaturePrice.style.border = valid;
    txtQty.style.border = valid;
    txtLineTot.style.border = valid;

    btnInnerAddFeaClear.setAttribute("disabled","disabled");
    btnInnerAddFeaUpdate.removeAttribute("disabled","disabled");
}

function btnInnerAddFeaUpdateMC() {
    innerUpdates = getInnerAddFeaUpdate(servicereservation.additionalfeatures[selectedInnerRow]);

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
            title: "Are you sure to update following...?",
            text:"\n"+ innerUpdates,
            icon:"warning",
            buttons:false,
            timer: 1200,
        })
            .then((willUpdate) => {
                if(willUpdate){
                    servicereservation.additionalfeatures[selectedInnerRow].eventId = JSON.parse(cmbFeature.value);
                    servicereservation.additionalfeatures[selectedInnerRow].eventdate = txtAddFeaturePrice.value;
                    servicereservation.additionalfeatures[selectedInnerRow].starttime = txtQty.value;
                    servicereservation.additionalfeatures[selectedInnerRow].endtime = txtLineTot.value;
                    refreshInnerAddFeaForm();
                }
            });
    }
}

function getInnerAddFeaUpdate(additionalfeatures) {
    var updates = "";
        if(additionalfeatures.featureId.name != JSON.parse(cmbFeature.value)){
            updates = updates + "\nFeature is Changed";
            cmbFeature.style.border = updated;
        }

        if(additionalfeatures.qty != JSON.parse(txtQty.value)){
            updates = updates + "\nQuantity is Changed";
            txtQty.style.border = updated;
        }

    return updates;
}

function deleteInnerAddFeaForm(additionalfeatures , indx) {
    swal({
        title: "Do you want to remove the selected Feature?",
        text:"\n",
        icon:"warning",
        buttons:true,
    }).then((willDelete) => {
        if(willDelete){
            servicereservation.additionalfeatures.splice(indx,1);
            refreshInnerAddFeaForm();

        }
    })

}



//Inner Event Reservation Form
function refreshInnerEventForm() {

    eventreservation = new Object();

    eventreservation.eventActivityList = new Array();//assosiation list for event activities

    fillCombo(cmbEvent,"Select Event",events,"name");

    dteDate.value = "";
    timStart.value = "";
    timEnd.value = "";
    eventLoc.value = "";
    txtEvent.value = "";

    //Autofill min and max date
    var today = new Date();
    var dayafterseevendate =  new Date(today);
    dayafterseevendate.setDate(today.getDate()+7);
    var dayafteryeardate = new Date(today);
    dayafteryeardate.setDate(today.getDate()+365);
    dteDate.min = getDate(dayafterseevendate);
    dteDate.max = getDate(dayafteryeardate);


    chkMode.checked == true;
    $('#chkMode').bootstrapToggle('on',true);

    cmbEvent.style.border = initial;
    dteDate.style.border = initial;
    timStart.style.border = initial;
    timEnd.style.border = initial;
    eventLoc.style.border = initial;
    txtEvent.style.border = initial;

    fillInnerTable("tblInnerEvent",reservation.eventReservationList,modifyInnerEventForm,deleteInnerEventForm);
    btnInnerEventAdd.removeAttribute("disabled","disabled");
    btnInnerEventUpdate.setAttribute("disabled","disabled");

    refreshInnerEventActForm();

}

function getInnerEventErrors() {
    var eventErrors = "";
    addEventvalue = "";

    if (reservation.customerId == null){
        eventErrors = eventErrors + "\n" + "Customer is Not Selected";
        cmbCustomer.style.border = invalid;
    }else
        addEventvalue = 1;

    if (eventreservation.eventId == null){
        eventErrors = eventErrors + "\n" + "Event is Not Selected";
        cmbEvent.style.border = invalid;
    }else
        addEventvalue = 1;

    if (eventreservation.eventdate == null){
        eventErrors = eventErrors + "\n" + "Event Date is Not Entered";
        dteDate.style.border = invalid;
    }else
        addEventvalue = 1;

    if (eventreservation.starttime == null){
        eventErrors = eventErrors + "\n" + "Starting Time is Not Entered";
        timStart.style.border = invalid;
    }else
        addEventvalue = 1;

    if (eventreservation.endtime == null){
        eventErrors = eventErrors + "\n" + "End Time is Not Entered";
        timEnd.style.border = invalid;
    }else
        addEventvalue = 1;

if (eventreservation.location == null){
        eventErrors = eventErrors + "\n" + "Event Location is Not Entered";
         eventLoc.style.border = invalid;
    }else
        addEventvalue = 1;

    return eventErrors;
}

function btnInnerEventAddMC() {
    if(chkMode.checked){
        eventreservation.eventmode = "Day";
    }else
        eventreservation.eventmode = "Night";

    if (getInnerEventErrors() == "") {
        eventreservation.eventId = JSON.parse(cmbEvent.value);
        eventreservation.eventdate = dteDate.value;
        eventreservation.starttime = timStart.value;
        eventreservation.endtime = timEnd.value;
        eventreservation.location = eventLoc.value;

        eventExs = false;
        for (index in reservation.eventReservationList) {
            if (reservation.eventReservationList[index].eventId.name == JSON.parse(cmbEvent.value).name ) {
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
            reservation.eventReservationList.push(eventreservation);
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
    loadForm();

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
                loadForm();

            }
        });
    }
}

function modifyInnerEventForm(eventreservationrow,indx) {
    selectedInnerRow = indx;
    eventreservation = eventreservationrow;
    fillCombo(cmbEvent,"Select Event",events,"name",eventreservationrow.eventId.name);
    dteDate.value = eventreservationrow.eventdate;
    timStart.value = eventreservationrow.starttime;
    timEnd.value = eventreservationrow.endtime;
    eventLoc.value = eventreservationrow.location;

    cmbEvent.style.border = valid;
    dteDate.style.border = valid;
    timStart.style.border = valid;
    timEnd.style.border = valid;
    eventLoc.style.border = valid;
    console.log(eventreservation)
    refreshInnerEventActForm();
    cmbPkg.disabled = true;


    btnInnerEventAdd.setAttribute("disabled","disabled");
    btnInnerEventUpdate.removeAttribute("disabled","disabled");
}

function btnInnerEventUpdateMC() {
    innerUpdates = getInnerEventUpdate(reservation.eventReservationList[selectedInnerRow]);

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
            title: "Are you sure to update following...?",
            text:"\n"+ innerUpdates,
            icon:"warning",
            buttons:false,
            timer: 1200,
        })
            .then((willUpdate) => {
                if(willUpdate){
                    reservation.eventReservationList[selectedInnerRow].eventId = JSON.parse(cmbEvent.value);
                    reservation.eventReservationList[selectedInnerRow].eventdate = dteDate.value;
                    reservation.eventReservationList[selectedInnerRow].starttime = timStart.value;
                    reservation.eventReservationList[selectedInnerRow].endtime = timEnd.value;
                    reservation.eventReservationList[selectedInnerRow].location = eventLoc.value;
                    refreshInnerEventForm();
                }
            });
    }
}

function getInnerEventUpdate(eventreservation) {
    var updates = "";
    if(eventreservation.eventId.name != JSON.parse(cmbEvent.value)){
        updates = updates + "\nEvent is Changed";
        cmbEvent.style.border = updated;
    }

    if(eventreservation.eventdate != JSON.parse(dteDate.value)){
        updates = updates + "\nEvent Date is Changed";
        dteDate.style.border = updated;
    }

    if(eventreservation.starttime != JSON.parse(timStart.value)){
        updates = updates + "\nStart Time is Changed";
        timStart.style.border = updated;
    }

    if(eventreservation.endtime != JSON.parse(timEnd.value)){
        updates = updates + "\nEnd Time is Changed";
        timEnd.style.border = updated;
    }

    if(eventreservation.location != JSON.parse(eventLoc.value)){
        updates = updates + "\nEvent Location is Changed";
        eventLoc.style.border = updated;
    }

    return updates;
}

function deleteInnerEventForm(eventreservation , indx) {
    swal({
        title: "Do you want to remove the selected Event?",
        text:"\n",
        icon:"warning",
        buttons:true,
    }).then((willDelete) => {
        if(willDelete){
            reservation.eventReservationList.splice(indx,1);
            refreshInnerEventForm();

        }
    })

}

function setDuration() {
   // console.log(timStart.value);
   //
   // var nowdate = new Date();
   // var starttime = new Date(nowdate.getFullYear()+getmonthdate(nowdate)+"T"+timStart.value+":"+"00");
   // var end

}

//Inner Event Activity Form
function refreshInnerEventActForm() {

    eventactivity = new Object();

    txtActLocFrom.value = "";
    txtActLocTo.value = "";
    timActTimeFrom.value = "";
    timActTimeTo.value = "";
    txtDistance.value = "";
    timTravelTime.value = "";
    txtActivity.value = "";

    txtActLocFrom.style.border = initial;
    txtActLocFrom.style.border = initial;
    txtActLocTo.style.border = initial;
    txtActivity.style.border = initial;
    timActTimeFrom.style.border = initial;
    timActTimeTo.style.border = initial;
    txtDistance.style.border = initial;
    timTravelTime.style.border = initial;
    cmbActivity.style.border = initial;

    fillCombo(cmbActivity,"Select Activity",activity,"name");

    fillInnerTable("tblInnerEventAct",eventreservation.eventActivityList,modifyInnerEventActForm,deleteInnerEventActForm);
    btnInnerEventActAdd.removeAttribute("disabled","disabled");
    btnInnerEventActUpdate.setAttribute("disabled","disabled");

}

function getInnerEventActErrors() {
    var eventactErrors = "";
    addEventActvalue = "";

    if (eventactivity.activityId == null){
        eventactErrors = eventactErrors + "\n" + "Activity Name is Not Selected";
        cmbActivity.style.border = invalid;
    }else
        addEventActvalue = 1;

    if (eventactivity.startlocation == null){
        eventactErrors = eventactErrors + "\n" + "Start Location is Not Entered";
        txtActLocFrom.style.border = invalid;
    }else
        addEventActvalue = 1;

    if (eventactivity.endlocation == null){
        eventactErrors = eventactErrors + "\n" + "End Location is Not Entered";
        txtActLocTo.style.border = invalid;
    }else
        addEventActvalue = 1;

    if (eventactivity.actstarttime == null && eventactivity.actendtime == null){
        eventactErrors = eventactErrors + "\n" + "Start Time/End Time is Not Entered";
        timActTimeFrom.style.border = invalid;
        timActTimeTo.style.border = invalid;

    }else
        addEventActvalue = 1;

    if (eventactivity.distance == null){
        eventactErrors = eventactErrors + "\n" + "Distance is Not Entered";
        txtDistance.style.border = invalid;
    }else
        addEventActvalue = 1;

    if (eventactivity.traveltime == null){
        eventactErrors = eventactErrors + "\n" + "Travel Time is Not Entered";
        timTravelTime.style.border = invalid;
    }else
        addEventActvalue = 1;

    return eventactErrors;
}

function btnInnerEventActAddMC() {

    if (getInnerEventActErrors() == "") {

        eventactivity.activityId = JSON.parse(cmbActivity.value);
        eventactivity.actstarttime = timActTimeFrom.value;
        eventactivity.actendtime = timActTimeTo.value;
        eventactivity.startlocation = txtActLocFrom.value;
        eventactivity.endlocation = txtActLocTo.value;
        eventactivity.distance = txtDistance.value;
        eventactivity.traveltime = timTravelTime.value;

        eventExs = false;
        for (index in eventreservation.eventActivityList) {
            if (eventreservation.eventActivityList[index].activityId.name == JSON.parse(cmbActivity.value).name) {
                eventExs = true;
                break;
            }
        }

        if(eventExs){
            swal({
                title: "This Event Activity is Already Selected",
                text:"\n",
                icon:"warning",
                buttons:false,
                timer: 1200,
            });
        }else{
            eventreservation.eventActivityList.push(eventactivity);
            refreshInnerEventActForm();
        }
    }else{
        swal({
            title: "You have following errors",
            text:"\n" + getInnerEventActErrors(),
            icon:"warning",
            buttons:true,

        })
    }
}

function btnInnerEventActClearMC() {

    check = getInnerEventActErrors();

    if (addEventActvalue == ""){

        swal({
            title: "Are you sure to clear this Inner form...?",
            text:"\n",
            icon:"warning",
            buttons:true,

        }).then((willUpdate) => {
            if(willUpdate){
                refreshInnerEventActForm();
            }
        });
    }
}

function modifyInnerEventActForm(eventactivity,indx) {
    selectedInnerRow = indx;

    cmbActivity.value = eventactivity.activityname;
    txtActLocFrom.value = eventactivity.startlocation ;
    txtActLocTo.value = eventactivity.endlocation;
    timActTimeFrom.value = eventactivity.actstarttime;
    timActTimeTo.value = eventactivity.actendtime;
    txtDistance.value = eventactivity.distance;
    timTravelTime.value = eventactivity.traveltime;

    cmbActivity.style.border = valid;
    txtActLocFrom.style.border = valid;
    txtActLocTo.style.border = valid;
    timActTimeFrom.style.border = valid;
    timActTimeTo.style.border = valid;
    txtDistance.style.border = valid;
    timTravelTime.style.border = valid;


    btnInnerEventActAdd.setAttribute("disabled","disabled");
    btnInnerEventActUpdate.removeAttribute("disabled","disabled");
}

function btnInnerEventActUpdateMC() {
    innerUpdates = getInnerEventActUpdate(eventreservation.eventActivityList[selectedInnerRow]);

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
            title: "Are you sure to update following...?",
            text:"\n"+ innerUpdates,
            icon:"warning",
            buttons:false,
            timer: 1200,
        })
            .then((willUpdate) => {
                if(willUpdate){
                    eventreservation.eventActivityList[selectedInnerRow].activityname =JSON.parse(cmbActivity.value) ;
                    eventreservation.eventReservationList[selectedInnerRow].actstarttime = timActTimeFrom.value;
                    eventreservation.eventReservationList[selectedInnerRow].actendtime = timActTimeTo.value;
                    eventreservation.eventReservationList[selectedInnerRow].startlocation = txtActLocFrom.value;
                    eventreservation.eventReservationList[selectedInnerRow].endlocation = txtActLocTo.value;
                    eventreservation.eventReservationList[selectedInnerRow].distance = txtDistance.value;
                    eventreservation.eventReservationList[selectedInnerRow].traveltime = timTravelTime.value;
                    refreshInnerEventActForm();
                }
            });
    }

}

function getInnerEventActUpdate(eventactivity) {
    var updates = "";
    if(eventactivity.activityname != JSON.parse(cmbActivity.value)){
        updates = updates + "\nActivity Name is Changed";
        cmbActivity.style.border = updated;
    }
    if(eventactivity.actstarttime != JSON.parse(timActTimeFrom.value)){
        updates = updates + "\nActivity Start time is Changed";
        timActTimeFrom.style.border = updated;
    }
    if(eventactivity.actendtime != JSON.parse(timActTimeTo.value)){
        updates = updates + "\nActivity End time is Changed";
        timActTimeTo.style.border = updated;
    }

    if(eventactivity.startlocation != JSON.parse(txtActLocFrom.value)){
        updates = updates + "\nActivity Start Location is Changed";
        txtActLocFrom.style.border = updated;
    }

    if(eventactivity.endlocation != JSON.parse(txtActLocTo.value)){
        updates = updates + "\nActivity End Location is Changed";
        txtActLocTo.style.border = updated;
    }

    if(eventactivity.distance != JSON.parse(txtDistance.value)){
        updates = updates + "\nDistance is Changed";
        txtDistance.style.border = updated;
    }

    if(eventactivity.traveltime != JSON.parse(timTravelTime.value)){
        updates = updates + "\nTravel time is Changed";
        timTravelTime.style.border = updated;
    }

    return updates;
}

function deleteInnerEventActForm(eventactivity , indx) {
    swal({
        title: "Do you want to remove the selected Event Activity?",
        text:"\n",
        icon:"warning",
        buttons:true,
    }).then((willDelete) => {
        if(willDelete){
            eventreservation.eventActivityList.splice(indx,1);
            refreshInnerEventActForm();

        }
    })

}




//fill customer
function fillCustomer() {
    customer = JSON.parse(cmbCustomer.value).regno;

    fillCombo3(cmbCusNo,"Customer",customers,"regno","cname",customer);
    fillCombo3(cmbCusNumber,"Customer",customers,"regno","cname",customer);

    cmbCusNo.style.border = valid;
    cmbCusNumber.style.border = valid;

}

//fill package
function fillPkg() {
    pkg = JSON.parse(cmbPkg.value).name;

    fillCombo(cmbPackage,"Package",packages,"name",pkg);
    fillCombo(cmbResPkg,"Package",packages,"name",pkg);

    cmbPackage.style.border = valid;
    cmbResPkg.style.border = valid;

}

function cmbServiceCH() {
    provider =  httpRequest("../serviceprovider/byservice?serviceid="+JSON.parse(cmbService.value).id, "GET");
    fillCombo(cmbSerProvider, "Select Provider", provider, "name", "");
    cmbSerProvider.removeAttribute("disabled","disabled");

}

function cmbPackageCH() {
    var event =  httpRequest("../event/bypackage?packageid="+JSON.parse(cmbPkg.value).id, "GET");
    fillCombo(cmbEvent, "Select Event", event, "name", "");
    fillCombo(cmbSerEvent, "Select Event", event, "name", "");

}

function cmbProviderCH() {
    package =  httpRequest("../providerpackage/byserviceandprovider?providerid="+JSON.parse(cmbSerProvider.value).id+"&serviceid="+JSON.parse(cmbService.value).id, "GET");
    fillCombo(cmbProviderPkg, "Select Package", package, "name", "");

    addfeature =  httpRequest("../additionalfeatures/byprovider?providerid="+JSON.parse(cmbSerProvider.value).id+"&serviceid="+JSON.parse(cmbService.value).id, "GET");
    fillCombo(cmbFeature, "Select Feature", addfeature, "name", "");

}

function cmbProviderPackageCH() {


}

function setETime() {
    var nowdate = new Date();

    starttime = new Date(getDate(nowdate)+"T"+timStart.value);
    endtime = new Date()
    endtime.setTime(starttime.getTime() + 2*60*60*1000);
    console.log(endtime);
    var hours = endtime.getHours();
    if(hours<10) hours= "0" + hours;
    var minuts = endtime.getMinutes();
    if(minuts<10) minuts= "0" + minuts;
    var second = endtime.getSeconds();
    if(second<10) second= "0" + second;

   // console.log(hours+":"+minuts+":"+second);
    timEnd.min = hours+":"+minuts;
    timEnd.value = hours+":"+minuts;
    eventreservation.endtime = timEnd.value;

    timActTimeFrom.value = timStart.value;
    eventactivity.actendtime = timActTimeFrom.value;
    timActTimeFrom.style.border = valid;
    timEnd.style.border = valid;

}

function settimEndCH() {
    var nowdate = new Date();
    endmintime = new Date(getDate(nowdate)+"T"+timEnd.min);
    endtime = new Date(getDate(nowdate)+"T"+timEnd.value);

   // console.log(endmintime)
   // console.log(endtime)
    if( endmintime.getTime() > endtime.getTime()){
        timEnd.value =timEnd.min;
    }
    eventreservation.endtime = timEnd.value;
    timEnd.style.border = valid;

}

function setActtimStartCH() {
    var nowdate = new Date();
    actstartmintime = new Date(getDate(nowdate)+"T"+timStart.value);
    actstarttime = new Date(getDate(nowdate)+"T"+timActTimeFrom.value);

    if( actstartmintime.getTime() > actstarttime.getTime()){
        timActTimeFrom.value =timStart.value;
    }
    eventactivity.actstarttime = timActTimeFrom.value;
    timActTimeFrom.style.border = valid;

}

function setActtimEndCH() {
    var nowdate = new Date();
    actendmaxtime = new Date(getDate(nowdate)+"T"+timEnd.value);
    actendtime = new Date(getDate(nowdate)+"T"+timActTimeTo.value);

    if( actendtime.getTime() > actendmaxtime.getTime()){
        timActTimeTo.value =timEnd.value;
    }
    eventactivity.actstarttime = timActTimeTo.value;
    timActTimeTo.style.border = valid;

}

function enterActivityCH() {
    //console.log(eventactivity.activityId)
    if(eventactivity.activityId.id == 3 ){
        //console.log("DDDD")
        txtActLocTo.value = (eventLoc.value);
        eventactivity.endlocation = txtActLocTo.value;
        txtActLocTo.style.border = valid;

    }else if(eventactivity.activityId.id == 4 ){
        //console.log("DDDD")
        txtActLocFrom.value = (eventLoc.value);
        txtActLocTo.value = (eventLoc.value);
        eventactivity.startlocation = txtActLocFrom.value;
        eventactivity.endlocation = txtActLocTo.value;
        txtActLocTo.style.border = valid;
        txtActLocFrom.style.border = valid;

    }else if(eventactivity.activityId.id == 7 ){
        //console.log("DDDD")
        txtActLocFrom.value = (eventLoc.value);
        eventactivity.startlocation = txtActLocFrom.value;
        txtActLocFrom.style.border = valid;
    }

    if(eventactivity.activityId.id == 8 ){
        //console.log("DDDD")
        txtActivity.removeAttribute("hidden","disabled");
    } else
        txtActivity.setAttribute("hidden","disabled");

}

function enterEventCH() {
   // console.log(cmbEvent.value)
    if(eventreservation.eventId.id == 5 ){
        //console.log("DDDD")
        txtEvent.removeAttribute("hidden","disabled");
    } else
        txtEvent.setAttribute("hidden","disabled");



}

//autofill service charge
function fillSerCharge() {
    sercharge = 0.0;

    txtSerCharge.value = JSON.parse(cmbService.value).servicecharge;
    servicereservation.servicecharge =  parseFloat(txtSerCharge.value).toFixed(2);
    txtSerCharge.style.border = valid;

    cmbSerProvider.removeAttribute("disabled","disabled");
    cmbProviderPkg.removeAttribute("disabled","disabled");

}

function fillSerEvent() {
    for(index in reservation.eventReservationList){

        var eventList = new Array();
        eventList.push(reservation.eventReservationList[index].eventId);
    }

    fillCombo(cmbSerEvent,"Select Event",eventList,"name",);

}

//autofill ReservedSerPrice & total
function calcReservedSerPrice() {
    totalSerPrice = 0.0;

    txtPkgPrice.value = JSON.parse(cmbProviderPkg.value).price;
    pkgprice = txtPkgPrice.value;
    txtPkgPrice.style.border = valid;

    totalSerPrice = parseFloat(txtSerCharge.value) + parseFloat(txtPkgPrice.value);

    txtReservedSerPrice.value = totalSerPrice;
    servicereservation.reservedserprice = parseFloat(totalSerPrice).toFixed(2);
    txtReservedSerPrice.style.border = valid;

    txtNetTot.value = totalSerPrice;
    servicereservation.srlinetotal = txtNetTot.value
    txtNetTot.style.border = valid;


}

//autofill Additional Feature Price
function fillAddFeatureCost() {
    addfeatureprice = 0.0;

    txtAddFeaturePrice.value = JSON.parse(cmbFeature.value).price;
    additionalfeatures.addfeatureprice = txtAddFeaturePrice.value;

}

//autofill line total
function calcLineTotal() {
    linetotal = 0.0;

    linetotal = (txtQty.value)*(txtAddFeaturePrice.value);
    txtLineTot.value = linetotal;
    additionalfeatures.linetotal = linetotal;
    txtLineTot.style.border = valid;
}

function calcTotal() {
    tot = 0.0;
    tot = parseFloat(txtTotal.value) - parseFloat(txtDiscount.value);

    txtTotPayable.value = tot;
    reservation.totalpayable = tot;

    txtAdvance.value = (txtTotPayable.value)*(0.5);
    reservation.advance = txtAdvance.value;
    txtTotPayable.style.border = valid;

}

function addPrecent() {
    console.log(10 < txtPrecent.value &&  txtPrecent.value < 90)

    if( 10 < txtPrecent.value &&  txtPrecent.value < 90)
    {
        txtAdvance.value = ((txtPrecent.value)/100) * (txtTotPayable.value);

        reservation.advance = txtAdvance.value;
        reservation.precentage = txtPrecent.value;
        txtPrecent.style.border = valid;

    } else

        txtPrecent.style.border = invalid;


}



function openMaps() {
    var slocation = txtActLocFrom.value;
    var elocation = txtActLocTo.value;
    //window.alert(txtActLocFrom.value);
    window.open('https://www.google.com/maps/dir/?api=1&origin=' +slocation+ '&destination=' +elocation);

}




function getErrors() {

    var errors = "";
    addvalue = "";

    if (reservation.customerId == null){
        errors = errors + "\n" + "Customer Number is Not Selected";
        cmbCusNumber.style.border = invalid;
    }else
        addvalue = 1;

    if (reservation.resstatusId == null){
        errors = errors + "\n" + "Reservation Status is Not Selected";
        cmbResStatus.style.border = invalid;
    }else
        addvalue = 1;

    if (reservation.eventReservationList.length == 0){
        errors = errors + "\n" + "Event Reservation is not Completed";
    }else
        addvalue = 1;

    if (reservation.serviceReservationList.length == 0){
        errors = errors + "\n" + "Service Reservation is not Completed";
    }else
        addvalue = 1;

    return errors;

}

function btnAddMC() {
    reservation.discount = parseFloat(txtDiscount);

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
    console.log(reservation);
    swal({
        title: "Are you sure to add following Reservation...?",
        text: "\nReg No : " + reservation.regno +
            "\nCustomer Name : " + reservation.customerId.cname +
            "\nReservation Status : " + reservation.resstatusId.name +
            "\nTotal Payable : " + reservation.totalpayable +
            "\nPrecent : " + reservation.precentage,

        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            var response = httpRequest("/reservation", "POST", reservation);
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

    if (oldreservation == null && addvalue == "") {
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

    if (oldreservation == null) {
        filldata(res);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n",
            icon: "warning", buttons: true, dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                filldata(res);
                //viewForm();
            }

        });
    }

}

function filldata(res) {
    changeTab('divevent');
    clearSelection(tblReservation);
    selectDeleteRow();
    selectRow(tblReservation, activerowno, active);

    reservation = JSON.parse(JSON.stringify(res));
    oldreservation = JSON.parse(JSON.stringify(res));

    txtNumber.value = reservation.regno;
    txtResNo.value = reservation.regno;
    txtResId.value = reservation.regno;
    txtNumber.disabled = false;
    txtResNo.disabled = false;
    txtResId.disabled = false;
    cmbResStatus.disabled = false;

    cmbRegBy.disabled = "disabled";
    dteRegDate.value = reservation.regdate;
    dteRegDate.disabled = "disabled";

    txtTotal.value = reservation.totalprice;
    txtDiscount.value = reservation.discount;
    txtTotPayable.value = reservation.totalpayable;
    txtAdvance.value = reservation.advance;
    txtDescription.value = reservation.description;

    fillCombo(cmbResStatus, "Reservation Status", resstatuses, "name", reservation.resstatusId .name);
    fillCombo(cmbCusNumber, "Customer Number", customers, "cname", reservation.customerId.cname);
    fillCombo(cmbCusNo, "Customer Number", customers, "cname", reservation.customerId.cname);
    fillCombo(cmbCustomer, "Customer Number", customers, "cname", reservation.customerId.cname);
    fillCombo(cmbRegBy, "", employees, "callingname", reservation.employeeId.callingname);

    refreshInnerSerForm();
    refreshInnerEventForm();

    disableButtons(true, false, false);
    setStyle(initial);

    dteRegDate.style.border = valid;
    cmbCusNo.style.border = valid;
    cmbCustomer.style.border = valid;
    cmbCusNumber.style.border = valid;
    txtNumber.style.border = valid;
    txtResNo.style.border = valid;
    txtResId.style.border = valid;
    cmbRegBy.style.border = valid;
    cmbResStatus.style.border = valid;
    txtTotal.style.border = valid;
    txtTotPayable.style.border = valid;
    txtAdvance.style.border = valid;


    if(reservation.description != null){
        txtDescription.style.border = valid;
    }else
        txtDescription.value = "";
    txtDescription.style.border = initial;

    if(reservation.packageId != null){
        fillCombo(cmbPackage, "", packages, "name", reservation.packageId.name);
        fillCombo(cmbPkg, "", packages, "name", reservation.packageId.name);
        fillCombo(cmbPkg, "", packages, "name", reservation.packageId.name);

        cmbPackage.style.border = valid;
        cmbPkg.style.border = valid;
        cmbPkg.style.border = valid;
    }else {
        cmbPackage.style.border = initial;
        cmbPkg.style.border = initial;
        cmbPkg.style.border = initial;
    }

    if(reservation.discount != null){
        txtDiscount.style.border = valid;
    }else
        txtDiscount.value = "";
        txtDiscount.style.border = initial;


}

function getUpdates() {

    var updates = "";

    if (reservation != null && oldreservation != null) {
        if (reservation.regno != oldreservation.regno)
            updates = updates + "\nReservation Number is Changed";

        if (reservation.customerId.name != oldreservation.customerId.cname)
            updates = updates + "\nCustomer Number is Changed";

        if (reservation.resstatusId.name != oldreservation.resstatusId.name)
            updates = updates + "\nReservation Status is Changed";

        if(isEqual(reservation.eventReservationList,oldreservation.eventReservationList,"eventId"))
            updates = updates + "\nReserved Event details are Changed";

        if(isEqual(reservation.serviceReservationList,oldreservation.serviceReservationList,"serviceId"))
            updates = updates + "\nReserved Service details are Changed";

        if (reservation.totalprice  != oldreservation.totalprice )
            updates = updates + "\nTotal Price is Changed";

        if (reservation.discount != oldreservation.discount)
            updates = updates + "\nDiscounted Price is Changed";

        if (reservation.description != oldreservation.description)
            updates = updates + "\nDescription is Changed";

        if (reservation.totalpayable  != oldreservation.totalpayable )
            updates = updates + "\nTotal Payable is Changed";

        if (reservation.description != oldreservation.description)
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
                    title: "Are you sure to update following Reservation details...?",
                    text: "\n" + getUpdates(),
                    icon: "warning", buttons: true, dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/reservation", "PUT", reservation);
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

function btnDeleteMC(res){
        reservation = JSON.parse(JSON.stringify(res));

        swal({
            title: "Are you sure to delete following Reservation...?",
            text: "\n Reservation Number : " + reservation.regno +
                "\n Customer Name : " + reservation.customerId.cname +
                "\n Reservation Status : " + reservation.resstatusId.name+
                "\n Total Payable : " + reservation.totalpayable,
            icon: "warning", buttons: true, dangerMode: true,

        }).then((willDelete) => {
            if (willDelete) {
                var responce = httpRequest("/reservation", "DELETE", reservation);
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

function btnPrintTableMC(reservation) {

        var newwindow = window.open();
        formattab = tblReservation.outerHTML;

        newwindow.document.write("" +
            "<html>" +
            "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
            "<link rel='stylesheet' href='../plugin/bootstrap/css/bootstrap.min.css'/></head>" +
            "<body><div style='margin-top: 150px; '> <h1>Reservation Details : </h1></div>" +
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

        var cprop = tblReservation.firstChild.firstChild.children[cindex].getAttribute('property');

        if (cprop.indexOf('.') == -1) {
            reservations.sort(
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
            reservations.sort(
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
        fillTable('tblReservation', reservations, fillForm, btnDeleteMC, viewitem);
        clearSelection(tblReservation);
        selectDeleteRow();

        if (activerowno != "") selectRow(tblReservation, activerowno, active);



}