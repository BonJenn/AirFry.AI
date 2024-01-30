// Importing necessary modules and components
import React, { useState, useEffect } from 'react';
import Toggle from 'react-toggle'; // Toggle component for switching views
import 'react-toggle/style.css'; // CSS for the Toggle component
import './App.css'; // Custom CSS for the app
import Header from './Header'; // Header component
import * as Realm from "realm-web"; // Realm Web SDK for MongoDB Realm
import { REALM_APP_ID, API_KEY } from './config'; // Configuration constants

// Initialize Realm app with the provided app ID
const app = new Realm.App({ id: REALM_APP_ID });

// Main App component
function App() {
  // State hooks for various functionalities
  const [input, setInput] = useState(''); // State for user input
  const [output, setOutput] = useState(''); // State for storing API output
  const [toggleState, setToggleState] = useState(false); // State for toggle switch position
  const [unit, setUnit] = useState('Fahrenheit'); // State for unit of measurement
  const [isLoading, setIsLoading] = useState(false); // State to indicate loading process
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // State for sidebar visibility

  // Function to toggle the visibility of the sidebar
  const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

  // Function to close the sidebar
  const closeSidebar = () => setIsSidebarVisible(false);

  // Effect hook for handling user login on component mount
  useEffect(() => {
    async function login() {
      const credentials = Realm.Credentials.anonymous(); // Using anonymous credentials for Realm
      try {
        await app.logIn(credentials); // Login to Realm
        console.log("Successfully logged in!");
      } catch (err) {
        console.error("Failed to log in", err);
      }
    }
    login();
  }, []); // Empty dependency array to run only once on mount

  // Function to handle the main action based on toggle state
  async function handleAction() {
    setIsLoading(true); // Indicate the start of an API call
    const actionType = toggleState ? 'Get Recipe' : 'Air Fry'; // Determine the action type
    const userContent = `Give me ${toggleState ? 'a recipe' : 'the cooking time'} for ${input} in ${unit}`; // Construct the user content

    // API request body
    const APIBody = {
      model: 'gpt-4', // Specify the model to use
      messages: [{ role: 'user', content: userContent }], // User message for the API
      temperature: 0.5, // Controls randomness
      max_tokens: 1024, // Maximum length of the response
      top_p: 1, // Nucleus sampling
      frequency_penalty: 0, // Controls repetition
      presence_penalty: 0, // Controls new concepts
    };

    try {
      // Fetching data from OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + API_KEY, // Authorization with the API key
        },
        body: JSON.stringify(APIBody),
      });
      const data = await response.json(); // Parse the JSON response
      setOutput(data.choices[0].message.content.trim()); // Set the output in state
      if (toggleState) {
        await writeRecipeToDatabase(data.choices[0].message.content.trim()); // Write recipe to database if toggle is set for recipes
      }
    } catch (error) {
      console.error(`Failed to fetch data from OpenAI API for ${actionType}`, error);
    } finally {
      setIsLoading(false); // Indicate the end of the API call
    }
  }

  // Placeholder function for writing recipe to the database
  async function writeRecipeToDatabase(recipeContent) {
    // Logic to write recipe content to the database
  }

  // Render method for the component
    // Render method for the component
return (
  <>
    <Header toggleSidebar={toggleSidebar} /> {/* Render the Header component */}
    {isSidebarVisible && <div className="overlay" onClick={closeSidebar}></div>} {/* Overlay for sidebar, closes on click */}
    <div className={`main-content ${isSidebarVisible ? 'sidebar-visible' : ''}`}>
      <div className="toggle-area">
        <h3 className="label-left">Time & Temp</h3> {/* Label for the left side of the toggle */}
        <Toggle
          defaultChecked={toggleState}
          icons={false}
          onChange={() => setToggleState(!toggleState)} // Toggle switch for switching between Time & Temp and Recipes
        />
        <h3 className="label-right">Recipes</h3> {/* Label for the right side of the toggle */}
      </div>

      {!toggleState ? (
        <div className={`airFryTimeTemp ${toggleState ? 'shrink' : 'grow'}`}>
          {/* Air Fry Time and Temp Section */}
          <h1>What's Cooking?</h1>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter food item"
          />
          {/* Radio buttons for unit selection */}
          <div className="temp-unit">
            <label>
              <input
                type="radio"
                value="Fahrenheit"
                checked={unit === 'Fahrenheit'}
                onChange={(e) => setUnit(e.target.value)}
              />
              Fahrenheit
            </label>
            <label>
              <input
                type="radio"
                value="Celsius"
                checked={unit === 'Celsius'}
                onChange={(e) => setUnit(e.target.value)}
              />
              Celsius
            </label>
          </div>
          <button onClick={handleAction}>Get Cooking Time</button> {/* Button to trigger the main action */}
          {isLoading ? <p>Loading...</p> : <p>{output}</p>} {/* Display loading message or output */}
        </div>
      ) : (
        <div className={`airFryRecipe ${toggleState ? 'grow' : 'shrink'}`}>
          {/* Air Fry Recipe Section */}
          <h1>Give Me a Recipe For...</h1>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter food item for recipe"
          />
          {/* Radio buttons for unit selection */}
          <div className="temp-unit">
            <label>
              <input
                type="radio"
                value="Fahrenheit"
                checked={unit === 'Fahrenheit'}
                onChange={(e) => setUnit(e.target.value)}
              />
              Fahrenheit
            </label>
            <label>
              <input
                type="radio"
                value="Celsius"
                checked={unit === 'Celsius'}
                onChange={(e) => setUnit(e.target.value)}
              />
              Celsius
            </label>
          </div>
          <button onClick={handleAction}>Create Recipe</button> {/* Button to trigger the main action for recipes */}
          {isLoading ? <p>Loading...</p> : <p>{output}</p>} {/* Display loading message or output */}
        </div>
      )}
    </div>
  </>
);

  }

export default App; // Export the App component as the default export
export { REALM_APP_ID }; // Export the REALM_APP_ID constant
