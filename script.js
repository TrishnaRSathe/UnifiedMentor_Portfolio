// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Register User
document.getElementById('register-btn').addEventListener('click', () => {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    auth.createUser WithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User registered
            console.log('User  registered:', userCredential.user);
            alert('Registration successful!');
            saveUser ToFirestore(userCredential.user);
        })
        .catch((error) => {
            console.error('Error registering:', error);
            alert(error.message);
        });
});

// Login User
document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // User logged in
            console.log('User  logged in:', userCredential.user);
            alert('Login successful!');
            displayMembers();
        })
        .catch((error) => {
            console.error('Error logging in:', error);
            alert(error.message);
        });
});

// Logout User
document.getElementById('logout-btn').addEventListener('click', () => {
    auth.signOut().then(() => {
        console.log('User  logged out');
        alert('Logout successful!');
        document.getElementById('members-container').style.display = 'none';
        document.getElementById('auth-container').style.display = 'block';
    });
});

// Save user to Firestore
function saveUser ToFirestore(user) {
    db.collection('members').doc(user.uid).set({
        email: user.email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log('User  saved to Firestore');
    })
    .catch((error) => {
        console.error('Error saving user to Firestore:', error);
    });
}

// Display members
function displayMembers() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('members-container').style.display = 'block';
    const membersList = document.getElementById('members-list');
    membersList.innerHTML = ''; // Clear previous list

    db.collection('members').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const li = document.createElement('li');
            li.textContent = doc.data().email;
            membersList.appendChild(li);
        });
    }).catch((error) => {
        console.error('Error fetching members:', error);
    });
}

// Monitor auth state
auth.onAuthStateChanged((user) => {
    if (user) {
        displayMembers();
    } else {
        document.getElementById('auth-container').style.display = 'block';
        document.getElementById('members-container').style.display = 'none';
    }
});
