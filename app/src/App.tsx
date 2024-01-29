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
      <Header />
      <div className="toggle-container">
        <Toggle
          checked={toggleState}
          onChange={() => setToggleState(!toggleState)}
          icons={false}
        />
        <span>{toggleState ? 'Recipes' : 'Time & Temp'}</span>
      </div>
      <div className="action-container">
        <h1>{toggleState ? 'Give Me a Recipe For...' : "What's Cooking?"}</h1>
        <div className="temperature-toggle">
          <label>
            <input
              type="radio"
              value="Fahrenheit"
              checked={unit === 'Fahrenheit'}
              onChange={() => setUnit('Fahrenheit')}
            />
            °F
          </label>
          <label>
            <input
              type="radio"
              value="Celsius"
              checked={unit === 'Celsius'}
              onChange={() => setUnit('Celsius')}
            />
            °C
          </label>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Chicken, ribs, etc..."
        />
        <button onClick={handleAction}>
          {toggleState ? 'Create Recipe' : 'Air Fry'}
        </button>
        <div>{output}</div>
      </div>
      {isLoading && (
        <div className="modal">
          <p>One sec, AI is preparing your {toggleState ? 'recipe' : 'cooking time'}...</p>
        </div>
      )}
    </>
  );
}

export default App;
export { REALM_APP_ID };
