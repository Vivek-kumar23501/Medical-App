import React, { Component } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
  Row,
  Col,
} from "reactstrap";
import { Link } from "react-router-dom";

class ExpertNavbar extends Component {
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
        <style>
          {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Roboto+Slab:wght@400;500;700&display=swap');

          * {
            font-family: "Poppins", sans-serif;
          }

          body {
            padding-top: 135px; /* space for top logo bar + navbar */
          }

          @media (max-width: 767px) {
            body {
              padding-top: 105px; /* mobile view */
            }
          }

          /* TOP LOGO BAR */
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

          @media (max-width: 767px) {
            .top-logo-bar img {
              height: 45px;
            }
          }

          /* MAIN NAVBAR */
          .custom-navbar {
            position: fixed;
            top: 85px; /* below top logo bar */
            width: 100%;
            background: #ffffff;
            min-height: 70px;
            border-bottom: 2px solid #00acc1;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            z-index: 1040;
          }
            @media (max-width: 767px) {
            .custom-navbar{
            margin-top:20px;
            }
          }

          .navbar-brand {
            font-family: 'Roboto Slab', serif;
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
            transition: 0.2s;
            border-radius: 6px;
          }

          .nav-link:hover {
            color: #ffffff !important;
            background: #00acc1;
            transform: translateY(-1px);
          }

          .dropdown-menu {
            border-radius: 8px;
            padding: 8px 0;
            border: 1px solid #b2ebf2;
            box-shadow: 0 4px 8px rgba(0,0,0,0.05);
          }

          .dropdown-item {
            padding: 8px 20px;
            font-weight: 500;
            font-size: 14px;
          }

          .dropdown-item:hover {
            background: #b2ebf2;
            color: #00695c;
          }

          .login-btn {
            background: linear-gradient(to right, #00796b, #00acc1);
            border: none;
            padding: 8px 24px;
            font-size: 15px;
            font-weight: 600;
            border-radius: 8px;
            color: white;
            transition: 0.2s;
          }

          .login-btn:hover {
            background: linear-gradient(to right, #004d40, #0097a7);
            transform: translateY(-1px);
          }
        `}
        </style>

        {/* TOP LOGO BAR */}
        <div className="top-logo-bar">
          <Container fluid>
            <Row className="align-items-center">
              <Col xs="12" md="6" className="d-flex justify-content-center justify-content-md-start">
                <img src="/who.jpeg" alt="WHO" />
                <img src="Ayushman.png" alt="Ayushman Bharat" />
                <img src="/minstry.png" alt="Ministry Health" />
                <img src="/Sihlogo.png" alt="SIH" />
              </Col>

              <Col xs="12" md="6" className="d-flex justify-content-center justify-content-md-end mt-2 mt-md-0">
                <UncontrolledDropdown>
                  <DropdownToggle
                    caret
                    className="nav-link"
                    style={{ background: "#e0f7fa", borderRadius: "8px", fontWeight: 500 }}
                  >
                    Language
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>English</DropdownItem>
                    <DropdownItem>Hindi</DropdownItem>
                    <DropdownItem>Odia</DropdownItem>
                    <DropdownItem>Urdu</DropdownItem>
                    <DropdownItem>Other Languages</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Col>
            </Row>
          </Container>
        </div>

        {/* MAIN NAVBAR */}
        <Navbar expand="lg" light className="custom-navbar px-4">
          <NavbarBrand tag={Link} to="/">
            <img src="/MedPulse logo.jpg" alt="MedPulse Logo" />
            MedPulse
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="mx-auto" navbar>
              <NavItem>
                <NavLink tag={Link} to="/">Home</NavLink>
              </NavItem>

              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret className="nav-link">Preventive Healthcare</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem tag={Link} to="/health-awareness">Health Awareness</DropdownItem>
                  <DropdownItem tag={Link} to="/hygiene">Hygiene Practices</DropdownItem>
                  <DropdownItem tag={Link} to="/nutrition">Nutrition Guide</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>

              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret className="nav-link">Diseases & Symptoms</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem tag={Link} to="/common-diseases">Common Diseases</DropdownItem>
                  <DropdownItem tag={Link} to="/symptom-checker">Symptom Checker</DropdownItem>
                  <DropdownItem tag={Link} to="/early-detection">Early Detection</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>

              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret className="nav-link">Vaccinations</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem tag={Link} to="/child-vaccines">Child Vaccination</DropdownItem>
                  <DropdownItem tag={Link} to="/adult-vaccines">Adult Vaccination</DropdownItem>
                  <DropdownItem tag={Link} to="/govt-programs">Govt Programs</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>

              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret className="nav-link">AI Chatbot</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem tag={Link} to="/whatsapp-bot">WhatsApp Bot</DropdownItem>
                  <DropdownItem tag={Link} to="/sms-bot">SMS Bot</DropdownItem>
                  <DropdownItem tag={Link} to="/web-chat">Web Chatbot</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>

            <Button className="login-btn" tag={Link} to="/login">Login</Button>
          </Collapse>
        </Navbar>
      </>
    );
  }
}

export default ExpertNavbar;
