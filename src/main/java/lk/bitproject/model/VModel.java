package lk.bitproject.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "vmodel")
public class VModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @JoinColumn(name = "brand_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private Brand brandId;

    @JoinColumn(name = "vcategory_id", referencedColumnName = "id")
    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    private VCategory vcategoryId;

}
