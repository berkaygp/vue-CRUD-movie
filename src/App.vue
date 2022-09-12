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
            @click="openModal4"
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
        :first="firstRecordIndex"
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
              @click="openModal2(slotProps.data)"
            ></Button>
            <Button
              type="button"
              class="ml-3"
              icon="pi pi-trash"
              style="height: 1.7rem"
              @click="openModal3(slotProps.data)"
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
      <a href="https://www.linkedin.com/in/mbgarip/" target="_blank"><i class="pi pi-linkedin text-blue-700"></i></a>
    </div>
  </div>
  <Dialog
    header="Add Movie"
    v-model:visible="displayModal"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '50vw' }"
    @update:visible="cleanForm"
    class="p-fluid"
  >
  <div class="formgrid grid">
    <div class="field col-12 md:col-6 pt-2 mt-3">
      <span class="p-float-label">
        <InputText id="inputtext" type="text" v-model="titleValue" />
        <label for="inputtext">Title</label>
      </span>
    </div>
    <div class="field col md:col-6 pt-2 mt-3">
      <span class="p-float-label">
        <InputText id="inputtext" type="text" v-model="directorValue" />
        <label for="inputtext">Director</label>
      </span>
    </div>
  </div>  
  <div class="formgrid grid">
    <div class="field col pt-3">
      <label for="minmax-buttons">Year</label>
      <InputNumber
        inputId="minmax-buttons"
        v-model="yearValue"
        mode="decimal"
        showButtons
        :min="1980"
        :max="2022"
      />
    </div>
    <div class="field col pl-8 mx-auto">
      <p>Rating</p>
      <Rating v-model="ratingValue" :cancel="false" name="cancel" />
    </div>
    <div class="field col ">
      <p>Genre</p>
      <Dropdown
        v-model="genreValue"
        :options="genres"
        placeholder="Select a Genre"
      />
    </div>
  </div>
  <div class="pl-2">
      <p>Actors</p>
      <Textarea v-model="actorsValue" :autoResize="true" rows="3"/>
    </div>
  <div class="pl-2">
      <p>Plot</p>
      <Textarea v-model="plotValue" :autoResize="true" rows="3"/>
    </div>

    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        @click="closeModal"
        class="p-button-text"
      />
      <Button label="Apply" icon="pi pi-check" @click="addMovie" autofocus />
    </template>
  </Dialog>

  <Dialog
    header="Edit Movie Info"
    v-model:visible="displayModal2"
    :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
    :style="{ width: '50vw' }"
    class="p-fluid"
  >
  <div class="formgrid grid">
    <div class="field col-12 md:col-6 pt-2 mt-3">
      <span class="p-float-label">
        <InputText id="inputtext" type="text" v-model="movie.title" />
        <label for="inputtext">Title</label>
      </span>
    </div>
    <div class="field col-12 md:col-6 pt-2 mt-3">
      <span class="p-float-label">
        <InputText id="inputtext" type="text" v-model="movie.director" />
        <label for="inputtext">Director</label>
      </span>
    </div>
  </div>
  <div class="formgrid grid">
    <div class="field col pt-3">
      <label for="minmax-buttons">Year</label>
      <InputNumber
        inputId="minmax-buttons"
        v-model="movie.year"
        mode="decimal"
        showButtons
        :min="1980"
        :max="2022"
      />
    </div>
    <div class="field col pl-8 mx-auto">
      <p>Rating</p>
      <Rating v-model="movie.rating" :cancel="false" name="cancel" />
    </div>
    <div class="field col">
      <p>Genre</p>
      <div class="mb-4">
        <Dropdown
        v-model="movie.genre"
        :options="genres"
        placeholder="Select a Genre"
      />
      </div>
      
    </div>
  </div>
  <div>
    <div>
      <p>Actors</p>
      <Textarea v-model="movie.actors" :autoResize="true" rows="3"/>
    </div>
    
    <div >
      <p>Plot</p>
      <Textarea v-model="movie.plot" :autoResize="true" rows="3"/>
    </div>
  </div>  
    <template #footer>
      <Button
        label="Cancel"
        icon="pi pi-times"
        @click="closeModal2"
        class="p-button-text"
      />
      <Button
        label="Apply"
        icon="pi pi-check"
        @click="saveMovieInfo"
        autofocus
      />
    </template>
  </Dialog>

  <Dialog
    header="Confirm Deletion"
    v-model:visible="displayModal3"
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
        @click="displayModal3 = false"
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
    v-model:visible="displayModal4"
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
        @click="displayModal4 = false"
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

export default {
  data() {
    return {
      filters: null,
      selectedMovies: null,
      displayModal: false,
      displayModal2: false,
      displayModal3: false,
      displayModal4: false,
      data: [],
      movie: {},
      genres: [
        "Action",
        "Comedy",
        "Drama",
        "Horror",
        "Sci-fi",
        "Adventure",
        "Crime",
      ],
      titleValue: "",
      directorValue: "",
      actorsValue: "",
      yearValue: 1980,
      ratingValue: 1,
      plotValue: "",
      genreValue: "",
    };
  },
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
    cleanForm() {
      this.titleValue = "";
      this.directorValue = "";
      this.actorsValue = "";
      this.yearValue = 1980;
      this.ratingValue = 1;
      this.plotValue = "";
      this.genreValue = "";
    },
    openModal() {
      this.cleanForm();
      this.displayModal = true;
    },
    closeModal() {
      this.displayModal = false;
    },
    openModal2(movie) {
      this.movie = { ...movie };
      this.displayModal2 = true;
    },
    closeModal2() {
      this.displayModal2 = false;
    },
    openModal3(movie) {
      this.movie = movie;
      this.displayModal3 = true;
    },
    openModal4(movie) {
      this.movie = movie;
      this.displayModal4 = true;
    },
    addMovie() {
      this.data.push({
        id: this.createId(),
        title: this.titleValue,
        director: this.directorValue,
        actors: this.actorsValue,
        year: this.yearValue,
        rating: this.ratingValue,
        plot: this.plotValue,
        genre: this.genreValue,
      });
      this.titleValue = "";
      this.directorValue = "";
      this.yearValue = "";
      this.ratingValue = "";
      this.genreValue = "";
      this.displayModal = false;
    },
    deleteMovie() {
      this.data = this.data.filter((val) => val.title !== this.movie.title);
      this.displayModal3 = false;
    },
    deleteSelectedMovies() {
      this.data = this.data.filter((val) => !this.selectedMovies.includes(val));
      this.displayModal4 = false;
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
    saveMovieInfo() {
      if (this.movie.id) {
        this.data[this.findIndexById(this.movie.id)] = this.movie;
      } else {
        this.movie.id = this.createId();
        this.data.push(this.movie);
      }
      this.closeModal2();
    },
    clearFilter1() {
      this.initFilters();
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
