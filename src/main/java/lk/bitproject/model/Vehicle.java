package lk.bitproject.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "vehicle")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "vname")
    private String vname;

    @Basic(optional = false)
    @Column(name = "vnumber")
    private String vnumber;

    @Column(name = "photo")
    private byte[] photo;

    @Column(name = "description")
    private String description;

    @Basic(optional = false)
    @Column(name = "withoutdriver")
    private Boolean withoutdriver;

    @Basic(optional = false)
    @Column(name = "startingrate")
    private BigDecimal startingrate;

    @Basic(optional = false)
    @Column(name = "priceperhour")
    private BigDecimal priceperkm;

    @Basic(optional = false)
    @Column(name = "regdate")
    private LocalDate regdate;


    @JoinColumn(name = "vstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private VStatus vstatusId;

    @JoinColumn(name = "vmodel_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private VModel vmodelId;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employeeId;

    public  Vehicle(String vnumber){
        this.vnumber = vnumber;
    }


    public  Vehicle(Integer id,String vname,String vnumber){
        this.id = id;
        this.vname = vname;
        this.vnumber = vnumber;
    }

}
