<template>
  <v-container fluid grid-list-md>
    <v-data-iterator
      :items="[{ name: 'test' }]"
      :rows-per-page-items="rowsPerPageItems"
      :pagination.sync="pagination"
      content-tag="v-layout"
      row
      wrap
    >
      <v-flex
        slot="item"
        slot-scope="props"
        xs12
        sm6
        md4
        lg3
      >
        <v-card>
          <v-card-title>
            <h4>{{ props.item.name }}</h4>
          </v-card-title>
          <v-divider></v-divider>
          <v-list dense>
            <v-list-tile>
              <v-list-tile-content>Calories:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.calories }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Fat:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.fat }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Carbs:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.carbs }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Protein:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.protein }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Sodium:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.sodium }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Calcium:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.calcium }}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>Iron:</v-list-tile-content>
              <v-list-tile-content class="align-end">{{ props.item.iron }}</v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-flex>
    </v-data-iterator>
  </v-container>
</template>

<script>
export default {
  name: 'FileManager',
  data() {
    return {
      items: []
    }
  }
}
</script>

<style>
</style>