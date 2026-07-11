<template>
  <div class="khqr-header">
    <button class="back-btn" @click="$router.back()">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
    </button>
    <img
      src="https://bakong.nbc.gov.kh/images/khqr-logo.svg"
      alt="KHQR"
      class="khqr-logo"
    />
  </div>
</template>

<style scoped>
.khqr-header {
  height: 70px;
  background: #EE1C25;
  border-radius: 32px 32px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  position: relative;
}

.back-btn {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.khqr-logo {
  height: 28px;
  width: auto;
}
</style>
