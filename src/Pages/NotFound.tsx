import { Link } from "react-router-dom";

const NotFound = ({ isAdmin = false }: { isAdmin?: boolean }) => {
  return (
    <div
      className={`min-h-screen ${
        isAdmin ? "bg-[#0E1220]" : "bg-white"
      } flex items-center justify-center px-6`}
    >
      <div className="text-center">
        <h1
          className={`text-9xl font-extrabold ${
            isAdmin ? "text-neutral-200" : "text-black"
          }  tracking-widest`}
        >
          404
        </h1>
        <div className="bg-black text-white px-2 text-sm rounded rotate-12 absolute mt-[-2rem] ml-[6rem]">
          Page Not Found
        </div>
        <p className="text-gray-700 mt-6 text-lg">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link
          to={isAdmin ? "/admin/dashboard" : "/"}
          className={`mt-8 inline-block text-sm  ${
            isAdmin ? "text-neutral-200" : "text-black"
          }  underline hover:text-gray-700 transition`}
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
