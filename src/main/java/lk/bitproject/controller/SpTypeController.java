package lk.bitproject.controller;

import lk.bitproject.model.SpType;
import lk.bitproject.repository.SpTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/sptype")
public class SpTypeController {

    @Autowired //create instance by beans
    private SpTypeRepository dao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<SpType> sptypeList(){
        return dao.findAll();
    }

}
