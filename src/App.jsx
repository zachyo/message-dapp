import { useState } from "react";
import abi from "./abi.json";
import { ethers } from "ethers";

const contractAddress = "0x9D1eb059977D71E1A21BdebD1F700d4A39744A70";

function App() {
  const [text, setText] = useState("");
  const [hash, setHash] = useState("");
  const [settingBool, setSettingBool] = useState(false);
  const [getBool, setGetBool] = useState(false);
  const [message, setMessage] = useState("");

  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  const handleSet = async () => {
    try {
      if (!text) {
        alert("Please enter a message before setting.");
        return;
      }

      if (window.ethereum) {
        setSettingBool(true);
        setHash("");
        setMessage("");
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        console.log("Setting message:", text);
        const tx = await contract.setMessage(text);
        const txReceipt = await tx.wait();
        setHash(tx.hash);
        setText("");
        setSettingBool(false);
        console.log("Transaction successful:", txReceipt);
      } else {
        console.error(
          "MetaMask not found. Please install MetaMask to use this application."
        );
        setSettingBool(false);
      }
    } catch (error) {
      console.error("Error setting message:", error);
      setSettingBool(false);
      alert(error.message || error);
    }
  };

  const handleGet = async () => {
     try {
    

      if (window.ethereum) {
        setGetBool(true);
        await requestAccount();
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);
        console.log("Getting message:", text);
        const message = await contract.getMessage();
        setMessage(message);
        setGetBool(false);
      } else {
        console.error(
          "MetaMask not found. Please install MetaMask to use this application."
        );
        setGetBool(false);
      }
    } catch (error) {
      console.error("Error getting message:", error);
      setGetBool(false);
      alert(error.message || error);
    }
  };

  return (
    <div style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
      <h1>Set Message on Smart Contract</h1>
      <input
        type="text"
        placeholder="Set message"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", fontSize: "1rem" }}
      />
      <button onClick={handleSet}>{settingBool ? "Setting..." : "Set Message"}</button>
      {hash && (
        <p style={{ marginTop: "1rem", wordBreak: "break-all" }}>
          Transaction successful: {hash}
        </p>
      )}
      <button onClick={handleGet} style={{ marginTop: "1rem" }}>
        {getBool ? "Getting..." : "Get Message"}
      </button>
      {message && (
        <p style={{ marginTop: "1rem" }}>Message retrieved: {message}</p>
      )}
    </div>
  );
}

export default App;
