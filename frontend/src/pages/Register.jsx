import React, { useState } from "react";
import api from "../services/api";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [message, setMessage] = useState("")

  const handleSubmit= async function(e){
    e.preventDefault()
    const data={
      fullName:String(fullName),
      email:String(email),
      password:String(password),
      code:String(invitationCode)
    }
    try {
     const response = await api.post("/api/auth/register",data)
      setMessage(response.data.message)
    } catch (error) {
      setMessage(error.response?.data?.message)
    }
  }
  return (
    <div>
      <h1>Create Your Account</h1>
      <p>Join the DNEG Community</p>
      {message && <p>{message}</p>}
      <form  onSubmit={handleSubmit}>
        <label htmlFor="fullName">Full Name</label>
        <input onChange={(e) => {
          setFullName(e.target.value)
        }
        } type="text" value={fullName} id="fullName" name="fullName" required />

        <label htmlFor="email">Email</label>
        <input onChange={(e) => {
          setEmail(e.target.value)}} type="email" value={email}  id="email" name="email" required />

        <label htmlFor="password">Password</label>
        <input onChange={(e) => {
          setPassword(e.target.value)}}  type="password" value={password}  id="password" name="password" required />

        <label htmlFor="invitationCode">Invitation Code</label>
        <input onChange={(e) => {
          setInvitationCode(e.target.value)}}  type="text" value={invitationCode}  id="invitationCode" name="invitationCode" required />

        <button  type="submit">Register</button>

        
        
      </form>
    </div>
  );
};

export default Register;
