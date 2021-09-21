<template>
  <v-app>
    <v-main>
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
