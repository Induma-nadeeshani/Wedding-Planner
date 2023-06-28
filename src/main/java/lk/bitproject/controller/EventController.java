package lk.bitproject.controller;

import lk.bitproject.model.Event;
import lk.bitproject.model.ServiceProvider;
import lk.bitproject.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/event")
public class EventController {

    @Autowired //create instance by beans
    private EventRepository dao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<Event> eventList(){
        return dao.findAll();
    }

    //event/bypackage?packageid=
    @GetMapping(value = "/bypackage", params = {"packageid"}, produces = "application/json")
    public List<Event> eventbypackage(@RequestParam("packageid") int packageid) {
        return dao.bypackage(packageid);
    }

    //event/reservedevents?reservationid=
    @GetMapping(value = "/reservedevents", params = {"reservationid"}, produces = "application/json")
    public List<Event> reservedevents(@RequestParam("reservationid") int reservationid) {
        return dao.reservedevents(reservationid);
    }


}
