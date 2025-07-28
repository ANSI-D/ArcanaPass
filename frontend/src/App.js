import './App.css';
import React from 'react';

// Simple deterministic password generation function
async function generatePassword(site, username, masterPassword) {
  // Combine all inputs
  const input = `${masterPassword}:${username}@${site}`;
  
  // Use Web Crypto API to generate a hash
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert to base64 and then to alphanumeric
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Convert to alphanumeric password
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  
  // Use chunks of the hex hash to generate password characters
  for (let i = 0; i < 16; i++) {
    const chunk = hashHex.substr(i * 4, 4);
    const num = parseInt(chunk, 16);
    password += chars[num % chars.length];
  }
  
  // Add some special characters for complexity
  const specials = '!@#$%^&*';
  const specialIndex1 = parseInt(hashHex.substr(0, 8), 16) % specials.length;
  const specialIndex2 = parseInt(hashHex.substr(8, 8), 16) % specials.length;
  const insertPos1 = parseInt(hashHex.substr(16, 8), 16) % password.length;
  const insertPos2 = parseInt(hashHex.substr(24, 8), 16) % (password.length + 1);
  
  // Insert first special character
  let result = password.slice(0, insertPos1) + specials[specialIndex1] + password.slice(insertPos1);
  
  // Insert second special character (adjust position since string is now longer)
  const adjustedPos2 = insertPos2 <= insertPos1 ? insertPos2 : insertPos2 + 1;
  result = result.slice(0, adjustedPos2) + specials[specialIndex2] + result.slice(adjustedPos2);
  
  return result;
}

function App() {
  const [site, setSite] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [master, setMaster] = React.useState("");
  const [generated, setGenerated] = React.useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      const password = await generatePassword(site, username, master);
      setGenerated(password);
    } catch (error) {
      console.error('Error generating password:', error);
      setGenerated('Error generating password');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>ArcanaPass</h1>
        <h3 className="subtitle">Stateless Password Generator</h3>
        <form onSubmit={handleGenerate} className="password-form">
          <input
            type="text"
            placeholder="Site/App Name"
            value={site}
            onChange={e => setSite(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="text"
            placeholder="Username/Email"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="input-field"
            required
          />
          <input
            type="password"
            placeholder="Master Password"
            value={master}
            onChange={e => setMaster(e.target.value)}
            className="input-field"
            required
          />
          <button type="submit" className="generate-btn">Generate Password</button>
        </form>
        {generated && (
          <div className="result-container">
            <div className="result-label">Generated Password:</div>
            <div className="generated-password">{generated}</div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
