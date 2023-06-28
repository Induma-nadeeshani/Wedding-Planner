package lk.bitproject.controller;

import lk.bitproject.model.Civilstatus;
import lk.bitproject.repository.CivilstatusRepository;
import lk.bitproject.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.sql.Date;
import java.util.List;

@RestController
public class ReportController {

    @Autowired
    private ReportRepository dao;

    //
    @GetMapping(value = "/reservationcountreportlist",params = {"sdate","edate"}, produces = "application/json")
    public List reservationcounts(@RequestParam("sdate")Date sdate, @RequestParam("edate")Date edate) {
        return dao.getReservationCountList(sdate, edate);
    }

    @GetMapping(value = "/suppervisorallocationreportlist",params = {"sdate","edate"}, produces = "application/json")
    public List getSuppervisorallocationcount(@RequestParam("sdate")Date sdate, @RequestParam("edate")Date edate) {
        return dao.getSuppervisorallocationcount(sdate, edate);
    }

    //cus pay
    @GetMapping(value = "/paymentmonthlyreport",params = {"sdate","edate"}, produces = "application/json")
    public List paymentmonthlyreport(@RequestParam("sdate")Date sdate, @RequestParam("edate")Date edate) {
        return dao.paymentmonthlyreport(sdate, edate);
    }




    @GetMapping(value = "/paymentcountreportlist",params = {"sdate","edate"}, produces = "application/json")
    public List paymentcounts(@RequestParam("sdate")Date sdate, @RequestParam("edate")Date edate) {
        return dao.getPaymentCountList(sdate, edate);
    }

    //sp pay
 @GetMapping(value = "/getspPaymentList",params = {"sdate","edate"}, produces = "application/json")
    public List sppayments(@RequestParam("sdate")Date sdate, @RequestParam("edate")Date edate) {
        return dao.getspPaymentList(sdate, edate);
    }



    //
    @GetMapping(value = "/getfullResList",params = {"sdate","edate"}, produces = "application/json")
    public List reservedli(@RequestParam("sdate")Date sdate, @RequestParam("edate")Date edate) {
        return dao.reservedli(sdate, edate);
    }


}
