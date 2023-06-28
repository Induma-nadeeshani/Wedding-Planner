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
@Table(name = "cuspayment")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CusPayment{

    @Id//primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//Auto generated
    @Basic(optional = false)//Not null
    @Column(name = "id")
    private Integer id;

    @Column(name = "billno")
    private String billno;

    @Column(name = "totalamt")
    @Basic(optional = false)
    private BigDecimal totalamt;

    @Basic(optional = false)
    @Column(name = "paidamt")
    private BigDecimal paidamt;

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

    @JoinColumn(name = "customer_id" , referencedColumnName = "id")
    @ManyToOne(optional = true , fetch = FetchType.EAGER)
    private Customer customerId;

    @JoinColumn(name = "paymenttype_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private PaymentType paymenttypeId;

    @JoinColumn(name = "paymentmethod_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private PaymentMethod paymentmethodId;

    @JoinColumn(name = "paymentstatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = true , fetch = FetchType.EAGER)
    private PaymentStatus paymentstatusId;

    @JoinColumn(name = "reservation_id" , referencedColumnName = "id")
    @ManyToOne(optional = true , fetch = FetchType.EAGER)
    private Reservation reservationId;


    public CusPayment(String billno){
        this.billno = billno;
    }

    public CusPayment(BigDecimal totalamt){
        this.totalamt = totalamt;
    }

    public CusPayment(Integer id, String billno){
        this.id = id;
        this.billno = billno;
    }

    public CusPayment(Integer id, BigDecimal totalamt, BigDecimal balance){
        this.id = id;
        this.totalamt = totalamt;
        this.balance = balance;
    }
}
