<template>
  <v-app>
    <v-main :style="{backgroundColor: '#badbff', width: '100vw', height: '100vh' }" class="d-flex align-center">
      <Main/>
    </v-main>
  </v-app>
</template>

<script>
import Main from './pages/Main';

export default {
  name: 'App',

  components: {
    Main,
  },

  data: () => ({
    //
  }),
};
</script>
