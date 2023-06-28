package lk.bitproject.repository;

import lk.bitproject.model.EventReservation;
import lk.bitproject.model.ServiceReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ServiceReservationRepository extends JpaRepository<ServiceReservation, Integer> {


       //query for get service provider
    @Query(value = "SELECT new ServiceReservation(sr.id, sr.pkgprice,sr.addtionalfeaturescharge) FROM ServiceReservation sr where sr.reservationId in " +
            "(select ev.reservationId from EventReservation ev where trim(ev.eventdate) like concat(:month,'%') ) and sr.providerpackageId.serviceproviderId.id=:providerid")
    List <ServiceReservation> byproviderandmnth(@Param("providerid") Integer providerid,@Param("month") String month);
}
