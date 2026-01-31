import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";

import JobsPage from "./pages/Jobs";
import CreateJobPage from "./pages/CreateJob";
import ApplyPage from "./pages/Apply";
import MyJobsPage from "./pages/MyJobs";

import './pdfWorker'
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Enable2FaPage } from "./pages/Enable2Fa";
import { ResetPasswordPage } from "./pages/ResetPassword";

function App() {
  return <>
  
    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com"/>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"></link>

    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/apply/:jobId" element={<ApplyPage />} />
      <Route path="/enable-2fa" element={<Enable2FaPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      <Route
        element={<ProtectedRoute allowedRoles={["EMPLOYER", "ADMIN"]} />}
      >
        <Route path="/create-job" element={<CreateJobPage />} />
        <Route path="/my-jobs" element={<MyJobsPage />} />
      </Route>
    </Routes>
  </>
}

export default App;