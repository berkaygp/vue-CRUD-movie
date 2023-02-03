<template>
  <div>
    <h1>Movies</h1>
    <div class="table-wrap">
      <ToolBar>
        <template #start>
          <Button
            class="p-button-rounded"
            label="Add Movie"
            icon="pi pi-plus"
            @click="openModal"
          />
          <Button
            class="p-button-rounded ml-2"
            label="Delete"
            icon="pi pi-trash"
            @click="openConfirmModal2"
            :disabled="!selectedMovies || !selectedMovies.length"
          />
        </template>
        <template #end>
          <FileUpload
            label="Import"
            chooseLabel="Import"
            mode="basic"
            name="demo[]"
            url="./upload"
            class="p-button-rounded mr-2"
          />
          <Button
            icon="pi pi-external-link"
            label="Export"
            @click="exportCSV($event)"
            class="p-button-rounded"
          />
        </template>
      </ToolBar>
      <DataTable
        :value="data"
        ref="dt"
        dataKey="id"
        responsiveLayout="scroll"
        :paginator="true"
        :rows="10"
        showGridlines
        class="p-datatable-sm"
        v-model:filters="filters"
        v-model:selection="selectedMovies"
        filterDisplay="menu"
        :globalFilterFields="['title', 'director', 'year', 'rating', 'genre']"
      >
        <template #header>
          <div class="flex justify-content-between">
            <Button
              type="button"
              icon="pi pi-filter-slash"
              label="Clear"
              class="p-button-outlined"
              @click="clearFilter1()"
            />
            <span class="p-input-icon-left">
              <i class="pi pi-search" />
              <InputText
                v-model="filters['global'].value"
                placeholder="Keyword Search"
              />
            </span>
          </div>
        </template>
        <template #empty> No customers found. </template>

        <Column selectionMode="multiple" headerStyle="width: 3em"></Column>
        <Column field="title" header="Title" :sortable="true"></Column>
        <Column field="director" header="Director" :sortable="true"></Column>
        <Column field="year" header="Year" :sortable="true"></Column>
        <Column field="rating" header="Rating" :sortable="true">
          <template #body="slotProps">
            <Rating
              v-model="slotProps.data.rating"
              :readonly="true"
              :stars="5"
              :cancel="false"
              name="readonly"
            />
          </template>
        </Column>
        <Column field="genre" header="Genre" :sortable="true"></Column>
        <Column field="edit" :exportable="false">
          <template #body="slotProps">
            <Button
              type="button"
              icon="pi pi-pencil"
              style="height: 1.7rem"
              @click="openModal(slotProps.data)"
            ></Button>
            <Button
              type="button"
              class="ml-3"
              icon="pi pi-trash"
              style="height: 1.7rem"
              @click="openConfirmModal(slotProps.data)"
            ></Button>
          </template>
        </Column>
        <template #footer>
          In total there are {{ data ? data.length : 0 }} movies.
        </template>
      </DataTable>
    </div>
    <div class="p-3 info">
      Muhammet Berkay Garip
      <a href="https://www.linkedin.com/in/mbgarip/" target="_blank"
        ><i class="pi pi-linkedin text-blue-700"></i
      ></a>
    </div>
  </div>
  <Dialog
    header="Movie Info"
    v-model:visible="displayModal"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '50vw' }"
    @update:visible="clearForm"
    class="p-fluid"
  >
    <InsideDialog
      @onSave="onClickAddProduct"
      :chosenMovie="selectedMovie"
      ref="editModal"
    ></InsideDialog>
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        @click="closeModal"
        class="p-button-text"
      />
      <Button label="Apply" icon="pi pi-check" @click="addMovie" />
    </template>
  </Dialog>

  <Dialog
    header="Confirm Deletion"
    v-model:visible="displayConfirmModal"
    :style="{ width: '450px' }"
  >
    <div>
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span>Do you want to delete movie?</span>
    </div>
    <template #footer>
      <Button
        label="No"
        icon="pi pi-times"
        class="p-button-text"
        @click="displayConfirmModal = false"
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        class="p-button-text"
        @click="deleteMovie"
      />
    </template>
  </Dialog>

  <Dialog
    header="Confirm Deletion"
    v-model:visible="displayConfirmModal2"
    :style="{ width: '450px' }"
  >
    <div>
      <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
      <span>Do you want to delete selected movies?</span>
    </div>
    <template #footer>
      <Button
        label="No"
        icon="pi pi-times"
        class="p-button-text"
        @click="displayConfirmModal2 = false"
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        class="p-button-text"
        @click="deleteSelectedMovies"
      />
    </template>
  </Dialog>
</template>

<script>
import { FilterMatchMode } from "primevue/api";
import InsideDialog from "./components/InsideDialog.vue";

export default {
  data() {
    return {
      titleValue: "",
      directorValue: "",
      actorsValue: "",
      yearValue: 1980,
      ratingValue: 1,
      plotValue: "",
      genreValue: "",
      selectedMovie: [],
      filters: null,
      selectedMovies: null,
      displayModal: false,
      displayConfirmModal: false,
      displayConfirmModal2: false,
      data: [],
      movie: {},
    };
  },
  components: { InsideDialog },
  created() {
    this.initFilters();
  },
  mounted() {
    if (localStorage.data) {
      this.data = JSON.parse(localStorage.data);
    }
  },
  watch: {
    data: {
      handler(newMovies) {
        localStorage.data = JSON.stringify(newMovies);
      },
      deep: true,
    },
  },
  methods: {
    exportCSV() {
      this.$refs.dt.exportCSV();
    },
    clearForm() {
      this.titleValue = "";
      this.directorValue = "";
      this.actorsValue = "";
      this.yearValue = 1980;
      this.ratingValue = 1;
      this.plotValue = "";
      this.genreValue = "";
    },
    openModal(event) {
      if (event.id) {
        this.selectedMovie = event;
      } else {
        this.selectedMovie = {
          id: null,
          title: this.titleValue,
          director: this.directorValue,
          actors: this.actorsValue,
          year: this.yearValue,
          rating: this.ratingValue,
          plot: this.plotValue,
          genre: this.genreValue,
        };
      }
      this.clearForm();
      this.displayModal = true;
    },
    closeModal() {
      this.displayModal = false;
    },
    openConfirmModal(movie) {
      this.movie = movie;
      this.displayConfirmModal = true;
    },
    openConfirmModal2(movie) {
      this.movie = movie;
      this.displayConfirmModal2 = true;
    },
    addMovie() {
      this.$refs.editModal.save();
      this.titleValue = "";
      this.directorValue = "";
      this.yearValue = 1980;
      this.ratingValue = 1;
      this.genreValue = "";
      this.displayModal = false;
    },
    deleteMovie() {
      this.data = this.data.filter((val) => val.title !== this.movie.title);
      this.displayConfirmModal = false;
    },
    deleteSelectedMovies() {
      this.data = this.data.filter((val) => !this.selectedMovies.includes(val));
      this.displayConfirmModal2 = false;
      this.selectedMovies = null;
    },
    createId() {
      let id = "";
      var chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
    },
    findIndexById(id) {
      let index = -1;
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].id === id) {
          index = i;
          break;
        }
      }
      return index;
    },
    clearFilter1() {
      this.initFilters();
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
    },
    onClickAddProduct(newMovie) {
      if (newMovie.id) {
        this.data[this.findIndexById(newMovie.id)] = {
          id: newMovie.id,
          title: newMovie.titleValue,
          director: newMovie.directorValue,
          actors: newMovie.actorsValue,
          year: newMovie.yearValue,
          rating: newMovie.ratingValue,
          plot: newMovie.plotValue,
          genre: newMovie.genreValue,
        };
      } else {
        this.data.push({
          id: this.createId(),
          title: newMovie.titleValue,
          director: newMovie.directorValue,
          actors: newMovie.actorsValue,
          year: newMovie.yearValue,
          rating: newMovie.ratingValue,
          plot: newMovie.plotValue,
          genre: newMovie.genreValue,
        });
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

info {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

.required {
  color: red;
}
</style>
