import { useResume } from "../../context/ResumeContext";

const Projects = () => {
  const { resumeData } = useResume();

  if (!resumeData.projects) return null;

  return (
    <section id="projects" className="scroll-mt-24">
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2 border-indigo-100">
          Projects
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {resumeData.projects.items?.map((project, index) => (
            <div
              key={index}
              className="border rounded-xl p-5 hover:border-indigo-300 transition-colors duration-300 hover:shadow-md"
            >
              <h3 className="font-semibold text-lg text-gray-800">
                {project.name}
              </h3>
              <p className="text-gray-600 mt-2 text-sm">
                {project.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.technologies?.map((tech, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-indigo-600 hover:underline font-medium text-sm"
                >
                  View Project →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
