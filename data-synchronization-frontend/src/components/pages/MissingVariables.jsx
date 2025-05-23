const MissingVariables = () => {
  return (
    <>
      <h2>Missing environment variables</h2>

      <p>At the root folder, create a .env file and add in the following:</p>

      <pre>
        <span>{"VITE_BACKEND_1_URL = <backend 1 url>"}</span>
        <br aria-hidden="true" />
        <span>{"VITE_BACKEND_2_URL = <backend 2 url>"}</span>
      </pre>

      <p>
        Replace <code>{"<backend 1 url>"}</code> and{" "}
        <code>{"<backend 2 url>"}</code> with the urls for each backend
      </p>
    </>
  );
};

export default MissingVariables;
