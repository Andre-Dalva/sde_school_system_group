package edu.unideb.schoolsystem.backend.repository;

import edu.unideb.schoolsystem.backend.model.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassRepository extends JpaRepository<ClassEntity, Long> {

}
