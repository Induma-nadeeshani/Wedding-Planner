package lk.bitproject.controller;

import lk.bitproject.model.EventActivity;
import lk.bitproject.repository.EventActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/eventactivity")
public class EventActivityController {

    @Autowired //create instance by beans
    private EventActivityRepository dao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<EventActivity> eventActivityList(){
        return dao.findAll();
    }
}
