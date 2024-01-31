import React, { useState, useEffect } from 'react';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import './App.css';
import Header from './Header';
import * as Realm from "realm-web";
import { REALM_APP_ID, API_KEY } from './config';

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [toggleState, setToggleState] = useState(false);
  const [unit, setUnit] = useState('Fahrenheit');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const app = new Realm.App({ id: REALM_APP_ID });

  useEffect(() => {
    const checkUserLoggedIn = () => {
      setIsLoggedIn(!!app.currentUser);
    };

    checkUserLoggedIn();

    return () => {};
  }, [app]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const closeSidebar = () => {
    setIsSidebarVisible(false);
  };

  const handleAction = async () => {
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
        // Placeholder for writing recipe to the database
      }
    } catch (error) {
      console.error(`Failed to fetch data from OpenAI API for ${actionType}`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLoginState = (loggedIn) => {
    setIsLoggedIn(loggedIn);
  };

  return (
    <>
      <Header 
        isLoggedIn={isLoggedIn}
        onLogout={() => setIsLoggedIn(false)}
        toggleSidebar={toggleSidebar}
        isSidebarVisible={isSidebarVisible}
        app={app} // Pass the app instance here
        updateLoginState={updateLoginState}
      />
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
          <div className={`airFryRecipe ${toggleState ? 'grow' : 'shrink'}`}>
            <h1>Give Me a Recipe For...</h1>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter food item for recipe"
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
            <button onClick={handleAction}>Create Recipe</button>
            {isLoading ? <p>Loading...</p> : <p>{output}</p>}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
