package lk.bitproject.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data //setters,getters
@Entity
@Table(name ="serviceprovider")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ServiceProvider {

    @Id//primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//Auto generated
    @Basic(optional = false)//Not null
    @Column(name = "id")
    private Integer id;

    @Basic(optional = false)
    @Column(name = "regno")
    private String regno;

    @Basic(optional = false)
    @Column(name = "brno")
    private String brno;

    @Basic(optional = false)
    @Column(name = "name")
    private String name;

    @Basic(optional = false)
    @Column(name = "email")
    private String email;

    @Basic(optional = false)
    @Column(name = "mobile")
    private String mobile;

    @Basic(optional = false)
    @Column(name = "land")
    private String land;

    @Basic(optional = false)
    @Column(name = "fax")
    private String fax;

    @Column(name = "address")
    private String address;

    @Column(name = "cpname")
    private String cpname;

    @Column(name = "cpnic")
    private String cpnic;

    @Column(name = "cpemail")
    private String cpemail;

    @Column(name = "cpmobile")
    private String cpmobile;

    @Column(name = "description")
    private String description;

    @Basic(optional = false)
    @Column(name = "bankname")
    private String bankname;

    @Basic(optional = false)
    @Column(name = "branch")
    private String branch;

    @Basic(optional = false)
    @Column(name = "accno")
    private String accno;

    @Basic(optional = false)
    @Column(name = "accholdername")
    private String accholdername;

    @Basic(optional = false)
    @Column(name = "regdate")
    private LocalDate regdate;

    @JoinColumn(name = "sptype_id" , referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private SpType sptypeId;

    @JoinColumn(name = "spstatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private SpStatus  spstatusId;

    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employeeId;

    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.LAZY,mappedBy = "serviceproviderId",orphanRemoval = true)
    private List<Provide> provideList;

    public ServiceProvider(String regno) {this.regno = regno; }

    public ServiceProvider(Integer id,String name) {
        this.id = id;
        this.name = name;
    }

}
