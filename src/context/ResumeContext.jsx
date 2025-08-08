import React, { createContext, useContext, useState, useEffect } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const ResumeContext = createContext();

export const useResume = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
};

export const ResumeProvider = ({ children }) => {
  const supabase = useSupabaseClient();
  const [resumeData, setResumeData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadResumeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from("resume_data")
        .select("*");

      if (supabaseError) throw supabaseError;

      // Transform array to object with section as key
      const dataObj = {};
      data.forEach((item) => {
        dataObj[item.section] = item.data;
      });

      setResumeData(dataObj);
    } catch (error) {
      console.error("Error loading resume data:", error);
      setError(error.message);

      // Fallback to default data if loading fails
      setResumeData({
        profile: {
          name: "Parveen Kumar",
          title: "React Native Developer",
          image: "https://via.placeholder.com/150",
        },
        about: {
          content:
            "Experienced React Native developer with expertise in cross-platform mobile applications.",
        },
        skills: {
          items: ["React Native", "JavaScript", "TypeScript", "Redux"],
        },
        contact: {
          email: "parveen6286@gmail.com",
          phone: "+1234567890",
          location: "New Delhi, India",
        },
        experience: {
          jobs: [],
        },
        projects: {
          items: [],
        },
        education: {
          degrees: [],
        },
        languages: {
          items: [],
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const updateResumeData = async (section, newData) => {
    try {
      const { error } = await supabase.from("resume_data").upsert(
        {
          section,
          data: newData,
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
        [section]: newData,
      }));

      return { success: true };
    } catch (error) {
      console.error("Error updating resume data:", error);
      return { success: false, error: error.message };
    }
  };

  // Set up real-time subscription for resume data changes
  useEffect(() => {
    loadResumeData();

    // Subscribe to changes in resume_data table
    const subscription = supabase
      .channel("resume_data_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "resume_data",
        },
        (payload) => {
          console.log("Resume data changed:", payload);
          // Reload data when changes occur
          loadResumeData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const value = {
    resumeData,
    loading,
    error,
    loadResumeData,
    updateResumeData,
  };

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
};
