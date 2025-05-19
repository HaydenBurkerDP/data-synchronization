import { useEffect } from "react";
import { backend1Url, backend2Url } from "../envConfig";

const DataSynchronization = () => {
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(`${backend1Url}/users`, { signal })
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((err) => {
        if (!signal.aborted) console.error(err);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetch(`${backend2Url}/users`, { signal })
      .then((res) => res.json())
      .then((res) => console.log(res))
      .catch((err) => {
        if (!signal.aborted) console.error(err);
      });

    return () => controller.abort();
  }, []);

  return <div>Data Synchronization</div>;
};

export default DataSynchronization;
