import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompty: userInput }),
    });
    const data = await response.json();
    setResult(data.result);
    setUserInput("");
  }

  return (
    <div>
      <Head>
        <title>HowieGen</title>
        <link rel="icon" href="/kyle.jpg" />
      </Head>

      <main className={styles.main}>
        <img src="/kyle.jpg" className={styles.icon} />
        <h3>HowieGen</h3>
        <h3>Is down for maintenance</h3>
        {/* <form onSubmit={onSubmit}>
          <input
            type="text"
            name="prompty"
            placeholder="Enter a prompt"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <input type="submit" value="Generate Text" />
        </form> */}
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
