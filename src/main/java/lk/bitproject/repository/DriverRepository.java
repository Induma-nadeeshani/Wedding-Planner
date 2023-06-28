package lk.bitproject.repository;

import lk.bitproject.model.Driver;
import lk.bitproject.model.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface DriverRepository extends JpaRepository<Driver, Integer> {

    //Query for get next number
    @Query(value = "SELECT concat('D',lpad(substring(max(d.regno),2)+1,5,'0')) FROM goldencrown.driver as d;",nativeQuery = true)
    String getNextNumber();

    //Query for get driver by given driver number
    @Query(value = "SELECT d from Driver d where d.regno=:regno")
    Driver getByNumber(@Param("regno") String regno);

    /*@Query("SELECT new Driver (v.id,v.dname) FROM Driver v WHERE v " +
            "not in(select va.driverId from AllocatedVehicle va where va.eventdate=:eventdate and " +
            "((trim(va.starttime) between :stime and :etime) OR " +
            " (trim(va.endtime) between :stime and :etime) OR (va.starttime >= :stime and va.endtime <= :etime )))")
    List<Driver> listbyavailable(@Param("eventdate") LocalDate eventdate, @Param("stime") String stime, @Param("etime")String etime);

*/
    //Query for get all data with search value
    @Query(value = "SELECT d from Driver d where " +
            "d.dname like concat('%',:searchtext,'%') or " +
            "d.nic like concat('%',:searchtext,'%') or " +
            "d.dmobile like concat('%',:searchtext,'%') or " +
            "d.licenseno like concat('%',:searchtext,'%')  or " +
            "d.dstatusId.name like concat('%',:searchtext,'%') ")
    Page<Driver> findAll(@Param("searchtext") String searchtext, Pageable of);
}
