package lk.bitproject.controller;

import lk.bitproject.model.CusPayment;
import lk.bitproject.model.SpPayment;
import lk.bitproject.model.User;
import lk.bitproject.repository.PaymentStatusRepository;
import lk.bitproject.repository.SpPaymentRepository;
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
@RequestMapping(value = "/sppayment")
public class SpPaymentController {

    @Autowired
    private SpPaymentRepository dao;

    private AuthController authority;

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentStatusRepository daoStatus;

    //get service mapping for get payment with next payment number
    @GetMapping(value = "/nextnumber", produces = "application/json")
    public  SpPayment nextNumber(){
        String nextnumber = dao.getNextNumber();
        SpPayment pay = new SpPayment(nextnumber);
        return pay;
    }

    @GetMapping(value = "/list",produces = "application/json")
    public List<SpPayment> paymentList(){return dao.getSpPayments();}

    //cuspayment/lastpaymentbyspreservation?serviceproviderid=
    @GetMapping(value = "/lastpaymentbyspreservation",params = {"serviceproviderid"},produces = "application/json")
    public SpPayment listbyspreservation(@RequestParam("serviceproviderid")int serviceproviderid){
        List<SpPayment> sppayments =  dao.listbyspreservation(serviceproviderid);
        if(sppayments.size() != 0)
            return  sppayments.get(0);
        else return null;
    }

    //get service for get data from Database(/payment/findAll?page=0&size=3
    @GetMapping(value = "/findAll" , params = {"page" , "size"},produces = "application/json")
    public Page<SpPayment> findAll(@RequestParam("page") int page, @RequestParam("size") int size){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"SpPayment");
        if(user != null && priv.get("select"))
            return dao.findAll(PageRequest.of(page, size,Sort.Direction.DESC,"id"));
        else
            return null;
    }

    //get service for get data from Database with search(/payment/findAll?page=0&size=3&searchtext=)
    @GetMapping(value = "/findAll" , params = {"page" , "size" , "searchtext"},produces = "application/json")
    public Page<SpPayment> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"SpPayment");
        if(user != null && priv.get("select"))
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC,"id"));
        else
            return null;
    }

    //post service mapping for insert data into Database
    @PostMapping
    public  String add(@Validated @RequestBody SpPayment payment){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"SpPayment");
        if(user != null && priv.get("add")){
            SpPayment payreg = dao.getByNumber(payment.getSpbillno());
            if (payreg != null)
                return "Error : SpPayment already Registered(Reg Number Exists)";

            try {
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
    public  String update(@Validated @RequestBody SpPayment payment){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"SpPayment");
        if(user != null && priv.get("update")){
            SpPayment pay = dao.getOne(payment.getId());
            if(pay != null){
                try {
                    dao.save(payment);
                    return "0";
                }catch (Exception ex){
                    return "Error : " +ex.getMessage();

                }
            }else{
                return "Error : SpPayment doesn't Exist";

            }

        }else
            return "Error : You have no permission";
    }

    //Delete service mapping for delete data from Database(not delete,status change into delete
    @DeleteMapping
    public  String delete(@Validated @RequestBody SpPayment payment){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        HashMap<String,Boolean> priv = authority.getPrivilages(user,"SpPayment");
        if(user != null && priv.get("delete")){
            SpPayment pay = dao.getOne(payment.getId());
            if(pay != null){
                try {
                    pay.setPaymentstatusId(daoStatus.getOne(3));
                    dao.save(pay);
                    return "0";
                }catch (Exception ex){
                    return "Error : " +ex.getMessage();

                }
            }else{
                return "Error : Payment doesn't Exist";

            }

        }else
            return "Error : You have no permission";
    }
}
