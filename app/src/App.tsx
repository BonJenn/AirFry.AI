import React, { useState, useEffect } from 'react';
import Toggle from 'react-toggle';
import 'react-toggle/style.css'; // Importing styles for the toggle component
import './App.css'; // Importing custom styles for the app
import Header from './Header'; // Importing the Header component
import * as Realm from "realm-web";
import { REALM_APP_ID, API_KEY } from './config';

const app = new Realm.App({ id: REALM_APP_ID });

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [toggleState, setToggleState] = useState(false);
  const [unit, setUnit] = useState('Fahrenheit');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    async function login() {
      const credentials = Realm.Credentials.anonymous();
      try {
        await app.logIn(credentials);
        console.log("Successfully logged in!");
      } catch (err) {
        console.error("Failed to log in", err);
      }
    }
    login();
  }, []);

  async function handleAction() {
    setIsLoading(true);
    const actionType = toggleState ? 'Get Recipe' : 'Air Fry';
    const userContent = `Give me ${toggleState ? 'a recipe' : 'the cooking time'} for ${input} in ${unit}`;

    const APIBody = {
      model: 'gpt-4',
      messages: [{ role: 'user', content: userContent }],
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + API_KEY,
        },
        body: JSON.stringify(APIBody),
      });
      const data = await response.json();
      setOutput(data.choices[0].message.content.trim());
      if (toggleState) {
        await writeRecipeToDatabase(data.choices[0].message.content.trim());
      }
    } catch (error) {
      console.error(`Failed to fetch data from OpenAI API for ${actionType}`, error);
    } finally {
      setIsLoading(false);
    }
  }

  async function writeRecipeToDatabase(recipeContent) {
    // Placeholder for database write logic
  }

  return (
    <>
      
     
      
      <Header toggleSidebar={toggleSidebar} />
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
          <div className="airFryTimeTemp">
            <h1>What's Cooking?</h1>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter food item"
            />
            {/* Temperature Unit Selection */}
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
          <div className="airFryRecipe">
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
