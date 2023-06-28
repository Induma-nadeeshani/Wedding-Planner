package lk.bitproject.repository;

import lk.bitproject.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ActivityRepository extends JpaRepository<Activity, Integer> {

    //query for get event by given package
    @Query(value = "SELECT new Activity (e.id,e.name) FROM Activity e")
    List<Activity> activityList(@Param("activityid") Integer activityid);

//    //query for get event by given resrvation
//    @Query(value = "SELECT new Event (e.id,e.name) FROM Event e where e in(select p.eventId from EventReservation p where p.reservationId.id=:reservationid)")
//    List<Event> reservedevents(@Param("reservationid") Integer reservationid);

}
