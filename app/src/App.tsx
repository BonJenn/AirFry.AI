import { useState, useEffect } from 'react';
import Toggle from 'react-toggle';
import 'react-toggle/style.css'; // Importing styles for the toggle component
import './App.css'; // Importing custom styles for the app
import Header from './Header.tsx'; // Importing the Header component
import * as Realm from "realm-web";
import { REALM_APP_ID, API_KEY } from './config.ts';

const app = new Realm.App({ id: REALM_APP_ID });

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [toggleState, setToggleState] = useState(false);
  const [unit, setUnit] = useState('Fahrenheit');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function login() {
      const credentials = Realm.Credentials.anonymous();
      try {
        const user = await app.logIn(credentials);
        console.log("Successfully logged in!", user);
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
        // Call the function to write recipe to database if the toggle is for recipes
        await writeRecipeToDatabase(data.choices[0].message.content.trim());
      }
    } catch (error) {
      console.error(`Failed to fetch data from OpenAI API for ${actionType}`, error);
    } finally {
      setIsLoading(false);
    }
  }

  async function writeRecipeToDatabase(recipeContent) {
    // Implementation remains unchanged
  }

  return (
    <>
    <div className = "header">
      <Header /> {/* Rendering the Header component */}
    </div>
    <div className = "main-content">

    
      <div>
        {/* Toggle component for switching between modes */}
        <span>Time & Temp</span>
        <Toggle
          defaultChecked={toggleState}
          onChange={() => setToggleState(!toggleState)}
        />
        <span>Recipes</span>
      </div>
  
      {/* Conditionally render sections based on toggleState */}
      {!toggleState ? (
        // If toggleState is false, show the cooking time section
        <div className="airFryTimeTemp">
          <h1>What's Cooking?</h1> {/* Header */}
          <input
            type="text"
            value={input} // Make sure to use the correct state variable name
            onChange={(e) => setInput(e.target.value)} // Make sure to use the correct state setter function
            placeholder="Enter food item"
          /> {/* Input field for air frying time query */}
          <div>
            {/* Radio buttons for selecting the unit of temperature */}
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
          <button onClick={handleAction}>Get Cooking Time</button> {/* Button to trigger API call for cooking time */}
          <div>
            <p>{output}</p> {/* Displaying the air frying time result */}
          </div>
        </div>
      ) : (
        // If toggleState is true, show the recipe section
        <div className="airFryRecipe">
          <h1>Give Me a Recipe For...</h1> {/* Header */}
          <input
            type="text"
            value={input} // Make sure to use the correct state variable name
            onChange={(e) => setInput(e.target.value)} // Make sure to use the correct state setter function
            placeholder="Enter food item for recipe"
          /> {/* Input field for air fryer recipe query */}
          <div>
            {/* Radio buttons for selecting the unit of temperature */}
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
          <button onClick={handleAction}>Create Recipe</button> {/* Button to trigger API call for recipe */}
          <div>
            <p>{output}</p> {/* Displaying the air fryer recipe result */}
          </div>
        </div>
      )}
    </div>
    </>
  );
} // This is the correct closing brace for the App function

export default App;
export { REALM_APP_ID };