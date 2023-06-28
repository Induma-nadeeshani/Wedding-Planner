package lk.bitproject.repository;

import lk.bitproject.model.CusPayment;
import lk.bitproject.model.SpPayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SpPaymentRepository extends JpaRepository<SpPayment, Integer> {

    //Query for get next number
    @Query(value = "SELECT concat('SP',lpad(substring(max(pm.spbillno),3)+1,5,'0')) FROM goldencrown.sppayment as pm;",nativeQuery = true)
    String getNextNumber();

    //Query for get payment by given payment number
    @Query(value = "SELECT pm from SpPayment pm where pm.spbillno=:spbillno")
    SpPayment getByNumber(@Param("spbillno") String spbillno);

    //Query for get payments' regno & name
    @Query(value = "SELECT new SpPayment(pm.id,pm.spbillno) from SpPayment pm")
    List<SpPayment> getSpPayments();

    //Query for get all data with search value
    @Query(value = "SELECT pm from SpPayment pm where " +
            "pm.spbillno like concat('%',:searchtext,'%') or " +
            "pm.paymentstatusId.name like concat('%',:searchtext,'%') ")
            Page<SpPayment>findAll(@Param("searchtext") String searchtext, Pageable of);


    @Query(value = "SELECT new SpPayment(sp.id, sp.totalamount, sp.balance) from SpPayment sp where sp.serviceproviderId.id=:serviceproviderid order by sp.id desc ")
    List<SpPayment> listbyspreservation(@Param("serviceproviderid")Integer serviceproviderid);

}
