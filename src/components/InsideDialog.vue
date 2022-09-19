<template>
  <div class="formgrid grid">
    <div class="field col-12 md:col-6 pt-2 mt-3">
      <span class="p-float-label">
        <InputText id="inputtext" type="text" v-model="newMovie.titleValue" />
        <label for="inputtext">Title<span class="required"> *</span></label>
      </span>
    </div>
    <div class="field col md:col-6 pt-2 mt-3">
      <span class="p-float-label">
        <InputText
          id="inputtext"
          type="text"
          v-model="newMovie.directorValue"
        />
        <label for="inputtext">Director<span class="required"> *</span></label>
      </span>
    </div>
  </div>

  <div class="formgrid grid">
    <div class="field col pt-3">
      <label for="minmax-buttons">Year<span class="required"> *</span></label>
      <InputNumber
        inputId="minmax-buttons"
        v-model="newMovie.yearValue"
        mode="decimal"
        showButtons
        :min="1980"
        :max="2022"
      />
    </div>
    <div class="field col pl-8 mx-auto">
      <p>Rating<span class="required"> *</span></p>
      <Rating v-model="newMovie.ratingValue" :cancel="false" name="cancel" />
    </div>
    <div class="field col">
      <p>Genre<span class="required"> *</span></p>
      <Dropdown
        v-model="newMovie.genreValue"
        :options="genres"
        placeholder="Select a Genre"
      />
    </div>
  </div>

  <div class="pl-2">
    <p>Actors</p>
    <Textarea v-model="newMovie.actorsValue" :autoResize="true" rows="3" />
  </div>
  <div class="pl-2">
    <p>Plot</p>
    <Textarea v-model="newMovie.plotValue" :autoResize="true" rows="3" />
  </div>
</template>
  
  <script>
export default {
  emits: ["onSave"],
  props: ["chosenMovie"],
  mounted() {
    this.arrangeValue();
  },
  data() {
    return {
      newMovie: {
        titleValue: "",
        directorValue: "",
        actorsValue: "",
        yearValue: 1980,
        ratingValue: 1,
        plotValue: "",
        genreValue: "",
      },
      genres: [
        "Action",
        "Comedy",
        "Drama",
        "Horror",
        "Sci-fi",
        "Adventure",
        "Crime",
      ],
    };
  },
  methods: {
    save() {
      this.$emit("onSave", this.newMovie);
    },
    arrangeValue() {
      this.newMovie = {
        id: this.chosenMovie.id,
        titleValue: this.chosenMovie.title,
        directorValue: this.chosenMovie.director,
        yearValue: this.chosenMovie.year,
        ratingValue: this.chosenMovie.rating,
        genreValue: this.chosenMovie.genre,
        plotValue: this.chosenMovie.plot,
        actorsValue: this.chosenMovie.actors,
      };
    },
  },
};
</script>
  
  <style></style>
  