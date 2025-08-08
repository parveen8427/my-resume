import { useResume } from "../../context/ResumeContext";

const Profile = () => {
  const { resumeData } = useResume();

  if (!resumeData.profile) return null;

  return (
    <section id="profile" className="scroll-mt-24">
      <div className="flex flex-col md:flex-row items-center gap-8 bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-indigo-100 flex-shrink-0 shadow-md">
          <img
            src={resumeData.profile.image}
            alt={resumeData.profile.name}
            className="w-full h-full object-cover"
            style={{
              maxWidth: "10%",
              maxHeight: "10%",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/200";
            }}
          />
        </div>

        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800">
            {resumeData.profile.name}
          </h1>
          <h2 className="text-xl text-indigo-600 mt-2 font-medium">
            {resumeData.profile.title}
          </h2>
          {resumeData.profile.summary && (
            <p className="text-gray-600 mt-4 max-w-2xl">
              {resumeData.profile.summary}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;
