import './App.css'
import {
    BrowserRouter as Router,
    Route, Routes
} from 'react-router-dom';
import {Home} from "./pages/Home.jsx";
import {StatsTable} from "./pages/Stats/stats-table.jsx";
import {StatsTableNew} from "./pages/Stats/stats-table-new.jsx";
import {StatsChartsAg} from "./pages/Stats/stats-charts-ag.jsx";
import {StatsChartsAG2024} from "./pages/Stats/stats-charts-ag-24.jsx";
import {StatsChartsAGFiniteqES} from "./pages/Stats/stats-charts-finiteq-es.jsx";
import {StatsChartsAGFiniteqNQ} from "./pages/Stats/stats-charts-finiteq-nq.jsx";
import {Backtests} from "./pages/Backtests/Backtests.jsx";
import {BacktestsSanya} from "./pages/Backtests/Backtests-Sanya.jsx";
import {BacktestsTapok} from "./pages/Backtests-Tapok/Backtests-Tapok.jsx";
import {BacktestsTapokUS500} from "./pages/Backtests-Tapok-US500/Backtests-Tapok-US500.jsx";

function App() {
  return (
      <Router>
          <div>
              <Routes>
                  <Route exact path="/" element={<Home />} />
                  <Route path="/stats-table" element={<StatsTable />} />
                  <Route path="/stats-table-new" element={<StatsTableNew />} />
                  <Route path="/stats-charts" element={<StatsChartsAg />} />
                  <Route path="/stats-charts-2024" element={<StatsChartsAG2024 />} />
                  <Route path="/stats-charts-es" element={<StatsChartsAGFiniteqES />} />
                  <Route path="/stats-charts-nq" element={<StatsChartsAGFiniteqNQ />} />
                  <Route path="/backtests" element={<Backtests />} />
                  <Route path="/backtests-sanya" element={<BacktestsSanya />} />
                  <Route path="/backtests-tapok" element={<BacktestsTapok />} />
                  <Route path="/backtests-tapok-US500" element={<BacktestsTapokUS500 />} />
              </Routes>
          </div>
      </Router>
  )
}

export default App
