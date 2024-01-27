"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const ReactToggle = __importDefault(require("react-toggle"));
require("react-toggle/style.css");
require("./App.css");
const Header_1 = __importDefault(require("./Header"));
const API_KEY = "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";
function App() {
    const [airFryInput, setairFryInput] = (0, react_1.useState)("");
    const [airFryOutput, setairFryOutput] = (0, react_1.useState)("");
    const [airFryRecInput, setairFryRecInput] = (0, react_1.useState)("");
    const [airFryRecOutput, setairFryRecOutput] = (0, react_1.useState)("");
    const [toggleState, setToggleState] = (0, react_1.useState)(false);
    const [unit, setUnit] = (0, react_1.useState)("Fahrenheit"); // Default unit
    function callOpenAIAPIForCookTime() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Calling the OpenAI API");
            const APIBody = {
                "model": "gpt-4",
                "messages": [
                    {
                        "role": "user",
                        "content": `How long do I airfry ${airFryInput} in ${unit}? Answer in one sentence`
                    },
                ],
                "temperature": 0.5,
                "max_tokens": 1024,
                "top_p": 1,
                "frequency_penalty": 0,
                "presence_penalty": 0
            };
            yield fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + API_KEY
                },
                body: JSON.stringify(APIBody)
            }).then(data => {
                return data.json();
            }).then(data => {
                setairFryOutput(data.choices[0].message.content.trim()); // Air Fry Instructions
            });
        });
    }
    function callOpenAIAPIForRecipe() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Calling the OpenAI API");
            const APIBody = {
                "model": "gpt-4",
                "messages": [
                    {
                        "role": "user",
                        "content": `Give me an air fry recipe for ${airFryRecInput} in ${unit}`
                    },
                ],
                "temperature": 0.5,
                "max_tokens": 1024,
                "top_p": 1,
                "frequency_penalty": 0,
                "presence_penalty": 0
            };
            yield fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + API_KEY
                },
                body: JSON.stringify(APIBody)
            }).then(data => {
                return data.json();
            }).then(data => {
                setairFryRecOutput(data.choices[0].message.content.trim()); // Air Fry Instructions
            });
        });
    }
    return (<>

      <Header_1.default />

      <div>
        <ReactToggle defaultChecked={toggleState} onChange={() => setToggleState(!toggleState)}/>
      </div>

      <div>
        <label style={{ color: 'black' }}>
          <input type="radio" value="Fahrenheit" checked={unit === "Fahrenheit"} onChange={(e) => setUnit(e.target.value)}/> Fahrenheit
        </label>
        <label style={{ color: 'black' }}>
          <input type="radio" value="Celsius" checked={unit === "Celsius"} onChange={(e) => setUnit(e.target.value)}/> Celsius
        </label>
      </div>

      {toggleState ? (<div className="input-area">
          <textarea onChange={(e) => setairFryRecInput(e.target.value)} placeholder='Give me an air fry recipe for...' cols={50} rows={10}/>

          {airFryRecOutput !== "" && <h3> {airFryRecOutput}</h3>}
          <button className="AI-button" onClick={callOpenAIAPIForRecipe}>Give me a Recipe!</button>
        </div>) : (<div className="input-area">
          <textarea onChange={(e) => setairFryInput(e.target.value)} placeholder='How long do I airfry...' cols={50} rows={10}/>
          {airFryOutput !== "" && <h3> {airFryOutput}</h3>}
          <button className="AI-button" onClick={callOpenAIAPIForCookTime}>Get Cook Time!</button>
        </div>)}
    </>);
}
exports.default = App;
