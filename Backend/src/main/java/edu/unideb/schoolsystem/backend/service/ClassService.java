package edu.unideb.schoolsystem.backend.service;

import edu.unideb.schoolsystem.backend.model.ClassEntity;
import edu.unideb.schoolsystem.backend.model.User;
import edu.unideb.schoolsystem.backend.repository.ClassRepository;
import edu.unideb.schoolsystem.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class ClassService {

    private final ClassRepository classRepository;
    private final UserRepository userRepository;

    public ClassService(ClassRepository classRepository, UserRepository userRepository) {
        this.classRepository = classRepository;
        this.userRepository = userRepository;
    }

    public List<ClassEntity> getAllClasses() {
        return classRepository.findAll();
    }

    public ClassEntity getClassById(Long id) {
        return classRepository.findById(id).orElse(null);
    }

    public ClassEntity createClass(ClassEntity classEntity) {
        User teacher = userRepository.findById(classEntity.getTeacher().getId()).orElse(null);
        if (teacher!=null && !teacher.isVerified()) {
            return null;
        }
        return classRepository.save(classEntity);
    }

    public void deleteClass(Long id) {
        classRepository.deleteById(id);
    }

    public ClassEntity assignTeacher(Long classId, Long teacherId) {
        ClassEntity classEntity = classRepository.findById(classId).orElse(null);
        User teacher = userRepository.findById(teacherId).orElse(null);

        if (classEntity == null || teacher == null) return null;
        if (teacher.getRole() != edu.unideb.schoolsystem.backend.model.ROLES.TEACHER) return null;

        classEntity.setTeacher(teacher);
        return classRepository.save(classEntity);
    }

    public ClassEntity enrollStudent(Long classId, Long studentId) {
        ClassEntity classEntity = classRepository.findById(classId).orElse(null);
        User student = userRepository.findById(studentId).orElse(null);

        if (classEntity == null || student == null) return null;
        if (student.getRole() != edu.unideb.schoolsystem.backend.model.ROLES.STUDENT) return null;
        if (classEntity.getStudents().contains(student)) return classEntity;

        classEntity.getStudents().add(student);
        return classRepository.save(classEntity);
    }

    public Set<User> getStudentInClass(Long classId) {
        ClassEntity classEntity = classRepository.findById(classId).orElse(null);
        return classEntity != null ? classEntity.getStudents() : null;
    }
}
