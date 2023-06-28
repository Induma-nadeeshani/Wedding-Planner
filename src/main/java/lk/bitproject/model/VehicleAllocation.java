package lk.bitproject.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data //setters,getters
@Entity
@Table(name = "vehicleallocation")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class VehicleAllocation {

    @Id//primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//Auto generated
    @Basic(optional = false)//Not null
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "reserveddate")
    private LocalDate reserveddate;

    @Basic(optional = false)
    @Column(name = "eventdate")
    private LocalDate eventdate;

    @Basic(optional = false)
    @Column(name = "starttime")
    private LocalTime starttime;

    @Basic(optional = false)
    @Column(name = "endtime")
    private LocalTime endtime;

    @Column(name = "description")
    private String description;


    @JoinColumn(name = "reservation_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Reservation reservationId;

    @JoinColumn(name = "event_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Event eventId;



    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employeeId;

    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.LAZY,mappedBy = "vehicleallocationId",orphanRemoval = true)
    private List<AllocatedVehicle> allocatedVehicleList;

}
