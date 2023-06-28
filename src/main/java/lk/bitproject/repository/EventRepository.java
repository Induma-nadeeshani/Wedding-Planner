package lk.bitproject.repository;

import lk.bitproject.model.Event;
import lk.bitproject.model.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventRepository  extends JpaRepository<Event, Integer> {

    //query for get event by given package
    @Query(value = "SELECT new Event (e.id,e.name) FROM Event e where e in(select p.eventId from PackageEvent p where p.packageId.id=:packageid)")
    List<Event> bypackage(@Param("packageid") Integer packageid);

    //query for get event by given resrvation
    @Query(value = "SELECT new Event (e.id,e.name) FROM Event e where e in(select p.eventId from EventReservation p where p.reservationId.id=:reservationid)")
    List<Event> reservedevents(@Param("reservationid") Integer reservationid);

}
