package lk.bitproject.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "eventreservation")
public class EventReservation {

    @Id//primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//Auto generated
    @Basic(optional = false)//Not null
    @Column(name = "id")
    private Integer id;

    @Column(name = "eventdate")
    @Basic(optional = false)
    private LocalDate eventdate;

    @Column(name = "eventmode")
    @Basic(optional = false)
    private String eventmode;

    @Column(name = "starttime")
    @Basic(optional = false)
    private LocalTime starttime;

    @Column(name = "endtime")
    @Basic(optional = false)
    private LocalTime endtime;

    @Column(name = "location")
    @Basic(optional = false)
    private String location;


    @JoinColumn(name = "reservation_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    @JsonIgnore
    private Reservation reservationId;

    @JoinColumn(name = "event_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Event eventId;

    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.LAZY,mappedBy = "eventreservationId",orphanRemoval = true)
    private List<EventActivity> eventActivityList;

    public  EventReservation(Integer id, LocalDate eventdate, LocalTime starttime,LocalTime endtime){
        this.id = id;
        this.eventdate = eventdate;
        this.starttime = starttime;
        this.endtime = endtime;
    }

}
