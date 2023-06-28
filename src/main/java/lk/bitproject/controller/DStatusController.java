package lk.bitproject.controller;

import lk.bitproject.model.DStatus;
import lk.bitproject.repository.DStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
    @RestController
    @RequestMapping(value = "/dstatus")
    public class DStatusController {

        @Autowired //create instance by beans
        private DStatusRepository dao;

        @GetMapping(value = "/list" , produces = "application/json")
        public List<DStatus> dstatusList(){
            return dao.findAll();
        }
    }

