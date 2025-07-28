import './App.css';
import React, { useEffect } from 'react';

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
  const specialIndex = parseInt(hashHex.substr(0, 8), 16) % specials.length;
  const insertPos = parseInt(hashHex.substr(8, 8), 16) % password.length;
  
  return password.slice(0, insertPos) + specials[specialIndex] + password.slice(insertPos);
}

function App() {
  const [site, setSite] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [master, setMaster] = React.useState("");
  const [generated, setGenerated] = React.useState("");

  // Create animated background elements
  useEffect(() => {
    // Create matrix rain effect
    const createMatrixRain = () => {
      const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
      const container = document.querySelector('.animated-bg');
      
      for (let i = 0; i < 15; i++) {
        const span = document.createElement('span');
        span.className = 'matrix-rain';
        span.style.left = Math.random() * 100 + '%';
        span.style.animationDuration = (Math.random() * 3 + 2) + 's';
        span.style.animationDelay = Math.random() * 2 + 's';
        span.textContent = chars[Math.floor(Math.random() * chars.length)];
        container.appendChild(span);
      }
    };

    // Create floating bubbles
    const createBubbles = () => {
      const container = document.querySelector('.animated-bg');
      
      for (let i = 0; i < 8; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.width = bubble.style.height = Math.random() * 60 + 20 + 'px';
        bubble.style.animationDuration = (Math.random() * 4 + 6) + 's';
        bubble.style.animationDelay = Math.random() * 4 + 's';
        container.appendChild(bubble);
      }
    };

    createMatrixRain();
    createBubbles();

    // Clean up function
    return () => {
      const container = document.querySelector('.animated-bg');
      if (container) {
        container.innerHTML = '';
      }
    };
  }, []);

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
      <div className="animated-bg"></div>
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
