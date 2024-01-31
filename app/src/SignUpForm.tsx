import React, { useState } from 'react';
import { REALM_APP_ID } from './config';
import * as Realm from "realm-web";
import './SignUpForm.css';

function SignUpForm({ updateLoginState }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (password.length < 6 || password.length > 128) {
      alert('Password must be between 6 and 128 characters.');
      return;
    }

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

      // Get a reference to the collection
      const mongo = app.currentUser?.mongoClient("mongodb-atlas");
      const userSignUp = mongo?.db("AirFryAI").collection("Users");

      // Encapsulate the database operation in an async function
      const insertUserDocument = async () => {
        const userDocument = { email, password };
        const result = await userSignUp?.insertOne(userDocument);
        console.log("Successfully wrote user with id:", result?.insertedId);
      };

      // Call the async function to perform the database operation
      await insertUserDocument();

      // Log in the newly registered user
      const user = await app.logIn(Realm.Credentials.emailPassword(email, password));
      console.log('Successfully logged in!', user);

      // Update login state
      updateLoginState(true);

      // Clear the form fields
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error signing up:', err);
    }
  };

  return (
    <>

    <h1 className = "Popup-Title">Sign Up</h1>
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
