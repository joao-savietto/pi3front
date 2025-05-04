import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  return (
    <div className="container">
      <h1 className="mt-5">Error</h1>
      <p>Error: {error.status} {error.statusText}</p>
      <p>{error.message}</p>
    </div>
  );
}
