import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState("");
  const [leftButton, setLeftButton] = useState("");
  const [rightButton, setRightButton] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    console.log("userInput", userInput);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompty: userInput }),
    });
    const data = await response.json();
    const newData = JSON.parse(data.result);
    setResult(newData.context);
    setLeftButton(newData.leftButton);
    setRightButton(newData.rightButton);
    setUserInput("");
  }
  async function onSubmitButton(event) {
    event.preventDefault();
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompty: "You " + userInput }),
    });
    const data = await response.json();
    const newData = JSON.parse(data.result);
    setResult(newData.context);
    setLeftButton(newData.leftButton);
    setRightButton(newData.rightButton);
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
        <form onSubmit={onSubmit}>
          {!result && (
            <input
              type="text"
              name="prompty"
              placeholder="Enter a prompt"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
          )}
          {!result && <input type="submit" value="Generate Text" />}
        </form>
        <div className={styles.result}>{result}</div>
        <form onSubmit={onSubmitButton} className={styles.buttonbox}>
          {result && (
            <input
              className={styles.button}
              type="submit"
              name="prompty"
              value={leftButton}
              onClick={(e) => setUserInput(e.target.value)}
            />
          )}
          {result && (
            <input
              className={styles.button}
              type="submit"
              name="prompty"
              value={rightButton}
              onClick={(e) => setUserInput(e.target.value)}
            />
          )}
        </form>
      </main>
    </div>
  );
}
