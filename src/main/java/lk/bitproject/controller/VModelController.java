package lk.bitproject.controller;

import lk.bitproject.model.VModel;
import lk.bitproject.repository.VModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/vmodel")
public class VModelController {

    @Autowired //create instance by beans
    private VModelRepository dao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<VModel> vmodelList(){
        return dao.findAll();
    }
}
