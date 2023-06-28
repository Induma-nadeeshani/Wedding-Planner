package lk.bitproject.repository;

import lk.bitproject.model.Customer;
import lk.bitproject.model.Service;
import lk.bitproject.model.ServiceProvider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Integer> {

   //Query for get next number
    @Query(value = "SELECT concat('S',lpad(substring(max(s.servicecode),2)+1,5,'0')) FROM goldencrown.service as s;",nativeQuery = true)
    String getNextNumber();

   //Query for get service names
    @Query(value = "SELECT new Service(s.id,s.servicename) FROM Service s")
    List<Service> serviceByName();

    //Query for get service by given service number
    @Query(value = "SELECT s from Service s where s.servicecode=:servicecode")
    Service getByNumber(@Param("servicecode") String servicecode);

    //Query for get all data with search value
    @Query(value = "SELECT s from Service s where " +
            "s.servicecode like concat('%',:searchtext,'%') or " +
            "s.stypeId.name like concat('%',:searchtext,'%') or " +
            "s.servicename like concat('%',:searchtext,'%') or " +
            "s.sstatusId.name like concat('%',:searchtext,'%') ")
    Page<Service> findAll(@Param("searchtext") String searchtext, Pageable of);
}

