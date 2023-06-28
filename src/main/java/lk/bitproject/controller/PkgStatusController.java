package lk.bitproject.controller;

import lk.bitproject.model.PkgStatus;
import lk.bitproject.repository.PkgStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/pkgstatus")
public class PkgStatusController {

    @Autowired //create instance by beans
    private PkgStatusRepository dao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<PkgStatus> pkgstatusList(){
        return dao.findAll();
    }
}
