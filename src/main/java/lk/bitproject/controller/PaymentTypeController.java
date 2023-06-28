package lk.bitproject.controller;

import lk.bitproject.model.PaymentType;
import lk.bitproject.repository.PaymentTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/paymenttype")
public class PaymentTypeController {

    @Autowired //create instance by beans
    private PaymentTypeRepository dao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<PaymentType> paymenttypeList(){
        return dao.findAll();
    }
}
