import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";
import axios from 'axios';
import Loading from './Loading';
import Modal from "./Modal/Modal";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState("");
  const [leftButton, setLeftButton] = useState("");
  const [rightButton, setRightButton] = useState("");
  const [leftTwoButton, setLeftTwoButton] = useState("");
  const [rightTwoButton, setRightTwoButton] = useState("");
  const [randomEvent, setRandomEvent] = useState("");
  const [triggerNumber, setTriggerNumber] = useState(0);
  const [imgResult, setImgResult] = useState("");
  const [show, setShow] = useState(false);
  const [artStyle, setArtStyle] = useState("digital art");
  const [storyStarting, setStoryStarting] = useState(false);
  const [pageError, setPageError] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setStoryStarting(true);
    setImgResult('loading');
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompty: userInput }),
    });

    var imgdata = JSON.stringify({
      "prompt": userInput + `, ${artStyle}`,
      "n": 1,
      "size": "1024x1024"
    });

    var config = {
      method: 'post',
      url: 'https://api.openai.com/v1/images/generations',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: imgdata
    };
    axios(config)
      .then(function (res) {
        setImgResult(res.data.data[0].url);
      })
      .catch(function (error) {
        console.log(error);
        setPageError(true);
      });

    const data = await response.json();
    const newData = JSON.parse(data.result);
    setResult(newData.context);
    setLeftButton(newData.leftButton);
    setRightButton(newData.rightButton);
    setLeftTwoButton(newData.leftTwoButton);
    setRightTwoButton(newData.rightTwoButton);
    setRandomEvent(newData.randomEvent);
    setStoryStarting(false);
    setUserInput("");
  }
  async function onSubmitButton(event) {
    event.preventDefault();
    setImgResult('loading');
    let triggerEvent = Math.floor((Math.random() * 10) + 1);
    setTriggerNumber(triggerEvent);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompty: "You " + userInput }),
    });
    const data = await response.json();
    const newData = JSON.parse(data.result);

    var imgdata = JSON.stringify({
      "prompt": "You " + userInput + `, ${artStyle}`,
      "n": 1,
      "size": "1024x1024"
    });

    var config = {
      method: 'post',
      url: 'https://api.openai.com/v1/images/generations',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: imgdata
    };

    axios(config)
      .then(function (res) {
        setImgResult(res.data.data[0].url);
      })
      .catch(function (error) {
        console.log(error);
        setPageError(true);
      });

    setResult(newData.context);
    setLeftButton(newData.leftButton);
    setRightButton(newData.rightButton);
    setLeftTwoButton(newData.leftTwoButton);
    setRightTwoButton(newData.rightTwoButton);
    setRandomEvent(newData.randomEvent);
    setUserInput("");
  }
  return (
    <div>
      <Head>
        <title>What Now?</title>
        <link rel="icon" href="/badlibs.png" />
      </Head>

      <main className={styles.main}>
        <img src="/badlibs.png" className={styles.icon} />
        <h3>What Now?</h3>
        {imgResult === 'loading' && <Loading />}
        {!storyStarting && <form onSubmit={onSubmit}>
          {!result && (
            <input
              type="text"
              name="prompty"
              placeholder="Enter a prompt"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          )}
          {!result && <button type="submit">Generate Story</button>}
        </form>}
        {imgResult !== '' && imgResult !== 'loading' && <img src={imgResult} width="200px" />}
          {pageError && <h4 className={styles.error}>Due to AI limitations or banned request, this prompt cannot be completed.</h4>}
          {pageError && <h5 className={styles.error2}>Please refresh the page</h5>}

        <div className={styles.result}>{result}</div>
        <form onSubmit={onSubmitButton} className={styles.buttonbox}>
          {result && !leftButton && !rightButton && !leftTwoButton && !rightTwoButton && <h3>Game Over</h3>}
          {imgResult !== 'loading' && (triggerNumber === 10 || triggerNumber === 1) && result && randomEvent &&
            <div className={styles.achievement}>
              <img alt="star" src="/star-shape.png" width="20px" height="20px"></img>
              <h4 className={styles.congrats}> &nbsp;&nbsp;Congratulations!&nbsp; </h4>
              <h4
                className={styles.random}
                name="prompty"
              >{randomEvent} &nbsp;&nbsp;</h4>
              <img alt="star" src="/star-shape.png" width="20px" height="20px"></img>
            </div>
          }
          {imgResult !== 'loading' && result && leftButton &&
            <button
              className={styles.button}
              type="submit"
              name="prompty"
              value={leftButton}
              onClick={(e) => setUserInput(e.target.value)}
            >{leftButton}</button>
          }
          {imgResult !== 'loading' && result && rightButton &&
            <button
              className={styles.button}
              type="submit"
              name="prompty"
              value={rightButton}
              onClick={(e) => setUserInput(e.target.value)}
            >{rightButton}</button>
          }
          {imgResult !== 'loading' && result && leftTwoButton &&
            <button
              className={styles.button}
              type="submit"
              name="prompty"
              value={leftTwoButton}
              onClick={(e) => setUserInput(e.target.value)}
            >{leftTwoButton}</button>
          }
          {imgResult !== 'loading' && result && rightTwoButton &&
            <button
              className={styles.button}
              type="submit"
              name="prompty"
              value={rightTwoButton}
              onClick={(e) => setUserInput(e.target.value)}
            >{rightTwoButton}</button>
          }
        </form>
        <span className="attribute"><a href="https://iconscout.com/icons/star-shape" target="_blank">Star Shape Icon</a> by <a href="https://iconscout.com/contributors/unicons">Unicons Font</a> on <a href="https://iconscout.com">IconScout and </a><a target="_blank" rel="noopener noreferrer" href="https://iconscout.com/lottie/loading-state-3830434">Loading Icon</a> courtesy of Fujio Studio</span>
        <button onClick={() => setShow(true)}>Settings</button>
        <Modal onClose={() => setShow(false)} show={show} artStyle={artStyle} setArtStyle={setArtStyle} />
      </main>
    </div>
  );
}
