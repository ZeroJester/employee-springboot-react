package za.co.app.employees.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.co.app.employees.model.Employee;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    Employee findByFullname(String fullname);
    Employee findByEmail(String email);
    Employee findByPhoneNumber(String phoneNumber);
    List<Employee> findByJobTitle(String jobTitle);
    List<Employee> findAllByGender(String gender);
}
