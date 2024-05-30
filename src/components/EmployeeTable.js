import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { styled } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const StyledContainer = styled(Container)({
  marginTop: '20px',
});

const StyledTypography = styled(Typography)({
  color: '#1976d2',
  marginBottom: '20px',
  fontWeight: 'bold',
});

const StyledTableContainer = styled(TableContainer)({
  borderRadius: '10px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
});

const StyledTableHead = styled(TableHead)({
  backgroundColor: '#1976d2',
});

const StyledTableCell = styled(TableCell)({
  color: '#ffffff',
  fontWeight: 'bold',
});

const StyledTableRow = styled(TableRow)({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f5f5f5',
  },
});

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
    width: '50%'
  },
});

const StyledDialogTitle = styled(DialogTitle)({
  backgroundColor: '#1976d2',
  color: '#ffffff',
  padding: '10px 20px',
  fontWeight: 'bold',
  borderRadius: '10px 10px 0 0',
  marginBottom: '20px'
});

const StyledDialogContent = styled(DialogContent)({
  padding: '10px',
});

const StyledDialogContentText = styled(DialogContentText)({
  marginBottom: '10px',
  color: '#333333',
});

const StyledDialogActions = styled(DialogActions)({
  padding: '0px 20px',
});

const EmployeeDetailsTable = styled(Table)({
  width: '100%',
});

const EmployeeDetailsTableRow = styled(TableRow)({
  '&:nth-of-type(odd)': {
    backgroundColor: '#f5f5f5',
  },
});

const EmployeeDetailsTableCell = styled(TableCell)({
  fontWeight: 'bold',
  '&:first-of-type': {
      width: '30%', // Adjust the width as needed
    },
});

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [open, setOpen] = useState(false);
  const [remove, setRemove] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState(null);
  const [editedEmployeeData, setEditedEmployeeData] = useState({});



  useEffect(() => {
    fetch('/getAllEmployees')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setEmployees(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching employee data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleViewClick = (employee) => {
    setSelectedEmployee(employee);
    setOpen(true);
  };

  const handleConfirmRemove = () => {
    fetch(`/remove/${selectedEmployee.id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        // Remove the deleted employee from the state
        setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== selectedEmployee.id));
        handleClose(); // Close the confirmation dialog
        setRemove(false); // Hide the remove confirmation dialog
      } else {
        throw new Error('Failed to remove employee');
      }
    })
    .catch(error => {
      console.error('Error removing employee:', error);
    });
  }

const handleEditClick = (employee) => {
  setEditMode(true);
  setEditedEmployee(employee);
  setEditedEmployeeData({
    id: employee.id,
    fullname: employee.fullname,
    email: employee.email,
    phoneNumber: employee.phoneNumber,
    jobTitle: employee.jobTitle,
    gender: employee.gender,
  });
  setOpen(true); // Open the dialog for editing
};

const handleEditInputChange = (e) => {
  const { name, value } = e.target;
  setEditedEmployeeData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

const handleEditSubmit = () => {
  fetch(`/update/${editedEmployeeData.id}?id=${editedEmployeeData.id}`, { // Include the id parameter in the URL
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(editedEmployeeData),
  })
    .then((response) => {
      if (response.ok) {
        setEmployees((prevEmployees) =>
          prevEmployees.map((employee) =>
            employee.id === editedEmployeeData.id ? editedEmployeeData : employee
          )
        );
        handleClose();
        setEditMode(false);
      } else {
        throw new Error('Failed to update employee');
      }
    })
    .catch((error) => {
      console.error('Error updating employee:', error);
    });
};



  const handleClose = () => {
    setOpen(false);
    setSelectedEmployee(null);
  };

  const handleRemoveClick = (employee) => {
    setSelectedEmployee(employee);
    setRemove(true);
  }

  const handleRemoveClose = () => {
    setRemove(false);
    setSelectedEmployee(null);
  }

  if (loading) {
    return (
      <StyledContainer>
        <CircularProgress />
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <Alert severity="error">Error fetching employee data: {error.message}</Alert>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <StyledTypography variant="h4" component="h2" gutterBottom>
        Employee List
      </StyledTypography>
      <StyledTableContainer component={Paper}>
        <Table>
          <StyledTableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Full Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Phone Number</StyledTableCell>
              <StyledTableCell>Job Title</StyledTableCell>
              <StyledTableCell>Gender</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {employees.map((employee) => (
              <StyledTableRow key={employee.id}>
                <TableCell>{employee.id}</TableCell>
                <TableCell>{employee.fullname}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phoneNumber}</TableCell>
                <TableCell>{employee.jobTitle}</TableCell>
                <TableCell>{employee.gender}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="view"
                    color="primary"
                    onClick={() => handleViewClick(employee)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton aria-label="edit" color="primary" onClick={() => handleEditClick(employee)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" color="tersiary" onClick={() => handleRemoveClick(employee)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      <StyledDialog open={open} onClose={handleClose}>
        <StyledDialogTitle>Employee Details</StyledDialogTitle>
        <StyledDialogContent>
          {selectedEmployee && (
            <EmployeeDetailsTable>
              <TableBody>
                <EmployeeDetailsTableRow>
                  <EmployeeDetailsTableCell>ID</EmployeeDetailsTableCell>
                  <EmployeeDetailsTableCell>{selectedEmployee.id}</EmployeeDetailsTableCell>
                </EmployeeDetailsTableRow>
                <EmployeeDetailsTableRow>
                  <EmployeeDetailsTableCell>Full Name</EmployeeDetailsTableCell>
                  <EmployeeDetailsTableCell>{selectedEmployee.fullname}</EmployeeDetailsTableCell>
                </EmployeeDetailsTableRow>
                <EmployeeDetailsTableRow>
                  <EmployeeDetailsTableCell>Email</EmployeeDetailsTableCell>
                  <EmployeeDetailsTableCell>{selectedEmployee.email}</EmployeeDetailsTableCell>
                </EmployeeDetailsTableRow>
                <EmployeeDetailsTableRow>
                  <EmployeeDetailsTableCell>Phone Number</EmployeeDetailsTableCell>
                  <EmployeeDetailsTableCell>{selectedEmployee.phoneNumber}</EmployeeDetailsTableCell>
                </EmployeeDetailsTableRow>
                <EmployeeDetailsTableRow>
                  <EmployeeDetailsTableCell>Job Title</EmployeeDetailsTableCell>
                  <EmployeeDetailsTableCell>{selectedEmployee.jobTitle}</EmployeeDetailsTableCell>
                </EmployeeDetailsTableRow>
                <EmployeeDetailsTableRow>
                  <EmployeeDetailsTableCell>Gender</EmployeeDetailsTableCell>
                  <EmployeeDetailsTableCell>{selectedEmployee.gender}</EmployeeDetailsTableCell>
                </EmployeeDetailsTableRow>
              </TableBody>
            </EmployeeDetailsTable>
          )}
        </StyledDialogContent>
        <StyledDialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </StyledDialogActions>
      </StyledDialog>



<StyledDialog open={open} onClose={handleClose}>
  <StyledDialogTitle>Edit Employee Details</StyledDialogTitle>
  <StyledDialogContent>
    <form>
      <TextField
        name="fullname"
        label="Full Name"
        value={editedEmployeeData.fullname}
        onChange={handleEditInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="email"
        label="Email"
        value={editedEmployeeData.email}
        onChange={handleEditInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="phoneNumber"
        label="Phone Number"
        value={editedEmployeeData.phoneNumber}
        onChange={handleEditInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="jobTitle"
        label="Job Title"
        value={editedEmployeeData.jobTitle}
        onChange={handleEditInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="gender"
        label="Gender"
        value={editedEmployeeData.gender}
        onChange={handleEditInputChange}
        fullWidth
        margin="normal"
      />
    </form>
  </StyledDialogContent>
  <StyledDialogActions>
    <Button onClick={handleClose} color="primary">
      Cancel
    </Button>
    <Button onClick={handleEditSubmit} color="primary">
      Save
    </Button>
  </StyledDialogActions>
</StyledDialog>





      <StyledDialog open={remove} onClose={handleRemoveClose}>
        <StyledDialogTitle>Remove Employee</StyledDialogTitle>
        <StyledDialogContent>
                  {selectedEmployee && (
                    <EmployeeDetailsTable>
                      <TableBody>
                        <EmployeeDetailsTableRow>
                          <EmployeeDetailsTableCell>ID</EmployeeDetailsTableCell>
                          <EmployeeDetailsTableCell>{selectedEmployee.id}</EmployeeDetailsTableCell>
                        </EmployeeDetailsTableRow>
                        <EmployeeDetailsTableRow>
                          <EmployeeDetailsTableCell>Full Name</EmployeeDetailsTableCell>
                          <EmployeeDetailsTableCell>{selectedEmployee.fullname}</EmployeeDetailsTableCell>
                        </EmployeeDetailsTableRow>
                        <EmployeeDetailsTableRow>
                          <EmployeeDetailsTableCell>Email</EmployeeDetailsTableCell>
                          <EmployeeDetailsTableCell>{selectedEmployee.email}</EmployeeDetailsTableCell>
                        </EmployeeDetailsTableRow>
                        <EmployeeDetailsTableRow>
                          <EmployeeDetailsTableCell>Phone Number</EmployeeDetailsTableCell>
                          <EmployeeDetailsTableCell>{selectedEmployee.phoneNumber}</EmployeeDetailsTableCell>
                        </EmployeeDetailsTableRow>
                        <EmployeeDetailsTableRow>
                          <EmployeeDetailsTableCell>Job Title</EmployeeDetailsTableCell>
                          <EmployeeDetailsTableCell>{selectedEmployee.jobTitle}</EmployeeDetailsTableCell>
                        </EmployeeDetailsTableRow>
                        <EmployeeDetailsTableRow>
                          <EmployeeDetailsTableCell>Gender</EmployeeDetailsTableCell>
                          <EmployeeDetailsTableCell>{selectedEmployee.gender}</EmployeeDetailsTableCell>
                        </EmployeeDetailsTableRow>
                      </TableBody>
                    </EmployeeDetailsTable>
                  )}
                </StyledDialogContent>
        <StyledDialogContent>
          <p style={{ color: '#FF0000', fontWeight: "bold" }}>Are you sure you want to remove this employee?</p>
        </StyledDialogContent>
        <StyledDialogActions>
          <Button onClick={handleRemoveClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmRemove} color="primary">
            Confirm
          </Button>
        </StyledDialogActions>
      </StyledDialog>
    </StyledContainer>
  );
};

export default EmployeeTable;
