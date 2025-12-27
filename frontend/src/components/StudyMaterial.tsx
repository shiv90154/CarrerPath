import React from "react";

interface Paper {
  title: string;
  year: string;
  exam: string;
  type: "Free" | "Paid";
}

const papers: Paper[] = [
  { title: "UPSC GS Paper I", year: "2023", exam: "UPSC", type: "Free" },
  { title: "UPSC GS Paper II", year: "2022", exam: "UPSC", type: "Paid" },
  { title: "SSC CGL Tier-1", year: "2023", exam: "SSC", type: "Free" },
  { title: "Bank PO Prelims", year: "2022", exam: "Banking", type: "Paid" },
  { title: "HPAS Prelims", year: "2021", exam: "State Exams", type: "Free" }
];

const StudyMaterial: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-10 bg-[#F8FAFC] font-['Inter']">

      {/* Page Title */}
      <h1 className="text-4xl font-semibold text-center mb-10 font-['Poppins'] text-[#0B1F33]">
        Previous Year Question Papers & PDFs
      </h1>

      {/* Intro */}
      <p className="max-w-3xl mx-auto text-center text-lg text-[#6B7280] mb-12">
        Access curated previous year question papers with detailed PDFs.
        Free samples are available, and full premium papers can be unlocked after purchase.
      </p>

      {/* Papers Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {papers.map((paper, index) => (
          <div
            key={index}
            className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm hover:shadow-md transition-all p-6"
          >
            {/* Badge */}
            <span
              className={`inline-block mb-3 px-3 py-1 text-sm rounded-full font-medium
                ${paper.type === "Free"
                  ? "bg-green-100 text-green-700"
                  : "bg-amber-100 text-amber-700"
                }`}
            >
              {paper.type}
            </span>

            {/* Title */}
            <h3 className="text-xl font-semibold text-[#0B1F33] mb-1">
              {paper.title}
            </h3>

            {/* Meta */}
            <p className="text-sm text-[#6B7280] mb-4">
              {paper.exam} • Year {paper.year}
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2 text-sm rounded-lg border border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition">
                Preview
              </button>

              {paper.type === "Free" ? (
                <button className="flex-1 px-4 py-2 text-sm rounded-lg bg-[#1E3A8A] text-white hover:bg-[#16336B] transition">
                  Download
                </button>
              ) : (
                <button className="flex-1 px-4 py-2 text-sm rounded-lg bg-[#D4AF37] text-[#0B1F33] hover:bg-[#C9A52F] transition font-medium">
                  Buy PDF
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center mt-14 text-sm text-[#6B7280]">
        More previous year papers and solutions will be added regularly.
      </div>

    </div>
  );
};

export default StudyMaterial;
