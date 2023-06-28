package lk.bitproject.repository;

import lk.bitproject.model.ProviderPackage;
import lk.bitproject.model.ServiceProvider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProviderPackageRepository extends JpaRepository<ProviderPackage, Integer> {

    //Query for get providerpackage by given providerpackage number
    @Query(value = "SELECT pp from ProviderPackage pp where pp.code=:code")
    ProviderPackage getByNumber(@Param("code") String code);

    //Query for get providerpackage by given provider id
    @Query(value = "SELECT pp from ProviderPackage pp where pp.serviceproviderId.id=:providerid and pp.packagestatusId.id=1")
    List<ProviderPackage> listByProvider(@Param("providerid") Integer providerid);

    //Query for get Vehicle Package
    @Query(value = "SELECT new ProviderPackage(pp.id,pp.name) FROM ProviderPackage pp where pp.serviceId.id = 4")
    List<ProviderPackage> packageListByVehicles();


    //Query for get all data with search value
    @Query(value = "SELECT pp from ProviderPackage pp where " +
            "pp.code like concat('%',:searchtext,'%') or " +
            "pp.serviceId.servicename like concat('%',:searchtext,'%') or " +
            "pp.serviceproviderId.name like concat('%',:searchtext,'%') or " +
            "pp.name like concat('%',:searchtext,'%') or " +
            "pp.packagestatusId.name like concat('%',:searchtext,'%') ")
            Page<ProviderPackage>findAll(@Param("searchtext") String searchtext, Pageable of);

    //Query for get providerpackage by given provider id
    @Query(value = "SELECT pp from ProviderPackage pp where pp.serviceId.id=:serviceid and pp.serviceproviderId.id=:providerid")
    List<ProviderPackage> byserviceandprovider(@Param("serviceid") Integer serviceid,@Param("providerid") Integer providerid);

    //Query for get providerpackage by given reservationId
    @Query(value = "SELECT pp from ServiceReservation pp where pp.reservationId.id=:reservationid")
    List<ProviderPackage> packagebyreservation(@Param("reservationid") Integer reservationid);


    //Query for get vehicle package by given reservationId
    @Query(value = "SELECT pp from ProviderPackage pp where pp.serviceId.id =4 and " +
            "pp in(select p.providerpackageId from ServiceReservation p where p.reservationId.id=:reservationid)")
    List<ProviderPackage> vehbyreservation(@Param("reservationid") Integer reservationid);

}
