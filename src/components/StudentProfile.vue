<template>
  <div class="container" style="margin-left: 35%">
    <h2 class="mb-3 fw-bold" style="font-size: large;">Student Informations</h2><br>

    <h2 class="mb-3 fw-bold">Personal Data</h2>

    <div v-if="!editingName" class="d-flex align-items-center">
      <p><strong>Name:</strong><br> {{ studentName }}
        <i @click="editStudentName" class="fas fa-pencil-alt ms-2" style="cursor: pointer;"></i>
      </p>
    </div>
    <div v-else>
        <div class="d-flex align-items-center">
          <p><strong>New Name:</strong><br> 
            <input type="text" class="form-control" id="newName" v-model="newName" placeholder="Enter new name">
            <i @click="saveStudentName" class="fas fa-check mr-2"></i>
            <i @click="cancelEditName" class="fas fa-times"></i>
          </p>
        </div>
    </div><br>

    <div v-if="!editingSurname" class="d-flex align-items-center">
      <p><strong>Surname:</strong><br> {{ studentSurname }}
        <i @click="editStudentSurname" class="fas fa-pencil-alt ms-2" style="cursor: pointer;"></i>
      </p>
    </div>
    <div v-else>
        <div class="d-flex align-items-center">
          <p><strong>New Surname:</strong><br> 
            <input type="text" class="form-control" id="newSurname" v-model="newSurname" placeholder="Enter new surname">
            <i @click="saveStudentSurname" class="fas fa-check mr-2"></i>
            <i @click="cancelEditSurname" class="fas fa-times"></i>
          </p>
        </div>
    </div><br><br>

    <h2 class="mb-3 fw-bold">Bringing Studies</h2>
    <div class="d-flex align-items-center">
      <select class="form-select" style="width: 30%;">
        <option>Select</option>
      </select>
      <i @click="addNewItem" class="fas fa-plus ml-5"></i>
    </div><br><br>

    <div>
      <ul class="list-group">
        <li v-for="item in specializationMajorYear" :key="item.id" class="list-group-item" style="width: 30%;">
          {{ item.specialization.name }} - {{ item.specialization.course }} - {{ ' Year ' + item.majorYear.year }}
          <i @click="deleteSpecializationMajorYear(item.id)" class="fas fa-trash ml-3"></i>
        </li>
      </ul>
  </div>


  </div>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css';
import axios from 'axios';

export default {
  data() {
    return {
      specializationMajorYear: [],
      studentName: 'John',
      newName: '',
      editingName: false,
      studentSurname: 'Doe',
      newSurname: '',
      editingSurname: false,
      token: localStorage.getItem('token') || ''
    };
  },
  mounted() {
    this.fetchStudentSpecializationMajorYear();
  },
  methods: {
    async fetchStudentSpecializationMajorYear() {
      const studentId = 1;
      try {
        const response = await axios.get(`http://localhost:8082/student/${studentId}/own-major-details`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.specializationMajorYear = response.data;
        console.log(response.data);
      } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error fetching workers:', error);
      }
    },
    async deleteSpecializationMajorYear(specializationMajorYearId) {
      const studentId = 1;
      try {
        await axios.delete(`http://localhost:8082/student/${studentId}/own-major-details/${specializationMajorYearId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.fetchStudentSpecializationMajorYear();
      } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error fetching workers:', error);
      }
    },
    editStudentName() {
      this.newName = this.studentName;
      this.editingName = true;
    },
    saveStudentName() {
      this.studentName = this.newName;
      this.editingName = false;
      // Optionally, send a request to update the student's name to a server
    },
    cancelEditName() {
      this.editingName = false;
    },
    editStudentSurname() {
      this.newSurname = this.studentSurname;
      this.editingSurname = true;
    },
    saveStudentSurname() {
      this.studentSurname = this.newSurname;
      this.editingSurname = false;
      // Optionally, send a request to update the student's name to a server
    },
    cancelEditSurname() {
      this.editingSurname = false;
    }
  }
};
</script>