package lk.bitproject.repository;

import lk.bitproject.model.Reservation;
import lk.bitproject.model.ServiceProvider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

    //Query for get next number
    @Query(value = "SELECT concat('R',lpad(substring(max(r.regno),2)+1,5,'0')) FROM goldencrown.reservation as r;", nativeQuery = true)
    String getNextNumber();

    //Query for get reservation by given customer number
    @Query(value = "SELECT r from Reservation r where r.regno=:regno")
    Reservation getByNumber(@Param("regno") String regno);

    //Query for get all data with search value
    @Query(value = "SELECT r from Reservation r where " +
            "r.regno like concat('%',:searchtext,'%') or " +
            "r.customerId.cname like concat('%',:searchtext,'%') or " +
            "r.resstatusId.name like concat('%',:searchtext,'%') ")
    Page<Reservation> findAll(@Param("searchtext") String searchtext, Pageable of);

    //query for get reservation by given customerid
    @Query(value = "SELECT new Reservation (r.id,r.regno,r.totalpayable) FROM Reservation r where r.customerId.id=:customerid " +
            "and (r.resstatusId.id = 2 or r.resstatusId.id = 4 or r.resstatusId.id =7 or r.resstatusId.id =1)")
    List <Reservation> bycustomer(@Param("customerid") Integer customerid);

    //query for get reservation by status
    @Query(value = "SELECT new Reservation (r.id,r.regno) FROM Reservation r where r.resstatusId.id = 2 or r.resstatusId.id = 4 or r.resstatusId.id =7 or r.resstatusId.id =6")
    List<Reservation> resList();

    //query for get reservation by status
    @Query(value = "SELECT new Reservation (r.id,r.regno,r.customerId) FROM Reservation r where r.resstatusId.id = 2")
    List<Reservation> listbystatus();

    //query for get pending reservation by status
    @Query(value = "SELECT new Reservation (r.id,r.regno) FROM Reservation r where r.resstatusId.id = 1")
    List<Reservation> pendinglist();

    //query for get vehicle reservation by status
    @Query(value = "SELECT new Reservation (r.id,r.regno,r.customerId) FROM Reservation r where r in(select a.reservationId from ServiceReservation a where a.serviceId.id=4) and " +
            " (r.resstatusId.id = 1 or r.resstatusId.id = 2)")
    List<Reservation> vehresList();

    //query for get reservation by status
    @Query(value = "SELECT r FROM Reservation r where r.resstatusId.id = 8 or r.resstatusId.id = 6")
    List<Reservation> listforschedule();

}
