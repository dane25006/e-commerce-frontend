<template>
  <div class="payment-status">
    <!-- Loading -->
    <div v-if="status === 'loading'" class="loading">
      <div class="spinner" />
      <p>Generating payment QR...</p>
    </div>

    <!-- Success -->
    <div v-else-if="status === 'success'" class="success">
      <div class="check-circle">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h3 class="success-title">Payment Successful</h3>
      <p class="success-desc">Your payment has been confirmed.</p>
      <button @click="$emit('done')" class="done-btn">Continue</button>
    </div>

    <!-- Error -->
    <div v-else-if="status === 'error'" class="error">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <p>{{ errorMessage || 'Payment verification failed.' }}</p>
      <button @click="$emit('retry')" class="retry-btn">Try Again</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  status: 'loading' | 'success' | 'error'
  errorMessage?: string
}>()

defineEmits<{
  retry: []
  done: []
}>()
</script>

<style scoped>
.payment-status {
  padding: 8px 24px 24px;
  text-align: center;
}

/* Loading */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid #E2E8F0;
  border-top-color: #EE1C25;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading p {
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #64748B;
  margin: 0;
}

/* Success */
.success {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.check-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #22C55E;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleIn {
  from { transform: scale(0); }
  to { transform: scale(1); }
}

.success-title {
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #1E293B;
  margin: 0;
}

.success-desc {
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  font-size: 14px;
  color: #64748B;
  margin: 0;
}

.done-btn {
  margin-top: 16px;
  padding: 12px 32px;
  border-radius: 100px;
  background: #1E293B;
  color: #fff;
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.done-btn:hover {
  background: #334155;
  transform: translateY(-1px);
}

/* Error */
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.error p {
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  font-size: 13px;
  color: #DC2626;
  margin: 0;
}

.retry-btn {
  margin-top: 8px;
  padding: 10px 24px;
  border-radius: 100px;
  background: #EE1C25;
  color: #fff;
  font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
  font-weight: 600;
  font-size: 13px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: #D9161F;
  transform: translateY(-1px);
}
</style>
