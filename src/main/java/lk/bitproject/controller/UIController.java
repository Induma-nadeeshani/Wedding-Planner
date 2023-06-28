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
public class UIController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public ModelAndView test(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("ui/test.html");
        return modelAndView;
    }
    @RequestMapping(value = "/access-denied", method = RequestMethod.GET)
    public ModelAndView error(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("error.html");
        return modelAndView;
    }

    @RequestMapping(value = "/config", method = RequestMethod.GET)
    public ModelAndView config(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("config.html");
        return modelAndView;
    }


    @GetMapping(value = "/employee")
    public ModelAndView employeeui() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            System.out.println("123654");
            modelAndView.setViewName("employee.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(value = "/privilage")
    public ModelAndView privilageui() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            System.out.println("123654");
            modelAndView.setViewName("privilage.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }



    @RequestMapping(value = "/mainwidow", method = RequestMethod.GET)
    public ModelAndView mainWindow() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("mainwidowtest.html");
        return modelAndView;
    }

    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public ModelAndView user() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("user.html");
        return modelAndView;
    }

    @RequestMapping(value = "/cinvoice", method = RequestMethod.GET)
    public ModelAndView cinvoice() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("cinvoice.html");
        return modelAndView;
    }

    @RequestMapping(value = "/reportemployee", method = RequestMethod.GET)
    public ModelAndView reportemployee() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("ui/reportemployee.html");
        return modelAndView;
    }

    @RequestMapping(value = "/customer", method = RequestMethod.GET)
    public ModelAndView customerUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("customer.html");
        return modelAndView;
    }

    @RequestMapping(value = "/vehicle", method = RequestMethod.GET)
    public ModelAndView vehicleUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("vehicle.html");
        return modelAndView;
    }

    @RequestMapping(value = "/driver", method = RequestMethod.GET)
    public ModelAndView driverUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("driver.html");
        return modelAndView;
    }

    @RequestMapping(value = "/service", method = RequestMethod.GET)
    public ModelAndView serviceUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("service.html");
        return modelAndView;
    }

    @RequestMapping(value = "/serviceprovider", method = RequestMethod.GET)
    public ModelAndView serviceproviderUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("serviceprovider.html");
        return modelAndView;
    }

    @RequestMapping(value = "/providerpackage", method = RequestMethod.GET)
    public ModelAndView providerpackageUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("providerpackage.html");
        return modelAndView;
    }

    @RequestMapping(value = "/reservation", method = RequestMethod.GET)
    public ModelAndView reservationUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("reservation.html");
        return modelAndView;
    }

    @RequestMapping(value = "/package", method = RequestMethod.GET)
    public ModelAndView packageUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("package.html");
        return modelAndView;
    }

    @RequestMapping(value = "/sppayment", method = RequestMethod.GET)
    public ModelAndView sppaymentUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("sppayment.html");
        return modelAndView;
    }

    @RequestMapping(value = "/cuspayment", method = RequestMethod.GET)
    public ModelAndView cuspaymentUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("cuspayment.html");
        return modelAndView;
    }

    @RequestMapping(value = "/vehicleallocation", method = RequestMethod.GET)
    public ModelAndView vehicleallocationUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("vehicleallocation.html");
        return modelAndView;
    }

    @RequestMapping(value = "/supervisorallocation", method = RequestMethod.GET)
    public ModelAndView supervisorallocationUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("supervisorallocation.html");
        return modelAndView;
    }
    @RequestMapping(value = "/schedule", method = RequestMethod.GET)
    public ModelAndView scheduleUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("schedule.html");
        return modelAndView;
    }


    //Website link
    @RequestMapping(value = {"/index"}, method = RequestMethod.GET)
    public ModelAndView indexUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("website/index.html");
        return modelAndView;
    }
    @RequestMapping(value = { "/photographer"}, method = RequestMethod.GET)
    public ModelAndView photographerUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("website/photographer.html");
        return modelAndView;
    }

    @RequestMapping(value = { "/fullpkg"}, method = RequestMethod.GET)
    public ModelAndView fullpkgUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("website/fullpkg.html");
        return modelAndView;
    }

    @RequestMapping(value = { "/rentacar"}, method = RequestMethod.GET)
    public ModelAndView rentacarUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("website/rentacar.html");
        return modelAndView;
    }

    @RequestMapping(value = { "/decos"}, method = RequestMethod.GET)
    public ModelAndView decosUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("website/decos.html");
        return modelAndView;
    }

    @RequestMapping(value = { "/modification"}, method = RequestMethod.GET)
    public ModelAndView modificationUI() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("abc.html");
        return modelAndView;
    }


}
