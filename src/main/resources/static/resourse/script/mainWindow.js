
window.onload = function () {

    // console.log(session.getObject("loginuser"));
	if(session.getObject("loginuser") != null){
        loggedUserName = session.getObject("loginuser").loginusername;
        lblLogUser.innerHTML = loggedUserName;
        loggedUser = httpRequest("/user/getuser/"+loggedUserName , "GET" );
        session.setObject('activeuser', loggedUser);

        if(loggedUser.employeeId != undefined){
            lblLoggedAsUser.innerText =  session.getObject('activeuser').employeeId.designationId.name;
            if(loggedUser.employeeId.photo != null)
                profileImage.src = atob(loggedUser.employeeId.photo);
            else
                profileImage.src = 'resourse/image/nouser.jpg';
        }else {
            window.location.href = "http://localhost:8080/login";
        }
    }else
		 window.location.href = "http://localhost:8080/login";



    if(session.getObject("activeuser").employeeId.id!=1) {
        //loged user select module
        modulelist = httpRequest("../module/listbyuser?userid=" + session.getObject("activeuser").id, "GET");
        //all module
        menuitemlist = httpRequest("../module/list","GET");

        dislist = listCompera(menuitemlist,modulelist,"id","name");

        for (x in dislist) {
            mname = dislist[x].name;
            //console.log(mname);
            if( document.getElementById(mname) != null )
                document.getElementById(mname).remove();


            var quickmnu = document.getElementsByClassName(mname);
            var i;
            for (i = 0; i < quickmnu.length; i++) {
                // quickmnu[i].style.cursor = "not-allowed";
                // quickmnu[i].disabled = true;
                quickmnu[i].style.display = "none";
                // quickmnu[i].style.opacity = "0.6";


            }


        }


    }

}

/* ---------------------------------------------------
    SIDE BAR COLLAPSE BUTTON
----------------------------------------------------- */


$(document).ready(function () {


    $('#dismiss, .overlay').on('click', function () {
        $('#sidebar').removeClass('active');
        $('.overlay').removeClass('active');
    });

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').addClass('active');
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
});


function btnSignoutMC() {
    swal({
        title: "Do you want to sign out?",
        text: " ",
        icon: "warning",
        buttons: true,
        closeOnClickOutside: false
    }).then((willDelete) => {
        if (willDelete) {
            swal({
                title: "Sign Out Successful",
                text: " ",
                icon: "success",
                timer: 1500,
                buttons: false,
                closeOnClickOutside: false
            }).then(() => {
                window.location.assign('/logout');
            });

        }
    });
}

