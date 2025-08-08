import { useState, useEffect } from "react";

const EditModal = ({ section, data, onClose, onSave }) => {
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(data || {});
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving data");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleArrayChange = (key, index, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key]?.map((item, i) => (i === index ? value : item)) || [],
    }));
  };

  const addArrayItem = (key) => {
    setFormData((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), ""],
    }));
  };

  const removeArrayItem = (key, index) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key]?.filter((_, i) => i !== index) || [],
    }));
  };

  const addJobOrProject = (key) => {
    const newItem =
      key === "jobs"
        ? { company: "", position: "", duration: "", description: "" }
        : { name: "", description: "", link: "" };

    setFormData((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), newItem],
    }));
  };

  const updateJobOrProject = (key, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]:
        prev[key]?.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        ) || [],
    }));
  };

  const renderFormFields = () => {
    switch (section) {
      case "profile":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g. React Native Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image URL
              </label>
              <input
                type="url"
                value={formData.image || ""}
                onChange={(e) => handleInputChange("image", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://example.com/your-photo.jpg"
              />
            </div>
          </div>
        );

      case "about":
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About Me Content
            </label>
            <textarea
              value={formData.content || ""}
              onChange={(e) => handleInputChange("content", e.target.value)}
              rows="6"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Write about yourself, your experience, and skills..."
            />
          </div>
        );

      case "skills":
        return (
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Skills
              </label>
              <button
                type="button"
                onClick={() => addArrayItem("items")}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                + Add Skill
              </button>
            </div>
            <div className="space-y-2">
              {(formData.items || []).map((skill, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) =>
                      handleArrayChange("items", index, e.target.value)
                    }
                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter skill"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem("items", index)}
                    className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="+1234567890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="City, Country"
              />
            </div>
          </div>
        );

      case "experience":
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Work Experience
              </label>
              <button
                type="button"
                onClick={() => addJobOrProject("jobs")}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                + Add Job
              </button>
            </div>
            <div className="space-y-6">
              {(formData.jobs || []).map((job, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Job #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("jobs", index)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={job.position || ""}
                      onChange={(e) =>
                        updateJobOrProject(
                          "jobs",
                          index,
                          "position",
                          e.target.value
                        )
                      }
                      className="p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Job Position"
                    />
                    <input
                      type="text"
                      value={job.company || ""}
                      onChange={(e) =>
                        updateJobOrProject(
                          "jobs",
                          index,
                          "company",
                          e.target.value
                        )
                      }
                      className="p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Company Name"
                    />
                  </div>
                  <input
                    type="text"
                    value={job.duration || ""}
                    onChange={(e) =>
                      updateJobOrProject(
                        "jobs",
                        index,
                        "duration",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border rounded mt-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Duration (e.g. 2020-2023)"
                  />
                  <textarea
                    value={job.description || ""}
                    onChange={(e) =>
                      updateJobOrProject(
                        "jobs",
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    rows="3"
                    className="w-full p-2 border rounded mt-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Job description..."
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case "projects":
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Projects
              </label>
              <button
                type="button"
                onClick={() => addJobOrProject("items")}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                + Add Project
              </button>
            </div>
            <div className="space-y-4">
              {(formData.items || []).map((project, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Project #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("items", index)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={project.name || ""}
                    onChange={(e) =>
                      updateJobOrProject("items", index, "name", e.target.value)
                    }
                    className="w-full p-2 border rounded mb-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Project Name"
                  />
                  <textarea
                    value={project.description || ""}
                    onChange={(e) =>
                      updateJobOrProject(
                        "items",
                        index,
                        "description",
                        e.target.value
                      )
                    }
                    rows="2"
                    className="w-full p-2 border rounded mb-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Project description..."
                  />
                  <input
                    type="url"
                    value={project.link || ""}
                    onChange={(e) =>
                      updateJobOrProject("items", index, "link", e.target.value)
                    }
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Project URL (optional)"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case "education":
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Education
              </label>
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    degrees: [
                      ...(prev.degrees || []),
                      { degree: "", institution: "", year: "" },
                    ],
                  }));
                }}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                + Add Degree
              </button>
            </div>
            <div className="space-y-4">
              {(formData.degrees || []).map((degree, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Degree #{index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("degrees", index)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    value={degree.degree || ""}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        degrees:
                          prev.degrees?.map((d, i) =>
                            i === index ? { ...d, degree: e.target.value } : d
                          ) || [],
                      }));
                    }}
                    className="w-full p-2 border rounded mb-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Degree Name"
                  />
                  <input
                    type="text"
                    value={degree.institution || ""}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        degrees:
                          prev.degrees?.map((d, i) =>
                            i === index
                              ? { ...d, institution: e.target.value }
                              : d
                          ) || [],
                      }));
                    }}
                    className="w-full p-2 border rounded mb-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Institution Name"
                  />
                  <input
                    type="text"
                    value={degree.year || ""}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        degrees:
                          prev.degrees?.map((d, i) =>
                            i === index ? { ...d, year: e.target.value } : d
                          ) || [],
                      }));
                    }}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Year"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case "languages":
        return (
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Languages
              </label>
              <button
                type="button"
                onClick={() => addArrayItem("items")}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                + Add Language
              </button>
            </div>
            <div className="space-y-2">
              {(formData.items || []).map((language, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={language}
                    onChange={(e) =>
                      handleArrayChange("items", index, e.target.value)
                    }
                    className="flex-1 p-2 border rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g. English (Fluent)"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem("items", index)}
                    className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <p className="text-gray-500">No form available for this section.</p>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold capitalize">{section} Editor</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFormFields()}
          <div className="flex justify-end mt-6 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 rounded text-white ${
                saving ? "bg-indigo-300" : "bg-indigo-600 hover:bg-indigo-700"
              }`}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
