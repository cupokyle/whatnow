import Head from "next/head";
import { useReducer } from "react";
import styles from "./index.module.css";
import axios from 'axios';
import Loading from './Loading';
import Modal from "./Modal/Modal";
import { fetchData } from '../lib/utils';


const initialState = {
  userInput: "",
  result: "",
  leftButton: "",
  rightButton: "",
  leftTwoButton: "",
  rightTwoButton: "",
  randomEvent: "",
  triggerNumber: 0,
  imgResult: "",
  show: false,
  artStyle: "digital art",
  storyStarting: false,
  pageError: false,
  summary: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'STORY_START':
      return { ...state, storyStarting: true, imgResult: 'loading' };
    case 'UPDATE_DATA':
      return { ...state, ...action.payload, storyStarting: false };
    case 'UPDATE_USER_INPUT':
      return { ...state, userInput: action.payload };
    case 'UPDATE_TRIGGER':
      return { ...state, triggerNumber: action.payload };
    case 'SET_SHOW':
      return { ...state, show: action.payload };
    case 'SET_ART_STYLE':
      return { ...state, artStyle: action.payload };
      case 'UPDATE_HISTORY':
        return {
            ...state,
            summary: state.summary + " " + action.payload,
            error: null
          };
    case 'ERROR':
      return { ...state, storyStarting: false, pageError: true };
    default:
      throw new Error();
  }
}

function processArray(arr) {
  const seen = new Set();

  return arr.map(str => str.trim()) // Remove whitespace
            .filter(str => {
                // Test if the string only contains whitespace or punctuation
                if (/^[\s]*$/.test(str) || /^[!-\/:-@[-`{-~]*$/.test(str)) {
                    // console.log('Removing because it only contains whitespace or punctuation:', str);
                    return false;
                }
                if (seen.has(str)) {
                    // console.log(seen, 'includes', str, '\nRemoving:', str);
                    return false; // If we've seen the string, exclude it
                } else {
                    // console.log(seen, 'does not include', str, '\nKeeping:', str);
                    seen.add(str); // Add new string to the Set
                    return true; // Include new strings
                }
            })
            .join('. '); // Convert array into one string of sentences
}

async function onSubmitHandling(prompt, state, dispatch, artStyle) {
  const imgData = {
    "prompt": `${prompt}, ${artStyle}`,
    "n": 1,
    "size": "1024x1024"
  };

  const config = {
    method: 'post',
    url: 'https://api.openai.com/v1/images/generations',
    headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
    data: imgData
  };

  try {
    let jsonString = `{"result": "You walk to the bank. The bank is a bustling building. Many people are entering and exiting with wads of cash in their hands.","leftButton": "Go inside the bank to open a chequing account","rightButton": "Think about banks quizically","leftTwoButton": "Scream the word Bank until you can't breathe anymore","rightTwoButton": "Throw a rock at the window.","randomEvent": "You gain the ability to invest!", "summary": "You're about to enter a bank. You have the power to invest."}`;
    let jsonObject = JSON.parse(jsonString);

    let apiPrompt = state.summary ? `${state.summary}. ${prompt}` : prompt;
    
    apiPrompt = processArray(apiPrompt.split('.'));
    // console.log('processed', apiPrompt);

    const [storyData, imgRes] = await Promise.all([
      fetchData(
        "https://api.openai.com/v1/chat/completions",
        {
          "model": "gpt-3.5-turbo",
          "messages": [
            {
              "role": "user",
              "content": `You are generating a story and choices for the player of a narrative adventure game. Everything must be written in the second-person point of view. Please generate only a JSON object with these exact seven keys: result, leftButton, rightButton, leftTwoButton, rightTwoButton, randomEvent, and summary. The summary key should summarize what has previously happened in the story. All four of the left and right button keys represent the next choices the player can make. You must use the exact same key names that are in the example! The choices should all vary from one another and be quite unique. Some can be expected, some more funny, and some very creative. The randomEvent should be a maximum of 10 words and recognize a good or bad achievement. Your response should be formatted exactly as shown in this example: ${jsonObject}. Now when you generate your result, this should be the prompt that you base the strings in your JSON off of: ${apiPrompt}.`
            }
          ]
        }
      ),
      axios(config)
    ]);
    let endResult;
    try {
        endResult = JSON.parse(storyData.choices[0].message.content);
        if (typeof endResult !== 'object' || endResult === null) {
            throw new Error(`endResult is not an object: ${endResult}`);
        }
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
    
    if (endResult) {
        dispatch({ type: 'UPDATE_DATA', payload: { ...endResult, imgResult: imgRes.data.data[0].url } });
        dispatch({ type: 'UPDATE_HISTORY', payload: endResult.summary });
    }
    

  } catch (error) {
    console.error(error);
    dispatch({ type: 'ERROR' });
  }
}



export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onSubmit = (event) => {
    event.preventDefault();
    dispatch({ type: 'STORY_START' });
    // Use the user's input directly as the newPrompt without adding it to the history
    const newPrompt = state.userInput;
    // console.log('after onsubmit: newPrompt:', newPrompt);

    onSubmitHandling(newPrompt, state, dispatch, state.artStyle);
  };
  
  const onSubmitButton = (event) => {
    event.preventDefault();
    dispatch({ type: 'STORY_START' });
    let triggerEvent = Math.floor((Math.random() * 10) + 1);
    dispatch({ type: 'UPDATE_TRIGGER', payload: triggerEvent });
    // Use the user's choice directly as the newPrompt
    const newPrompt = 'You ' + state.userInput;
    onSubmitHandling(newPrompt, state, dispatch, state.artStyle);
  };
  
  

  // Render function starts here
  // console.log(state.result, state.leftButton, state.rightButton, state.leftTwoButton, state.rightTwoButton, state.randomEvent);

return (
  <div>
    <Head>
      <title>What Now?</title>
      <link rel="icon" href="/badlibs.png" />
    </Head>

    <main className={styles.main}>
      <img src="/badlibs.png" className={styles.icon} />
      <h3>What Now?</h3>
      {state.imgResult === 'loading' && <Loading />}
      {!state.storyStarting && <form onSubmit={onSubmit}>
        {!state.result && (
          <input
            type="text"
            name="prompty"
            placeholder="Enter a prompt"
            value={state.userInput}
            onChange={(e) => dispatch({ type: 'UPDATE_USER_INPUT', payload: e.target.value })}
          />
        )}
        {!state.result && <button type="submit">Generate Story</button>}
      </form>}
      {state.imgResult !== '' && state.imgResult !== 'loading' && <img src={state.imgResult} width="200px" />}
      {state.pageError && <h4 className={styles.error}>Due to AI limitations or banned request, this prompt cannot be completed.</h4>}
      {state.pageError && <h5 className={styles.error2}>Please refresh the page</h5>}

      <div className={styles.result}>{state.result}</div>
      <form onSubmit={onSubmitButton} className={styles.buttonbox}>
        {state.result && !state.leftButton && !state.rightButton && !state.leftTwoButton && !state.rightTwoButton && <h3>Game Over</h3>}
        {state.imgResult !== 'loading' && (state.triggerNumber === 10 || state.triggerNumber === 1) && state.result && state.randomEvent &&
          <div className={styles.achievement}>
            <img alt="star" src="/star-shape.png" width="20px" height="20px"></img>
            <h4 className={styles.congrats}> &nbsp;&nbsp;Congratulations!&nbsp; </h4>
            <h4
              className={styles.random}
              name="prompty"
            >{state.randomEvent} &nbsp;&nbsp;</h4>
            <img alt="star" src="/star-shape.png" width="20px" height="20px"></img>
          </div>
        }
        {state.imgResult !== 'loading' && state.result && state.leftButton &&
          <button
            className={styles.button}
            type="submit"
            name="prompty"
            value={state.leftButton}
            onClick={(e) => dispatch({ type: 'UPDATE_USER_INPUT', payload: e.target.value })}
          >{state.leftButton}</button>
        }
        {state.imgResult !== 'loading' && state.result && state.rightButton &&
          <button
            className={styles.button}
            type="submit"
            name="prompty"
            value={state.rightButton}
            onClick={(e) => dispatch({ type: 'UPDATE_USER_INPUT', payload: e.target.value })}
          >{state.rightButton}</button>
        }
        {state.imgResult !== 'loading' && state.result && state.leftTwoButton &&
          <button
            className={styles.button}
            type="submit"
            name="prompty"
            value={state.leftTwoButton}
            onClick={(e) => dispatch({ type: 'UPDATE_USER_INPUT', payload: e.target.value })}
          >{state.leftTwoButton}</button>
        }
        {state.imgResult !== 'loading' && state.result && state.rightTwoButton &&
          <button
            className={styles.button}
            type="submit"
            name="prompty"
            value={state.rightTwoButton}
            onClick={(e) => dispatch({ type: 'UPDATE_USER_INPUT', payload: e.target.value })}
          >{state.rightTwoButton}</button>
        }
      </form>
      <span className="attribute"><a href="https://iconscout.com/icons/star-shape" target="_blank">Star Shape Icon</a> by <a href="https://iconscout.com/contributors/unicons">Unicons Font</a> on <a href="https://iconscout.com">IconScout</a> and <a target="_blank" rel="noopener noreferrer" href="https://iconscout.com/lottie/loading-state-3830434">Loading Icon</a> courtesy of Fujio Studio</span>
      <button onClick={() => dispatch({ type: 'SET_SHOW', payload: true })}>Settings</button>
      <Modal onClose={() => dispatch({ type: 'SET_SHOW', payload: false })} show={state.show} artStyle={state.artStyle} setArtStyle={(value) => dispatch({ type: 'SET_ART_STYLE', payload: value })} />
    </main>
  </div>
);

}
