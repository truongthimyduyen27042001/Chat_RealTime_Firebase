<template>
  <div class="container" style="max-width: 400px; margin-top: 100px;">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title text-center">Đăng nhập</h3>
      </div>
      <div class="panel-body text-center">
        <button class="btn btn-primary btn-block" @click="loginWithGoogle">
          <span class="glyphicon glyphicon-log-in"></span> Đăng nhập với Google
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Cookies from 'js-cookie';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { firebaseApp } from '../firebase';
import { useRouter } from 'vue-router';

const auth = getAuth(firebaseApp);
const router = useRouter();

function loginWithGoogle() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;
      const token = await user.getIdToken();
      Cookies.set('token', token);
      Cookies.set('user', JSON.stringify({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      }), { expires: 2 });
      router.push('/');
    })
    .catch((error) => {
      console.error(error);
    });
}
</script>