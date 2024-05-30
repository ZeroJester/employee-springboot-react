package za.co.app.employees.exception;

public class EmployeeNotFoundException extends Exception{
    public EmployeeNotFoundException(String errorMessage) {
        super(errorMessage);
    }
}
