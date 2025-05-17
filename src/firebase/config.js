import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAtLCJIuQyKqlIZQZ8NI0zC7ngS-01kWHo",
  authDomain: "loggin-rappidmart.firebaseapp.com",
  projectId: "loggin-rappidmart",
  storageBucket: "loggin-rappidmart.firebasestorage.app",
  messagingSenderId: "557039589033",
  appId: "1:557039589033:web:d9194ef07eaede6e9e7bb8"
};;

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener instancias de Firestore y Auth
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app; 