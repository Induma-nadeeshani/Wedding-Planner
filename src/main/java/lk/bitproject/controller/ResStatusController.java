package lk.bitproject.controller;

import lk.bitproject.model.ResStatus;
import lk.bitproject.repository.ResStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/resstatus")
public class ResStatusController {

    @Autowired //create instance by beans
    private ResStatusRepository dao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<ResStatus> resStatusList(){
        return dao.findAll();
    }
}
