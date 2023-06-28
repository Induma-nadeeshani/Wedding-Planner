package lk.bitproject.controller;

import lk.bitproject.model.PackageStatus;
import lk.bitproject.repository.PackageStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/packagestatus")
public class PackageStatusController {

    @Autowired //create instance by beans
    private PackageStatusRepository dao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<PackageStatus> packageStatusList(){
        return dao.findAll();
    }
}
