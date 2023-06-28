package lk.bitproject.repository;

import lk.bitproject.model.EventReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EventReservationRepository extends JpaRepository<EventReservation, Integer> {


    //query for get event by given resrvation and package
    @Query(value = "SELECT new EventReservation (e.id,e.eventdate,e.starttime,e.endtime) FROM EventReservation e where e.reservationId.id=:reservationid and e.eventId.id=:eventid")
    EventReservation reservedeventsbypkg(@Param("reservationid") Integer reservationid, @Param("eventid") Integer eventid);

    //events within 5 days
    @Query(value = "SELECT r.regno , e.name, er.eventdate FROM goldencrown.eventreservation as er,goldencrown.reservation as r,goldencrown.event as e where " +
            "er.reservation_id = r.id and er.event_id = e.id and er.eventdate between now() and now() + interval+ 5 day;", nativeQuery=true)
    List listbyfivedaynear();
}
