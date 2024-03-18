import "./App.css";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MenuBar from "./components/MenuBar";

import { AuthContext } from "./context/auth";
import { useContext } from "react";
import SinglePost from "./pages/SinglePost";

function App() {
  const { user } = useContext(AuthContext);
  return (
      <Router>
        <Container>
          <MenuBar />
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={user?<Navigate to='/'/>:<Login />} />
            <Route exact path="/register" element={user?<Navigate to='/'/>:<Register />} />
            <Route exact path='/posts/:postId' element={<SinglePost/>}/>
          </Routes>
        </Container>
      </Router>

  );
}

export default App;
