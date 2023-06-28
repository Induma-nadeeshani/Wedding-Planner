package lk.bitproject.controller;

import lk.bitproject.model.Package;
import lk.bitproject.model.User;
import lk.bitproject.repository.CStatusRepository;
import lk.bitproject.repository.PackageRepository;
import lk.bitproject.repository.PkgStatusRepository;
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
@RequestMapping(value = "/package")
public class PackageController {

    @Autowired
    private PackageRepository dao;

    private AuthController authority;

    @Autowired
    private UserService userService;

    @Autowired
    private PkgStatusRepository daoStatus;

    //get service mapping for get Package with next Package number
    @GetMapping(value = "/nextnumber", produces = "application/json")
    public  Package nextNumber(){
        String nextnumber = dao.getNextNumber();
        Package pkg = new Package(nextnumber);
        return pkg;
    }

    @GetMapping(value = "/list",produces = "application/json")
    public List<Package> packageList(){return dao.findAll();}

    //get service for get data from Database(/Package/findAll?page=0&size=3
    @GetMapping(value = "/findAll" , params = {"page" , "size"},produces = "application/json")
    public Page<Package> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Package");
        if(user != null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size,Sort.Direction.DESC,"id"));
        else
            return null;
    }

//    //get service for get data from Database with search(/Package/findAll?page=0&size=3&searchtext=)
//    @GetMapping(value = "/findAll" , params = {"page" , "size" , "searchtext"},produces = "application/json")
//    public Page<Package> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        User user = userService.findUserByUserName(auth.getName());
//        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Package");
//            if(user != null && priv.get("select"))
//            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC,"id"));
//        else
//            return null;
//    }
//
//    //post service mapping for insert data into Database
//    @PostMapping
//    public  String add(@Validated @RequestBody Package Package){
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        User user = userService.findUserByUserName(auth.getName());
//        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Package");
//            if(user != null && priv.get("add")){
//            Package cusreg = dao.getByNumber(Package.getRegno());
//
//            if (cusreg != null)
//                return "Error : Package already Registered(Reg Number Exists)";
//            try {
//                dao.save(Package);
//                  return "0";
//            }catch (Exception ex){
//                  return "Error : " +ex.getMessage();
//
//                }
//
//        }else
//            return "Error : You have no permission";
//    }
//
//    //put service mapping for update data into Database
//    @PutMapping
//    public  String update(@Validated @RequestBody Package Package){
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        User user = userService.findUserByUserName(auth.getName());
//        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Package");
//            if(user != null && priv.get("update")){
//            Package cus = dao.getOne(Package.getId());
//            if(cus != null){
//                try {
//                    dao.save(Package);
//                    return "0";
//                }catch (Exception ex){
//                    return "Error : " +ex.getMessage();
//
//                }
//            }else{
//                return "Error : Package doesn't Exist";
//
//            }
//
//        }else
//            return "Error : You have no permission";
//    }
//
//    //Delete service mapping for delete data from Database(not delete,status change into delete
//    @DeleteMapping
//    public  String delete(@Validated @RequestBody Package Package){
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        User user = userService.findUserByUserName(auth.getName());
//        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Package");
//            if(user != null && priv.get("delete")){
//            Package cus = dao.getOne(Package.getId());
//            if(cus != null){
//                try {
//                    cus.setPkgstatusId(daoStatus.getOne(3));
//                    dao.save(cus);
//                    return "0";
//                }catch (Exception ex){
//                    return "Error : " +ex.getMessage();
//
//                }
//            }else{
//                return "Error : Package doesn't Exist";
//
//            }
//
//        }else
//            return "Error : You have no permission";
//    }
}
