
window.addEventListener("load", initialize);

        //Initializing Functions
        function initialize() {

            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);

            txtPassword.addEventListener("keyup",txtPasswordKU);
            txtRetypePassword.addEventListener("keyup",txtRetypePasswordKU);
            btnSearch.addEventListener("click",btnSearchMC);
            btnSearchClear.addEventListener("click",btnSearchClearMC);



            privilages = httpRequest("../privilage?module=USER","GET");
           // changepasswordprivilages = httpRequest("../privilages?module=USERPASSWORDCHANGE","GET");

       
          employeeswithoutusers = httpRequest("../employee/list/withoutusers","GET");
          employees = httpRequest("../employee/list","GET");
         //   userstatuses = httpRequest("../userstatuses/list","GET");
           //     userstatuses = [{"id":1,"name":"Operational"}];
            roleslist = httpRequest("../role/list","GET");

            //apply selecr2 into your select box
            $(".js-example-basic-multiple").select2({
                placeholder: " Select a Roles",
                allowClear: true
            });

            valid = "lightgreen";
            invalid = "pink";
            initial = "white";
            updated = "khaki";
            active = "khaki";

            loadView();
            loadForm();


        }

        function loadView() {

            //Search Area
            txtSearchUsername.value="";
            fillCombo(cmbSearchRole,"Role",roleslist,"name","");
         //   fillCombo(cmbSearchUserstatus,"Status",userstatuses,"name","");
            cmbSearchUserstatus.style.background = "";
            cmbSearchRole.style.background = "";
            txtSearchUsername.style.background = "";

            //Table Area
            activerowno = "";
            activepage = 1;
            loadTable(1,cmbPageSize.value,"");

        }

        function loadTable(page,size,query) {
            page = page - 1;
            users = new Array();
            var data = httpRequest("/user/findAll?page="+page+"&size="+size+query,"GET");
           // var data = {"content":[{"docreation":"2018-10-16","customerId":null,"usertypeId":{"id":1,"name":"Employee"},"id":1,"username":"admin","password":"a25abd72409b7dd11cc8cd2bd56d31067b194aa5","description":"RootUser","salt":"1f5b9aef5cbf9cd0d81b84d58d6960e7a2f6c4f","userroleList":[],"userstatusId":{"id":1,"name":"Operational"},"employeeCreatedId":{"id":1,"fullname":"Aga Surf View","callingname":"Admin","nic":"000000000V","genderId":{"id":1,"name":"Male"},"designationId":{"id":1,"name":"Owner"},"civilstatusId":{"id":1,"name":"Married"},"employeestatusId":{"id":1,"name":"Operational"}},"employeeId":{"id":1,"fullname":"Aga Surf View","callingname":"Admin","nic":"000000000V","genderId":{"id":1,"name":"Male"},"designationId":{"id":1,"name":"Owner"},"civilstatusId":{"id":1,"name":"Married"},"employeestatusId":{"id":1,"name":"Operational"}}},{"docreation":"2018-10-17","customerId":null,"usertypeId":{"id":1,"name":"Employee"},"id":2,"username":"najee","password":"38da8b282848801c2605a16a786bb81cfdbe74ea","description":null,"salt":"ccf56b06b3458a485d8afbcbe178e1fa587cac6d","userroleList":[{"id":1,"roleId":{"id":1,"name":"Admin1"}}],"userstatusId":{"id":1,"name":"Operational"},"employeeCreatedId":{"id":1,"fullname":"Aga Surf View","callingname":"Admin","nic":"000000000V","genderId":{"id":1,"name":"Male"},"designationId":{"id":1,"name":"Owner"},"civilstatusId":{"id":1,"name":"Married"},"employeestatusId":{"id":1,"name":"Operational"}},"employeeId":{"dobirth":"1988-11-03","doassignment":"2018-10-17","id":2,"number":"0001","fullname":"Najee Suraj","callingname":"Najee","nic":"881025621V","address":"unakuruwa,\ntengalle","mobile":"0771269906","genderId":{"id":1,"name":"Male"},"designationId":{"id":1,"name":"Owner"},"civilstatusId":{"id":1,"name":"Married"},"employeestatusId":{"id":1,"name":"Operational"}}},{"docreation":"2019-06-17","customerId":null,"usertypeId":{"id":1,"name":"Employee"},"id":3,"username":"kasun","password":"e978e58b66e5dc31fdfc30eeeb06339699eda06f","description":null,"salt":"4eecfa21de8d96ce439b745f248a4b916f67ffeb","userroleList":[{"id":3,"roleId":{"id":2,"name":"Admin2"}}],"userstatusId":{"id":1,"name":"Operational"},"employeeCreatedId":{"id":1,"fullname":"Aga Surf View","callingname":"Admin","nic":"000000000V","genderId":{"id":1,"name":"Male"},"designationId":{"id":1,"name":"Owner"},"civilstatusId":{"id":1,"name":"Married"},"employeestatusId":{"id":1,"name":"Operational"}},"employeeId":{"dobirth":"1990-04-25","doassignment":"2019-06-16","id":3,"number":"0002","fullname":"Kasun Sulakshana","callingname":"Kasun","nic":"901015785V","address":"115,\nGalle Road,\nTengalle","mobile":"0771234567","genderId":{"id":1,"name":"Male"},"designationId":{"id":1,"name":"Owner"},"civilstatusId":{"id":1,"name":"Married"},"employeestatusId":{"id":1,"name":"Operational"}}}],"pageable":{"sort":{"sorted":false,"unsorted":true},"offset":0,"pageNumber":0,"pageSize":3,"unpaged":false,"paged":true},"totalPages":4,"totalElements":11,"last":false,"size":3,"number":0,"sort":{"sorted":false,"unsorted":true},"numberOfElements":3,"first":true}
            if(data.content!= undefined) users = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblUser',users,fillForm,btnDeleteMC,printrow);
            clearSelection(tblUser);
            if(activerowno!="")selectRow(tblUser,activerowno,active);
            window.location.href="#ui";
        }

        function paginate(page) {
            var paginate;
            if(olduser==null){
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

            user = new Object();
            olduser = null;

            fillCombo(cmbEmployee,"Select Employee",employeeswithoutusers,"callingname","");
          //  fillCombo(cmbUserstatus,"Select Userstatus",userstatuses,"name","Operational");
            fillCombo(cmbEmployeeCreated,"Loged Employee",employees,"callingname","Admin");
            fillCombo(cmbUserRoles,"",roleslist,"role","");

            var today = new Date();
            var month = today.getMonth()+1;
            if(month<10) month = "0"+month;
            var date = today.getDate();
            if(date<10) date = "0"+date;

            dteDOCreated.value=today.getFullYear()+"-"+month+"-"+date;

            user.docreation=dteDOCreated.value;
            user.employeeCreatedId=JSON.parse(cmbEmployeeCreated.value);
           // user.userstatusId=JSON.parse(cmbUserstatus.value);

            txtUsername.value = "";
            txtPassword.value = "";
            txtRetypePassword.value = "";
            txtDescription.value = "";

            setStyle(initial);

            dteDOCreated.style.background=valid;

            cmbEmployeeCreated.style.background=valid;
            disableButtons(false, true, true);
            cmbEmployeeCreated.disabled="disabled";
        }

        function setStyle(style) {
            /*
            txtUsername.style.background = style;
            txtPassword.style.background = style;
            txtRetypePassword.style.background = style;
            cmbEmployee.style.background = style;
            cmbUserstatus.style.background = style;
            dteDOCreated.style.background = style;
            txtDescription.style.background = style;
            cmbEmployeeCreated.style.background = style;
          */
        }

function disableButtons(add, upd, del) {

    if (add || !privilages.add) {
        btnAdd.setAttribute("disabled", "disabled");
        $('#btnAdd').css('cursor','not-allowed');
    }
    else {
        btnAdd.removeAttribute("disabled");
        $('#btnAdd').css('cursor','pointer')
    }

    if (upd || !privilages.update) {
        btnUpdate.setAttribute("disabled", "disabled");
        $('#btnUpdate').css('cursor','not-allowed');
    }
    else {
        btnUpdate.removeAttribute("disabled");
        $('#btnUpdate').css('cursor','pointer');
    }

    if (!privilages.update) {
        $(".buttonup").prop('disabled', true);
        $(".buttonup").css('cursor','not-allowed');
    }
    else {
        $(".buttonup").removeAttr("disabled");
        $(".buttonup").css('cursor','pointer');
    }

    if (!privilages.delete){
        $(".buttondel").prop('disabled', true);
        $(".buttondel").css('cursor','not-allowed');
    }
    else {
        $(".buttondel").removeAttr("disabled");
        $(".buttondel").css('cursor','pointer');
    }

}

        function txtPasswordKU() {
            txtRetypePassword.value="";
            txtRetypePassword.style.background = invalid;

        }

        function txtRetypePasswordKU() {
            var pattern = new RegExp(txtPassword.getAttribute('data-pattern'));
            var password = txtPassword.value;
            var retypepassword = txtRetypePassword.value;
            if(pattern.test(password) && password==retypepassword) {
                user.password = password;
                txtRetypePassword.style.background = valid;
            }
            else
            {
                user.password = null;
                txtRetypePassword.style.background = invalid;
            }
        }

        function btnSetToDefaultMC(){

            var option = window.confirm("\n\nAre your sure to reset the password ! \n\n");
            if(option==true) {
                var defaultpassword = window.prompt("Enter Default Password");
                user.password=defaultpassword;
                var response = httpRequest("/resetpassword","PUT",user);
                if(response=="0"){
                    toast("<strong>Success !</strong> Updated Successfully","success");
                    loadForm();
                    loadSearchedTable();

                }
                else window.alert("Failed to Update as \n\n"+response);
            }
        }

        //Form Operation Functions
        function getErrors() {

            var errors = "";

            if (user.employeeId == null)
                errors = errors + "\n" + "Employee Not Selected";

            if (user.userName == null)
                errors = errors + "\n" + "User Name Not Entered";

            if (user.password == null)
                errors = errors + "\n" + "Password Not Inserted or Mismatch";

            if (user.roles.length == 0)
                errors = errors + "\n" + "Roles Not Selected";

            return errors;

        }

        function btnAddMC(){
            var errors = getErrors();

            if(errors==""){
                // roleslist = $(".js-example-basic-multiple").val();
                // userroles = new Array();
                // for(x in roleslist){
                //     userroles.push(roleslist[x])
                // }
               // user.userroleList = userroles;
                console.log(user.userroleList);
                var option = window.confirm("Are you sure to add following User ?\n" +
                    "\nEmployee : " + user.employeeId.callingname +
                    "\nUsername : " + user.userName +
                    "\nUser email : " + user.email +
                   // "\nRoles : " + user.userroleList +
                    "\nCreated By : " + user.employeeCreatedId.callingname);
                if(option==true) {
                    var response = httpRequest("/user","POST",user);
                    if(response=="0"){
                        alert(" Saved Successfully");
                        employeeswithoutusers = httpRequest("../employee/withoutusers","GET");
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

            var clear;
            if(olduser==null){
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

        function fillForm(usr,rowno){
            activerowno = rowno;
            var filling;
            if(olduser==null){
                filling=true;
            }else{

                if(getErrors()==''&&getUpdates()==''){
                    filling=true;
                }else{
                    filling = window.confirm("Form has Some Errors or Update Values. " +
                        "Are you sure to discard that changes ?");
                }
            }

            if(filling) {

                clearSelection(tblUser);
                selectRow(tblUser,activerowno,active);

                user = JSON.parse(JSON.stringify(usr));
                olduser = JSON.parse(JSON.stringify(usr));

                // fill combo 2
               fillCombo2(cmbUserRoles,"",roleslist,"role",user.roles);

                $('.select2-selection').css('border','2px solid green');

                txtUsername.value = user.userName;
                dteDOCreated.value = user.docreation;
                txtDescription.value = user.description;
                txtUsername.disabled="disabled";
                txtPassword.disabled="disabled";
                txtRetypePassword.disabled="disabled";
                dteDOCreated.disabled="disabled";

                fillCombo(cmbEmployee, "", employees, "callingname", user.employeeId.callingname);

                fillCombo(cmbEmployeeCreated, "", employees, "callingname", user.employeeCreatedId.callingname);
                cmbEmployee.disabled="disabled";
                cmbEmployeeCreated.disabled="disabled";

                disableButtons(true, false, false);
                setStyle(valid);
            }

        }

        function getUpdates() {

            var updates = "";

            if(user!=null && olduser!=null) {

                if (isEqual(user.userroleList,olduser.userroleList,"roleId"))
                     updates = updates + "\nRoles are Changed";

                if (user.description != olduser.description)
                    updates = updates + "\nDescription is Changed";

                if (user.userstatusId.name != olduser.userstatusId.name)
                    updates = updates + "\nUserstatus is Changed";


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
                        var response = httpRequest("/users","PUT",user);
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

        function btnDeleteMC(uer) {
            user = JSON.parse(JSON.stringify(uer));

            var option = window.confirm("\n\nAre your sure to delete following ! \n\n" +
                "Number : " +user.userName+ "\nEmployee name : " +user.employeeId.callingname);

            if(option==true) {
                var response = httpRequest("/user","DELETE",user);
                if(response=="0"){
                    swal({
                        title: "Deleted Successfully....!",
                        text: "\n\n  Status change to delete",
                        icon: "success", button: false, timer: 1200,
                    });
                    employeeswithoutusers = httpRequest("../datalists/employeeswithoutusers","GET");
                    loadForm();
                    loadSearchedTable();

                }
                else window.alert("Failed to Delete as \n\n"+response);
            }

        }

        //Search Functions
        function loadSearchedTable(){

            var userName = txtSearchUsername.value.trim();

            var query ="&username=";

            if(username!="")
                query = "&username=" + username;

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

        //Custom combo binder
        function cusComboBoxBinder(field) {
            rlist = $('.js-example-basic-multiple').val();
            user.roles = new Array();

            rlist.forEach(function(item){
                eval('var obj='+item);
                user.roles.push(obj);
            })

            if(user.roles.length != 0){

                if (olduser != null && isEqualtolist(user.roles,olduser.roles,"role") ){
                    $('.select2-selection').css('border','2px solid khaki');
                }else {
                    $('.select2-selection').css('border','2px solid green');
                }
            }else
                $('.select2-selection').css('border','2px solid red');

        }



function printrow(usr) {
    user = JSON.parse(JSON.stringify(usr));




}
