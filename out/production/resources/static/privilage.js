
document.write('<script type="text/javascript" src="resourse/script/common.bitproject.js" ></script>');
document.write('<script src="https://cdn.jsdelivr.net/npm/sweetalert2@9"></script>');
document.write('<script src="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/js/select2.min.js"></script>');
document.write('<link href="https://cdn.jsdelivr.net/npm/select2@4.0.13/dist/css/select2.min.css" rel="stylesheet" />');

window.addEventListener("load", initialize);

//Initializing Functions

function initialize() {




    btnSearch.addEventListener("click",btnSearchMC);
    btnSearchClear.addEventListener("click",btnSearchClearMC);

    cmbRole.addEventListener("change",cmbRoleCH);

    userprivilages = httpRequest("../privilage?module=PRIVILAGE","GET");

    roles = httpRequest("../role/list","GET");
    modules = httpRequest("../module/list","GET");
    employeeswithuseraccount = httpRequest("../employee/list/withuseraccount","GET");

    valid = "2px solid green";
    invalid = "2px solid red";
    initial = "2px solid #d6d6c2";
    updated = "2px solid #ff9900";
    active = "#ff9900";

    loadView();
    loadForm();
}

function loadView() {

    //Search Area
    fillCombo(cmbSearchRole,"Role",roles,"name","");
    fillCombo(cmbSearchModule,"Module",modules,"name","");
    fillCombo(cmbSearchEmployee,"Employee",employeeswithuseraccount,"callingname","");
    cmbSearchRole.style.background = "";
    cmbSearchModule.style.background = "";
    cmbSearchEmployee.style.background = "";

    //Table Area
    activerowno = "";
    activepage = 1;
    loadTable(1,cmbPageSize.value,"");

}


function loadTable(page,size,query) {
    page = page - 1;
    privilages = new Array();
    var data = httpRequest("/privilage/findAll?page="+page+"&size="+size+query,"GET");
    privilages = data.content;
    createPagination('pagination',data.totalPages, data.number+1,paginate);
    fillTable('tblPrevilage',privilages,fillForm,btnDeleteMC,printRow);
    clearSelection(tblPrevilage);
    if(activerowno!="")selectRow(tblPrevilage,activerowno,active);
    window.location.href="#ui";
}

function paginate(page) {
    var paginate;
    if(oldprivilage==null){
        paginate=true;
    }else{
        if(getErrors()==''&&getUpdates()==''){
            paginate=true;
        }else{
            paginate = window.confirm("Form has Some Errors or Update Values. " +
                "Are you sure to discard that changes ?");
        }
    }
    if(paginate) {
        activepage=page;
        activerowno=""
        loadSearchedTable();
        loadForm();
    }

}

function loadForm() {

    privilage = new Object();
    oldprivilage = null;

    fillCombo(cmbRole,"Select Role",roles,"role","");
    fillCombo(cmbModule,"Select Role First",[],"name","");
    cmbRole.disabled="";
    cmbModule.disabled="";

    chkSelect.checked=false;
    chkInsert.checked=false;
    chkUpdate.checked=false;
    chkDelete.checked=false;


    privilage.sel=0;
    privilage.ins=0;
    privilage.upd=0;
    privilage.del=0;

    setStyle(initial);
    disableButtons(false, true, true);

}

function setStyle(style) {
    cmbRole.style.background = style;
    cmbModule.style.background = style;
    chkSelect.parentNode.style.background = style;
    chkInsert.parentNode.style.background = style;
    chkUpdate.parentNode.style.background = style;
    chkDelete.parentNode.style.background = style;
}

function disableButtons(add, upd, del) {

    if (add || !userprivilages.add) {
        btnAdd.setAttribute("disabled", "disabled");
        $('#btnAdd').css('cursor','not-allowed');
    }
    else {
        btnAdd.removeAttribute("disabled");
        $('#btnAdd').css('cursor','pointer')
    }

    if (upd || !userprivilages.update) {
        btnUpdate.setAttribute("disabled", "disabled");
        $('#btnUpdate').css('cursor','not-allowed');
    }
    else {
        btnUpdate.removeAttribute("disabled");
        $('#btnUpdate').css('cursor','pointer');
    }

    if (!userprivilages.update) {
        $(".buttonup").prop('disabled', true);
        $(".buttonup").css('cursor','not-allowed');
    }
    else {
        $(".buttonup").removeAttr("disabled");
        $(".buttonup").css('cursor','pointer');
    }

    if (!userprivilages.delete){
        $(".buttondel").prop('disabled', true);
        $(".buttondel").css('cursor','not-allowed');
    }
    else {
        $(".buttondel").removeAttr("disabled");
        $(".buttondel").css('cursor','pointer');
    }

}


// Binding and Validation Functions for Non-Regex-Based
// When Regex-Based default validation is used, programmers do not need to define these functions
// Default Validation and Binding is coded in "ui.bitproject.earth.lk.js"

function cmbRoleCH() {
    modulesunassigned = httpRequest("../module/list/unassignedtothisrole?roleid="+JSON.parse(cmbRole.value).id,"GET");
    fillCombo(cmbModule,"Select a Module", modulesunassigned,"name","");

}



//Form Operation Functions

function getErrors() {

    var errors = "";

    if (privilage.roleId == null)
        errors = errors + "\n" + "Roles Not Selected";

    if (privilage.moduleId == null)
        errors = errors + "\n" + "Module Not Selected";

    if (privilage.sel == 0 && privilage.ins == 0 && privilage.upd == 0 && privilage.del == 0)
        errors = errors + "\n" + "No any Privilages are Selected";

    return errors;

}

function btnAddMC(){

    var errors = getErrors();

    if(errors==""){

        var privi = privilage.sel == 1 ? "Select   " : "";
        privi = privi + (privilage.ins == 1 ? "Insert   " : "");
        privi = privi + (privilage.upd == 1 ? "Update   " : "");
        privi = privi + (privilage.del == 1 ? "Delete   " : "");

        var option = window.confirm("Are you sure to add a Module with following privilages  ?\n" +
            "\nRole : " + privilage.roleId.role +
            "\nModule : " + privilage.moduleId.name +
            "\nPrivilage : " + privi);
        if(option==true) {
            var response = httpRequest("/privilage","POST",privilage);
            if(response=="0"){
                toast("<strong>Success !</strong> Saved Successfully","success");
                loadForm();
                activerowno = 1;
                loadSearchedTable();
            }
            else window.alert("Failed to Add as \n\n"+response);
        }

    }
    else
    { window.alert("You have following Errors\n"+errors); }

}

function btnClearMC() {
    //Get Cofirmation from the User window.confirm();

    var clear;
    if(oldprivilage==null){
        clear=true;
    }else{
        if(getErrors()==''&&getUpdates()==''){
            clear=true;
        }else{
            clear = window.confirm("Form has Some Errors or Update Values. " +
                "Are you sure to discard that changes ?");
        }
    }
    if(clear) {
        loadForm();
        clearSelection(tblUser);
    }




}
function fillForm(pri,rowno){
    activerowno = rowno;

    if (oldprivilage==null) {
        filldata(pri);
    } else {
        swal({
            title: "Form has some values, updates values... Are you sure to discard the form ?",
            text: "\n" ,
            icon: "warning", buttons: true, dangerMode: true,
        })
            .then((willDelete)=> {
            if (willDelete) {
                filldata(pri);
            }

        });
    }


}

function filldata(pri){

        clearSelection(tblPrevilage);
        selectRow(tblPrevilage,activerowno,active);

        privilage = JSON.parse(JSON.stringify(pri));
        oldprivilage = JSON.parse(JSON.stringify(pri));

        fillCombo(cmbRole, "", roles, "role", pri.roleId.role);
        fillCombo(cmbModule, "", modules , "name", pri.moduleId.name);
        cmbRole.disabled="disabled";
        cmbModule.disabled="disabled";



    if ( privilage.sel == 1) {
        $('#chkSelect').bootstrapToggle('on');
        chkSelect.checked =true;
    } else {
        $('#chkSelect').bootstrapToggle('off');
        chkSelect.checked =false;
    }
    if ( privilage.ins == 1) {
        $('#chkInsert').bootstrapToggle('on');
        chkInsert.checked =true;
    } else {
        $('#chkInsert').bootstrapToggle('off');
        chkInsert.checked =false;
    }
    if ( privilage.upd == 1) {
        $('#chkUpdate').bootstrapToggle('on');
        chkUpdate.checked =true;
    } else {
        $('#chkUpdate').bootstrapToggle('off');
        chkUpdate.checked =false;
    }
    if ( privilage.del == 1) {
        $('#chkDelete').bootstrapToggle('on');
        chkDelete.checked =true;
    } else {
        $('#chkDelete').bootstrapToggle('off');
        chkDelete.checked =false;
    }

        disableButtons(true, false, false);
        setStyle(valid);
        chkSelect.parentNode.style.border = privilage.sel == 1 ? valid : initial;
        chkInsert.parentNode.style.border = privilage.ins == 1 ? valid : initial;
        chkUpdate.parentNode.style.border = privilage.upd == 1 ? valid : initial;
        chkDelete.parentNode.style.border = privilage.del == 1 ? valid : initial;


}

function getUpdates() {

    var updates = "";

    if(privilage!=null && oldprivilage!=null) {

        if (privilage.sel != oldprivilage.sel)
            updates = updates + "\nSelect is Changed";

        if (privilage.ins != oldprivilage.ins)
            updates = updates + "\nInsert is Changed";

        if (privilage.upd != oldprivilage.upd)
            updates = updates + "\nUpdate is Changed";

        if (privilage.del != oldprivilage.del)
            updates = updates + "\nDelete is Changed";
    }

    return updates;

}

function btnUpdateMC() {
    var errors = getErrors();
    if (errors == "") {
        var updates = getUpdates();
        if (updates == "") window.alert("Nothing Updated!");
        else {

            var option = window.confirm("\n\nAre your sure to update followings ! \n\n" + updates);
            if(option==true) {
                var response = httpRequest("/privilage","PUT",privilage);
                if(response=="0"){
                    toast("<strong>Success !</strong> Updated Successfully","success");
                    loadForm();
                    loadSearchedTable();
                }
                else window.alert("Failed to Update as \n\n"+response);
            }


        }
    }
    else
        window.alert("You have following errors in your form\n\n"+getErrors());
}

function btnDeleteMC(priv) {
    privilage = JSON.parse(JSON.stringify(priv));
    privilage.sel = 0;
    privilage.ins = 0;
    privilage.upd = 0;
    privilage.del = 0;

    var option = window.confirm("\n\nAre your sure to delete following ! \n\n" +
        "Role : " +privilage.roleId.role+ "\nModule : " +privilage.moduleId.name);

    if(option==true) {
        var response = httpRequest("/privilage","DELETE",privilage);
        if(response=="0"){
            toast("<strong>Success !</strong> Deleted Successfully","success");
            loadForm();
            loadSearchedTable();

        }
        else window.alert("Failed to Delete as \n\n"+response);
    }

}


function printRow(priv) {
    privilage = JSON.parse(JSON.stringify(priv));
}

//Search Functions

function loadSearchedTable(){

    var role = cmbSearchRole.value;
    var module = cmbSearchModule.value;
    var employee = cmbSearchEmployee.value;

    var roleid="";
    if(role!="Role")
    { roleid = JSON.parse(role).id;
        cmbSearchRole.style.background = active;}

    var moduleid="";
    if(module!="Module")
    {  moduleid = JSON.parse(module).id;
        cmbSearchModule.style.background = active; }

    var employeeid="";
    if(employee!="Employee")
    {  employeeid = JSON.parse(employee).id;
        cmbSearchEmployee.style.background = active; }

    var query ="";

    if(roleid!="" || moduleid!="" || employeeid!="")
        query = "&roleid=" + roleid + "&moduleid=" + moduleid + "&employeeid=" + employeeid;

    //window.alert(query);
    loadTable(activepage, cmbPageSize.value, query);

}

function btnSearchMC(){
    activepage=1;
    loadSearchedTable();
}

function btnSearchClearMC(){
    loadView();
}


