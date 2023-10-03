<template>
  <div class="flex flex-col">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Worker
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Time
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Description
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="appointment in paginatedData" :key="appointment.appointmentId">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ appointment.workerName + ' ' + appointment.workerSurname }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ appointment.date }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ appointment.startInterval + ' - ' + appointment.endInterval }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ appointment.description }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getAppointmentStatus(appointment.date) }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <button v-if="getAppointmentStatus(appointment.date) === 'Pending'" @click="showCancelAppointmentModal(appointment.appointmentId)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
           </td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-center mt-4">
      <nav class="flex items-center" aria-label="Pagination">
        <button
          :disabled="currentPage === 1"
          @click="goToPage(currentPage - 1)"
          class="px-3 py-1 text-sm rounded-md mr-2"
        >
          Previous
        </button>
        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page)"
          :class="{ 'bg-gray-900 text-white': currentPage === page }"
          class="px-3 py-1 text-sm rounded-md mr-2"
        >
          {{ page }}
        </button>
        <button
          :disabled="currentPage === totalPages"
          @click="goToPage(currentPage + 1)"
          class="px-3 py-1 text-sm rounded-md"
        >
          Next
        </button>
      </nav>
    </div>
  </div>

  <!-- Cancel Appointment Modal -->
  <div class="cancel-appointment-modal" v-if="showModal">
    <div class="modal-content">
      <p>Are you sure you want to cancel that appointment?</p><br>
      <div style="display:flex; align-items: center;">
        <button class="btn btn-warning" style="width: 150px; margin-right: 5px;" @click="closeModal">Close</button>
        <button class="btn btn-primary" style="width: 150px;" @click="confirmCancellationModal">Confirm</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      appointments: [],
      pageSize: 5,
      currentPage: 1,
      showModal: false,
      appointmentToCancel: null,
      token: this.$store.state.auth.token,
      studentId: this.$store.state.auth.id
    };
  },
  mounted() {
    this.fetchStudentAppointments();
  },
  methods: {
    async fetchStudentAppointments() {
      try {
        const response = await axios.get(`http://localhost:8082/student/${this.studentId}/appointments`, {
          headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
          }
        })
        this.appointments = response.data;
      } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error fetching workers:', error);
      }
    },
    getAppointmentStatus(appointmentDate) {
      const currentDate = new Date();
      const appointmentDateObj = new Date(appointmentDate);
      
      if (appointmentDateObj > currentDate) {
        return 'Pending';
      } else {
        return 'Done';
      }
    },
    showCancelAppointmentModal(appointmentId) {
      this.appointmentToCancel = appointmentId;
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async confirmCancellationModal() {  
      try {
        await axios.get(`http://localhost:8082/student/${this.studentId}/appointment/${this.appointmentToCancel}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.fetchStudentAppointments();
        this.showModal = false;
      } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error fetching workers:', error);
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
  },
  computed: {
    // ...mapState('auth', ['token', 'role', 'id']),
    paginatedData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.appointments.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.appointments.length / this.pageSize);
    },
  },
};
</script>

<style scoped>
.cancel-appointment-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}
</style>




