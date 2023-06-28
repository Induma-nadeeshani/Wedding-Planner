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
@Data //setters,getters
@Entity
@Table(name = "customer")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Customer {

    @Id//primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//Auto generated
    @Basic(optional = false)//Not null
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "regno")
    @Pattern(regexp = "^([C][0-9]{5})$" , message = "Invalid Reg Number")//only for strings
    private String regno;

    @Basic(optional = false)
    @Column(name = "cname")
    private String cname;

    @Basic(optional = false)
    @Column(name = "cmobile")
    private String cmobile;

    @Pattern(regexp = "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$", message = "Invalid Email")
    @Column(name = "cemail")
    private String cemail;

    @Basic(optional = false)
    @Column(name = "nic")
    private String nic;

    @Column(name = "cpname")
    private String cpname;

    @Column(name = "cpmobile")
    private String cpmobile;

    @Column(name = "cpland")
    private String cpland;

    @Column(name = "cpemail")
    private String cpemail;

    @Basic(optional = false)
    @Column(name = "caddress")
    private String caddress;

    @Column(name = "description")
    private String description;

    @Basic(optional = false)
    @Column(name = "regdate")
    private LocalDate regdate;

    @Column(name = "cpaddress")
    private String cpaddress;

    @Column(name = "point")
    private Integer point;

    @Column(name = "tobepaid")
    private BigDecimal tobepaid;



    @JoinColumn(name = "ctype_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private CType ctypeId;

    @JoinColumn(name = "cstatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private CStatus cstatusId;

    @JoinColumn(name = "cregion_id" , referencedColumnName = "id")
    @ManyToOne(optional = true , fetch = FetchType.EAGER)
    private CRegion cregionId;

    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employeeId;

    public  Customer(String regno){
        this.regno = regno;
    }

    public  Customer(Integer id, String regno, String cname){
        this.id = id;
        this.regno = regno;
        this.cname = cname;
    }

    public  Customer(Integer id, String regno, String cname,String cemail ){
        this.id = id;
        this.regno = regno;
        this.cname = cname;
        this.cemail = cemail;
    }

}
