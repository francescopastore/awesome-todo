<template>
  <q-form @submit.prevent="onSubmit">
    <div class="row q-mb-md">
      <q-banner class="col bg-grey-3">
        <template v-slot:avatar>
          <q-icon name="account_circle" color="primary" />
        </template>
        {{ tab | capitalizeFirstLetter }} to see your todos anywhere!
      </q-banner>
    </div>
    <div class="row q-mb-md">
      <q-input
        class="col"
        :rules="[
          val =>
            isValidEmailAddress(val) || 'Please enter a valid email address.'
        ]"
        ref="email"
        outlined
        v-model="form.email"
        label="Email"
        lazy-rules
        type="email"
      />
    </div>
    <div class="row q-mb-md">
      <q-input
        class="col"
        outlined
        ref="password"
        v-model="form.password"
        :type="isPwd ? 'password' : 'text'"
        label="Password"
        :rules="[
          val =>
            val.length >= 6 ||
            'Please use a password with at least 6 characters.'
        ]"
      >
        <template v-slot:append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          /> </template
      ></q-input>
    </div>
    <div class="row q-mb-md">
      <q-space />
      <q-btn label="Reset" type="reset" flat class="q-ml-sm" />
      <q-btn type="submit" color="primary" :label="tab" />
    </div>
  </q-form>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: ['tab'],
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      isPwd: true
    }
  },
  methods: {
    ...mapActions('auth', ['registerUser', 'loginUser']),
    onSubmit() {
      if (this.tab == 'login') this.loginUser(this.form)
      else this.registerUser(this.form)
    },
    isValidEmailAddress(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(String(email).toLowerCase())
    }
  },
  filters: {
    capitalizeFirstLetter(value) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
}
</script>

<style></style>
