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
@Data //setters,getters
@Entity
@Table(name = "sppayment")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SpPayment {

    @Id//primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//Auto generated
    @Basic(optional = false)//Not null
    @Column(name = "id")
    private Integer id;

    @Column(name = "spbillno")
    @Basic(optional = false)
    private String spbillno;

    @Column(name = "month")
    @Basic(optional = false)
    private String month;

    @Column(name = "totalamount")
    @Basic(optional = false)
    private BigDecimal totalamount;

    @Column(name = "paidamount")
    @Basic(optional = false)
    private BigDecimal paidamount;

    @Column(name = "balance")
    @Basic(optional = false)
    private BigDecimal balance;

    @Column(name = "paiddate")
    @Basic(optional = false)
    private LocalDate paiddate;

    @Column(name = "chqno")
    private String chqno;

    @Column(name = "chqdate")
    private LocalDate chqdate;

    @Column(name = "bankname")
    private String bankname;

    @Column(name = "branchname")
    private String branchname;

    @Column(name = "accno")
    private String accno;

    @Column(name = "accholdname")
    private String accholdname;

    @Column(name = "description")
    private String description;


    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employeeId;

    @JoinColumn(name = "serviceprovider_id" , referencedColumnName = "id")
    @ManyToOne(optional = true , fetch = FetchType.EAGER)
    private ServiceProvider serviceproviderId;

    @JoinColumn(name = "paymentmethod_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private PaymentMethod paymentmethodId;

    @JoinColumn(name = "paymentstatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = true , fetch = FetchType.EAGER)
    private PaymentStatus paymentstatusId;


    public SpPayment(String spbillno){
        this.spbillno = spbillno;
    }

    public SpPayment(Integer id, String spbillno){
        this.id = id;
        this.spbillno = spbillno;
    }

    public SpPayment(Integer id, BigDecimal totalamount,BigDecimal balance){
        this.id = id;
        this.totalamount = totalamount;
        this.balance = balance;
    }

}
