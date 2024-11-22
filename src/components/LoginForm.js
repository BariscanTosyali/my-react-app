import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm = ({ onLogin, onSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Giriş işlemini gerçekleştiren fonksiyon
  const handleSubmit = (e) => {
    e.preventDefault(); // Formun varsayılan submit davranışını durdurur
    onLogin(username, password); // OnLogin fonksiyonunu tetikler
  };

  // Kayıt olma işlemini gerçekleştiren fonksiyon
  const handleSignup = (e) => {
    e.preventDefault(); // Formun varsayılan submit davranışını durdurur
    onSignup(username, password); // OnSignup fonksiyonunu tetikler
  };

  return (
    <div className="login-form">
      <h2>Login or Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        <button type="button" onClick={handleSignup}>Sign Up</button>
      </form>
    </div>
  );
};

export default LoginForm;
