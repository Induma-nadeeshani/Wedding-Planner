package lk.bitproject.controller;

import lk.bitproject.model.Provide;
import lk.bitproject.model.ServiceProvider;
import lk.bitproject.model.User;
import lk.bitproject.repository.ServiceProviderRepository;
import lk.bitproject.repository.SpStatusRepository;
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
@RequestMapping(value = "/serviceprovider")
public class ServiceProviderController {

    @Autowired
    private ServiceProviderRepository dao;

    private AuthController authority;

    @Autowired
    private UserService userService;

    @Autowired
    private SpStatusRepository daoStatus;

    //get service mapping for get serviceprovice with next serviceprovice number
    @GetMapping(value = "/nextnumber", produces = "application/json")
    public  ServiceProvider nextNumber(){
        String nextnumber = dao.getNextNumber();
        ServiceProvider sp = new ServiceProvider(nextnumber);
        return sp;
    }

    //serviceprovider/byservice?serviceid=
    @GetMapping(value = "/byservice", params = {"serviceid"}, produces = "application/json")
    public List<ServiceProvider> serviceproviderbyservice(@RequestParam("serviceid") int serviceid) {
        return dao.byservice(serviceid);
    }

    //get service mapping for get serviceprovider name to combo in provider package
    @GetMapping(value = "/list" , produces = "application/json")
    public List<ServiceProvider> providersList(){
        return dao.providersList();
    }

    //get service mapping for get photographers
    @GetMapping(value = "/listbyphotographer" , produces = "application/json")
    public List<ServiceProvider> providersListbypoto(){
        return dao.providersListByPhoto();
    }

    //get service mapping for get decorations
    @GetMapping(value = "/listbydecos" , produces = "application/json")
    public List<ServiceProvider> providersListbydeco(){
        return dao.providersListByDeco();
    }

    //get service mapping for get vehicles
    @GetMapping(value = "/listbyvehi" , produces = "application/json")
    public List<ServiceProvider> providersListbyvehi(){
        return dao.providersListByVehi();
    }

    //get service for get data from Database(/serviceprovider/findAll?page=0&size=3
    @GetMapping(value = "/findAll" , params = {"page" , "size"},produces = "application/json")
    public Page<ServiceProvider> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"ServiceProvider");
        if(user != null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size,Sort.Direction.DESC,"id"));
        else
            return null;
    }

    //get service for get data from Database with search(/serviceprovider/findAll?page=0&size=3&searchtext=)
    @GetMapping(value = "/findAll" , params = {"page" , "size" , "searchtext"},produces = "application/json")
    public Page<ServiceProvider> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"ServiceProvider");
        if(user != null && priv.get("select"))
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        else
            return null;
    }

    //post service mapping for insert data into Database
    @PostMapping
    public  String add(@Validated @RequestBody ServiceProvider serviceProvider){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"ServiceProvider");
        if(user != null && priv.get("add")){
            ServiceProvider spreg = dao.getByNumber(serviceProvider.getRegno());

            if (spreg != null)
                return "Error : Service Provider already Registered(Reg Number Exists)";

                try {
                    for (Provide provide: serviceProvider.getProvideList())
                        provide.setServiceproviderId(serviceProvider);
                    dao.save(serviceProvider);
                    return "0";
                } catch (Exception ex) {
                    return "Error : " + ex.getMessage();

                }
        }else
            return "Error : You have no permission";
    }

    //put service mapping for update data into Database
    @PutMapping
    public  String update(@Validated @RequestBody ServiceProvider serviceProvider){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"ServiceProvider");
        if(user != null && priv.get("update")){
            ServiceProvider sp = dao.getOne(serviceProvider.getId());
            if(sp != null){
                try {
                    for (Provide provide: serviceProvider.getProvideList())
                        provide.setServiceproviderId(serviceProvider);
                    dao.save(serviceProvider);
                    return "0";
                }catch (Exception ex){
                    return "Error : " +ex.getMessage();

                }
            }else{
                return "Error : Service Provider doesn't Exist";

            }
        }else
            return "Error : You have no permission";
    }

    //Delete service mapping for delete data from Database(not delete,status change into delete
    @DeleteMapping
    public  String delete(@Validated @RequestBody ServiceProvider serviceProvider){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"ServiceProvider");
        if(user != null && priv.get("delete")){
            ServiceProvider sp = dao.getOne(serviceProvider.getId());
            if(sp != null){
                try {
                    for (Provide provide: sp.getProvideList())
                        provide.setServiceproviderId(sp);

                    sp.setSpstatusId(daoStatus.getOne(3));
                    dao.save(sp);
                    return "0";
                }catch (Exception ex){
                    return "Error : " +ex.getMessage();

                }
            }else{
                return "Error : Service Provider doesn't Exist";

            }

        }else
            return "Error : You have no permission";
    }
}
