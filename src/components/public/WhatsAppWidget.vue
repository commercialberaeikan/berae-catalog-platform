<script setup>
import { ref } from 'vue'

const WHATSAPP_NUMBER = '6285778053118'
const isOpen = ref(false)
const message = ref('')

function toggleWidget() {
  isOpen.value = !isOpen.value
}

function sendMessage() {
  const text = message.value.trim() || 'Halo, saya ingin bertanya tentang produk PT Berae Segara Nusantara.'
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
  window.open(url, '_blank', 'noopener')
  message.value = ''
  isOpen.value = false
}
</script>

<template>
  <div class="wa-widget">
    <transition name="wa-fade">
      <v-card v-if="isOpen" class="wa-chat-panel" rounded="xl" elevation="8">
        <div class="wa-chat-header">
          <v-avatar color="white" size="36" class="mr-2">
            <v-icon icon="mdi-whatsapp" color="#25D366" size="22" />
          </v-avatar>
          <div class="flex-grow-1">
            <div class="text-subtitle-2 font-weight-bold text-white">PT Berae Segara Nusantara</div>
            <div class="text-caption wa-online"><span class="wa-dot" /> Online</div>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" color="white" @click="toggleWidget" />
        </div>
        <div class="wa-chat-body">
          <div class="wa-bubble">Halo! 👋 Ada yang bisa kami bantu terkait produk perikanan kami?</div>
        </div>
        <div class="wa-chat-footer">
          <v-textarea
            v-model="message"
            placeholder="Tulis pesan Anda..."
            rows="2"
            auto-grow
            hide-details
            variant="outlined"
            density="compact"
            class="wa-input"
            @keydown.enter.exact.prevent="sendMessage"
          />
          <v-btn icon="mdi-send" color="#25D366" class="ml-2" @click="sendMessage" />
        </div>
      </v-card>
    </transition>

    <v-btn class="wa-fab" rounded="pill" color="#25D366" size="large" prepend-icon="mdi-whatsapp" @click="toggleWidget">
      Pesan Sekarang
    </v-btn>
  </div>
</template>

<style scoped>
.wa-widget {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.wa-fab {
  color: white !important;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4) !important;
}
.wa-chat-panel {
  width: 320px;
  max-width: calc(100vw - 48px);
  margin-bottom: 16px;
  overflow: hidden;
}
.wa-chat-header {
  background: #25d366;
  padding: 12px 16px;
  display: flex;
  align-items: center;
}
.wa-online {
  color: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
}
.wa-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #7cffb2;
  display: inline-block;
  margin-right: 4px;
}
.wa-chat-body {
  background: #ece5dd;
  padding: 16px;
  min-height: 80px;
}
.wa-bubble {
  background: white;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 13.5px;
  max-width: 85%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.wa-chat-footer {
  padding: 12px;
  display: flex;
  align-items: flex-end;
  background: white;
}
.wa-input {
  flex-grow: 1;
}
.wa-fade-enter-active,
.wa-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.wa-fade-enter-from,
.wa-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
