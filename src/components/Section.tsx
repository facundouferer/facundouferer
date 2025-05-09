import ReactMarkdown from "react-markdown";

interface SectionProps {
  icon: string;
  title: string;
  content: string;
  onClose: () => void;
}

export default function Section({ icon, title, content, onClose }: SectionProps) {
  return (
    <div className="lg:w-1/2 w-screen  fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 p-5">
      <section className="bg-white p-4 rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 cursor-pointer"
          aria-label="Cerrar sección"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
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