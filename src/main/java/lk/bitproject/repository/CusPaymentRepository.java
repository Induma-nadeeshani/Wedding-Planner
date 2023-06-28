package lk.bitproject.repository;

import lk.bitproject.model.CusPayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CusPaymentRepository extends JpaRepository<CusPayment, Integer> {

    //Query for get next number
    @Query(value = "SELECT concat('CUS',lpad(substring(max(cus.billno),4)+1,5,'0')) FROM goldencrown.cuspayment as cus ;",nativeQuery = true)
    String getNextNumber();

    //Query for get payment by given payment number
    @Query(value = "SELECT cus from CusPayment cus where cus.billno=:billno")
    CusPayment getByNumber(@Param("billno") String billno);

    //Query for get payments' regno & name
    @Query(value = "SELECT new CusPayment(cus.id,cus.billno) from CusPayment cus")
    List<CusPayment> getCusPayments();
    

    //Query for get all data with search value
    @Query(value = "SELECT cus from CusPayment cus where " +
            "(cus.billno like concat('%',:searchtext,'%') or " +
            "cus.reservationId.customerId.cname like concat('%',:searchtext,'%') or " +
            "cus.paymentstatusId.name like concat('%',:searchtext,'%'))")
    Page<CusPayment>findAll(@Param("searchtext") String searchtext, Pageable of);

    //Query for get all data with search value
    @Query(value = "SELECT cus from CusPayment cus")
    Page<CusPayment>findAll(Pageable of);

    //Query for get payments' regno & name
    @Query(value = "SELECT new CusPayment(sum(cus.totalamt)) from CusPayment cus where cus.customerId.id=:customerid and cus.reservationId.id=:reservationid")
    CusPayment getPaymentByCustomerReservation(@Param("customerid")Integer customerid,@Param("reservationid")Integer reservationid);

    @Query(value = "SELECT new CusPayment(cus.id , cus.totalamt, cus.balance) from CusPayment cus where cus.reservationId.id=:reservationid order by cus.id desc ")
    List<CusPayment> listbycustomerreservation(@Param("reservationid")Integer reservationid);
}
