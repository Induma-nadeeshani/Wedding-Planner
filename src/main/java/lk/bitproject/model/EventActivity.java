package lk.bitproject.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "eventactivity")
public class EventActivity {


    @Id//primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//Auto generated
    @Basic(optional = false)//Not null
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "activityname")
    private String activityname;

    @Basic(optional = false)
    @Column(name = "actstarttime")
    private LocalTime actstarttime;

    @Basic(optional = false)
    @Column(name = "actendtime")
    private LocalTime actendtime;

    @Basic(optional = false)
    @Column(name = "distance")
    private BigDecimal distance;

    @Basic(optional = false)
    @Column(name = "traveltime")
    private BigDecimal traveltime;

    @Basic(optional = false)
    @Column(name = "startlocation")
    private String startlocation;

    @Basic(optional = false)
    @Column(name = "endlocation")
    private String endlocation;

    @JoinColumn(name = "eventreservation_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    @JsonIgnore
    private EventReservation eventreservationId;

    @JoinColumn(name = "activity_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Activity activityId;


}
