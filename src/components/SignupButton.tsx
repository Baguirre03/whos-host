import Link from "next/link";

const SignupButton = () => {
  return (
    <Link
      href="/signup"
      className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded transition duration-300"
    >
      Sign Up
    </Link>
  );
};

export default SignupButton;
