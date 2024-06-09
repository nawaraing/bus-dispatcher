import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    // console.log(localStorage.getItem("token"));

    navigate('/');
  }, [navigate]);

  return null; // null을 반환하여 렌더링이 필요하지 않음을 나타냄

  return (
    <>
    </>
  );
};

export default Logout;
