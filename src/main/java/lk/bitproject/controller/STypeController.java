package lk.bitproject.controller;

import lk.bitproject.model.SType;
import lk.bitproject.repository.STypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/stype")
public class STypeController {

    @Autowired //create instance by beans
    private STypeRepository dao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<SType> stypeList(){
        return dao.findAll();
    }

}
