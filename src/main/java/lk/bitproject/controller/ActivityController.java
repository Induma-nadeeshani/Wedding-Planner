package lk.bitproject.controller;

import lk.bitproject.model.Activity;
import lk.bitproject.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/activity")
public class ActivityController {

    @Autowired //create instance by beans
    private ActivityRepository dao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<Activity> activityList(){
        return dao.findAll();
    }

//    //event/bypackage?packageid=
//    @GetMapping(value = "/bypackage", params = {"packageid"}, produces = "application/json")
//    public List<Event> eventbypackage(@RequestParam("packageid") int packageid) {
//        return dao.bypackage(packageid);
//    }
//
//    //event/reservedevents?reservationid=
//    @GetMapping(value = "/reservedevents", params = {"reservationid"}, produces = "application/json")
//    public List<Event> reservedevents(@RequestParam("reservationid") int reservationid) {
//        return dao.reservedevents(reservationid);
//    }


}
