import React, { useState } from "react";
import { useRouter } from "next/router";

const API_BASE = "http://localhost:5000";

const Login = () => {
  const [aadhaar, setAadhaar] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("voter");
  const [specialkey, setSpecialKey] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // -------------------------
  // GEO LOCATION FUNCTION
  // -------------------------
  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          reject(err.message || "Location denied");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  // -------------------------
  // LOGIN FLOW
  // -------------------------
  const loginUser = async () => {
    if (loading) return;

    // basic validation
    if (!aadhaar || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    let token = null;

    // -------------------------
    // STEP 1: LOGIN REQUEST
    // -------------------------
    try {
      const payload = { aadhaar, password, role };

      if (role === "admin") {
        payload.specialkey = specialkey;
      }

      const res = await fetch(`${API_BASE}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || data.message || "Login failed");
        setLoading(false);
        return;
      }

      token = data.token;

      if (!token) {
        alert("Token not received");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      alert("Login successful");

    } catch (err) {
      console.log("LOGIN ERROR:", err);
      alert("Server error during login");
      setLoading(false);
      return;
    }

    // -------------------------
    // STEP 2: GET LOCATION
    // -------------------------
    let location;

    try {
      location = await getLocation();

      if (!location?.lat || !location?.lng) {
        alert("Invalid location detected");
        setLoading(false);
        return;
      }

      console.log("LOCATION:", location);

    } catch (err) {
      console.log("GEO ERROR:", err);
      alert("Please allow location access to continue");
      setLoading(false);
      return;
    }
    setLoading(false);

    // redirect after login
    router.push("/candidates");

  };


    

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">

        <h2 className="text-xl font-bold mb-4 text-center">
          Login
        </h2>

        {/* Aadhaar */}
        <input
          type="text"
          placeholder="Aadhaar"
          value={aadhaar}
          onChange={(e) => setAadhaar(e.target.value)}
          className="w-full p-2 border mb-3"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border mb-3"
        />

        {/* Admin toggle */}
        <label className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={role === "admin"}
            onChange={(e) =>
              setRole(e.target.checked ? "admin" : "voter")
            }
          />
          Admin Login
        </label>

        {/* Special key */}
        {role === "admin" && (
          <input
            type="password"
            placeholder="Special Key"
            value={specialkey}
            onChange={(e) => setSpecialKey(e.target.value)}
            className="w-full p-2 border mb-3"
          />
        )}

        {/* Button */}
        <button
          type="button"
          onClick={loginUser}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Processing..." : "Login"}
        </button>

      </div>
    </div>
  );
};

export default Login;