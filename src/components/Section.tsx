import ReactMarkdown from "react-markdown";

interface SectionProps {
  icon: string;
  title: string;
  content: string;
  onClose: () => void;
}

export default function Section({ icon, title, content, onClose }: SectionProps) {
  return (
    <section className="max-w-3/4 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-4 rounded-lg shadow-lg">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300"
        aria-label="Cerrar sección"
      >
        ✖
      </button>

      <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span className="text-2xl">{icon}</span>
        {title}
      </h3>
      <div className="text-base leading-relaxed">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </section>
  );
}