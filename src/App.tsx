
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import ProjectInfo from './pages/ProjectInfo';
import DistrictCropSelection from './pages/DistrictCropSelection';
import CoverSelection from './pages/CoverSelection';
import CustomCoverEditor from './pages/CustomCoverEditor';
import QuickTool from './pages/QuickTool';
import WeatherData from './pages/WeatherData';
import DataChecks from './pages/DataChecks';
import BurnCost from './pages/BurnCost';
import Summary from './pages/Summary';
import Users from './pages/Users';
import Help from './pages/Help';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/project-info" element={<ProjectInfo />} />
          <Route path="/district-crop-selection" element={<DistrictCropSelection />} />
          <Route path="/cover-selection" element={<CoverSelection />} />
          <Route path="/custom-cover-editor" element={<CustomCoverEditor />} />
          <Route path="/quick-tool" element={<QuickTool />} />
          <Route path="/weather-data" element={<WeatherData />} />
          <Route path="/data-checks" element={<DataChecks />} />
          <Route path="/burn-cost" element={<BurnCost />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/users" element={<Users />} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
