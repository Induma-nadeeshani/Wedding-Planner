package lk.bitproject.controller;

import lk.bitproject.model.Features;
import lk.bitproject.repository.FeaturesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/features")
public class FeaturesController {

    @Autowired //create instance by beans
    private FeaturesRepository dao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<Features> featuresList(){
        return dao.findAll();
    }

}
