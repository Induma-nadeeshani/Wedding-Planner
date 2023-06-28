package lk.bitproject.controller;

import lk.bitproject.model.*;
import lk.bitproject.repository.PackageStatusRepository;
import lk.bitproject.repository.ProviderPackageRepository;
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
@RequestMapping(value = "/providerpackage")
public class ProviderPackageController {

    @Autowired
    private ProviderPackageRepository dao;

    private AuthController authority;

    @Autowired
    private UserService userService;

    @Autowired
    private PackageStatusRepository daoStatus;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<ProviderPackage> providerPackageList(){
        return dao.findAll();
    }

    //providerpackae/byprovider?providerid=+&serviceid=
    @GetMapping(value = "/byserviceandprovider", params = {"serviceid","providerid"}, produces = "application/json")
    public List<ProviderPackage> packagebyserviceandprovider(@RequestParam("serviceid") int serviceid,@RequestParam("providerid") int providerid) {
        return dao.byserviceandprovider(serviceid,providerid);
    }


//    //providerpackage/byreservation?reservationId=
//    @GetMapping(value = "/byreservation", params = {"reservationid"}, produces = "application/json")
//    public List<ProviderPackage> byreservation(@RequestParam("reservationid") int reservationid) {
//        return dao.byreservation(reservationid);
//    }

    //vehicle pkg from reservation
 //providerpackage/vehbyreservation?reservationid=
    @GetMapping(value = "/vehbyreservation", params = {"reservationid"}, produces = "application/json")
    public List<ProviderPackage> vehbyreservation(@RequestParam("reservationid") int reservationid) {
        return dao.vehbyreservation(reservationid);
    }

    @GetMapping(value = "/listbyprovider" , params = {"providerid"},produces = "application/json")
    public List<ProviderPackage> providerPackageListbyprovider(@RequestParam("providerid")int providerid){
        return dao.listByProvider(providerid);
    }

    //get service mapping for get vehicle packages
    @GetMapping(value = "/listbyvehiclepkgs" , produces = "application/json")
    public List<ProviderPackage> packageListByVehicles(){
        return dao.packageListByVehicles();
    }





    //get service for get data from Database(/providerpackage/findAll?page=0&size=3
    @GetMapping(value = "/findAll" , params = {"page" , "size"},produces = "application/json")
    public Page<ProviderPackage> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"ProviderPackage");
        if(user != null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size,Sort.Direction.DESC,"id"));
        else
            return null;
    }

    //get service for get data from Database with search(/providerpackage/findAll?page=0&size=3&searchtext=)
    @GetMapping(value = "/findAll" , params = {"page" , "size" , "searchtext"},produces = "application/json")
    public Page<ProviderPackage> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"ProviderPackage");
        if(user != null && priv.get("select"))
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        else
            return null;
    }

    //post service mapping for insert data into Database
    @PostMapping
    public  String add(@Validated @RequestBody ProviderPackage providerpackage){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"ProviderPackage");
        if(user != null && priv.get("add")){
            ProviderPackage spreg = dao.getByNumber(providerpackage.getCode());

            if (spreg != null)
                return "Error : Service Provider already Registered(Reg Number Exists)";

            try {
                for (Features features: providerpackage.getFeaturesList())
                    features.setProviderpackageId(providerpackage);
                dao.save(providerpackage);
                return "0";
            } catch (Exception ex) {
                return "Error : " + ex.getMessage();

            }
        }else
            return "Error : You have no permission";
    }

    //put service mapping for update data into Database
    @PutMapping
    public  String update(@Validated @RequestBody ProviderPackage providerpackage){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"ProviderPackage");
        if(user != null && priv.get("update")){
            ProviderPackage sp = dao.getOne(providerpackage.getId());
            if(sp != null){
                try {
                    for (Features features: providerpackage.getFeaturesList())
                        features.setProviderpackageId(providerpackage);
                    dao.save(providerpackage);
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
    public  String delete(@Validated @RequestBody ProviderPackage providerpackage){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"ProviderPackage");
        if(user != null && priv.get("delete")){
            ProviderPackage pp = dao.getOne(providerpackage.getId());
            if(pp != null){
                try {
                    for (Features features: pp.getFeaturesList())
                        features.setProviderpackageId(pp);

                    pp.setPackagestatusId(daoStatus.getOne(3));
                    dao.save(pp);
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
