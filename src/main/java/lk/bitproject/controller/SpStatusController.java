package lk.bitproject.controller;

import lk.bitproject.model.SpStatus;
import lk.bitproject.repository.SpStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/spstatus")
public class SpStatusController {

    @Autowired //create instance by beans
    private SpStatusRepository dao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<SpStatus> spstatusList(){
        return dao.findAll();
    }
}
