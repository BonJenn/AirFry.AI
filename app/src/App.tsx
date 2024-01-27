import { useState, useEffect } from 'react';
import Toggle from 'react-toggle';
import 'react-toggle/style.css'; // Importing styles for the toggle component
import './App.css'; // Importing custom styles for the app
import Header from './Header.tsx'; // Importing the Header component
import * as Realm from "realm-web";
import SignUpForm from './SignUpForm';
import { REALM_APP_ID } from './config.ts';


// API key for OpenAI, should be kept secret and not exposed in the frontend in a real-world app
const API_KEY = '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';
   // App.tsx

const app = new Realm.App({ id: REALM_APP_ID });

function App() {
  // State hooks for managing input and output for air frying time
  const [airFryInput, setairFryInput] = useState('');
  const [airFryOutput, setairFryOutput] = useState('');

  // State hooks for managing input and output for air fryer recipes
  const [airFryRecInput, setairFryRecInput] = useState('');
  const [airFryRecOutput, setairFryRecOutput] = useState('');

  // State hook for managing the toggle state (true/false)
  const [toggleState, setToggleState] = useState(false);
  // State hook for managing the unit of temperature (Fahrenheit/Celsius)
  const [unit, setUnit] = useState('Fahrenheit');

  // Function to get a user token and log in
  async function login() {
    const credentials = Realm.Credentials.anonymous(); // Or use another authentication method
    try {
      // Log in to Realm with the credentials
      const user = await app.logIn(credentials);
      console.log("Successfully logged in!", user);
      // Now you can read and write data
    } catch (err) {
      console.error("Failed to log in", err);
    }
  }

  // Call the login function when your component mounts
  useEffect(() => {
    login();
  }, []);

  async function writeDataToMongoDB() {
    const credentials = Realm.Credentials.anonymous(); // Or use another authentication method
    try {
      // Log in to Realm with the credentials
      const user = await app.logIn(credentials);
      console.log("Successfully logged in!", user);
  
      // Define the document you want to write
      const myDocument = {
        name: "Test Item 2",
        description: "This is a test item for the database.",
        createdAt: new Date(),
      };
  
      // Get a reference to the collection
      const mongo = app.currentUser.mongoClient("mongodb-atlas"); // Replace "mongodb-atlas" with your MongoDB service name if different
      const myCollection = mongo.db("AirFryAI").collection("Test");
  
      // Perform the write operation
      const result = await myCollection.insertOne(myDocument);
      console.log("Successfully wrote document with id:", result.insertedId);
    } catch (err) {
      console.error("Failed to write data to MongoDB", err);
    }
  }


  async function writeRecipeToDatabase(recipeContent: string) {
    const credentials = Realm.Credentials.anonymous(); // Or use another authentication method
    try {
      // Log in to Realm with the credentials
      const user = await app.logIn(credentials);
      console.log("Successfully logged in!", user);

      const recipeDocument = {
        content: recipeContent,
        createdAt: new Date(), // Optionally add a timestamp
      };
  
      // Get a reference to the collection
      const mongo = app.currentUser?.mongoClient("mongodb-atlas");
      const recipesCollection = mongo?.db("AirFryAI").collection("Recipes");
  
      // Perform the write operation
      // Perform the write operation with the recipe object
      const result = await recipesCollection?.insertOne(recipeDocument);
      console.log("Successfully wrote recipe with id:", result?.insertedId);
    } catch (err) {
      console.error("Failed to write recipe to MongoDB", err);
    }
  }




  // Function to call OpenAI API for getting cooking time
  async function callOpenAIAPIForCookTime() {
    const APIBody = {
      model: 'gpt-4', // Specifies the model to be used
      messages: [
        {
          role: 'user',
          content: `How long do I airfry ${airFryInput} in ${unit}? Answer in one sentence`,
        },
      ],
      temperature: 0.5, // Controls randomness in the response
      max_tokens: 1024, // Maximum length of the response
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };

    // Fetch request to OpenAI API
    await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + API_KEY, // Authorization header with API key
      },
      body: JSON.stringify(APIBody),
    })
      .then((data) => data.json())
      .then((data) => {
        // Setting the response from the API to the airFryOutput state
        setairFryOutput(data.choices[0].message.content.trim());
      });
  }

  // Function to call OpenAI API for getting a recipe
  async function callOpenAIAPIForRecipe() {
    const APIBody = {
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Give me an air fry recipe for ${airFryRecInput} in ${unit}`,
        },
      ],
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };

    // Fetch request to OpenAI API
    await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + API_KEY,
      },
      body: JSON.stringify(APIBody),
    })
      .then((data) => data.json())
      .then((data) => {
        // Setting the response from the API to the airFryRecOutput state
        setairFryRecOutput(data.choices[0].message.content.trim());
        writeRecipeToDatabase(data.choices[0].message.content.trim());
      });
  }

  // JSX for rendering the app UI
  return (
    <>
      <Header /> {/* Rendering the Header component */}
  
      <div>
        {/* Toggle component for switching between modes */}
        <Toggle
          defaultChecked={toggleState}
          onChange={() => setToggleState(!toggleState)}
        />
      </div>
      <div>
        {/* Radio buttons for selecting the unit of temperature */}
        <label style={{ color: 'black' }}>
          <input
            type="radio"
            value="Fahrenheit"
            checked={unit === 'Fahrenheit'}
            onChange={(e) => setUnit(e.target.value)}
          />
          Fahrenheit
        </label>
        <label style={{ color: 'black' }}>
          <input
            type="radio"
            value="Celsius"
            checked={unit === 'Celsius'}
            onChange={(e) => setUnit(e.target.value)}
          />
          Celsius
        </label>
      </div>

      {/* Conditionally render input fields and buttons based on toggleState */}
      {!toggleState ? (
        // If toggleState is true, show the cooking time input and button
        <div className="airFryTimeTemp">
          {/* Input field for air frying time query */}
          <input
            type="text"
            value={airFryInput}
            onChange={(e) => setairFryInput(e.target.value)}
            placeholder="Enter food item"
          />
          <button onClick={callOpenAIAPIForCookTime}>Get Cooking Time</button>

          {/* Displaying the air frying time result */}
          <div>
            <p>{airFryOutput}</p>
          </div>
        </div>
      ) : (
        // If toggleState is false, show the recipe input and button
        <div>
          {/* Input field for air fryer recipe query */}
          <input
            type="text"
            value={airFryRecInput}
            onChange={(e) => setairFryRecInput(e.target.value)}
            placeholder="Enter food item for recipe"
          />
          <button onClick={callOpenAIAPIForRecipe}>Get Recipe</button>

          {/* Displaying the air fryer recipe result */}
          <div>
            <p>{airFryRecOutput}</p>
          </div>
        </div>
      )}
     
 
    </>
  );
}

export default App;
export { REALM_APP_ID };

