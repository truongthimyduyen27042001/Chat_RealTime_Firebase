<template>
  <div class="chat-container">
    <div class="panel panel-primary chat-panel">
      <div class="panel-heading">
        <h3 class="panel-title">
          <span class="glyphicon glyphicon-comment"></span>
          Chat Room
          <span class="pull-right" style="display: flex; align-items: center; gap: 12px;">
            <img
              src="https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2281862025.jpg"
              class="img-circle" width="32" height="32" v-if="user.photoURL" />
            <span v-if="user.displayName">{{ user.displayName }}</span>
            <button class="btn btn-danger btn-xs" @click="logout" style="margin-left: 12px;">
              <span class="glyphicon glyphicon-log-out"></span> Logout
            </button>
          </span>
        </h3>
      </div>
      <div class="panel-body" style="height: 400px; overflow-y: auto; width: 100%" ref="chatBody">
        <ul class="chat list-unstyled">
          <li
            v-for="msg in messages"
            :key="msg.id"
            :class="{ right: msg.uid === user.uid, left: msg.uid !== user.uid }"
          >
            <span class="chat-img" :class="msg.uid === user.uid ? 'pull-right' : 'pull-left'">
              <img
                src="https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2281862025.jpg"
                class="img-circle"
                width="32"
                height="32"
              />
            </span>
            <div class="chat-body clearfix">
              <div class="header" style="display: flex; justify-content: space-between; align-items: center;">
                <strong class="primary-font">{{ msg.displayName }}</strong>
                <small class="pull-right">{{ formatTime(msg.createdAt) }}</small>
              </div>
              <p style="display: flex;">{{ msg.text }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="panel-footer">
        <form @submit.prevent="sendMessage">
          <div class="input-group">
            <input v-model="newMessage" type="text" class="form-control" placeholder="Nhập tin nhắn..." required autocomplete="off" />
            <span class="input-group-btn">
              <button class="btn btn-success" type="submit">
                <span class="glyphicon glyphicon-send"></span> Gửi
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'
import { firebaseApp } from '../firebase';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

const router = useRouter();
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

// Giả lập dữ liệu user từ cookie
const user = JSON.parse(Cookies.get('user') || '{}')

// Dữ liệu tin nhắn (sau này sẽ lấy từ Firestore)
const messages = ref<any[]>([])
const newMessage = ref('')

onMounted(() => {
  const firestore = getFirestore(firebaseApp)
  const messageRef = collection(firestore, 'message')
  const q = query(messageRef, orderBy('createdAt'), limit(25))
  onSnapshot(q, (querySnapshot: any) => {
    messages.value = querySnapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    }))
    nextTick(() => {
      const chatBody = document.querySelector('.panel-body')
      if (chatBody) chatBody.scrollTop = chatBody.scrollHeight
    })
  })
})

async function sendMessage() {
  if (!newMessage.value.trim()) return;
  const messageRef = collection(firestore, 'message');
  await addDoc(messageRef, {
    text: newMessage.value,
    uid: user.uid,
    displayName: user.displayName,
    photoURL: user.photoURL,
    createdAt: serverTimestamp()
  });
  newMessage.value = '';
}

function formatTime(date: any) {
  if (!date) return '';
  if (typeof date.toDate === 'function') {
    return date.toDate().toLocaleTimeString();
  }
  if (typeof date === 'number') {
    return new Date(date).toLocaleTimeString();
  }
  if (date instanceof Date) {
    return date.toLocaleTimeString();
  }
  return '';
}

async function logout() {
  await signOut(auth);
  Cookies.remove('token');
  Cookies.remove('user');
  router.push('/login');
}
</script>

<style scoped>
.chat-container {
  width: 100vw;
  height: 100vh;
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%);
  overflow: hidden;
}

.chat-panel {
  width: 100%;
  max-width: 600px;
  min-height: 600px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  border-radius: 18px;
  overflow: hidden;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.panel-heading {
  border-radius: 18px 18px 0 0;
  background: #0084ff;
  color: #fff;
  padding: 18px 24px;
}

.panel-title {
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-body {
  flex: 1 1 auto;
  background: #f5f6fa;
  padding: 18px 12px 12px 12px;
}

.panel-footer {
  background: #f5f6fa;
  padding: 16px 18px;
  border-radius: 0 0 18px 18px;
}

.chat {
  margin: 0;
  padding: 0;
}

.chat li {
  display: flex;
  align-items: flex-end;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px dotted #b3a9a9;
}

.chat li.left {
  flex-direction: row;
  justify-content: flex-start;
}

.chat li.right {
  flex-direction: row-reverse;
  justify-content: flex-end;
}

.chat-img {
  width: 32px;
  height: 32px;
  margin: 0 10px;
}

.chat-body {
  max-width: 70%;
  background: #f1f0f0;
  border-radius: 10px;
  padding: 8px 12px;
  word-break: break-word;
}

.chat li.right .chat-body {
  background: #0084ff;
  color: #fff;
  text-align: right;
}

.chat li.left .chat-body {
  background: #f1f0f0;
  color: #222;
  text-align: left;
}

.right {
  display: flex;
  justify-content: end!important;
}
</style>