<template>
  <div class="container my-auto">

    <div v-if="page === 1">
        <label for="workerSelect">Select Worker</label><br>
        <select id="workerSelect" class="form-select" v-model="selectedWorker" @change="handleWorkerSelect">
            <option value="">Select Worker</option>
            <option v-for="worker in workers" :key="worker.id" :value="worker">{{ worker.name + ' ' + worker.surname }}</option>
        </select><br><br>

        <label for="dateSelect">Select Date</label>
        <VueDatePicker id="dateSelect" v-model="selectedDate" :enable-time-picker="false" auto-apply
        :disabled="!selectedWorker" :allowed-dates="allowedDatesByWorker">
        </VueDatePicker><br><br>


        <label for="timeSelect">Select Time</label><br>
        <select id="timeSelect" class="form-select" v-model="selectedInterval" :disabled="!formattedSelectedDate">
            <option value="">Select Time</option>
            <option v-for="(interval,index) in intervals" :key="index" :value="interval">{{ interval }}</option>
        </select><br><br>

        <label for="appointmentReason">Appointment Reason</label>
        <textarea id="appointmentReason" class="form-control" v-model="appointmentReason" maxlength="100" rows="4" cols="50"></textarea><br>

        <button class="btn btn-primary float-right" @click="this.page++;" :disabled="!selectedInterval">Next</button>
    </div>

    <div v-if="page === 2">
      <p><strong>Selected Worker</strong><br> {{ selectedWorker.name }} {{ selectedWorker.surname }}</p><br>
      <p><strong>Selected Date</strong><br> {{ formattedSelectedDate }}</p><br>
      <p><strong>Selected Time</strong><br> {{ selectedInterval }}</p><br>
      <p><strong>Appointment Reason</strong><br> {{ appointmentReason }}</p><br>

      <button class="btn btn-primary float-right" @click="confirmAppointment">Confirm an Appointment</button>
      <button class="btn btn-warning float-right mr-2" @click="this.page--;">Back</button>
    </div>

    <div v-if="page === 3">
        <div v-if="successMessage">
          <img src="\assets\img\success.png" style="max-width: 200px; height: auto; margin: 0 auto;"/><br>
          <p class="mb-3 fw-bold" style="font-size: large; text-align: center;"> {{ successMessage }} </p>
        </div>

        <div v-if="failureMessage" class="alert alert-warning alert-dismissible" role="alert">
          <img src="\assets\img\failure.png" style="max-width: 200px; height: auto; margin: 0 auto;"/><br>
          <p class="mb-3 fw-bold" style="font-size: large; text-align: center;"> {{ failureMessage }} </p>
        </div>
    </div>

  </div>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

import axios from 'axios';

export default {
  components: { 
    VueDatePicker
  },
  data() {
    return {
      page: 1,
      workers: [],
      selectedWorker: null,
      workdays: [],
      selectedDate: null,
      formattedSelectedDate: null,
      requestSelectedDateTimestamp: null,
      intervals: [],
      selectedInterval: null,
      appointmentReason: '',
      successMessage: '',
      failureMessage: '',
      token: this.$store.state.auth.token,
      studentId: this.$store.state.auth.id
    };
  },
  computed: {
    allowedDatesByWorker() {
        return this.workdays;
    }
  },
  mounted() {
    this.fetchWorkers();
  },
   watch: {
    selectedDate(selectedDate) {
      this.formattedSelectedDate = selectedDate.toISOString().split('T')[0];

      var requestDate = new Date(this.formattedSelectedDate + 'T00:00:00Z');
      this.requestSelectedDateTimestamp = requestDate.getTime();
      this.fetchIntervals(this.requestSelectedDateTimestamp);
    },
  },
  methods: {
    async fetchWorkers() {
      try {
        const response = await axios.get(`http://localhost:8082/student/${this.studentId}/workers?matchSpecializations=false`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        });

        this.workers = response.data;   
      } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error fetching workers:', error);
      }
    },
    handleWorkerSelect() {
      this.fetchWorkdays();
      this.formattedSelectedDate = null;
      this.selectedInterval = null;
    },
    async fetchWorkdays() {
      try {
        const response = await axios.get(`http://localhost:8082/student/${this.studentId}/worker/${this.selectedWorker.id}/workdays`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          }
        });
        this.workdays = response.data;  
      } catch (error) {
        // Handle any errors that occur during the request
        console.error('Error fetching workers:', error);
      }
    },
    async fetchIntervals(workday) {
        try {
            const response = await axios.get(`http://localhost:8082/student/${this.studentId}/worker/${this.selectedWorker.id}/workdays/${workday}/intervals`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        });
        this.intervals = response.data.intervals;   
      } catch (error) {
        console.error('Error fetching workers:', error);
      }
    },
    async confirmAppointment() {
        try {
            var formattedInterval = this.selectedInterval.split(' ')[0];

            var descriptionBody = {
                description: { 
                    description: this.appointmentReason
                }
            }

            const response = await axios.put(`http://localhost:8082/student/${this.studentId}/worker/${this.selectedWorker.id}/workdays/${this.requestSelectedDateTimestamp}/interval/${formattedInterval}`, descriptionBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                }, 
            });

            if (response.status === 201) {
                this.page++;
                this.successMessage = 'Appointment made successfully';
            } else {
                this.page++;
                this.failureMessage = 'Something went wrong during making an appointment';
            }
      } catch (error) {
            console.error('Error fetching workers:', error);
      }
    }
  },
};
</script>