//<!--===============================================================================================-->
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/app.css';
//<!--===============================================================================================-->
const App = () => {
  //<!--===============================================================================================-->
  const [errors, setErrors] = useState([]);
  const [users, setUsers] = useState([]);
  //<!--===============================================================================================-->
  const addSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    axios.post('http://127.0.0.1:8000/api/create', formData)
      .then(response => {
        window.location.reload();
      })
      .catch(error => {
        const errorMessages = Object.values(error.response.data.errors).flat();
        setErrors(errorMessages);
        $('#addModal').modal('hide');
      });
  };
  //<!--===============================================================================================-->
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/read')
      .then(response => {
        setUsers(response.data)
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  //<!--===============================================================================================-->
  useEffect(() => {
    const deleteButton = document.querySelector('.btn.btn-danger');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    const handleCheckboxChange = () => {
      const checkedCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked');
      const deleteButton = document.querySelector('.btn.btn-danger');

      if (checkedCheckboxes.length > 0) {
        deleteButton.classList.remove('d-none');
      } else {
        deleteButton.classList.add('d-none');
      }
    };

    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('click', handleCheckboxChange);
    });

    return () => {
      checkboxes.forEach(checkbox => {
        checkbox.removeEventListener('click', handleCheckboxChange);
      });
    };
  },);
  //<!--===============================================================================================-->
  const deleteSubmit = (e) => {
    e.preventDefault();

    const selectedIds = [];
    const checkboxes = e.target.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach((checkbox) => {
      selectedIds.push(checkbox.value);
    });

    if (selectedIds.length === 0) {
      console.log('No IDs selected for deletion');
      return;
    }

    const requestData = { id: selectedIds };

    axios.delete('http://127.0.0.1:8000/api/delete', { data: requestData })
      .then(response => {
        window.location.reload();
      })
      .catch(error => {
        const errorMessages = Object.values(error.response.data.errors).flat();
        setErrors(errorMessages);
      })
  }
  //<!--===============================================================================================-->
  const transferAttribute = (e) => {
    document.getElementById('editId').value = e.getAttribute('data-id');
    document.getElementById('editName').value = e.getAttribute('data-name');
    document.getElementById('editPhoneNumber').value = e.getAttribute('data-phone_number');
  }
  //<!--===============================================================================================-->
  const editSubmit = (e) => {
    e.preventDefault();

    const id = document.getElementById('editId').value;
    const name = document.getElementById('editName').value;
    const phone_number = document.getElementById('editPhoneNumber').value;

    const data = {
      id: id,
      name: name,
      phone_number: phone_number
    };
  
    axios.put('http://127.0.0.1:8000/api/update', data)
      .then(response => {
        window.location.reload();
      })
      .catch(error => {
        const errorMessages = Object.values(error.response.data.errors).flat();
        setErrors(errorMessages);
        $('#editModal').modal('hide');
      })
  }
  //<!--===============================================================================================-->
  return (
    <div>
      <div className="container p-3 p-md-5">
        {/* <!--===============================================================================================--> */}
        <form onSubmit={deleteSubmit}>
          <div className="row row-cols" id='logos'>
            <i class="col col-md-1 devicon-react-original-wordmark colored"></i>
            <i class="col col-md-1 devicon-laravel-original colored"></i>
            <i class="col col-md-1 devicon-bootstrap-plain colored"></i>
            <i class="col col-md-1 devicon-github-original-wordmark colored"></i>
            <i class="col col-md-1 devicon-npm-original-wordmark colored"></i>
          </div>
          <div className="d-flex flex-row gap-2 mt-3" id='btn'>
            <button className='btn btn-primary' data-bs-toggle="modal" data-bs-target="#addModal"><i className="bi bi-plus"></i>Add</button>
            <button type='submit' className='btn btn-danger d-none'><i className="bi bi-trash"></i>Delete</button>
          </div>
          {errors.map((error) => (
            <div className="alert alert-danger mt-3">{error}</div>
          ))}

          {users.map((user) => (
            <div className="border rounded p-3 d-flex flex-row justify-content-space-between gap-3 align-items-center mt-3">
              <input type="checkbox" name="id[]" value={user.id} />
              <div className="d-flex flex-column">
                <h1>{user.name}</h1>
                <h3>{user.phone_number}</h3>
              </div>
              <div className="d-flex align-items-center" id='editButton'>
                <i onClick={(e) => transferAttribute(e.target)} data-bs-toggle="modal" data-bs-target="#editModal" class="bi bi-pen" data-name={user.name} data-phone_number={user.phone_number} data-id={user.id}></i>
              </div>
            </div>
          ))}
        </form>
        {/* <!--===============================================================================================--> */}
      </div>
      {/* <!--===============================================================================================--> */}
      <form onSubmit={addSubmit}>
        <div className="modal fade" id="addModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Add</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body d-flex flex-column gap-3">
                <input className='p-3' type="text" name="name" id="" placeholder='Name' />
                <input className='p-3' type="text" name="phone_number" id="" placeholder='Phone Number' />
              </div>
              <div className="modal-footer justify-content-center">
                <button type="submit" className="btn btn-primary">Submit</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </form>
      {/* <!--===============================================================================================--> */}
      <form onSubmit={editSubmit}>
        <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Edit</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body d-flex flex-column gap-3">
                <input className='p-3' type="text" name="id" id="editId" disabled />
                <input className='p-3' type="text" name="name" id="editName" placeholder='Name' />
                <input className='p-3' type="text" name="phone_number" id="editPhoneNumber" placeholder='Phone Number' />
              </div>
              <div className="modal-footer justify-content-center">
                <button type="submit" className="btn btn-primary">Submit</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </form>
      {/* <!--===============================================================================================--> */}
    </div>
  );
};

export default App;
