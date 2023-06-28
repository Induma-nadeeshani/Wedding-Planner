package lk.bitproject.controller;

import lk.bitproject.model.EventReservation;
import lk.bitproject.model.ProviderPackage;
import lk.bitproject.repository.EventReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/eventreservation")
public class EventReservationController {

    @Autowired //create instance by beans
    private EventReservationRepository dao;

    ///eventreservation/reservedeventsbypkg?&reservationid=+&packageid=
    @GetMapping(value = "/reservedeventsbypkg", params = {"reservationid","eventid"}, produces = "application/json")
    public EventReservation reservedeventsbypkg(@RequestParam("reservationid") int reservationid, @RequestParam("eventid") int eventid) {
        return dao.reservedeventsbypkg(reservationid,eventid);
    }

    ///eventreservation/reservedeventsbypkg?&reservationid=+&packageid=
    @GetMapping(value = "/listbyfivedaynear",  produces = "application/json")
    public List listbyfivedaynear(){
        return dao.listbyfivedaynear();
    }


}
