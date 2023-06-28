package lk.bitproject.repository;

import lk.bitproject.model.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Integer> {

}
