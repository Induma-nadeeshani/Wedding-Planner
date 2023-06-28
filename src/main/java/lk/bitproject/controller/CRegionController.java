package lk.bitproject.controller;

import lk.bitproject.model.CRegion;
import lk.bitproject.repository.CRegionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/cregion")
public class CRegionController {

    @Autowired //create instance by beans
    private CRegionRepository dao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<CRegion> cregionList(){
        return dao.findAll();
    }
}
