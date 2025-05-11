import Link from "next/link";

export default function Page() {

  const enlaces = [
    { href: "frelance", text: "Freelance" },
    { href: "diseniador", text: "Diseñador" },
    { href: "prostituta", text: "Prostituta" },
  ]
  return (
    <div className="flex flex-col min-h-screen p-4 max-w-2xl mx-auto">
      {enlaces.map((enlace) => (
        <Link
          key={enlace.href}
          href={`/cuentos/${enlace.href}`}
          className="hover:bg-yellow-600 p-3"
        >
          <h1>{enlace.text}</h1>
        </Link>
      ))}
    </div>
  );
}