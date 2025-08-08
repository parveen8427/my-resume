import { useResume } from "../../context/ResumeContext";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";

const Contact = () => {
  const { resumeData } = useResume();

  if (!resumeData.contact) return null;

  return (
    <section id="contact" className="scroll-mt-24">
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2 border-indigo-100">
          Contact
        </h2>
        <div className="space-y-3">
          <p className="flex items-center hover:text-indigo-600 transition-colors">
            <Mail className="w-5 h-5 mr-3 text-indigo-600" />
            <a href={`mailto:${resumeData.contact.email}`}>
              {resumeData.contact.email}
            </a>
          </p>
          <p className="flex items-center hover:text-indigo-600 transition-colors">
            <Phone className="w-5 h-5 mr-3 text-indigo-600" />
            <a href={`tel:${resumeData.contact.phone}`}>
              {resumeData.contact.phone}
            </a>
          </p>
          <p className="flex items-center hover:text-indigo-600 transition-colors">
            <MapPin className="w-5 h-5 mr-3 text-indigo-600" />
            {resumeData.contact.location}
          </p>
          {resumeData.contact.linkedin && (
            <p className="flex items-center hover:text-indigo-600 transition-colors">
              <Linkedin className="w-5 h-5 mr-3 text-indigo-600" />
              <a
                href={resumeData.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn Profile
              </a>
            </p>
          )}
          {resumeData.contact.github && (
            <p className="flex items-center hover:text-indigo-600 transition-colors">
              <Github className="w-5 h-5 mr-3 text-indigo-600" />
              <a
                href={resumeData.contact.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Profile
              </a>
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
