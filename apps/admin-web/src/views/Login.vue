<script setup lang="ts">
// Login Component
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-base-200">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center text-2xl mb-4">Login</h2>
        <div class="form-control w-full">
          <label class="label">
            <span class="label-text">Username</span>
          </label>
          <input type="text" placeholder="Type your username" class="input input-bordered w-full" />
        </div>
        <div class="form-control w-full mt-4">
          <label class="label">
            <span class="label-text">Password</span>
          </label>
          <input type="password" placeholder="Type your password" class="input input-bordered w-full" />
        </div>
        <div class="card-actions justify-end mt-6">
          <button class="btn btn-primary w-full">Sign In</button>
        </div>
        <div class="mt-4 text-center">
          <router-link to="/regist" class="link link-primary">Don't have an account? Register</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
