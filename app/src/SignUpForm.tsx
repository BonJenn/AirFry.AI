import React, { useState } from 'react';
import { REALM_APP_ID } from './config';
import * as Realm from "realm-web";
import './SignUpForm.css';

function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    };

    try {
      // Replace with your MongoDB Realm App instance
      const app = new Realm.App({ id: REALM_APP_ID });
      const credentials = Realm.Credentials.emailPassword(email, password);
      const newUser = await app.emailPasswordAuth.registerUser({ email, password });
      console.log('User created:', newUser);
    } catch (err) {
      console.error('Error signing up:', err);
    }
  };

  return (
    <>
      <div className="signUpForm">
        <form onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
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
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
          <button type="submit">Sign Up</button>
        </form>
      </div>

    </>
  );
}

export default SignUpForm;
