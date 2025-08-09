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
        <ul className="list-disc list-inside space-y-2">
          {resumeData.skills.items?.map((skill, index) => (
            <li key={index} className="text-gray-700 text-base">
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Skills;
