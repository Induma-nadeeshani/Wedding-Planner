package lk.bitproject.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "service")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "servicecode")
    private String servicecode;

    @Basic(optional = false)
    @Column(name = "servicename")
    private String servicename;

    @Basic(optional = false)
    @Column(name = "servicecharge")
    private BigDecimal servicecharge;

    @Column(name = "regdate")
    private LocalDate regdate;

    @JoinColumn(name = "stype_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private SType stypeId;

    @JoinColumn(name = "sstatus_id",referencedColumnName = "id" )
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private SStatus sstatusId;

    @JoinColumn(name = "employee_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Employee employeeId;

    public  Service(String servicecode){
        this.servicecode = servicecode;
    }

    public  Service(Integer id,String servicename){
        this.id = id;
        this.servicename = servicename;
    }

}
