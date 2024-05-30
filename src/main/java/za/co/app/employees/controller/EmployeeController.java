package za.co.app.employees.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.co.app.employees.exception.EmployeeNotFoundException;
import za.co.app.employees.model.Employee;
import za.co.app.employees.repository.EmployeeRepository;

import java.util.List;

@RestController
public class EmployeeController {

    private final EmployeeRepository employeeRepository;

    public EmployeeController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }


    @PostMapping("/add")
    public ResponseEntity<?> addEmployee(@RequestBody Employee employee){
        employeeRepository.save(employee);
        return new ResponseEntity<>(employee, HttpStatus.OK);
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<?> deleteById(@PathVariable Integer id){
        try{
            employeeRepository.deleteById(id);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateById(@RequestBody Employee employee, @RequestParam("id") Integer id) {
        try {
            Employee oldEmployee = employeeRepository.findById(id).orElseThrow(() -> new Exception("Employee not found"));
            oldEmployee.setEmail(employee.getEmail());
            oldEmployee.setFullname(employee.getFullname());
            oldEmployee.setGender(employee.getGender());
            oldEmployee.setJobTitle(employee.getJobTitle());
            oldEmployee.setPhoneNumber(employee.getPhoneNumber());

            Employee updatedEmployee = employeeRepository.save(oldEmployee);
            return new ResponseEntity<>(updatedEmployee, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Employee not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getAllEmployees")
    public List<Employee> getAll(){
        return employeeRepository.findAll();
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) throws EmployeeNotFoundException {
        try{
            return new ResponseEntity<>(employeeRepository.findById(id).orElseThrow(), HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>("Employee not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getByName/{fullname}")
    public ResponseEntity<?> getByName(@PathVariable String fullname) throws Exception {
        try {
            Employee emp = employeeRepository.findByFullname(fullname);

            if (emp == null){
                throw new Exception();
            }
            return new ResponseEntity<>(emp, HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>("Employee not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getByEmail/{email}")
    public ResponseEntity<?> getByEmail(@PathVariable String email) throws Exception {
        try{
            Employee emp =  employeeRepository.findByEmail(email);
            if (emp == null){
                throw new Exception();
            }
            return new ResponseEntity<>(emp, HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>("Employee not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getByPhoneNumber/{phoneNumber}")
    public ResponseEntity<?> getByPhoneNumber(@PathVariable String phoneNumber) throws Exception {
        try{
            Employee emp =  employeeRepository.findByPhoneNumber(phoneNumber);
            if (emp == null){
                throw new Exception();
            }
            return new ResponseEntity<>(emp, HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>("Employee not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getAllByTitle/{jobTitle}")
    public ResponseEntity<?> getAllByTitle(@PathVariable String jobTitle) throws Exception {
        try{
            Iterable<Employee> emp =  employeeRepository.findByJobTitle(jobTitle);
            if (emp == null){
                throw new Exception();
            }
            return new ResponseEntity<>(emp, HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>("Employee not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getAllByGender/{gender}")
    public ResponseEntity<?> getAllByGender(@PathVariable String gender) throws Exception {
        try{
        Iterable<Employee> emp = employeeRepository.findAllByGender(gender);
            if (emp == null){
                throw new Exception();
            }
            return new ResponseEntity<>(emp, HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>("Employee not found", HttpStatus.NOT_FOUND);
        }
    }
}
