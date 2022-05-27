import { Route, Routes } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import RequiresAuth from './RequiresAuth';
import HomePage from '../pages/HomePage';
import { useState } from 'react';
import { User } from '../authentication/User';

const AppRoutes = () => {
  // we get the user from the localStorage because that's where we will save their account on the login process
  const userString = window.localStorage.getItem('user');

  const [user, setUser] = useState<User | undefined>(
    userString ? JSON.parse(userString) : undefined
  );
  return (
    <Routes>
      <Route path="/login" element={<LoginPage setUser={setUser} />} />
      <Route path="/" element={<RequiresAuth user={user} />}>
        <Route index element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
