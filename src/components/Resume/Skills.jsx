import { useResume } from "../../context/ResumeContext";

const Skills = () => {
  const { resumeData } = useResume();

  if (!resumeData.skills) return null;

  return (
    <section id="skills" className="scroll-mt-24">
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2 border-indigo-100">
          Skills
        </h2>
        <div className="flex flex-wrap gap-3">
          {resumeData.skills.items?.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
