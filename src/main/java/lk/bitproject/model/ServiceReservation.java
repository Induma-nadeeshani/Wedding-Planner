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
@Table(name = "servicereservation")
public class ServiceReservation {

    @Id//primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//Auto generated
    @Basic(optional = false)//Not null
    @Column(name = "id")
    private Integer id;

    @Column(name = "servicecharge")
    @Basic(optional = false)
    private BigDecimal servicecharge;

    @Column(name = "pkgprice")
    @Basic(optional = false)
    private BigDecimal pkgprice;

    @Column(name = "reservedserprice")
    @Basic(optional = false)
    private BigDecimal reservedserprice;

    @Column(name = "srlinetotal")
    @Basic(optional = false)
    private BigDecimal srlinetotal;

    @Column(name = "addtionalfeaturescharge")
    private BigDecimal addtionalfeaturescharge;


    @JoinColumn(name = "providerpackage_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private ProviderPackage providerpackageId;

    @JoinColumn(name = "service_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Service serviceId;

    @JoinColumn(name = "reservation_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    @JsonIgnore
    private Reservation reservationId;

    @JoinColumn(name = "event_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Event eventId;

    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.LAZY,mappedBy = "servicereservationId",orphanRemoval = true)
    private List<AdditionalFeaturesDetails> additionalFeaturesDetailsList;


    public ServiceReservation(Integer id , BigDecimal pkgprice ,BigDecimal addtionalfeaturescharge){
        this.id = id;
        this.pkgprice = pkgprice;
        this.addtionalfeaturescharge = addtionalfeaturescharge;
    }
}
