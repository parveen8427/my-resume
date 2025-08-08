import { useResume } from "../../context/ResumeContext";

const Education = () => {
  const { resumeData } = useResume();

  if (!resumeData.education) return null;

  return (
    <section id="education" className="scroll-mt-24">
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2 border-indigo-100">
          Education
        </h2>
        <div className="space-y-6">
          {resumeData.education.degrees?.map((degree, index) => (
            <div
              key={index}
              className="relative pl-6 pb-6 border-l-2 border-indigo-100 last:pb-0"
            >
              <div className="absolute -left-2 top-0 w-4 h-4 bg-indigo-600 rounded-full"></div>
              <h3 className="text-lg font-semibold text-gray-700">
                {degree.degree}
              </h3>
              <p className="text-indigo-600 font-medium">
                {degree.institution}
              </p>
              <p className="text-gray-500 text-sm mt-1">{degree.year}</p>
              {degree.description && (
                <p className="text-gray-600 mt-2 text-sm">
                  {degree.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
