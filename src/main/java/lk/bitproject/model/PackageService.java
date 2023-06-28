package lk.bitproject.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.math.BigDecimal;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "packageevent")
public class PackageService {

    @Id//primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//Auto generated
    @Basic(optional = false)//Not null
    @Column(name = "id")
    private Integer id;

    @Column(name = "servicecharge")
    private BigDecimal servicecharge;

    @Column(name = "pkgchargemin")
    private BigDecimal pkgchargemin;

    @Column(name = "pkgchargemax")
    private BigDecimal pkgchargemax;



    @JoinColumn(name = "package_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Package packageId;

    @JoinColumn(name = "service_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    @JsonIgnore
    private Service serviceId;

}
