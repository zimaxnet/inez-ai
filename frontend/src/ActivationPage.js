import React, { useState } from 'react';

const ActivationPage = () => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Get email from MSAL context or other state
    const email = "user@example.com"; // Placeholder
    
    // Call the backend to activate the account
    const response = await fetch('/api/auth/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, code }),
    });
    
    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <div>
      <h2>Activate Your Account</h2>
      <p>Please enter the activation code sent to your email.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Activation Code"
        />
        <button type="submit">Activate</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ActivationPage; 