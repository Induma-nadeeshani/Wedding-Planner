package lk.bitproject.controller;

import lk.bitproject.model.Employee;
import lk.bitproject.model.Reservation;
import lk.bitproject.model.User;
import lk.bitproject.model.SupervisorAllocation;
import lk.bitproject.repository.ResStatusRepository;
import lk.bitproject.repository.ReservationRepository;
import lk.bitproject.service.EmailService;
import lk.bitproject.repository.SupervisorAllocationRepository;
import lk.bitproject.service.EmailService;
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
@RequestMapping(value = "/supervisorallocation")
public class SupervisorAllocationController {

    @Autowired
    private SupervisorAllocationRepository dao;

    private AuthController authority;

    @Autowired
    private ResStatusRepository daoreservationstatus;

    @Autowired
    private ReservationRepository daoreservation;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;

    @GetMapping(value = "/getbyreservation", params = {"resid"}, produces = "application/json")
    public SupervisorAllocation getbyreservation(@RequestParam("resid") int resid) {
        return dao.getbyreservation(resid); }


    //get service for get data from Database(/supervisorallocation/findAll?page=0&size=3
    @GetMapping(value = "/findAll" , params = {"page" , "size"},produces = "application/json")
    public Page<SupervisorAllocation> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"SupervisorAllocation");
        if(user != null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size,Sort.Direction.DESC,"id"));
        else
            return null;
    }

    //get service for get data from Database with search(/supervisorallocation/findAll?page=0&size=3&searchtext=)
    @GetMapping(value = "/findAll" , params = {"page" , "size" , "searchtext"},produces = "application/json")
    public Page<SupervisorAllocation> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"SupervisorAllocation");
        if(user != null && priv.get("select"))
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        else
            return null;
    }

    //post service mapping for insert data into Database
    @PostMapping
    public  String add(@Validated @RequestBody SupervisorAllocation supervisorallocation){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"SupervisorAllocation");

            if(user != null && priv.get("add")){
            SupervisorAllocation vareg = dao.getByResEvent(supervisorallocation.getReservationId().getId(), supervisorallocation.getEventId().getId());

                Reservation reservation = daoreservation.getOne(supervisorallocation.getReservationId().getId());

            if (vareg != null)
                return "Error : Allocation already Exists";
            try {

                reservation.setResstatusId(daoreservationstatus.getOne(8));

                daoreservation.save(reservation);

               // System.out.println("Email:" + supervisorallocation.getSupervisorId().getEmail());

                emailService.sendMail(supervisorallocation.getSupervisorId().getEmail(),
                        "You are allocated to a new Reservation!!! \n ",
                        "Reservation Code :"+supervisorallocation.getReservationId().getRegno()+
                                "\n Events :"+supervisorallocation.getEventId().getName()+"\n\n"+
                                "\n Event Date :"+supervisorallocation.getEventdate() +
                                "\n\n\n Log into the system to view more details" ) ;

                dao.save(supervisorallocation);

                  return "0";
            }catch (Exception ex){
                  return "Error : " +ex.getMessage();

                }

        }else
            return "Error : You have no permission";
        }


    //put service mapping for update data into Database
    @PutMapping
    public  String update(@Validated @RequestBody SupervisorAllocation supervisorallocation){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"SupervisorAllocation");
        if(user != null && priv.get("update")){
            SupervisorAllocation va = dao.getOne(supervisorallocation.getId());
            if(va != null){
                try {
                    dao.save(supervisorallocation);
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
    public  String delete(@Validated @RequestBody SupervisorAllocation supervisorallocation){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"SupervisorAllocation");
            if(user != null && priv.get("delete")){
            SupervisorAllocation va = dao.getOne(supervisorallocation.getId());
            if(va != null){
                try {
                    Reservation reservation = daoreservation.getOne(supervisorallocation.getReservationId().getId());

                    //set status
                    reservation.setResstatusId(daoreservationstatus.getOne(2));
                    daoreservation.save(reservation);

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
