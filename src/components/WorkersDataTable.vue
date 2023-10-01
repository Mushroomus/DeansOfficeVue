<template>
  <div class="flex flex-col">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Surname
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Phone number
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Email
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Room
          </th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Options
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="worker in paginatedData" :key="worker.id">
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ worker.name }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ worker.surname }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ worker.phoneNumber }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ worker.email }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ worker.room }}</td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            <button @click="editItem(worker)" class="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
            </button>
            <button @click="deleteItem(worker.id)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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
</template>

<script>
export default {
  data() {
    return {
      workers: [],
      pageSize: 5,
      currentPage: 1,
      token: localStorage.getItem('token') || ''
    };
  },
  mounted() {
     fetch('http://localhost:8082/admin/1/workers', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
  })
      .then(response => response.json())
      .then(data => {
        this.workers = data;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  },
  methods: {
    deleteItem(itemId) {
      console.log(itemId);
    },
    editItem(item) {
      console.log(item);
    },
    goToPage(page) {
      this.currentPage = page;
    },
  },
  computed: {
    paginatedData() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      return this.workers.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.workers.length / this.pageSize);
    },
  },
};
</script>
