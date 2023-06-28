package lk.bitproject.repository;

import lk.bitproject.model.PkgStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PkgStatusRepository extends JpaRepository<PkgStatus, Integer> {
}
