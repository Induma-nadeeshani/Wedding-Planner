package lk.bitproject.repository;

import lk.bitproject.model.AdditionalFeatures;
import lk.bitproject.model.ProviderPackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AdditionalFeaturesRepository extends JpaRepository<AdditionalFeatures, Integer> {

    //Query for get additionalfeatures by given service id and provider id
    @Query(value = "SELECT pp from AdditionalFeatures pp where pp.provideId.serviceId.id=:serviceid and pp.provideId.serviceproviderId.id=:providerid")
    List<AdditionalFeatures> byprovider(@Param("serviceid") Integer serviceid,@Param("providerid") Integer providerid);


}
