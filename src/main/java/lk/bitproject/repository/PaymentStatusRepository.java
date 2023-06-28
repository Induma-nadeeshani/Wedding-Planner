package lk.bitproject.repository;

import lk.bitproject.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentStatusRepository extends JpaRepository<PaymentStatus, Integer> {
}
