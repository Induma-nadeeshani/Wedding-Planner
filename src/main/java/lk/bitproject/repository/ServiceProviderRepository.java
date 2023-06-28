package lk.bitproject.repository;

import lk.bitproject.model.ServiceProvider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Integer> {

    //Query for get next number
    @Query(value = "SELECT concat('P',lpad(substring(max(p.regno),2)+1,5,'0')) FROM goldencrown.serviceprovider as p;",nativeQuery = true)
    String getNextNumber();

    //Query for get next number
    @Query(value = "SELECT new ServiceProvider(sp.id,sp.name) FROM ServiceProvider sp")
    List<ServiceProvider> providersList();

    //Query for get Photographers
    @Query(value = "SELECT new ServiceProvider(sp.id,sp.name) FROM ServiceProvider sp where sp in(select p.serviceproviderId from Provide p where p.serviceId.id=1)")
    List<ServiceProvider> providersListByPhoto();

    //Query for get Decorations
    @Query(value = "SELECT new ServiceProvider(sp.id,sp.name) FROM ServiceProvider sp where sp in(select p.serviceproviderId from Provide p where p.serviceId.id=2)")
    List<ServiceProvider> providersListByDeco();

    //Query for get Vehicles
    @Query(value = "SELECT new ServiceProvider(sp.id,sp.name) FROM ServiceProvider sp where sp in(select p.serviceproviderId from Provide p where p.serviceId.id=4)")
    List<ServiceProvider> providersListByVehi();

    //Query for get customer by given customer number
    @Query(value = "SELECT p from ServiceProvider p where p.regno=:regno")
    ServiceProvider getByNumber(@Param("regno") String regno);

    //Query for get all data with search value
    @Query(value = "SELECT p from ServiceProvider p where " +
            "p.regno like concat('%',:searchtext,'%') or " +
            "p.sptypeId.name like concat('%',:searchtext,'%') or " +
            "p.name like concat('%',:searchtext,'%') or " +
            "p.mobile like concat('%',:searchtext,'%') or " +
            "p.brno like concat('%',:searchtext,'%') or " +
            "p.spstatusId.name like concat('%',:searchtext,'%') ")
            Page<ServiceProvider>findAll(@Param("searchtext") String searchtext, Pageable of);

    //query for get service by given serviceid
    @Query(value = "SELECT new ServiceProvider(sp.id,sp.name) FROM ServiceProvider sp where sp in(select p.serviceproviderId from Provide p where p.serviceId.id=:serviceid)")
    List <ServiceProvider> byservice(@Param("serviceid") Integer serviceid);
}
