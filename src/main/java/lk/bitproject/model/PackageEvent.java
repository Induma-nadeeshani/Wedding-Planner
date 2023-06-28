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
@Table(name = "packageevent")
public class PackageEvent {

    @Id//primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY)//Auto generated
    @Basic(optional = false)//Not null
    @Column(name = "id")
    private Integer id;

    @JoinColumn(name = "package_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    private Package packageId;

    @JoinColumn(name = "event_id",referencedColumnName = "id")
    @ManyToOne(optional = false,fetch = FetchType.EAGER)
    @JsonIgnore
    private Service eventId;

}
