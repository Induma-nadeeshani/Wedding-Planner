package lk.bitproject.controller;


import lk.bitproject.model.Employee;
import lk.bitproject.model.Reservation;
import lk.bitproject.model.User;
import lk.bitproject.model.Vehicle;
import lk.bitproject.repository.DesignationRepository;
import lk.bitproject.repository.EmployeeRepository;
import lk.bitproject.repository.EmployeestatusRepository;
import lk.bitproject.repository.UserRepository;
import lk.bitproject.service.EmailService;
import lk.bitproject.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RequestMapping(value = "/employee")
@RestController
public class EmployeeController {

    @Autowired
    private EmployeeRepository dao;

    private AuthController authority;

    @Autowired
    private UserRepository daouser;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private DesignationRepository daoDesignation;

    @Autowired
    private EmployeestatusRepository daoEmployeestatus;

    //reservation/bygender?genderid=
    @GetMapping(value = "/bygender", params = {"genderid"}, produces = "application/json")
    public List<Employee> bygender(@RequestParam("genderid") int genderid) {
        return dao.bygender(genderid);
    }

    @GetMapping(value = "/list", produces = "application/json")
    public List<Employee> list() {
            return dao.list();
    }

    @GetMapping(value = "/listbysupavailable", params = {"date"}, produces = "application/json")
    public List<Employee> listbysupavailable(@RequestParam("date") String date) {
        return dao.listbysupavailable(LocalDate.parse(date));
    }

    //Available drivers for vehallocation
    @GetMapping(value = "/drvlistbyavailable", params = {"eventdate"}, produces = "application/json")
    public List<Employee> drvlistbyavailable(@RequestParam("eventdate") String eventdate) {
        return dao.drvlistbyavailable(LocalDate.parse(eventdate));
    }

// @GetMapping(value = "/listbyavailability", params = {"date"}, produces = "application/json")
//    public List<Employee> listbyavailability(@RequestParam("date") String date) {
//        return dao.listbyavailability(LocalDate.parse(date));
//    }

    @GetMapping(value = "/supervisorlist", produces = "application/json")
    public List<Employee> supervisorlist(){
        return dao.supervisorlist();
    }

    @GetMapping(value = "/nextNumber", produces = "application/json")
    public Employee nextNumber() {
        String nextnumber = dao.getNextNumber();
        LocalDate cdate =  java.time.LocalDate.now();
        String cdates = cdate.toString().substring(2,4);
        System.out.println("sss "+ cdates);
        if(nextnumber!=""){
            String fisttwo = nextnumber.substring(0,2);
            if(cdates.equals(fisttwo)){
                nextnumber = cdates+String.format("%04d", Integer.parseInt(nextnumber.substring(3))+1);
                System.out.println("sss1 "+ nextnumber);
            }else{
                nextnumber = cdates+"0000";
                System.out.println("sss2 "+ nextnumber);
            }

        }else{
            nextnumber = cdates+"0000";
            System.out.println("sss3 "+ nextnumber);
        }

       Employee emp = new Employee(nextnumber);
        return emp;
    }

    @GetMapping(value = "/list/withoutusers", produces = "application/json")
    public List<Employee> listwithoutusers() {
         return dao.listWithoutUsers();
    }

    @GetMapping(value = "/list/withuseraccount", produces = "application/json")
    public List<Employee> listwithuseraccount() {
        return dao.listWithUseraccount();

    }

    //Drivers list
    @GetMapping(value = "/listbydesignation" , produces = "application/json")
    public List<Employee> empdrvList(){
        return dao.empdrvList();
    }


    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Employee> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Employee");
        if(user != null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size));
        else
            return null;
    }


    @GetMapping(value = "/findAll",params = {"page", "size","searchtext"}, produces = "application/json")
    public Page<Employee> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Employee");
        if(user != null && priv.get("select")){
            return dao.findAll(searchtext,PageRequest.of(page, size));
        }
        return null;
    }


    @PostMapping()
    public String add(@Validated @RequestBody Employee employee) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Employee");
        if(user != null && priv.get("add")){
            Employee empnic = dao.findByNIC(employee.getNic());
            Employee empnumber = dao.findByNumber(employee.getNumber());
            if (empnic != null)
                return "Error-Validation : NIC Exists";
            else if (empnumber != null)
                return "Error-Validation : Number Exists";
            else
                try {
                        dao.save(employee);
                        //  emailService.sendMail("rukshannuwanbit@gmail.com","Registor Employee","Employee Registration Success Fully...!\n\n Thank You to join with us.. \n\n from : Sudu buthaya");
                        return "0";

                } catch (Exception e) {
                    return "Error-Saving : " + e.getMessage();
                }
       }
        return "Error-Saving : You have no Permission";

    }



    @PutMapping()
    public String update(@Validated @RequestBody Employee employee) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Employee");
        if(user != null && priv.get("update")){
            Employee emp = dao.findByNIC(employee.getNic());
        if(emp==null || emp.getId()==employee.getId()) {
            try {
            User empuser = daouser.getByEmployee(employee.getId());
                /*if (empuser != null) {
                if (employee.getEmployeestatusId().getName().equals("Resigned") || employee.getEmployeestatusId().getName().equals("Deleted") ){
                        empuser.setActive(false);
                }
                if (employee.getEmployeestatusId().getName().equals("Working")) {

                    empuser.setActive(true);
                    System.out.println("1234554545");
                }
                    //System.out.println("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                    System.out.println(empuser.getActive());
                        daouser.save(empuser);

                }*/
                dao.save(employee);
                return "0";
            }
            catch(Exception e) {
                return "Error-Updating : "+e.getMessage();
            }
        }
        else {  return "Error-Updating : NIC Exists"; }
        }
        return "Error-Updating : You have no Permission";
    }


    @DeleteMapping()
    public String delete(@RequestBody Employee employee ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Employee");
        if(user != null && priv.get("delete")){
            try {
           // dao.delete(dao.getOne(employee.getId()));
                /*employee.setEmployeestatusId(daoEmployeestatus.getOne(3));

                User empuser = daouser.getByEmployee(employee.getId());
                if (empuser != null){
                    empuser.setActive(false);
                     daouser.save(empuser);
                }*/
                dao.save(employee);
            return "0";
        }
        catch(Exception e) {
            return "Error-Deleting : "+e.getMessage();
        }
    }
        return "Error-Deleting : You have no Permission";

    }

}
