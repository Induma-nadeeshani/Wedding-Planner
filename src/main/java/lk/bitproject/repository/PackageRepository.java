package lk.bitproject.repository;

import lk.bitproject.model.Package;
import lk.bitproject.model.ServiceProvider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PackageRepository extends JpaRepository<Package , Integer> {

    //Query for get next number
    @Query(value = "SELECT concat('P',lpad(substring(max(p.regno),2)+1,5,'0')) FROM goldencrown.package as p;",nativeQuery = true)
    String getNextNumber();

    //Query for get customer by given package number
    @Query(value = "SELECT p from Package p where p.regno=:regno")
    Package getByNumber(@Param("regno") String regno);

    //Query for get all data with search value
    @Query(value = "SELECT p from Package p where " +
            "p.regno like concat('%',:searchtext,'%') or " +
            "p.name like concat('%',:searchtext,'%') or " +
            "p.pkgstatusId.name like concat('%',:searchtext,'%') ")
            Page<Package>findAll(@Param("searchtext") String searchtext, Pageable of);
}
