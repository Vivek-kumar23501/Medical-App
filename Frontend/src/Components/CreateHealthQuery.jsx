import React, { useState } from "react";

const PatientQueryForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    age: "",
    gender: "",
    symptomsDuration: "",
    symptoms: "",
    medicalHistory: "",
  });

  const [medicalReport, setMedicalReport] = useState(null);

  // Handle form input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setMedicalReport(e.target.files[0]);
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (medicalReport) data.append("medicalReport", medicalReport);

    try {
      const res = await fetch("http://localhost:5000/api/patient-query/submit", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        alert("Query Submitted Successfully!");
        setFormData({
          fullName: "",
          email: "",
          mobile: "",
          age: "",
          gender: "",
          symptomsDuration: "",
          symptoms: "",
          medicalHistory: "",
        });
        setMedicalReport(null);
      } else {
        alert(result.message);
      }

    } catch (error) {
      console.error(error);
      alert("Server error! Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-[#e0f7fa] flex justify-center items-center py-10 mt-[10vh] md:mt-0">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-xl p-8 border-t-4 border-blue-600">

        <h2 className="text-2xl font-bold text-blue-700 uppercase text-center mb-6">
          Patient Health Query Form
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              placeholder="Enter patient name"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Email *
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Mobile Number *
            </label>
            <input
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              type="text"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              placeholder="xxxxxxxxxx"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Age *
            </label>
            <input
              name="age"
              value={formData.age}
              onChange={handleChange}
              type="number"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              placeholder="Enter age"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Symptoms Duration (Days) *
            </label>
            <input
              name="symptomsDuration"
              value={formData.symptomsDuration}
              onChange={handleChange}
              type="number"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              placeholder="Ex: 3 days"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold text-gray-700 mb-1">
              Symptoms *
            </label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 h-24"
              placeholder="Describe symptoms clearly"
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold text-gray-700 mb-1">
              Previous Medical History *
            </label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 h-24"
              placeholder="Any major illness, allergy, ongoing medication..."
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <label className="block font-semibold text-gray-700 mb-1">
              Upload Medical Reports (Optional)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-600"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-gradient-to-r from-[#00796b] to-[#00acc1] text-white px-10 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition-all shadow-md"
            >
              Submit Query
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PatientQueryForm;
