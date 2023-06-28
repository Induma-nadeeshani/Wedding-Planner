package lk.bitproject.repository;

import lk.bitproject.model.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface VehicleRepository extends JpaRepository <Vehicle, Integer> {

    //Query for get vehicle by given vehicle number
    @Query(value = "SELECT v from Vehicle v where v.vnumber=:vnumber")
    Vehicle getByNumber(@Param("vnumber") String vnumber);

//    //Query for get vehicle by given vehicle number
//    @Query(value = "SELECT v from Vehicle v where v.categoryId.id=:categoryid")
//    Vehicle bycategory(@Param("categoryid") String categoryid);

//    //available vehicles for the package
//    @Query("SELECT new Vehicle(v.id,v.vname,v.vnumber) FROM Vehicle v " +
//            "WHERE v.vmodelId.vcategoryId.name=:vtype and v.vstatusId.id=1 and v " +
//            "not in(select ava.vehicleId from AllocatedVehicle ava where ava.vehicleallocationId " +
//            "in(select va from VehicleAllocation va where va.eventdate=:eventdate and " +
//            "((trim(va.starttime) between :stime and :etime) OR " +
//            " (trim(va.endtime) between :stime and :etime) OR (va.starttime >= :stime and va.endtime <= :etime ))))")
//    List<Vehicle> listbyavailable(@Param("eventdate") LocalDate eventdate, @Param("stime") String stime, @Param("etime")String etime,@Param("vtype")String vtype);


    //available vehicles for the package
    @Query("SELECT v FROM Vehicle v " +
            "WHERE v.vmodelId.vcategoryId.name=:vtype and v.vstatusId.id=1 and v.id " +
            "in(select ava.vehicleId from AllocatedVehicle ava where ava.vehicleallocationId " +
            "not in(select va.id from VehicleAllocation va where va.eventdate=:eventdate))")
    List<Vehicle> listbyavailable(@Param("eventdate") LocalDate eventdate,@Param("vtype")String vtype);


    //Query for get all data with search value
    @Query(value = "SELECT v from Vehicle v where " +
            "v.vnumber like concat('%',:searchtext,'%') or " +
            "v.vmodelId.vcategoryId.name like concat('%',:searchtext,'%') or " +
            "v.vmodelId.brandId.name like concat('%',:searchtext,'%') or " +
            "v.vmodelId.name like concat('%',:searchtext,'%') or " +
            "v.vstatusId.name like concat('%',:searchtext,'%') ")
    Page<Vehicle> findAll(@Param("searchtext") String searchtext, Pageable of);
}

