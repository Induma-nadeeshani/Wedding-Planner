package lk.bitproject.repository;


import lk.bitproject.model.SupervisorAllocation;
import lk.bitproject.model.VehicleAllocation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SupervisorAllocationRepository extends JpaRepository<SupervisorAllocation, Integer> {

    //Query for get all data with search value
    @Query(value = "SELECT va from SupervisorAllocation va where " +
            "va.eventId.name like concat('%',:searchtext,'%') or " +
            "va.reservationId.customerId.cname like concat('%',:searchtext,'%')  ")
            Page<SupervisorAllocation>findAll(@Param("searchtext") String searchtext, Pageable of);

//
    @Query(value = "SELECT va from SupervisorAllocation va where va.reservationId.id=:resid and va.eventId.id=:evetid" )
    SupervisorAllocation getByResEvent(@Param("resid") Integer resid, @Param("evetid") Integer evetid);

    @Query(value = "SELECT va from SupervisorAllocation va where va.reservationId.id=:resid" )
    SupervisorAllocation getbyreservation(@Param("resid") Integer resid);
}

