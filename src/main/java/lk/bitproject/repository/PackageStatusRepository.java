package lk.bitproject.repository;

import lk.bitproject.model.PackageStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PackageStatusRepository extends JpaRepository<PackageStatus, Integer> {
}
