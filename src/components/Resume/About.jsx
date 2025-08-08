import { useResume } from "../../context/ResumeContext";

const About = () => {
  const { resumeData } = useResume();

  if (!resumeData.about) return null;

  return (
    <section id="about" className="scroll-mt-24">
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2 border-indigo-100">
          About Me
        </h2>
        <p className="text-gray-700 leading-relaxed text-justify">
          {resumeData.about.content}
        </p>
      </div>
    </section>
  );
};

export default About;
