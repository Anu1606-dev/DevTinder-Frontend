import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-linear-to-br from-primary/10 via-base-100 to-secondary/10">
      <p className="text-8xl font-black text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary mb-2">
        404
      </p>
      <h1 className="text-2xl font-bold text-base-content mb-2">Page not found</h1>
      <p className="text-base-content/60 mb-6 max-w-sm">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        className="btn border-none text-primary-content bg-linear-to-r from-primary to-secondary hover:brightness-110 shadow-lg shadow-primary/30"
      >
        Take me home
      </Link>
    </div>
  );
};

export default NotFound;