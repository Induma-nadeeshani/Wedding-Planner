package lk.bitproject.repository;


import lk.bitproject.model.Customer;
import lk.bitproject.model.VehicleAllocation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VehicleAllocationRepository extends JpaRepository<VehicleAllocation, Integer> {

    //Query for get all data with search value
    @Query(value = "SELECT va from VehicleAllocation va where " +
            "va.eventId.name like concat('%',:searchtext,'%') or " +
            "va.reservationId.customerId.cname like concat('%',:searchtext,'%')  ")
            Page<VehicleAllocation>findAll(@Param("searchtext") String searchtext, Pageable of);

    @Query(value = "SELECT va from VehicleAllocation va where va.reservationId.id=:resid and va.eventId.id=:evetid" )
    VehicleAllocation getByResEvent(@Param("resid") Integer resid, @Param("evetid") Integer evetid);
}

