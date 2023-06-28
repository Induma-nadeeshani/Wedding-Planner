package lk.bitproject.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.math.BigDecimal;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "driver")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Driver {

    @Id//primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//Auto generated
    @Basic(optional = false)//Not null
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "regno")
    @Pattern(regexp = "^([D][0-9]{5})$" , message = "Invalid Reg Number")//only for strings
    private String regno;

    @Basic(optional = false)
    @Column(name = "dname")
    private String dname;

    @Basic(optional = false)
    @Column(name = "nic")
    private String nic;

    @Basic(optional = false)
    @Column(name = "dmobile")
    private String dmobile;

    @Basic(optional = false)
    @Column(name = "licenseno")
    private String licenseno;

    @Basic(optional = false)
    @Column(name = "expyears")
    private String expyears;

    @Column(name = "dphoto")
    private byte[] dphoto;

    @Column(name = "description")
    private String description;

    @Column(name = "chargeperday")
    private BigDecimal chargeperday;

    @Basic(optional = false)
    @Column(name = "regdate")
    private LocalDate regdate;


    @JoinColumn(name = "dstatus_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private DStatus dstatusId;

    @JoinColumn(name = "employee_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Employee employeeId;

    public  Driver(String regno){
        this.regno = regno;
    }

}