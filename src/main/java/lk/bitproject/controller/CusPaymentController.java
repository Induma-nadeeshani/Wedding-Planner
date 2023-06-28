package lk.bitproject.controller;

import lk.bitproject.model.*;
import lk.bitproject.repository.CusPaymentRepository;
import lk.bitproject.repository.PaymentStatusRepository;
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
@RequestMapping(value = "/cuspayment")
public class CusPaymentController {

    private AuthController authority;

    @Autowired
    private CusPaymentRepository dao;

    @Autowired
    private ReservationRepository daoreservation;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ResStatusRepository daoreservationstatus;

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentStatusRepository daoStatus;

    //get service mapping for get payment with next payment number
    @GetMapping(value = "/nextnumber", produces = "application/json")
    public  CusPayment nextNumber(){
        String nextnumber = dao.getNextNumber();
        CusPayment cuspay = new CusPayment(nextnumber);
        return cuspay;
    }

    @GetMapping(value = "/list",produces = "application/json")
    public List<CusPayment> paymentList(){return dao.getCusPayments();}


    @GetMapping(value = "/listbycustomerreservation",params = {"customerid","reservationid"},produces = "application/json")
    public CusPayment listbycustomerreservation(@RequestParam("customerid") int customerid, @RequestParam("reservationid")int reservationid){
        return dao.getPaymentByCustomerReservation(customerid,reservationid);
    }

    ///cuspayment/lastpaymentbyreservation?reservationid=
    @GetMapping(value = "/lastpaymentbyreservation",params = {"reservationid"},produces = "application/json")
    public CusPayment listbycustomerreservation(@RequestParam("reservationid")int reservationid){
        List<CusPayment> cuspayments =  dao.listbycustomerreservation(reservationid);
        if(cuspayments.size() != 0)
            return  cuspayments.get(0);
        else return null;
    }

    //get service for get data from Database(/payment/findAll?page=0&size=3
    @GetMapping(value = "/findAll" , params = {"page" , "size"},produces = "application/json")
    public Page<CusPayment> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"CustomerPayment");
        if(user != null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size,Sort.Direction.DESC,"id"));
        else
            return null;
    }

    //get service for get data from Database with search(/payment/findAll?page=0&size=3&searchtext=)
    @GetMapping(value = "/findAll" , params = {"page" , "size" , "searchtext"},produces = "application/json")
    public Page<CusPayment> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"CustomerPayment");
        if(user != null && priv.get("select"))
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        else
            return null;
    }

    //post service mapping for insert data into Database
    @Transactional
    @PostMapping
    public  String add(@Validated @RequestBody CusPayment payment){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"CustomerPayment");
        if(user != null && priv.get("add")){
            CusPayment payreg = dao.getByNumber(payment.getBillno());
            if (payreg != null)
                return "Error : CusPayment already Registered(Reg Number Exists)";

            try {
                //check payment type advance or balance
                Reservation reservation = daoreservation.getOne(payment.getReservationId().getId());
                for (EventReservation eventreservation: reservation.getEventReservationList()){
                    eventreservation.setReservationId(reservation);
                    for(EventActivity eventActivity :eventreservation.getEventActivityList()){
                        eventActivity.setEventreservationId(eventreservation);
                    }
                }
                for (ServiceReservation servicereservation: reservation.getServiceReservationList()){
                    servicereservation.setReservationId(reservation);
                    for(AdditionalFeaturesDetails additionalFeaturesDetails :servicereservation.getAdditionalFeaturesDetailsList()){
                        additionalFeaturesDetails.setServicereservationId(servicereservation);
                    }
                }

                if(payment.getPaymenttypeId().getName().equals("Advance-Payment")){
                    reservation.setResstatusId(daoreservationstatus.getOne(2));
                }else if(payment.getPaymenttypeId().getName().equals("Balance-Payment")){
                    CusPayment cpay = dao.getPaymentByCustomerReservation(payment.getCustomerId().getId(),payment.getReservationId().getId());
                    if(cpay.getTotalamt().add(payment.getTotalamt()).equals(reservation.getTotalpayable())){
                        reservation.setResstatusId(daoreservationstatus.getOne(6));
                    }else{
                        reservation.setResstatusId(daoreservationstatus.getOne(7));
                    }
                }
                //advance --> reservation status change into conferim
                //balance --> reservation status change into Completed -->
                daoreservation.save(reservation);

                emailService.sendMail(payment.getCustomerId().getCemail(),
                        "Your Payment is Added Successfully.\n",
                        "Payment Code :"+payment.getBillno()+
                                "\n Total Amount :"+payment.getTotalamt()+"\n\n"+
                                "\n Paid Amount :"+payment.getPaidamt()+"\n\n"+
                                "\n Balance :"+payment.getBalance() +"\n\n\n\n"+
                                "\n - Golden Crown Wedding Planners -")  ;
                dao.save(payment);
                  return "0";
            }catch (Exception ex){
                  return "Error : " +ex.getMessage();

                }

        }else
            return "Error : You have no permission";
    }

    //put service mapping for update data into Database
    @PutMapping
    public  String update(@Validated @RequestBody CusPayment payment){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"CustomerPayment");
        if(user != null && priv.get("update")){
            CusPayment cuspay = dao.getOne(payment.getId());
            if(cuspay != null){
                try {
                    dao.save(payment);
                    return "0";
                }catch (Exception ex){
                    return "Error : " +ex.getMessage();

                }
            }else{
                return "Error : CusPayment doesn't Exist";

            }

        }else
            return "Error : You have no permission";
    }

    //Delete service mapping for delete data from Database(not delete,status change into delete
    @DeleteMapping
    public  String delete(@Validated @RequestBody CusPayment payment){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null) {
            CusPayment cuspay = dao.getOne(payment.getId());
            HashMap<String,Boolean> priv = authority.getPrivilages(user,"CustomerPayment");
            if(user != null && priv.get("delete")){
                try {
                    cuspay.setPaymentstatusId(daoStatus.getOne(3));
                    dao.save(cuspay);
                    return "0";
                }catch (Exception ex){
                    return "Error : " +ex.getMessage();

                }
            }else{
                return "Error : CusPayment doesn't Exist";

            }

        }else
            return "Error : You have no permission";
    }
}
