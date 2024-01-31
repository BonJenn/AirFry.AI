// app/src/LoginForm.tsx
import React, { useState } from 'react';
import { REALM_APP_ID } from './config';
import * as Realm from "realm-web";
import './LoginForm.css'; // Reuse the same styles as SignUpForm

function LoginForm({ updateLoginState }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const app = new Realm.App({ id: REALM_APP_ID });
      const credentials = Realm.Credentials.emailPassword(email, password);
      const user = await app.logIn(credentials);
      console.log('Successfully logged in!', user);
      // You can now redirect the user or perform other actions
      updateLoginState(true);
    } catch (err) {
      console.error('Error logging in:', err);
    }
  };

  return (
    <>
    <h1 className = "Popup-Title">Login</h1>
    <div className="loginForm">
      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Log In</button>
      </form>
    </div>
    </>
  );
}

export default LoginForm;
