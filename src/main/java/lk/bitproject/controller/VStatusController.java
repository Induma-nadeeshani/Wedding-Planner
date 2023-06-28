package lk.bitproject.controller;

import lk.bitproject.model.VStatus;
import lk.bitproject.repository.VStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/vstatus")
public class VStatusController {

    @Autowired //create instance by beans
    private VStatusRepository dao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<VStatus> vstatusList(){
        return dao.findAll();
    }
}
