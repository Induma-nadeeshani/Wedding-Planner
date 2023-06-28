package lk.bitproject.repository;

import lk.bitproject.model.Employee;
import lk.bitproject.model.Reservation;
import lk.bitproject.model.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {

  @Query(value="SELECT new Employee(e.id,e.callingname) FROM Employee e")
    List<Employee> list();

    @Query(value = "SELECT max(e.number) FROM Employee e")
    String getNextNumber();

    @Query(value="SELECT new Employee(e.id,e.callingname) FROM Employee e WHERE e not in (Select u.employeeId from User u)")
    List<Employee> listWithoutUsers();

    @Query(value="SELECT new Employee(e.id,e.callingname) FROM Employee e WHERE e in (Select u.employeeId from User u)")
    List<Employee> listWithUseraccount();

    @Query("SELECT e FROM Employee e where e.callingname <> 'Admin' ORDER BY e.id DESC")
    Page<Employee> findAll(Pageable of);

    @Query("SELECT e FROM Employee e where (e.callingname like concat('%',:searchtext,'%')) and e.callingname<>'Admin' ORDER BY e.id DESC")
    Page<Employee> findAll(@Param("searchtext")String searchtext ,Pageable of);

   @Query("SELECT e FROM Employee e WHERE e.nic= :nic")
    Employee findByNIC(@Param("nic")String nic);

    @Query("SELECT e FROM Employee e WHERE e.number= :number")
    Employee findByNumber(@Param("number")String number);

    //Fill data to select2 combo
    @Query(value = "SELECT new Employee(e.id,e.nic,e.callingname) FROM Employee e where e.designationId.id = 2" )
    List<Employee> empdrvList();

    //query for get employee by gender
    @Query(value = "SELECT new Employee (r.id,r.callingname) FROM Employee r where r.genderId.id =:genderid")
    List <Employee> bygender(@Param("genderid") Integer genderid);

    //query for get available supervisors
    @Query(value = "SELECT new Employee (v.id,v.nic, v.callingname,v.email) FROM Employee v WHERE v.designationId.id=7 and " +
            "v.id not in (select sa.supervisorId from SupervisorAllocation sa where sa.eventdate=:date) ")
    List<Employee> listbysupavailable(@Param("date") LocalDate date);

////query for get available supervisors
//    @Query(value= "SELECT v.id,v.callingname ,sa.eventdate \n" +
//            "FROM employee as v, supervisorallocation as sa\n" +
//            " WHERE v.designation_id=7 and sa.supervisor_id=v.id and sa.eventdate != date;", nativeQuery = true)
//    List<Employee> listbyavailability(@Param("date") LocalDate date);


//    //query for get supervisors
//    @Query(value = "SELECT new Employee(e.id,e.nic,e.callingname) FROM Employee e where e.designationId.id = 7 and" )
//    List<Employee> supforres(@Param("resid") Integer resid);

 //query for get supervisors by reservation Id
    @Query(value = "SELECT new Employee(e.id,e.nic,e.callingname) FROM Employee e where e.designationId.id = 7" )
    List<Employee> supervisorlist();


    //available drivers
    @Query(value = "SELECT v FROM employee as v" +
            "    WHERE v.designation_id =2 and v.employeestatus_id=1 and v.id" +
            "    not in(select va.employee_id from vehicleallocation as va where va.eventdate =:eventdate);",nativeQuery = true)
    List<Employee> drvlistbyavailable(@Param("eventdate") LocalDate eventdate);


}
