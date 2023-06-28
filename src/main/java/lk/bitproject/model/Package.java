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
@Table(name = "package")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Package {

    @Id//primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//Auto generated
    @Basic(optional = false)//Not null
    @Column(name= "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name="regno")
    private String regno;

    @Basic(optional = false)
    @Column(name="name")
    private String name;

    @Column(name="description")
    private String description;

    @Basic(optional = false)
    @Column(name="regdate")
    private LocalDate regdate;


    @JoinColumn(name = "pkgstatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private PkgStatus pkgstatusId;


    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employeeId;

    public  Package(String regno){
        this.regno = regno;
    }

    public  Package(String regno,String name){
        this.regno = regno;
        this.name = name;
    }


}
