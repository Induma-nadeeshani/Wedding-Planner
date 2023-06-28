package lk.bitproject.repository;

import lk.bitproject.model.PaymentType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentTypeRepository extends JpaRepository<PaymentType, Integer> {

}
