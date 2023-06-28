package lk.bitproject.controller;

import lk.bitproject.model.EventReservation;
import lk.bitproject.model.ServiceReservation;
import lk.bitproject.repository.ServiceReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/servicereservation")
public class ServiceReservationController {

    @Autowired //create instance by beans
    private ServiceReservationRepository dao;

        //reservation/byproviderandmnth?providerid="+JSON.parse(cmbSerProvider.value).id+"&month
    @GetMapping(value = "/byproviderandmnth", params = {"providerid","month"}, produces = "application/json")
    public List<ServiceReservation> byproviderandmnth(@RequestParam("providerid") int providerid, @RequestParam("month") String month) {
        return dao.byproviderandmnth(providerid,month);
    }



}
