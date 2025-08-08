import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const AdminDashboard = () => {
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [tempData, setTempData] = useState({});
  const [imageUploading, setImageUploading] = useState(false);

  // Load resume data from Supabase
  const loadResumeData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("resume_data").select("*");

      if (error) throw error;

      // Transform array to object with section as key
      const dataObj = {};
      data.forEach((item) => {
        dataObj[item.section] = item.data;
      });

      setResumeData(dataObj);
    } catch (error) {
      console.error("Error loading resume data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumeData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const startEditing = (section) => {
    setEditingSection(section);
    setTempData(resumeData[section] || {});
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setTempData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayItemChange = (index, field, value) => {
    setTempData((prev) => {
      const newItems = [...prev.items];
      newItems[index] =
        field === undefined ? value : { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const addArrayItem = () => {
    setTempData((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        editingSection === "skills" || editingSection === "languages" ? "" : {},
      ],
    }));
  };

  const removeArrayItem = (index) => {
    setTempData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setImageUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("resume-images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("resume-images").getPublicUrl(filePath);

      setTempData((prev) => ({ ...prev, image: publicUrl }));
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image: " + error.message);
    } finally {
      setImageUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase.from("resume_data").upsert(
        {
          section: editingSection,
          data: tempData,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "section",
        }
      );

      if (error) throw error;

      // Update local state
      setResumeData((prev) => ({
        ...prev,
        [editingSection]: tempData,
      }));

      setEditingSection(null);
      setTempData({});
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data: " + error.message);
    }
  };

  const renderEditableContent = (section) => {
    const data = tempData;

    switch (section) {
      case "profile":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={data.image || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
                <label className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                  <span>📷</span>
                </label>
              </div>
              {imageUploading && (
                <span className="text-sm text-gray-500">Uploading...</span>
              )}
            </div>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={data.name || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={data.title || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        );

      case "about":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              About Content
            </label>
            <textarea
              name="content"
              value={data.content || ""}
              onChange={handleInputChange}
              rows={5}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        );

      case "skills":
      case "languages":
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              {section === "skills" ? "Skills" : "Languages"}
            </label>
            {(data.items || []).map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayItemChange(index, undefined, e.target.value)
                  }
                  className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  onClick={() => removeArrayItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              onClick={addArrayItem}
              className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add {section === "skills" ? "Skill" : "Language"}
            </button>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={data.email || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={data.phone || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={data.location || ""}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        );

      case "experience":
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Work Experience
            </label>
            {(data.jobs || []).map((job, index) => (
              <div
                key={index}
                className="border-l-4 border-indigo-200 pl-4 space-y-3"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <input
                    type="text"
                    value={job.position || ""}
                    onChange={(e) =>
                      handleArrayItemChange(index, "position", e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Company
                    </label>
                    <input
                      type="text"
                      value={job.company || ""}
                      onChange={(e) =>
                        handleArrayItemChange(index, "company", e.target.value)
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={job.duration || ""}
                      onChange={(e) =>
                        handleArrayItemChange(index, "duration", e.target.value)
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={job.description || ""}
                    onChange={(e) =>
                      handleArrayItemChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button
                  onClick={() => removeArrayItem(index)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Remove Job
                </button>
              </div>
            ))}
            <button
              onClick={addArrayItem}
              className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Job
            </button>
          </div>
        );

      case "projects":
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Projects
            </label>
            {(data.items || []).map((project, index) => (
              <div
                key={index}
                className="border rounded-lg p-3 bg-gray-50 space-y-3"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={project.name || ""}
                    onChange={(e) =>
                      handleArrayItemChange(index, "name", e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={project.description || ""}
                    onChange={(e) =>
                      handleArrayItemChange(
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Link (optional)
                  </label>
                  <input
                    type="url"
                    value={project.link || ""}
                    onChange={(e) =>
                      handleArrayItemChange(index, "link", e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button
                  onClick={() => removeArrayItem(index)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Remove Project
                </button>
              </div>
            ))}
            <button
              onClick={addArrayItem}
              className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Project
            </button>
          </div>
        );

      case "education":
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Education
            </label>
            {(data.degrees || []).map((degree, index) => (
              <div key={index} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Degree
                  </label>
                  <input
                    type="text"
                    value={degree.degree || ""}
                    onChange={(e) =>
                      handleArrayItemChange(index, "degree", e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Institution
                  </label>
                  <input
                    type="text"
                    value={degree.institution || ""}
                    onChange={(e) =>
                      handleArrayItemChange(
                        index,
                        "institution",
                        e.target.value
                      )
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Year
                  </label>
                  <input
                    type="text"
                    value={degree.year || ""}
                    onChange={(e) =>
                      handleArrayItemChange(index, "year", e.target.value)
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <button
                  onClick={() => removeArrayItem(index)}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Remove Degree
                </button>
              </div>
            ))}
            <button
              onClick={addArrayItem}
              className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Degree
            </button>
          </div>
        );

      default:
        return (
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Section Data
            </label>
            <textarea
              value={JSON.stringify(data, null, 2)}
              onChange={(e) => setTempData(JSON.parse(e.target.value))}
              rows={10}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 font-mono text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        );
    }
  };

  const renderSectionContent = (section, data) => {
    if (!data) return <p className="text-gray-500">No data available</p>;

    switch (section) {
      case "profile":
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              {data.image && (
                <img
                  src={data.image}
                  alt={data.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                  style={{
                    maxWidth: "10%",
                    maxHeight: "10%",
                  }}
                />
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {data.name}
                </h3>
                <p className="text-indigo-600">{data.title}</p>
              </div>
            </div>
          </div>
        );

      case "about":
        return (
          <div>
            <p className="text-gray-700 leading-relaxed">{data.content}</p>
          </div>
        );

      case "skills":
        return (
          <div className="flex flex-wrap gap-2">
            {data.items?.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        );

      case "contact":
        return (
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-sm mr-2">📧</span>
              <span className="text-gray-700">{data.email}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm mr-2">📱</span>
              <span className="text-gray-700">{data.phone}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm mr-2">📍</span>
              <span className="text-gray-700">{data.location}</span>
            </div>
          </div>
        );

      case "experience":
        return (
          <div className="space-y-4">
            {data.jobs?.map((job, index) => (
              <div key={index} className="border-l-4 border-indigo-200 pl-4">
                <h4 className="font-semibold text-gray-800">{job.position}</h4>
                <p className="text-indigo-600">
                  {job.company} • {job.duration}
                </p>
                <p className="text-gray-600 text-sm mt-1">{job.description}</p>
              </div>
            ))}
          </div>
        );

      case "projects":
        return (
          <div className="space-y-3">
            {data.items?.map((project, index) => (
              <div key={index} className="border rounded-lg p-3 bg-gray-50">
                <h4 className="font-semibold text-gray-800">{project.name}</h4>
                <p className="text-gray-600 text-sm">{project.description}</p>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 text-sm hover:underline"
                  >
                    View Project →
                  </a>
                )}
              </div>
            ))}
          </div>
        );

      case "education":
        return (
          <div className="space-y-3">
            {data.degrees?.map((degree, index) => (
              <div key={index}>
                <h4 className="font-semibold text-gray-800">{degree.degree}</h4>
                <p className="text-indigo-600">{degree.institution}</p>
                <p className="text-gray-500 text-sm">{degree.year}</p>
              </div>
            ))}
          </div>
        );

      case "languages":
        return (
          <div className="flex flex-wrap gap-2">
            {data.items?.map((language, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {language}
              </span>
            ))}
          </div>
        );

      default:
        return (
          <div className="text-sm text-gray-700">
            <pre className="whitespace-pre-wrap bg-gray-50 p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        );
    }
  };

  const getSectionDisplayName = (section) => {
    const names = {
      profile: "Profile",
      about: "About Me",
      skills: "Skills",
      contact: "Contact Information",
      experience: "Work Experience",
      languages: "Languages",
      education: "Education",
      projects: "Projects",
    };
    return names[section] || section.charAt(0).toUpperCase() + section.slice(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resume data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
            <button
              onClick={loadResumeData}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Resume Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Manage your resume content</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => window.open("/", "_blank")}
              className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
            >
              View Resume
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Resume Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(resumeData).map(([section, data]) => (
            <div
              key={section}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Section Header */}
              <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  {getSectionDisplayName(section)}
                </h2>
                <button
                  onClick={() => startEditing(section)}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded transition"
                  title="Edit section"
                >
                  <span>✏️</span>
                  <span>Edit</span>
                </button>
              </div>

              {/* Section Content */}
              <div className="p-6">
                {editingSection === section ? (
                  <div className="space-y-4">
                    {renderEditableContent(section)}
                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={cancelEditing}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  renderSectionContent(section, data)
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {Object.keys(resumeData).length}
              </div>
              <div className="text-sm text-gray-600">Total Sections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {resumeData.skills?.items?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Skills</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {resumeData.experience?.jobs?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {resumeData.projects?.items?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
