import React, { useState, useEffect } from 'react';
import Toggle from 'react-toggle';
import 'react-toggle/style.css'; // Importing styles for the toggle component
import './App.css'; // Importing custom styles for the app
import Header from './Header'; // Importing the Header component
import * as Realm from "realm-web";
import { REALM_APP_ID, API_KEY } from './config';

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
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Function to close the sidebar
  const closeSidebar = () => {
    setIsSidebarVisible(false);
  };

  // Effect hook for handling user login on component mount
  useEffect(() => {
    async function login() {
      const credentials = Realm.Credentials.anonymous(); // Anonymous credentials for Realm
      try {
        await app.logIn(credentials); // Attempt to log in
        console.log("Successfully logged in!");
      } catch (err) {
        console.error("Failed to log in", err); // Log any login errors
      }
    }
    login(); // Invoke the login function
  }, []); // Empty dependency array to run only once on mount

  // Function to handle the main action based on toggle state
  async function handleAction() {
    setIsLoading(true); // Indicate the start of an API call
    const actionType = toggleState ? 'Get Recipe' : 'Air Fry'; // Determine the action type
    // Construct the user content based on toggle state and input
    const userContent = `Give me ${toggleState ? 'a recipe' : 'the cooking time'} for ${input} in ${unit}`;

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
      // Make the API call to OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + API_KEY, // Authorization with the API key
        },
        body: JSON.stringify(APIBody), // Stringify the API body for the request
      });
      const data = await response.json(); // Parse the JSON response
      setOutput(data.choices[0].message.content.trim()); // Set the output in state
      if (toggleState) {
        // If the toggle is set to 'Get Recipe', write the recipe to the database
        await writeRecipeToDatabase(data.choices[0].message.content.trim());
      }
    } catch (error) {
      // Catch and log any errors from the API call
      console.error(`Failed to fetch data from OpenAI API for ${actionType}`, error);
    } finally {
      setIsLoading(false); // Indicate the end of the API call
    }
  }

  // Placeholder function for writing a recipe to the database
  async function writeRecipeToDatabase(recipeContent) {
    // Database write logic would go here
  }

  // Render the main app content
  return (
    <>
      <Header toggleSidebar={toggleSidebar} /> {/* Render the Header component */}
      {/* Overlay for sidebar, closes sidebar on click */}
      {isSidebarVisible && <div className="overlay" onClick={closeSidebar}></div>}
      <div className={`main-content ${isSidebarVisible ? 'sidebar-visible' : ''}`}>
        <div className="toggle-area">
          <h3 className="label-left">Time & Temp</h3>
          <Toggle
            defaultChecked={toggleState}
            icons={false}
            onChange={() => setToggleState(!toggleState)}
          />
          <h3 className="label-right">Recipes</h3>
        </div>
        {!toggleState ? (
          // Air Fry Time and Temp Section
          <div className={`airFryTimeTemp ${toggleState ? 'shrink' : 'grow'}`}>
            <h1>What's Cooking?</h1>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter food item"
            />
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
            <button onClick={handleAction}>Get Cooking Time</button>
            {isLoading ? <p>Loading...</p> : <p>{output}</p>}
          </div>
        ) : (
          // Air Fry Recipe Section
          <div className={`airFryRecipe ${toggleState ? 'grow' : 'shrink'}`}>
            <h1>Give Me a Recipe For...</h1>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter food item for recipe"
            />
            <button onClick={handleAction}>Create Recipe</button>
            {isLoading ? <p>Loading...</p> : <p>{output}</p>}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
export { REALM_APP_ID };
