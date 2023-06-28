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
@Table(name = "providerpackage")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ProviderPackage {

    @Id//primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//Auto generated
    @Basic(optional = false)//Not null
    @Column(name= "id")
    private Integer id;

    @Column(name="code")
    @Basic(optional = false)
    private String code;

    @Column(name="name")
    @Basic(optional = false)
    private String name;

    @Column(name="price")
    @Basic(optional = false)
    private BigDecimal price;

    @Basic(optional = false)
    @Column(name="startdate")
    private LocalDate startdate;

    @Column(name="enddate")
    @Basic(optional = false)
    private LocalDate enddate;

    @Column(name="description")
    private String description;

    @Basic(optional = false)
    @Column(name="regdate")
    private LocalDate regdate;



    @JoinColumn(name = "service_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Service serviceId;

    @JoinColumn(name = "event_id" , referencedColumnName = "id")
    @ManyToOne(optional = true , fetch = FetchType.EAGER)
    private Event eventId;

    @JoinColumn(name = "serviceprovider_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private ServiceProvider serviceproviderId;

    @JoinColumn(name = "packagestatus_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private PackageStatus packagestatusId;

    @JoinColumn(name = "employee_id" , referencedColumnName = "id")
    @ManyToOne(optional = false , fetch = FetchType.EAGER)
    private Employee employeeId;

    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.LAZY,mappedBy = "providerpackageId",orphanRemoval = true)
    private List<Features> featuresList;

    @OneToMany(cascade = CascadeType.ALL,fetch = FetchType.LAZY,mappedBy = "provideId",orphanRemoval = true)
    private List<AdditionalFeatures> additionalFeaturesList;

    public  ProviderPackage(Integer id, String name){
        this.id = id;
        this.name = name;
    }
}
