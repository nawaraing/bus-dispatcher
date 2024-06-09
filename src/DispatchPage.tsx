import React, { useEffect } from 'react';
import NavBar from './NavBar';
import DispatchTable from './DispatchTable';
import { useNavigate } from 'react-router-dom';

const DispatchPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/');
  }}, [navigate]);

  return (
    <div>
      <NavBar />
      <div className="content-wrapper">
        <div className="container-fluid flex-grow-1 container-p-y">
          <DispatchTable />
        </div>
      </div>
    </div>
  );
};

export default DispatchPage;
