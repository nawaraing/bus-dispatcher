import React from 'react';

const NavBar: React.FC = () => {
  const name = localStorage.getItem("name");
  return (
    <nav
      className="layout-navbar container-fluid navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
      id="layout-navbar"
      >
      <div className="navbar-nav-left d-flex align-items-center" id="navbar-collapse">
        <ul className="navbar-nav flex-row align-items-center ms-auto">
          <li className="nav-item lh-1 me-3">
            <a href="home" className="fw-semibold d-block mb-1">홈</a>
          </li>
          <li className="nav-item lh-1 me-3">
            <a href="#" className="text-nowrap fw-semibold d-block mb-1">근무 관리</a>
          </li>
          <li className="nav-item lh-1 me-3">
            <a href="dispatch" className="text-nowrap fw-semibold d-block mb-1">배차 관리</a>
          </li>
          <li className="nav-item lh-1 me-3">
            <a href="#" className="text-nowrap fw-semibold d-block mb-1">자원 관리</a>
          </li>
        </ul>
      </div>
      <div className="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
        <ul className="navbar-nav flex-row align-items-center ms-auto">
        <li className="nav-item lh-1">
            <div className="text-nowrap fw-bold">{name}</div>
          </li>
          <li className="nav-item lh-1 me-3">
            님
          </li>
          <li className="nav-item lh-1 me-3">
            <a href="logout" className="text-nowrap fw-semibold d-block mb-1">Logout</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
