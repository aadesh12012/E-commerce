import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout, { AuthFooterLink, AuthLink } from "../components/ui/AuthLayout";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";

function Regester() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    axios
      .post(
        "http://localhost:3000/create",
        { name, email, password },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.success) {
          navigate("/");
        } else {
          setError(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Something went wrong. Please try again.");
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <AuthLayout title="Create account" subtitle="Join Black Lake to start shopping.">
      <Card padding="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <Alert variant="error">{error}</Alert>}

          <Input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <AuthFooterLink>
          Already have an account? <AuthLink to="/">Sign in</AuthLink>
        </AuthFooterLink>
      </Card>
    </AuthLayout>
  );
}

export default Regester;
