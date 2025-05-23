import DataSynchronization from "./components/pages/DataSynchronization";
import MissingVariables from "./components/pages/MissingVariables";

import { backend1Url, backend2Url } from "./envConfig";

import "../src/styles/app.scss";

function App() {
  const isConfigured = Boolean(backend1Url && backend2Url);

  return (
    <div className="app">
      {isConfigured ? <DataSynchronization /> : <MissingVariables />}
    </div>
  );
}

export default App;
