import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Link } from "react-router-dom";
import { Download } from "lucide-react";
import { useResume } from "../../context/ResumeContext";

const Navbar = () => {
  const supabase = useSupabaseClient();
  const { resumeData } = useResume();

  const downloadPDF = async () => {
    const button = document.getElementById("download-btn");
    const originalText = button.innerHTML;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).jsPDF;

      const resumeElement = document.getElementById("resume-content");
      if (!resumeElement) {
        alert("Resume content not found");
        return;
      }

      button.innerHTML = "Generating PDF...";
      button.disabled = true;

      // Split content into two groups: before projects and projects+after
      const allSections = Array.from(resumeElement.children);
      const projectsIndex = allSections.findIndex(
        (section) => section.id === "projects"
      );

      const firstPageSections =
        projectsIndex > 0
          ? allSections.slice(0, projectsIndex)
          : allSections.slice(0, 4);
      const secondPageSections =
        projectsIndex > 0
          ? allSections.slice(projectsIndex)
          : allSections.slice(4);

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Function to create and capture content
      const captureContent = async (sections) => {
        const tempContainer = document.createElement("div");
        tempContainer.style.cssText = `
          position: absolute;
          left: -9999px;
          width: 1200px;
          background: white;
          padding: 40px;
          box-sizing: border-box;
        `;

        const contentWrapper = document.createElement("div");
        contentWrapper.style.cssText = `
          max-width: 1120px;
          margin: 0 auto;
          background: white;
        `;

        sections.forEach((section) => {
          const clonedSection = section.cloneNode(true);
          clonedSection.style.marginBottom = "2rem";
          contentWrapper.appendChild(clonedSection);
        });

        tempContainer.appendChild(contentWrapper);
        document.body.appendChild(tempContainer);

        const canvas = await html2canvas(tempContainer, {
          scale: 2.0,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
        });

        document.body.removeChild(tempContainer);
        return canvas;
      };

      // Generate first page
      if (firstPageSections.length > 0) {
        const firstPageCanvas = await captureContent(firstPageSections);
        const firstPageData = firstPageCanvas.toDataURL("image/png", 0.95);

        const imgWidth = pageWidth;
        const imgHeight =
          (firstPageCanvas.height * pageWidth) / firstPageCanvas.width;

        pdf.addImage(
          firstPageData,
          "PNG",
          0,
          0,
          imgWidth,
          Math.min(imgHeight, pageHeight)
        );
      }

      // Generate second page with projects
      if (secondPageSections.length > 0) {
        pdf.addPage();
        const secondPageCanvas = await captureContent(secondPageSections);
        const secondPageData = secondPageCanvas.toDataURL("image/png", 0.95);

        const imgWidth = pageWidth;
        const imgHeight =
          (secondPageCanvas.height * pageWidth) / secondPageCanvas.width;

        // If content is too tall for one page, split it
        if (imgHeight > pageHeight) {
          let yOffset = 0;
          let pageCount = 0;

          while (yOffset < imgHeight) {
            if (pageCount > 0) {
              pdf.addPage();
            }

            pdf.addImage(
              secondPageData,
              "PNG",
              0,
              -yOffset,
              imgWidth,
              imgHeight
            );

            yOffset += pageHeight * 0.9; // Slight overlap
            pageCount++;

            if (pageCount > 5) break; // Safety
          }
        } else {
          pdf.addImage(secondPageData, "PNG", 0, 0, imgWidth, imgHeight);
        }
      }

      // Add page numbers
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 25, pageHeight - 10);
      }

      const fileName = resumeData?.profile?.name
        ? `${resumeData.profile.name.replace(/\s+/g, "_")}_Resume.pdf`
        : "Resume.pdf";

      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      button.innerHTML = originalText;
      button.disabled = false;
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold">
          My Resume
        </Link>

        <div className="flex items-center gap-4">
          <button
            id="download-btn"
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>

          {/* Uncomment if you need admin link */}
          {/* <Link to="/admin" className="text-indigo-600 hover:text-indigo-800">
            Admin
          </Link> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
