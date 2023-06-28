package lk.bitproject.controller;

import lk.bitproject.model.PaymentMethod;
import lk.bitproject.repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/paymentmethod")
public class PaymentMethodController {

    @Autowired //create instance by beans
    private PaymentMethodRepository dao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<PaymentMethod> paymentmethodList(){
        return dao.findAll();
    }
}
