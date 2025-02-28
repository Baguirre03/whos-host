import Header from "components/Header";

export default function PartyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header addLogin={false} />
      {children}{" "}
    </div>
  );
}
