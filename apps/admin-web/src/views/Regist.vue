<script setup lang="ts">
// Regist Component
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-base-200">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center text-2xl mb-4">Register</h2>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Username</span>
          </label>
          <input type="text" placeholder="Choose a username" class="input input-bordered w-full" />
        </div>
        <div class="form-control w-full mt-4">
          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input type="password" placeholder="Choose a password" class="input input-bordered w-full" />
        </div>
        <div class="card-actions justify-end mt-6">
          <button class="btn btn-primary w-full">Sign Up</button>
        </div>
        <div class="mt-4 text-center">
          <router-link to="/login" class="link link-primary">Already have an account? Login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
