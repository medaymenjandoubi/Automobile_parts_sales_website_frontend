import React, { useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Nav } from "react-bootstrap";
import logobousnina from "../assets/logobousnina.jpg";
import { UserContext } from '../context/userContext';
import { Context } from "../context";

const NavbarComponent = () => {

    const { dispatch } = useContext(Context);
    const [user, setUser] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
      }, [location]);
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/" style={{width:"7%",marginLeft:"10px"}}>
        <img
          src={logobousnina}
          style={{height:"12vh"}}
        ></img>
        </Navbar.Brand>
        {user && user.role == "Admin" && (
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link
                as={NavLink}
                to="/admin/pieces"
                activeClassName="active-link"
              >
                Gérer les pièces
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/admin/TypePiece"
                activeClassName="active-link"
              >
                Gérer les types de pièces
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/admin/marques"
                activeClassName="active-link"
              >
                Gérer les marques de pièces
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/admin/TypeVoiture"
                activeClassName="active-link"
              >
                Gérer les types des voitures
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/admin/MarqueVoiture"
                activeClassName="active-link"
              >
                Gérer les marques des voitures
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
    
        )}
      
            

    </Navbar>
  );
};

export default NavbarComponent;
