import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'universal-cookie';

export default function Login() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const handleUserNameOnChange = (e) => {
    e.preventDefault();
    setUserName(e.target.value);
  };
  const handlePasswordOnChange = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const loginRes = await fetch("http://localhost:3000/auth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userName,
        password,
      }),
    });
    new Cookies().set('token', (await loginRes.json()).token, { path: '/' });
    navigate("/home");
  };
  return (
    <div>
      <form onSubmit={(e) => handleFormSubmit(e)}>
        <div>
          <label>username</label>
          <input
            id="username"
            onChange={(e) => handleUserNameOnChange(e)}
          ></input>
        </div>
        <div>
          <label>password</label>
          <input
            id="password"
            onChange={(e) => handlePasswordOnChange(e)}
          ></input>
        </div>
        <button type="submit">log in</button>
      </form>
    </div>
  );
}
