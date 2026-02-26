import React from 'react'
import { ExtractPatientData } from './ExtractPatientData'
import { CoraAIContainer } from './CoraAIContainer'
import { RestrictedUser } from './RestrictedUser'
import { useEffect, useState } from 'react'
export const Home = () => {
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    try {
      const storedUserString = localStorage.getItem('user');
      if (storedUserString) {
        const storedUser = JSON.parse(storedUserString);
        console.log(storedUser);
        if (storedUser && storedUser.role) {
          setUserRole(storedUser.role);
        }
      }
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
    }
  }, []);

  // This useEffect will run whenever userRole changes
  useEffect(() => {
    console.log("role", userRole);
  }, [userRole]);
  
  return (
    <CoraAIContainer showAvatar={true} showSearch={userRole === 'PROVIDER' ? true : false}>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {userRole === 'PROVIDER' ? <ExtractPatientData /> : <RestrictedUser/>}
      </div>
    </CoraAIContainer>
  )
}
