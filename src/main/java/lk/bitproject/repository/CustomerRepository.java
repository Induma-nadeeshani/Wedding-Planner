package lk.bitproject.repository;

import lk.bitproject.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer , Integer> {

    //Query for get next number
    @Query(value = "SELECT concat('C',lpad(substring(max(c.regno),2)+1,5,'0')) FROM goldencrown.customer as c;",nativeQuery = true)
    String getNextNumber();

    //Query for get customer by given customer number
    @Query(value = "SELECT c from Customer c where c.regno=:regno")
    Customer getByNumber(@Param("regno") String regno);

    //Query for get customers' regno & name
    @Query(value = "SELECT new Customer(c.id,c.regno, c.cname, c.cemail) from Customer c where c.cstatusId.id=1")
    List<Customer> getCustomers();

    //Query for get customers' regno & name by reservation status
    @Query(value = "SELECT new Customer(c.id,c.regno,c.cname, c.cemail) from Customer c where c in(select r.customerId from Reservation r where " +
            "r.resstatusId.id=2 or r.resstatusId.id=4 or r.resstatusId.id=7 or r.resstatusId.id=1)")
    List<Customer> listbypending();

    //When 2 companies have same contact person
    @Query(value = "SELECT c from Customer c where c.nic=:nic")
    Customer getByNic(@Param("nic") String nic);

    //Query for get all data with search value
    @Query(value = "SELECT c from Customer c where " +
            "c.regno like concat('%',:searchtext,'%') or " +
            "c.ctypeId.name like concat('%',:searchtext,'%') or " +
            "c.cname like concat('%',:searchtext,'%') or " +
            "c.cmobile like concat('%',:searchtext,'%') or " +
            "c.nic like concat('%',:searchtext,'%') or " +
            "c.cstatusId.name like concat('%',:searchtext,'%') ")
            Page<Customer>findAll(@Param("searchtext") String searchtext, Pageable of);
}
