package edu.unideb.schoolsystem.backend.repository;

import edu.unideb.schoolsystem.backend.model.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassRepository extends JpaRepository<ClassEntity, Long> {
    // classes where this user is the teacher
    List<ClassEntity> findByTeacher_Id(Long teacherId);

    // classes where this user is a student
    List<ClassEntity> findByStudents_Id(Long studentId);
}
