import DataSynchronization from "./components/DataSynchronization";
import MissingVariables from "./components/MissingVariables";

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
