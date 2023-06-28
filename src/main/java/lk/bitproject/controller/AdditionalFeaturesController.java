package lk.bitproject.controller;

import lk.bitproject.model.AdditionalFeatures;
import lk.bitproject.model.ProviderPackage;
import lk.bitproject.repository.AdditionalFeaturesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/additionalfeatures")
public class AdditionalFeaturesController {

    @Autowired //create instance by beans
    private AdditionalFeaturesRepository dao;

    @GetMapping(value = "/list" , produces = "application/json")
    public List<AdditionalFeatures> additionalFeaturesList(){
        return dao.findAll();
    }

    //additionalfeatures/byprovider?providerid=+&serviceid=
    @GetMapping(value = "/byprovider", params = {"serviceid","providerid"}, produces = "application/json")
    public List<AdditionalFeatures> featuresbyserviceandprovider(@RequestParam("serviceid") int serviceid,@RequestParam("providerid") int providerid) {
        return dao.byprovider(serviceid,providerid);
    }

}
