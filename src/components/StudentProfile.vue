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
      <select class="form-select" v-model="selectedSpecializationMajorYearId" style="width: 30%;">
        <option v-for="item in filteredSpecializationMajorYear" :key="item.id" :value="item.id">
          {{ item.specialization.name }} - {{ item.specialization.course }} - {{ ' Year ' + item.majorYear.year }}</option>
      </select>
      <i @click="addNewSpecializationToStudent()" class="fas fa-plus ml-5"></i>
    </div><br><br>

    <div>
      <ul class="list-group">
        <li v-for="item in studentSpecializationMajorYear" :key="item.id" class="list-group-item" style="width: 30%;">
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
      filteredSpecializationMajorYear: [],
      selectedSpecializationMajorYearId: null,
      studentSpecializationMajorYear: [],
      studentName: 'John',
      newName: '',
      editingName: false,
      studentSurname: 'Doe',
      newSurname: '',
      editingSurname: false,
      token: this.$store.state.auth.token,
      studentId: this.$store.state.auth.id
    };
  },
  mounted() {
    this.fetchStudentData();
    this.fetchStudentSpecializationMajorYear();
  },
  methods: {
    async fetchStudentData() {
      try {
        const response = await axios.get(`http://localhost:8082/student/${this.studentId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.studentName = response.data.name;
        this.studentSurname = response.data.surname;
      } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error fetching workers:', error);
      }
    },
    async fetchSpecializationMajorYear() {
      try {
        const response = await axios.get(`http://localhost:8082/student/${this.studentId}/specialization-major-year`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.specializationMajorYear = response.data;

        this.filteredSpecializationMajorYear = this.specializationMajorYear.filter((specialization) => {
          return !this.studentSpecializationMajorYear.some((studentSpecialization) => studentSpecialization.id === specialization.id);
        });

        if (this.filteredSpecializationMajorYear.length > 0) {
          this.selectedSpecializationMajorYearId = this.filteredSpecializationMajorYear[0].id;
        }
      } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error fetching workers:', error);
      }
    },
    async fetchStudentSpecializationMajorYear() {
      try {
        const response = await axios.get(`http://localhost:8082/student/${this.studentId}/own-major-details`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.studentSpecializationMajorYear = response.data;

        if(this.specializationMajorYear != []) {
          this.fetchSpecializationMajorYear();
        }
      } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error fetching workers:', error);
      }
    },
    async updateStudentData() {
       var putName = this.studentName;
       var putSurname = this.studentSurname;

      try {
        await axios.put(`http://localhost:8082/student/${this.studentId}`, {
          name: putName,
          surname: putSurname
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        });
      } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error fetching workers:', error);
      }
    },
    async deleteSpecializationMajorYear(specializationMajorYearId) {
      try {
        await axios.delete(`http://localhost:8082/student/${this.studentId}/own-major-details/${specializationMajorYearId}`, {
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
      this.updateStudentData();
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
      this.updateStudentData();
    },
    cancelEditSurname() {
      this.editingSurname = false;
    },
    async addNewSpecializationToStudent() {
      const specializationMajorYearId = this.selectedSpecializationMajorYearId;
      try {
        await axios.post(`http://localhost:8082/student/${this.studentId}/own-major-details`, {
          specializationMajorYearId
        }, {
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
    }
  }
};
</script>