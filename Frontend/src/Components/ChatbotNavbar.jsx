import React, { Component } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  Row,
  Col,
} from "reactstrap";
import { Link } from "react-router-dom";

class DashboardNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

          * {
            font-family: "Poppins", sans-serif;
          }

          body {
            padding-top: 135px;
          }

          /* HIDE top logo bar on mobile */
          @media (max-width: 767px) {
            .top-logo-bar {
              display: none !important;
            }
            body {
              padding-top: 75px !important;
            }
          }

          .top-logo-bar {
            position: fixed;
            top: 0;
            width: 100%;
            background: #e0f7fa;
            border-bottom: 1px solid #b2ebf2;
            padding: 10px 0;
            z-index: 1050;
          }

          .top-logo-bar img {
            height: 65px;
            margin: 0 10px;
            object-fit: contain;
          }

          .custom-navbar {
            position: fixed;
            top: 85px;
            width: 100%;
            background: #ffffff;
            min-height: 70px;
            border-bottom: 2px solid #00acc1;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            z-index: 1040;
          }

          @media (max-width: 767px) {
            .custom-navbar {
              top: 0;
            }
          }

          .navbar-brand {
            font-size: 1.6rem !important;
            font-weight: 700 !important;
            color: #00695c !important;
            display: flex;
            align-items: center;
          }

          .navbar-brand img {
            height: 40px;
            margin-right: 10px;
          }

          .nav-link {
            font-weight: 500;
            font-size: 15px;
            color: #004d40 !important;
            padding: 8px 12px;
            border-radius: 6px;
            transition: 0.2s;
          }

          .nav-link:hover {
            color: #ffffff !important;
            background: #00acc1;
            transform: translateY(-1px);
          }

          .profile-img {
            height: 42px;
            width: 42px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #00acc1;
          }

          .dropdown-menu {
            border-radius: 8px;
            padding: 8px 0;
          }

          .logout-btn {
            color: #d50000 !important;
            font-weight: 600;
          }
        `}</style>

        {/* TOP LOGO BAR - Hidden on mobile */}
        <div className="top-logo-bar">
          <Container fluid>
            <Row className="align-items-center">
              <Col className="d-flex justify-content-center justify-content-md-start">
                <img src="/who.jpeg" alt="WHO" />
                <img src="/Ayushman.png" alt="Ayushman Bharat" />
                <img src="/minstry.png" alt="Ministry" />
                <img src="/Sihlogo.png" alt="SIH" />
              </Col>
            </Row>
          </Container>
        </div>

        {/* MAIN NAVBAR */}
        <Navbar expand="lg" light className="custom-navbar px-4">
          <NavbarBrand tag={Link} to="/dashboard">
            <img src="/MedPulse logo.jpg" alt="Logo" />
            MedPulse Dashboard
          </NavbarBrand>

          <NavbarToggler onClick={this.toggle} />

          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mx-auto" navbar>
              <NavItem><NavLink tag={Link} to="/dashboard">Dashboard</NavLink></NavItem>
              <NavItem><NavLink tag={Link} to="/dashboard/chatbot">Chatbot</NavLink></NavItem>
              <NavItem><NavLink tag={Link} to="/dashboard/alerts">Health Alerts</NavLink></NavItem>
              <NavItem><NavLink tag={Link} to="/dashboard/vaccinations">Vaccinations</NavLink></NavItem>
              <NavItem><NavLink tag={Link} to="/dashboard/health-queires">Health Queries</NavLink></NavItem>
            </Nav>

            {/* PROFILE */}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav>
                <img src="/default-profile.jpg" className="profile-img" alt="Profile" />
              </DropdownToggle>

              <DropdownMenu end>
                <DropdownItem tag={Link} to="/dashboard/profile">View Profile</DropdownItem>
                <DropdownItem tag={Link} to="/dashboard/edit-profile">Edit Profile</DropdownItem>
                <DropdownItem tag={Link} to="/dashboard/settings">Settings</DropdownItem>

                <DropdownItem divider />
                <DropdownItem tag={Link} to="/login" className="logout-btn">Logout</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Collapse>
        </Navbar>
      </>
    );
  }
}

export default DashboardNavbar;
