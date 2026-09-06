<script setup>
import { nextTick, ref } from 'vue'

const isOpen = ref(false)
const draft = ref('')
const messages = ref([
  { from: 'bot', text: 'Halo! Saya Ber.AI 🤖 — tanya apa saja seputar ikan, produk, atau ketelusuran di sini.' },
])
const chatBodyRef = ref(null)

function toggleWidget() {
  isOpen.value = !isOpen.value
}

async function scrollToBottom() {
  await nextTick()
  chatBodyRef.value?.scrollTo({ top: chatBodyRef.value.scrollHeight, behavior: 'smooth' })
}

async function sendMessage() {
  const text = draft.value.trim()
  if (!text) return
  messages.value.push({ from: 'user', text })
  draft.value = ''
  await scrollToBottom()
  setTimeout(async () => {
    messages.value.push({
      from: 'bot',
      text: 'Ber.AI sedang dalam pengembangan 🚧 — fitur tanya jawab otomatis akan segera hadir. Untuk saat ini, silakan hubungi kami lewat WhatsApp ya!',
    })
    await scrollToBottom()
  }, 500)
}
</script>

<template>
  <div class="ai-widget">
    <transition name="ai-fade">
      <v-card v-if="isOpen" class="ai-chat-panel" rounded="xl" elevation="8">
        <div class="ai-chat-header">
          <v-avatar color="white" size="36" class="mr-2">
            <v-icon icon="mdi-robot-happy" color="#2554C7" size="22" />
          </v-avatar>
          <div class="flex-grow-1">
            <div class="text-subtitle-2 font-weight-bold text-white">Ber.AI</div>
            <div class="text-caption ai-subtitle">Asisten AI seputar ikan</div>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" color="white" @click="toggleWidget" />
        </div>
        <div ref="chatBodyRef" class="ai-chat-body">
          <div v-for="(m, i) in messages" :key="i" class="ai-bubble-row" :class="{ 'ai-bubble-row--user': m.from === 'user' }">
            <div class="ai-bubble" :class="{ 'ai-bubble--user': m.from === 'user' }">{{ m.text }}</div>
          </div>
        </div>
        <div class="ai-chat-footer">
          <v-textarea
            v-model="draft"
            placeholder="Tanya sesuatu tentang ikan..."
            rows="1"
            auto-grow
            hide-details
            variant="outlined"
            density="compact"
            class="ai-input"
            @keydown.enter.exact.prevent="sendMessage"
          />
          <v-btn icon="mdi-send" color="#2554C7" class="ml-2" @click="sendMessage" />
        </div>
      </v-card>
    </transition>

    <v-btn
      class="ai-fab d-none d-sm-inline-flex"
      rounded="pill"
      color="#2554C7"
      size="large"
      prepend-icon="mdi-robot-happy"
      @click="toggleWidget"
    >
      Ber.AI
    </v-btn>
    <v-btn class="ai-fab d-sm-none" rounded="pill" color="#2554C7" size="large" icon="mdi-robot-happy" @click="toggleWidget" />
  </div>
</template>

<style scoped>
.ai-widget {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.ai-fab {
  color: white !important;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(37, 84, 199, 0.4) !important;
}
.ai-chat-panel {
  width: 320px;
  max-width: calc(100vw - 48px);
  margin-bottom: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.ai-chat-header {
  background: #2554c7;
  padding: 12px 16px;
  display: flex;
  align-items: center;
}
.ai-subtitle {
  color: rgba(255, 255, 255, 0.85);
}
.ai-chat-body {
  background: #f5f7fa;
  padding: 16px;
  min-height: 140px;
  max-height: 280px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.ai-bubble-row {
  display: flex;
  justify-content: flex-start;
}
.ai-bubble-row--user {
  justify-content: flex-end;
}
.ai-bubble {
  background: white;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 13.5px;
  max-width: 85%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.ai-bubble--user {
  background: #2554c7;
  color: white;
}
.ai-chat-footer {
  padding: 12px;
  display: flex;
  align-items: flex-end;
  background: white;
}
.ai-input {
  flex-grow: 1;
}
.ai-fade-enter-active,
.ai-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.ai-fade-enter-from,
.ai-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
