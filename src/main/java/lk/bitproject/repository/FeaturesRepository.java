package lk.bitproject.repository;

import lk.bitproject.model.Features;
import lk.bitproject.model.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FeaturesRepository extends JpaRepository<Features, Integer> {

//    //Query for get Features
//    @Query(value = "SELECT new Features (f.id,f.name) FROM Features f where f in(select pp.serviceproviderId from Provide pp where pp.serviceId.id=1)")
//    List<ServiceProvider> providersListByPhoto();


}
