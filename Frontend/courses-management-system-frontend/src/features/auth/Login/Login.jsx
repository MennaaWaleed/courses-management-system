import { useState } from "react";
import "./Login.css";
import api from "../../../api/axios.js";

function Login() {
    console.log("Login rendered");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password,
                }
            );

            console.log(response.data);

            localStorage.setItem("token", response.data.token);

            alert("Login successful!");
        } catch (error) {
            console.error(error);

            if (error.response) {
                alert(error.response.data.message);
            } else {
                alert("Something went wrong.");
            }
        }
    };

    return (
        <div className="login">
                <h1>Login</h1>

                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={handleLogin}>
                    Login
                </button>
            </div>

    );
}

export default Login;