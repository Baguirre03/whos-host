import Link from "next/link";
import SignupButton from "./SignupButton";
import LoginButton from "./LoginButton";

const Header = () => {
  return (
    <header className="bg-black text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          Hosts Host
        </Link>
        <nav className="space-x-4">
          <SignupButton />
          <LoginButton />
        </nav>
      </div>
    </header>
  );
};

export default Header;
