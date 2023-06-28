package lk.bitproject.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "addtionalfeaturesdetails")
public class AdditionalFeaturesDetails {

    @Id//primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//Auto generated
    @Basic(optional = false)//Not null
    @Column(name = "id")
    private Integer id;

    @Column(name = "qty")
    private Integer qty;

    @Column(name = "addfeatureprice")
    private BigDecimal addfeatureprice;

    @Basic(optional = false)
    @Column(name = "linetotal")
    private BigDecimal linetotal;

    @JoinColumn(name = "addtionalfeatures_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private AdditionalFeatures addtionalfeaturesId;

    @JoinColumn(name = "servicereservation_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    @JsonIgnore
    private ServiceReservation servicereservationId;


}
