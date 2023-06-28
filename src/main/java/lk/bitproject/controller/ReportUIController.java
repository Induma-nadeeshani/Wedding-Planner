package lk.bitproject.controller;

import lk.bitproject.model.User;
import lk.bitproject.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class ReportUIController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/samplereport", method = RequestMethod.GET)
    public ModelAndView samplereport(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("ui/samplereport.html");
        return modelAndView;
    }


    //Report for reservations
    @RequestMapping(value = "/reservationreport", method = RequestMethod.GET)
    public ModelAndView reservationreport(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("ui/reservationreport.html");
        return modelAndView;
    }

    //Supervisor count
    @RequestMapping(value = "/suppervisorallocationcountreport", method = RequestMethod.GET)
    public ModelAndView suppervisorallocationcountreport(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("ui/suppervisorallocationcountreport.html");
        return modelAndView;
    }

    @RequestMapping(value = "/paymentmonthlyreport", method = RequestMethod.GET)
    public ModelAndView paymentmonthlyreport(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("ui/paymentmonthlyreport.html");
        return modelAndView;
    }




    @RequestMapping(value = "/paymentreport", method = RequestMethod.GET)
    public ModelAndView paymentreport(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("ui/paymentreport.html");
        return modelAndView;
    }
    @RequestMapping(value = "/incomingoutgoing", method = RequestMethod.GET)
    public ModelAndView sppaymentreport(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("ui/incomingoutgoing.html");
        return modelAndView;
    }

//    @RequestMapping(value = "/getfullResList", method = RequestMethod.GET)
//    public ModelAndView getfullResList(){
//        ModelAndView modelAndView = new ModelAndView();
//        modelAndView.setViewName("ui/paymentmonthlyreport.html");
//        return modelAndView;
//    }


 @RequestMapping(value = "/getspPaymentList", method = RequestMethod.GET)
    public ModelAndView getspPaymentList(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("ui/getspPaymentList.html");
        return modelAndView;
    }


}
