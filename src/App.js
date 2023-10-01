import { useContext } from 'react';
import './App.scss';
import { Home } from './pages/home';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

function App() {

  const {currentUser}=useContext(AuthContext)

  //Creating an additional protected route to check if any current user has logged in or not
  const ProtectedRoute = ({children}) => {
    //If there is no current user navigate to '/login' page
    if(!currentUser){
      return <Navigate to="/login" />
    }
    return children;
  }

  return (
    <div className="App">
     <Router>
      <Routes>
        <Route path="/">
        <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        <Route path="register" element={<Register/>}/>
        <Route path="login" element={<Login/>}/> 
        </Route>
      </Routes>
     </Router>
    </div>
  );
}

export default App;
