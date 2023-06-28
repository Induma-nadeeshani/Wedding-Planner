package lk.bitproject.controller;

import lk.bitproject.model.Service;
import lk.bitproject.model.User;
import lk.bitproject.repository.SStatusRepository;
import lk.bitproject.repository.ServiceRepository;
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

@RestController
@RequestMapping(value = "/service")
public class ServiceController {

    @Autowired
    private ServiceRepository dao;

    private AuthController authority;

    @Autowired
    private UserService userService;

    @Autowired
    private SStatusRepository daoStatus;

    @GetMapping(value = "/list",produces = "application/json")
    public List<Service> serviceList(){return dao.findAll();}

    //get service mapping for get service name to combo in provider package
    @GetMapping(value = "/servicebyname" , produces = "application/json")
    public List<Service> serviceByName(){
        return dao.serviceByName();
    }

    //get service mapping for get service with next customer number
    @GetMapping(value = "/nextnumber", produces = "application/json")
    public Service nextNumber(){
        String nextnumber = dao.getNextNumber();
        Service ser = new Service(nextnumber);
        return ser;
    }

    //get service for get data from Database(/service/findAll?page=0&size=3
    @GetMapping(value = "/findAll" , params = {"page" , "size"},produces = "application/json")
    public Page<Service> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Service");
        if(user != null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        else
            return null;
    }

    //get service for get data from Database with search(/customer/findAll?page=0&size=3&searchtext=)
    @GetMapping(value = "/findAll" , params = {"page" , "size" , "searchtext"},produces = "application/json")
    public Page<Service> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Service");
        if(user != null && priv.get("select"))
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        else
            return null;
    }

    //post service mapping for insert data into Database
    @PostMapping
    public  String add(@Validated @RequestBody Service service){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Service");
        if(user != null && priv.get("add")){
            Service serreg = dao.getByNumber(service.getServicecode());

            if (serreg != null)
                return "Error : Serice already Registered(Reg Number Exists)";

            try {
                dao.save(service);
                return "0";
            }catch (Exception ex){
                return "Error : " +ex.getMessage();

            }

        }else
            return "Error : You have no permission";
    }

    //put service mapping for update data into Database
    @PutMapping
    public  String update(@Validated @RequestBody Service service){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Service");
        if(user != null && priv.get("update")){
            Service ser = dao.getOne(service.getId());
            if(ser != null){
                try {
                    dao.save(service);
                    return "0";
                }catch (Exception ex){
                    return "Error : " +ex.getMessage();

                }
            }else{
                return "Error : Service doesn't Exist";

            }

        }else
            return "Error : You have no permission";
    }

    //Delete service mapping for delete data from Database(not delete,status change into delete
    @DeleteMapping
    public  String delete(@Validated @RequestBody Service service){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Service");
        if(user != null && priv.get("delete")){
            Service ser = dao.getOne(service.getId());
            if(ser != null){
                try {
                    ser.setSstatusId(daoStatus.getOne(3));
                    dao.save(ser);
                    return "0";
                }catch (Exception ex){
                    return "Error : " +ex.getMessage();

                }
            }else{
                return "Error : Service doesn't Exist";

            }

        }else
            return "Error : You have no permission";
    }
}
