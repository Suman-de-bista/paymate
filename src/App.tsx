import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import PrivateRoute from "./components/PrivateRoute";
import GroupPage from "./pages/GroupPage";
import Layout from "./components/Layout";
import GroupDetailsPage from "./pages/GroupDetailsPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
            <Route path="dashboard" element={<HomePage />} />
           <Route path="groups" element={<GroupPage />} />
           <Route path="groups/:groupId" element={<GroupDetailsPage />} />
           <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
