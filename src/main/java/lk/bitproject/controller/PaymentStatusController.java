package lk.bitproject.controller;

import lk.bitproject.model.PaymentStatus;
import lk.bitproject.repository.PaymentStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/paymentstatus")
public class PaymentStatusController {

    @Autowired //create instance by beans
    private PaymentStatusRepository dao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<PaymentStatus> paymentstatusList(){
        return dao.findAll();
    }
}
