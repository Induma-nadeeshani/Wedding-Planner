package lk.bitproject.controller;

import lk.bitproject.model.*;
import lk.bitproject.repository.CStatusRepository;
import lk.bitproject.repository.VehicleAllocationRepository;
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
@RequestMapping(value = "/vehicleallocation")
public class VehicleAllocationController {

    @Autowired
    private VehicleAllocationRepository dao;

    private AuthController authority;

    @Autowired
    private UserService userService;

    //get service for get data from Database(/vehicleallocation/findAll?page=0&size=3
    @GetMapping(value = "/findAll" , params = {"page" , "size"},produces = "application/json")
    public Page<VehicleAllocation> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"VehicleAllocation");
        if(user != null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size,Sort.Direction.DESC,"id"));
        else
            return null;
    }

    //get service for get data from Database with search(/vehicleallocation/findAll?page=0&size=3&searchtext=)
    @GetMapping(value = "/findAll" , params = {"page" , "size" , "searchtext"},produces = "application/json")
    public Page<VehicleAllocation> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"VehicleAllocation");
        if(user != null && priv.get("select"))
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        else
            return null;
    }

    //post service mapping for insert data into Database
    @PostMapping
    public  String add(@Validated @RequestBody VehicleAllocation vehicleallocation){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"VehicleAllocation");
            if(user != null && priv.get("add")){
            VehicleAllocation vareg = dao.getByResEvent(vehicleallocation.getReservationId().getId(), vehicleallocation.getEventId().getId());

            if (vareg != null)
                return "Error : Allocation already Exists";
            try {
                dao.save(vehicleallocation);
                  return "0";
            }catch (Exception ex){
                  return "Error : " +ex.getMessage();

                }

        }else
            return "Error : You have no permission";

    }

    //put service mapping for update data into Database
    @PutMapping
    public  String update(@Validated @RequestBody VehicleAllocation vehicleallocation){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"VehicleAllocation");
        if(user != null && priv.get("update")){
            VehicleAllocation va = dao.getOne(vehicleallocation.getId());
            if(va != null){
                try {
                    dao.save(vehicleallocation);
                    return "0";
                }catch (Exception ex){
                    return "Error : " +ex.getMessage();

                }
            }else{
                return "Error : Allocation doesn't Exist";

            }

        }else
            return "Error : You have no permission";
    }

    //Delete service mapping for delete data from Database(not delete,status change into delete
    @DeleteMapping
    public  String delete(@Validated @RequestBody VehicleAllocation vehicleallocation){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"VehicleAllocation");
            if(user != null && priv.get("delete")){
            VehicleAllocation va = dao.getOne(vehicleallocation.getId());
            if(va != null){
                try {
                    dao.delete(va);
                    return "0";
                }catch (Exception ex){
                    return "Error : " +ex.getMessage();

                }
            }else{
                return "Error : Allocation doesn't Exist";

            }

        }else
            return "Error : You have no permission";
    }
}
