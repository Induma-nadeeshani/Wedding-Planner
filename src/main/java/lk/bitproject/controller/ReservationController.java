package lk.bitproject.controller;

import lk.bitproject.model.*;
import lk.bitproject.repository.ResStatusRepository;
import lk.bitproject.repository.ReservationRepository;
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

import javax.transaction.Transactional;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/reservation")
public class ReservationController {

    @Autowired
    private ReservationRepository dao;

    private AuthController authority;

    @Autowired
    private UserService userService;

    @Autowired
    private ResStatusRepository daoStatus;

    @Autowired
    private EmailService emailService;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<Reservation> reservationList(){
        return dao.findAll();
    }

    //not admitted reservations
    @GetMapping(value = "/listbystatus" , produces = "application/json")
    public List<Reservation> reservation(){
        return dao.listbystatus();
    }

    //Get Reservations
    @GetMapping(value = "/reslist" , produces = "application/json")
    public List<Reservation> resList(){
        return dao.findAll();
    }

    //Get pending Reservations
    @GetMapping(value = "/pendinglist" , produces = "application/json")
    public List<Reservation> pendinglist(){
        return dao.pendinglist();
    }

    //Get Reservations for schedule
    @GetMapping(value = "/listforschedule" , produces = "application/json")
    public List<Reservation> listforschedule(){
        return dao.listforschedule();
    }

    //Get Vehicle Reservations
    @GetMapping(value = "/listbyvehres" , produces = "application/json")
    public List<Reservation> vehreservationList(){
        return dao.vehresList();
    }

    //reservation/bycustomer?customerid=
    @GetMapping(value = "/bycustomer", params = {"customerid"}, produces = "application/json")
    public List<Reservation> serviceproviderbyservice(@RequestParam("customerid") int customerid) {
        return dao.bycustomer(customerid);
    }
    //get service mapping for get serviceprovice with next serviceprovice number
    @GetMapping(value = "/nextnumber", produces = "application/json")
    public  Reservation nextNumber(){
        String nextnumber = dao.getNextNumber();
        Reservation res = new Reservation(nextnumber);
        return res;
    }

    //get service for get data from Database(/reservation/findAll?page=0&size=3
    @GetMapping(value = "/findAll" , params = {"page" , "size"},produces = "application/json")
    public Page<Reservation> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Reservation");
        if(user != null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size,Sort.Direction.DESC,"id"));
        else
            return null;
    }

    //get service for get data from Database with search(/reservation/findAll?page=0&size=3&searchtext=)
    @GetMapping(value = "/findAll" , params = {"page" , "size" , "searchtext"},produces = "application/json")
    public Page<Reservation> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Reservation");
        if(user != null && priv.get("select"))
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        else
            return null;
    }

    //post service mapping for insert data into Database
    @PostMapping
    @Transactional
    public  String add(@Validated @RequestBody Reservation reservation){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Reservation");
        if(user != null && priv.get("add")){
           Reservation resreg = dao.getByNumber(reservation.getRegno());

            if (resreg != null)
                return "Error : Reservation is already Registered(Reg Number Exists)";

                try{
                    StringBuffer message = new StringBuffer("No\t\t\tService Name \t\t\tEvent Name \t\t\t \n\n");


                         //reservation.getCustomerId().getCemail();

                    for (EventReservation eventreservation: reservation.getEventReservationList()){
                        eventreservation.setReservationId(reservation);
                        for(EventActivity eventActivity :eventreservation.getEventActivityList()){
                            eventActivity.setEventreservationId(eventreservation);
                        }
                    }

                    int i=1;
                    for (ServiceReservation servicereservation: reservation.getServiceReservationList()){
                        servicereservation.setReservationId(reservation);

                        message.append(i).append("\t\t")
                        .append(servicereservation.getServiceId().getServicename()).append("\t\t\t\t")
                                .append(servicereservation.getEventId().getName()).append("\n");
                        i++;

                        for(AdditionalFeaturesDetails additionalFeaturesDetails :servicereservation.getAdditionalFeaturesDetailsList()){
                            additionalFeaturesDetails.setServicereservationId(servicereservation);
                        }
                    }

                    emailService.sendMail(reservation.getCustomerId().getCemail(),
                            "Your Reservation is Completed Successfully.",
                            "Reservation Code :"+reservation.getRegno()+
                                    "\n Reserved Service Details :"+"\n\n"+message+"\n\n"+
                                    "\n Total payable :"+reservation.getTotalpayable()+"\n\n"+
                                    "\n Advance Amount :"+reservation.getAdvance())  ;

                    dao.save(reservation);


                    return "0";

                } catch (Exception ex) {
                    return "Error : " + ex.getMessage();

                }
        }else
            return "Error : You have no permission";
    }

    //put service mapping for update data into Database
    @PutMapping
    public  String update(@Validated @RequestBody Reservation reservation){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Reservation");
        if(user != null && priv.get("update")){
            Reservation res = dao.getOne(reservation.getId());
            if(res != null){
                try {
                    for (EventReservation eventreservation: reservation.getEventReservationList())
                        eventreservation.setReservationId(reservation);

                    for (ServiceReservation servicereservation: reservation.getServiceReservationList())
                        servicereservation.setReservationId(reservation);

                    dao.save(reservation);
                    return "0";
                }catch (Exception ex){
                    return "Error : " +ex.getMessage();

                }
            }else{
                return "Error : Reservation doesn't Exist";

            }
        }else
            return "Error : You have no permission";
    }

    //Delete service mapping for delete data from Database(not delete,status change into delete
    @DeleteMapping
    public  String delete(@Validated @RequestBody Reservation reservation){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"Reservation");
        if(user != null && priv.get("delete")){
            Reservation res = dao.getOne(reservation.getId());
            if(res != null){
                try {
                    for (EventReservation eventreservation: res.getEventReservationList())
                        eventreservation.setReservationId(res);

                    for (ServiceReservation servicereservation: res.getServiceReservationList())
                        servicereservation.setReservationId(res);

                    res.setResstatusId(daoStatus.getOne(5));
                    dao.save(res);
                    return "0";
                }catch (Exception ex){
                    return "Error : " +ex.getMessage();

                }
            }else{
                return "Error : Reservation doesn't Exist";

            }

        }else
            return "Error : You have no permission";
    }
}
