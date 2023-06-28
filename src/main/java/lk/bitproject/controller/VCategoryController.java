package lk.bitproject.controller;

import lk.bitproject.model.VCategory;
import lk.bitproject.repository.VCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/vcategory")
public class VCategoryController {

    @Autowired //create instance by beans
    private VCategoryRepository dao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<VCategory> vcategoryList(){
        return dao.findAll();
    }
}
