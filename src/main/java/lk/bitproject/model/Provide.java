package lk.bitproject.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "provide")
public class Provide {

    @Id//primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//Auto generated
    @Basic(optional = false)//Not null
    @Column(name = "id")
    private Integer id;

    @JoinColumn(name = "serviceprovider_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    @JsonIgnore
    private ServiceProvider serviceproviderId;

    @JoinColumn(name = "service_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Service serviceId;

}
