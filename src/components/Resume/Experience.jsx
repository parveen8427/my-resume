import { useResume } from "../../context/ResumeContext";

const Experience = () => {
  const { resumeData } = useResume();

  if (!resumeData.experience) return null;

  return (
    <section id="experience" className="scroll-mt-24">
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2 border-indigo-100">
          Work Experience
        </h2>
        <div className="space-y-8">
          {resumeData.experience.jobs?.map((job, index) => (
            <div key={index} className="relative pl-8">
              <div className="absolute left-0 top-1 w-3 h-3 bg-indigo-600 rounded-full"></div>
              <div className="border-l-2 border-indigo-100 pl-6">
                <h3 className="text-lg font-semibold text-gray-700">
                  {job.position}
                </h3>
                <p className="text-indigo-600 font-medium">
                  {job.company} • {job.duration}
                </p>
                {job.location && (
                  <p className="text-gray-500 text-sm">{job.location}</p>
                )}
                <ul className="mt-3 space-y-2">
                  {job.responsibilities?.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="w-1.5 h-1.5 bg-indigo-300 rounded-full mt-2 mr-2"></span>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
