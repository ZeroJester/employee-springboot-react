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
  LinearProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Pagination
} from '@mui/material';
import Stack from '@mui/material/Stack';
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
  '&:hover': {
    backgroundColor: '#f1f1f1',
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
      width: '30%',
    },
});

const PAGE_SIZE = 3;

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [remove, setRemove] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState(null);
  const [editedEmployeeData, setEditedEmployeeData] = useState({});
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('ID');
  const [currentPage, setCurrentPage] = useState(1);
  const [newEmployeeData, setNewEmployeeData] = useState({
    fullname: '',
    email: '',
    phoneNumber: '',
    jobTitle: '',
    gender: ''
  });

const handleAddInputChange = (e) => {
  const { name, value } = e.target;
  setNewEmployeeData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

const handleAddSubmit = () => {
  fetch('/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newEmployeeData),
  })
    .then((response) => response.json())
    .then((data) => {
      fetchEmployees(); // Refresh the employee table
      handleAddClose();
    })
    .catch((error) => {
      console.error('Error adding employee:', error);
    });
};


const handleAddOpen = () => {
  setAddOpen(true);
};

const handleAddClose = () => {
  setAddOpen(false);
  setNewEmployeeData({
    fullname: '',
    email: '',
    phoneNumber: '',
    jobTitle: '',
    gender: ''
  });
};

const fetchEmployees = () => {
  setLoading(true);
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
};

 useEffect(() => {
   fetchEmployees();
 }, []);

const handleRequestSort = (property) => {
  const isAsc = orderBy === property && order === 'asc';
  setOrder(isAsc ? 'desc' : 'asc');
  setOrderBy(property);
};

const [searchQuery, setSearchQuery] = useState("");

const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredEmployees = employees.filter((employee) =>
     employee.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
     employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
     employee.phoneNumber.includes(searchQuery) ||
     employee.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
     employee.gender.toLowerCase().includes(searchQuery.toLowerCase())
   );


   const sortedEmployees = filteredEmployees.sort((a, b) => {
     if (orderBy === 'fullname') {
       return order === 'asc'
         ? a.fullname.localeCompare(b.fullname)
         : b.fullname.localeCompare(a.fullname);
     } else if (orderBy === 'email') {
       return order === 'asc'
         ? a.email.localeCompare(b.email)
         : b.email.localeCompare(a.email);
     } else if (orderBy === 'phoneNumber') {
       return order === 'asc'
         ? a.phoneNumber.localeCompare(b.phoneNumber)
         : b.phoneNumber.localeCompare(a.phoneNumber);
     } else if (orderBy === 'jobTitle') {
       return order === 'asc'
         ? a.jobTitle.localeCompare(b.jobTitle)
         : b.jobTitle.localeCompare(a.jobTitle);
     } else if (orderBy === 'gender') {
       return order === 'asc'
         ? a.gender.localeCompare(b.gender)
         : b.gender.localeCompare(a.gender);
     } else {
       return 0;
     }
   });

  const handleViewClick = (employee) => {
    setSelectedEmployee(employee);
    setViewOpen(true);
  };

  const handleConfirmRemove = () => {
    fetch(`/remove/${selectedEmployee.id}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.ok) {
        setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== selectedEmployee.id));
        fetchEmployees();
        handleRemoveClose();
        setRemove(false);
      } else {
        throw new Error('Failed to remove employee');
      }
    })
    .catch(error => {
      console.error('Error removing employee:', error);
    });
  }

const handleEditClick = (employee) => {
  setEditedEmployee(employee);
    setEditedEmployeeData({
      id: employee.id,
      fullname: employee.fullname,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      jobTitle: employee.jobTitle,
      gender: employee.gender,
    });
    setEditOpen(true);
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
        fetchEmployees();
        handleEditClose();
        setEditMode(false);
      } else {
        throw new Error('Failed to update employee');
      }
    })
    .catch((error) => {
      console.error('Error updating employee:', error);
    });
};

  const handleViewClose = () => {
    setViewOpen(false);
    setSelectedEmployee(null);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditedEmployee(null);
  };

  const handleRemoveClick = (employee) => {
    setSelectedEmployee(employee);
    setRemove(true);
  }

  const handleRemoveClose = () => {
    setRemove(false);
    setSelectedEmployee(null);
  }

  const totalPages = Math.ceil(filteredEmployees.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = currentPage * PAGE_SIZE;
  const currentEmployees = sortedEmployees.slice(startIndex, endIndex);
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  if (currentEmployees.length === 0) {
    return (
      <StyledContainer>
        <Typography>No employees found.</Typography>
      </StyledContainer>
    );
  }

  if (loading) {
    return (
      <StyledContainer>
        <LinearProgress color="success" />
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
      <StyledTypography style = {{padding: "30px 0px"}} variant="h4" component="h2" gutterBottom>
        Employee List
      </StyledTypography>
      <TextField id="outlined-basic" label="Type to search" variant="outlined" style = {{margin: "20px 3%"}} onChange={handleSearchChange}/>
      <StyledTableContainer component={Paper}>
        <Table>
          <StyledTableHead>
             <TableRow>
               <StyledTableCell onClick={() => handleRequestSort('id')}>ID</StyledTableCell>
               <StyledTableCell onClick={() => handleRequestSort('fullname')}>Full Name</StyledTableCell>
               <StyledTableCell onClick={() => handleRequestSort('email')}>Email</StyledTableCell>
               <StyledTableCell onClick={() => handleRequestSort('phoneNumber')}>Phone Number</StyledTableCell>
               <StyledTableCell onClick={() => handleRequestSort('jobTitle')}>Job Title</StyledTableCell>
               <StyledTableCell onClick={() => handleRequestSort('gender')}>Gender</StyledTableCell>
               <StyledTableCell>Actions</StyledTableCell>
             </TableRow>
          </StyledTableHead>
          <TableBody>
            {currentEmployees.map((employee) => (
              <StyledTableRow key={employee.id}>
                <TableCell>{employee.id}</TableCell>
                <TableCell>{employee.fullname}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phoneNumber}</TableCell>
                <TableCell>{employee.jobTitle}</TableCell>
                <TableCell>{employee.gender}</TableCell>
                <TableCell>
                  <IconButton aria-label="view" color="primary" onClick={() => handleViewClick(employee)}>
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
       <Button
         variant="outlined"
         style={{ marginTop: "50px", fontWeight: "bold" }}
         onClick={handleAddOpen}
       >
         Add Employee
       </Button>

<StyledDialog open={addOpen} onClose={handleAddClose}>
  <StyledDialogTitle>Add New Employee</StyledDialogTitle>
  <StyledDialogContent>
    <form>
      <TextField
        name="fullname"
        label="Full Name"
        value={newEmployeeData.fullname}
        onChange={handleAddInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="email"
        label="Email"
        value={newEmployeeData.email}
        onChange={handleAddInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="phoneNumber"
        label="Phone Number"
        value={newEmployeeData.phoneNumber}
        onChange={handleAddInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="jobTitle"
        label="Job Title"
        value={newEmployeeData.jobTitle}
        onChange={handleAddInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        name="gender"
        label="Gender"
        value={newEmployeeData.gender}
        onChange={handleAddInputChange}
        fullWidth
        margin="normal"
      />
    </form>
  </StyledDialogContent>
  <StyledDialogActions>
    <Button onClick={handleAddClose} color="primary">
      Cancel
    </Button>
    <Button onClick={handleAddSubmit} color="primary">
      Save
    </Button>
  </StyledDialogActions>
</StyledDialog>


      <StyledDialog open={viewOpen} onClose={handleViewClose}>
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
          <Button onClick={handleViewClose} color="primary">
            Close
          </Button>
        </StyledDialogActions>
      </StyledDialog>



<StyledDialog open={editOpen} onClose={handleEditClose}>
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
    <Button onClick={handleEditClose} color="primary">
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
      <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
              style={{ marginTop: '20px' }}
            />
    </StyledContainer>
  );
};

export default EmployeeTable;
