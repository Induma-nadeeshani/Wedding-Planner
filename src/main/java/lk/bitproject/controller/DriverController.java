package lk.bitproject.controller;

import lk.bitproject.model.Customer;
import lk.bitproject.model.Driver;
import lk.bitproject.model.User;
import lk.bitproject.model.Vehicle;
import lk.bitproject.repository.DStatusRepository;
import lk.bitproject.repository.DriverRepository;
import lk.bitproject.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/driver")
public class DriverController {

    @Autowired
    private DriverRepository dao;

    private AuthController authority;

    @Autowired
    private UserService userService;

    @Autowired
    private DStatusRepository daoStatus;

  /*  @GetMapping(value = "/listbyavailable", params = {"date", "stime", "etime"}, produces = "application/json")
    public List<Driver> listbyavailable(@RequestParam("date") String date, @RequestParam("stime") String stime, @RequestParam("etime") String etime) {
        return dao.listbyavailable(LocalDate.parse(date), stime, etime);
    }*/

    //get service mapping for get customer with next customer number
    @GetMapping(value = "/nextnumber", produces = "application/json")
    public Driver nextNumber(){
        String nextnumber = dao.getNextNumber();
        Driver drv = new Driver(nextnumber);
        return drv;
    }

    //get service for get data from Database(/driver/findAll?page=0&size=3
    @GetMapping(value = "/findAll" , params = {"page" , "size"},produces = "application/json")
    public Page<Driver> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Driver");
        if(user != null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size,Sort.Direction.DESC,"id"));
        else
            return null;
    }


    //get service for get data from Database with search(/driver/findAll?page=0&size=3&searchtext=)
    @GetMapping(value = "/findAll" , params = {"page" , "size" , "searchtext"},produces = "application/json")
    public Page<Driver> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Driver");
        if(user != null && priv.get("select"))
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        else
            return null;
    }

    //post service mapping for insert data into Database
    @PostMapping
    public  String add(@Validated @RequestBody Driver driver){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Driver");
        if(user != null && priv.get("add")){
            Driver drvreg = dao.getByNumber(driver.getRegno());

            if (drvreg != null)
                return "Error : Driver already Registered(Reg Number Exists)";
            try {
                dao.save(driver);
                return "0";
            }catch (Exception ex){
                return "Error : " +ex.getMessage();

            }

        }else
            return "Error : You have no permission";
    }

    //put service mapping for update data into Database
    @PutMapping
    public  String update(@Validated @RequestBody Driver driver){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Driver");
        if(user != null && priv.get("update")){
            Driver cus = dao.getOne(driver.getId());
            if(cus != null){
                try {
                    dao.save(driver);
                    return "0";
                }catch (Exception ex){
                    return "Error : " +ex.getMessage();

                }
            }else{
                return "Error : Driver doesn't Exist";

            }

        }else
            return "Error : You have no permission";
    }

    //Delete service mapping for delete data from Database(not delete,status change into delete
    @DeleteMapping
    public  String delete(@Validated @RequestBody Driver driver){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Driver");
        if(user != null && priv.get("delete")){
            Driver drv = dao.getOne(driver.getId());
            if(drv != null){
                try {
                    drv.setDstatusId(daoStatus.getOne(3));
                    dao.save(drv);
                    return "0";
                }catch (Exception ex){
                    return "Error : " +ex.getMessage();

                }
            }else{
                return "Error : Driver doesn't Exist";

            }

        }else
            return "Error : You have no permission";
    }

}
