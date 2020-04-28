import React, { useState } from 'react';

import { Nav, Navbar} from "react-bootstrap";
import { ReactComponent as Logo } from '../../logo.svg';

// Sandwich menu based on https://codesandbox.io/s/rnud4?file=/src/App.js:110-162
const Header = () => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="#home">
        <Logo
          alt=""
          width="30"
          height="30"
          className="d-inline-block align-top"
        />
        Sistemas Operacionais
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/page-replacement-algorithm">Substituição de páginas</Nav.Link>
        </Nav>
        <Nav>
          <Nav.Link href="/about">Sobre o projeto</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Header;
