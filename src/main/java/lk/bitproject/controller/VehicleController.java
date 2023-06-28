package lk.bitproject.controller;

import lk.bitproject.model.Event;
import lk.bitproject.model.User;
import lk.bitproject.model.Vehicle;
import lk.bitproject.repository.VStatusRepository;
import lk.bitproject.repository.VehicleRepository;
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
import java.util.List;

@RestController
@RequestMapping(value = "/vehicle")
public class VehicleController {

    @Autowired
    private VehicleRepository dao;

    @Autowired
    private UserService userService;

    @Autowired
    private VStatusRepository daoStatus;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<Vehicle> vehicleList(){
        return dao.findAll();
    }

//    @GetMapping(value = "/bycategory", params = {"categoryid"}, produces = "application/json")
//    public List<Vehicle> bycategory(@RequestParam("categoryid") int categoryid) {
//        return dao.bycategory(categoryid);
//    }

//    @GetMapping(value = "/listbyavailable", params = {"date", "stime", "etime","vtype"}, produces = "application/json")
//    public List<Vehicle> listbyavailable(@RequestParam("date") String date, @RequestParam("stime") String stime, @RequestParam("etime") String etime, @RequestParam("vtype") String vtype) {
//        return dao.listbyavailable(LocalDate.parse(date), stime, etime,vtype);
//    }


    @GetMapping(value = "/listbyavailable", params = {"eventdate","vtype"}, produces = "application/json")
    public List<Vehicle> listbyavailable(@RequestParam("eventdate") String eventdate, @RequestParam("vtype") String vtype) {
        return dao.listbyavailable(LocalDate.parse(eventdate),vtype);
    }

    //get service for get data from Database(/vehicle/findAll?page=0&size=3)
    @GetMapping(value = "/findAll" , params = {"page" , "size"},produces = "application/json")
    public Page<Vehicle> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null)
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        else
            return null;
    }

    //get service for get data from Database with search(/vehicle/findAll?page=0&size=3&searchtext=)
    @GetMapping(value = "/findAll" , params = {"page" , "size" , "searchtext"},produces = "application/json")
    public Page<Vehicle> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null)
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        else
            return null;
    }

    //post service mapping for insert data into Database
    @PostMapping
    public  String add(@Validated @RequestBody Vehicle vehicle){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null) {
            Vehicle vehreg = dao.getByNumber(vehicle.getVnumber());

            if (vehreg != null)
                return "Error : Vehicle already Registered(Reg Number Exists)";
            try {
                dao.save(vehicle);
                return "0";
            }catch (Exception ex){
                return "Error : " +ex.getMessage();

            }

        }else
            return "Error : You have no permission";
    }

    //put service mapping for update data into Database
    @PutMapping
    public  String update(@Validated @RequestBody Vehicle vehicle){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null) {
            Vehicle veh = dao.getOne(vehicle.getId());
            if(veh != null){
                try {
                    dao.save(vehicle);
                    return "0";
                }catch (Exception ex){
                    return "Error : " +ex.getMessage();

                }
            }else{
                return "Error : Vehicle doesn't Exist";

            }

        }else
            return "Error : You have no permission";
    }

    //Delete service mapping for delete data from Database(not delete,status change into deleted)
    @DeleteMapping
    public  String delete(@Validated @RequestBody Vehicle vehicle){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null) {
            Vehicle veh = dao.getOne(vehicle.getId());
            if(veh != null){
                try {
                    veh.setVstatusId(daoStatus.getOne(3));
                    dao.save(veh);
                    return "0";
                }catch (Exception ex){
                    return "Error : " +ex.getMessage();

                }
            }else{
                return "Error : Vehicle doesn't Exist";

            }

        }else
            return "Error : You have no permission";
    }


}
