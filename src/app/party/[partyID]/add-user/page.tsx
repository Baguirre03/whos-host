"use client";
import { useParams } from "next/navigation";

export default function AddUserPage() {
  const { partyID } = useParams();

  const handleAddUser = (event: React.FormEvent) => {
    event.preventDefault();
    const userID = (event.target as HTMLFormElement).userID.value;

    // Logic to add user to the party
    console.log(`Adding user with ID: ${userID} to party ${partyID}`);

    // You can make an API request or update state here to add the user to the party
  };

  return (
    <div>
      <h1>Add User to Party</h1>
      <p>Party ID: {partyID}</p>

      <form onSubmit={handleAddUser}>
        <input
          type="text"
          name="userID"
          placeholder="Enter user ID"
          className="border p-2"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded mt-2"
        >
          Add User
        </button>
      </form>
    </div>
  );
}
