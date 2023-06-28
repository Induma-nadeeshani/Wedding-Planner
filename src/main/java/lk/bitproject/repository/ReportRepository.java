package lk.bitproject.repository;



import lk.bitproject.model.Civilstatus;
import lk.bitproject.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;


public interface ReportRepository extends JpaRepository<Civilstatus, Integer> {

    // Query for get reservation count for given date period
    @Query(value="SELECT count(r.id),r.regdate, sum(r.totalpayable) FROM goldencrown.reservation as r where r.regdate between :sdate and :edate group by month(r.regdate) ;", nativeQuery = true)
    List getReservationCountList(@Param("sdate") Date sdate, @Param("edate") Date edate);

    // Query for get supervisorallocation count for given date period
    @Query(value="SELECT e.callingname, count(sa.id) FROM goldencrown.supervisorallocation as sa,goldencrown.employee as e where " +
            "sa.supervisor_id=e.id and  sa.eventdate between :sdate and :edate " +
            "group by sa.supervisor_id;", nativeQuery = true)
    List getSuppervisorallocationcount(@Param("sdate") Date sdate, @Param("edate") Date edate);

    // Query for get customer payment count for given date period
    @Query(value="SELECT p.paiddate,count(p.id), sum(p.totalamt) FROM goldencrown.cuspayment as p where p.paiddate " +
            "between :sdate and :edate and p.billno is not null group by month(p.paiddate)  order by p.paiddate", nativeQuery = true)
    List paymentmonthlyreport(@Param("sdate") Date sdate, @Param("edate") Date edate);



    // Query for get payment count for given date period
    @Query(value="SELECT count(p.id),p.paiddate, sum(p.totalamount) FROM goldencrown.payment as p where p.paiddate between :sdate and :edate and p.cusbillno is not null group by p.paiddate;", nativeQuery = true)
    List getPaymentCountList(@Param("sdate") Date sdate, @Param("edate") Date edate);



    // Query for get service povider payment count for given date period
    @Query(value="SELECT p.paiddate,count(p.id), sum(p.totalamount) FROM goldencrown.sppayment as p where p.paiddate" +
            "between '2022-01-01' and '2022-12-31' and p.spbillno is not null group by month(p.paiddate)  order by p.paiddate", nativeQuery = true)
    List getspPaymentList(@Param("sdate") Date sdate, @Param("edate") Date edate);

    @Query("SELECT new Vehicle(v.id,v.vname,v.vnumber) FROM Vehicle v WHERE v.vmodelId.vcategoryId.name=:vtype and v.vstatusId.id=1 and v " +
            "not in(select ava.vehicleId from AllocatedVehicle ava where ava.vehicleallocationId in(select va from VehicleAllocation va where va.eventdate=:eventdate and " +
            "((trim(va.starttime) between :stime and :etime) OR " +
            " (trim(va.endtime) between :stime and :etime) OR (va.starttime >= :stime and va.endtime <= :etime ))))")
    List<Vehicle> listbyavailable(@Param("eventdate") LocalDate eventdate, @Param("stime") String stime, @Param("etime")String etime, @Param("vtype")String vtype);


    // Query for get reservation count for given date period
    @Query(value="SELECT new Reservation(r.id,r.customerId,r.regdate) FROM Reservation r where r.resstatusId.id=6 and r in " +
            "(select e.eventId.name from EventReservation e) and (trim(r.regdate) between :sdate and :edate)")
    List reservedli(@Param("sdate") Date sdate, @Param("edate") Date edate);


}