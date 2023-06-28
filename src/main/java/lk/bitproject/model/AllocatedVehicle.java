package lk.bitproject.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "allocatedvehicle")
public class AllocatedVehicle {

    @Id//primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//Auto generated
    @Basic(optional = false)//Not null
    @Column(name = "id")
    private Integer id;

    @JoinColumn(name = "vehicleallocation_id",referencedColumnName = "id")
    @JsonIgnore
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private VehicleAllocation vehicleallocationId;

    @JoinColumn(name = "vehicle_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Vehicle vehicleId;

    @JoinColumn(name = "driver_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Driver driverId;

}
