import { useResume } from "../../context/ResumeContext";

const Languages = () => {
  const { resumeData } = useResume();

  if (!resumeData.languages) return null;

  return (
    <section id="languages" className="scroll-mt-24">
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2 border-indigo-100">
          Languages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {resumeData.languages.items?.map((language, index) => (
            <div key={index} className="flex items-center">
              <div className="w-3 h-3 bg-indigo-600 rounded-full mr-3"></div>
              <span className="text-gray-700 font-medium">{language}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Languages;
