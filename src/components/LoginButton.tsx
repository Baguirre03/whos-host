import Link from "next/link";

const LoginButton = () => {
  return (
    <Link
      href="/login"
      className="bg-amber-400 hover:bg-amber-500 text-black font-bold py-2 px-4 rounded transition duration-300"
    >
      Log In
    </Link>
  );
};

export default LoginButton;
