package lk.bitproject.controller;

//import 3rd Party
import lk.bitproject.model.Customer;
import lk.bitproject.model.SMS;
import lk.bitproject.model.User;
import lk.bitproject.repository.CStatusRepository;
import lk.bitproject.repository.CustomerRepository;
import lk.bitproject.service.EmailService;
import lk.bitproject.service.SMSService;
import lk.bitproject.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

//service wada krnn
@RestController
//class level req mapping
@RequestMapping(value = "/customer")
public class CustomerController {

    //Instance of repositories
    @Autowired//to create the instance specially for instances
    private CustomerRepository dao;

    //authentication
    private AuthController authority;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;

    @Autowired//priviledge for logged user
    private SMSService smsService;

    @Autowired
    private CStatusRepository daoStatus;

    //get service mapping for get customer with next customer number
    @GetMapping(value = "/nextnumber", produces = "application/json")
    public Customer nextNumber() {
        String nextnumber = dao.getNextNumber();
        Customer cus = new Customer(nextnumber);
        return cus;
    }

    //get customer list [customer/list]
    @GetMapping(value = "/list", produces = "application/json")
    public List<Customer> customerList() {
        return dao.getCustomers();
    }

    //get customer list [customer/listbypending]
    @GetMapping(value = "/listbypending", produces = "application/json")
    public List<Customer> listbypending() {
        return dao.listbypending();
    }

    //get data to the table
    //get service for get data from Database(/customer/findAll?page=0&size=3)
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<Customer> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Customer");
        if(user != null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        else
            return null;
    }

    //get service for get data from Database with search(/customer/findAll?page=0&size=3&searchtext=)
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Customer> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //get auth object from security content
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user object by given auth object
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Customer");
        if(user != null && priv.get("select"))
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        else
            return null;
    }

    //post service mapping for insert data into Database
    @PostMapping
    public String add(@Validated @RequestBody Customer customer) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Customer");
        if(user != null && priv.get("add")){

            Customer email = dao.getByNumber(customer.getCemail());
            Customer mobile = dao.getByNumber(customer.getCmobile());
            Customer cusreg = dao.getByNumber(customer.getRegno());
            Customer cusnic = dao.getByNic(customer.getNic());

            if (cusreg != null)
                return "Error : Customer already Registered(Reg Number Exists)";
            if (cusnic != null)
                return "Error : Customer already Registered(NIC Exists)";
            if (email != null)
                return "Error : Customer already Registered(Email Exists)";
            if (mobile != null)
                return "Error : Customer already Registered(Mobile Number Exists)";
            try {
                dao.save(customer);

//                emailService.sendMail(customer.getCemail(),
//                        "Welcome to Golden Crown Wedding Planners.",
//
//                        "You are successfully Registered"+
//                                "Reservation Code :"+customer.getRegno()+
//                                "\n Customer Number :"+customer.getCname()+"\n\n"+
//                                "\n NIC :"+customer.getNic())  ;

                     SMS sms = new SMS();


                //sms.setTo(customer.getCmobile());
                sms.setMessage("\n\n"+
                                "Your Customer Registration is Successfull...!"+
                                "\n Customer No :"+customer.getRegno()+
                                "\n Customer Name :"+customer.getCname()+
                                "\n Registered Date :"+customer.getRegdate()+
                                "\n\n"+
                                "- Golden Crown Wedding Planners -");

                //smsService.send(sms);

                return "0";
            } catch (Exception ex) {
                return "Error : " + ex.getMessage();

            }

        } else
            return "Error : You have no permission";
    }


    //put service mapping for update data into Database
    @PutMapping
    public String update(@Validated @RequestBody Customer customer) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Customer");
        if(user != null && priv.get("update")){
            Customer cus = dao.getOne(customer.getId());
            if (cus != null) {
                try {
                    dao.save(customer);
                    return "0";
                } catch (Exception ex) {
                    return "Error : " + ex.getMessage();

                }
            } else {
                return "Error : Customer doesn't Exist";

            }

        } else
            return "Error : You have no permission";
    }

    //Delete service mapping for delete data from Database(not delete,status change into delete
    @DeleteMapping
    public String delete(@Validated @RequestBody Customer customer) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Customer");
        if(user != null && priv.get("delete")){
            Customer cus = dao.getOne(customer.getId());
            if (cus != null) {
                try {
                    cus.setCstatusId(daoStatus.getOne(3));
                    dao.save(cus);
                    return "0";
                } catch (Exception ex) {
                    return "Error : " + ex.getMessage();

                }
            } else {
                return "Error : Customer doesn't Exist";

            }

        } else
            return "Error : You have no permission";
    }
}
