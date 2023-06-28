package lk.bitproject.controller;

import lk.bitproject.model.Brand;
import lk.bitproject.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/brand")
public class BrandController {

    @Autowired //create instance by beans
    private BrandRepository dao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<Brand> vmodelList(){
        return dao.findAll();
    }
}
