import ReactMarkdown from "react-markdown";

interface SectionProps {
  icon: string;
  title: string;
  content: string;
  onClose: () => void;
}

export default function Section({ icon, title, content, onClose }: SectionProps) {
  return (
    <div className="lg:w-1/3 w-screen fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <section className="bg-white p-4 rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="bg-[#A09A95] hover:bg-amber-400 px-2 py-1 rounded absolute top-5 right-5 text-gray-300 hover:text-gray-800 cursor-pointer"
          aria-label="Cerrar sección"
        >
          ✖
        </button>

        <h2 className="w-2/3 text-2xl font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          {title}
        </h2>
        <div className="text-base leading-relaxed">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </section>
    </div>
  );
}