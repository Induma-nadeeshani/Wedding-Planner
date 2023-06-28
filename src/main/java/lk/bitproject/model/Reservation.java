package lk.bitproject.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data //setters,getters
@Entity
@Table(name ="reservation")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Reservation {

    @Id//primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//Auto generated
    @Basic(optional = false)//Not null
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "regno")
    private String regno;

    @Basic(optional = false)
    @Column(name = "totalprice")
    private BigDecimal totalprice;

    @Basic(optional = false)
    @Column(name = "advance")
    private BigDecimal advance;

    @Basic(optional = false)
    @Column(name = "totalpayable")
    private BigDecimal totalpayable;

    @Column(name = "discount")
    private BigDecimal discount;

    @Column(name = "description")
    private String description;

    @Basic(optional = false)
    @Column(name = "regdate")
    private LocalDate regdate;

    @Basic(optional = false)
    @Column(name = "precentage")
    private Integer precentage;

    @JoinColumn(name = "resstatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private ResStatus  resstatusId;

    @JoinColumn(name = "package_id" , referencedColumnName = "id")
    @ManyToOne(optional = true , fetch = FetchType.EAGER)
    private Package  packageId;

    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employeeId;

    @JoinColumn(name = "customer_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Customer customerId;

    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.LAZY,mappedBy = "reservationId",orphanRemoval = true)
    private List<EventReservation> eventReservationList;

    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.LAZY,mappedBy = "reservationId",orphanRemoval = true)
    private List<ServiceReservation> serviceReservationList;

   public Reservation(String regno) {this.regno = regno; }

    public Reservation(Integer id, String regno) {
        this.id = id;
        this.regno = regno;
    }


    public Reservation(Integer id, String regno, BigDecimal totalpayable) {
        this.id = id;
        this.regno = regno;
        this.totalpayable = totalpayable;
    }

    public Reservation(Integer id, String regno, Customer customerId) {
        this.id = id;
        this.regno = regno;
        this.customerId = customerId;
    }

    public Reservation(Integer id, Customer customerId, LocalDate regdate) {
        this.id = id;
        this.customerId = customerId;
        this.regdate = regdate;
    }
}
