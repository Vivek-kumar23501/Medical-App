import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  // Fetch profile data
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setUser(res.data.data);
        setForm(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
    setSuccess("");
  };

  const handleNestedChange = (e, parentKey) => {
    const { name, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [parentKey]: { ...prev[parentKey], [name]: checked },
    }));
    setError("");
    setSuccess("");
  };

  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.put("http://localhost:8080/auth/profile", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setUser(res.data.data);
        setForm(res.data.data);
        setSuccess("Profile updated successfully!");
        setEditMode(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) return <div className="text-center mt-20">Loading...</div>;
  if (!user) return <div className="text-center mt-20">No user data found</div>;

  return (
    <>
      
      <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
        <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-4xl">
          <h2 className="text-2xl font-bold text-teal-900 mb-6 text-center">My Profile</h2>

          {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
          {success && <div className="mb-4 text-green-600 text-center">{success}</div>}

          <div className="space-y-4">

            {/* Profile Picture */}
            <div>
              <label className="block font-medium mb-1">Profile Picture URL</label>
              <input
                type="text"
                name="profilePicture"
                value={form.profilePicture || ""}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  editMode ? "focus:ring-[#00acc1]" : "bg-gray-100"
                }`}
              />
              {form.profilePicture && <img src={form.profilePicture} alt="Profile" className="mt-2 w-32 h-32 rounded-full object-cover" />}
            </div>

            {/* Name */}
            <div>
              <label className="block font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  editMode ? "focus:ring-[#00acc1]" : "bg-gray-100"
                }`}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email || ""}
                disabled
                className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block font-medium">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={form.phoneNumber || ""}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  editMode ? "focus:ring-[#00acc1]" : "bg-gray-100"
                }`}
              />
            </div>

            {/* Address */}
            <div>
              <label className="block font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={form.address || ""}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  editMode ? "focus:ring-[#00acc1]" : "bg-gray-100"
                }`}
              />
            </div>

            {/* Blood Group */}
            <div>
              <label className="block font-medium">Blood Group</label>
              <input
                type="text"
                name="bloodGroup"
                value={form.bloodGroup || ""}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  editMode ? "focus:ring-[#00acc1]" : "bg-gray-100"
                }`}
              />
            </div>

            {/* Allergies */}
            <div>
              <label className="block font-medium">Allergies</label>
              <input
                type="text"
                name="allergies"
                value={form.allergies || ""}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  editMode ? "focus:ring-[#00acc1]" : "bg-gray-100"
                }`}
              />
            </div>

            {/* Chronic Diseases */}
            <div>
              <label className="block font-medium">Chronic Diseases</label>
              <input
                type="text"
                name="chronicDiseases"
                value={form.chronicDiseases || ""}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  editMode ? "focus:ring-[#00acc1]" : "bg-gray-100"
                }`}
              />
            </div>

            {/* State */}
            <div>
              <label className="block font-medium">State</label>
              <input
                type="text"
                name="state"
                value={form.state || ""}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  editMode ? "focus:ring-[#00acc1]" : "bg-gray-100"
                }`}
              />
            </div>

            {/* District */}
            <div>
              <label className="block font-medium">District</label>
              <input
                type="text"
                name="district"
                value={form.district || ""}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  editMode ? "focus:ring-[#00acc1]" : "bg-gray-100"
                }`}
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block font-medium">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={form.pincode || ""}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  editMode ? "focus:ring-[#00acc1]" : "bg-gray-100"
                }`}
              />
            </div>

            {/* Language */}
            <div>
              <label className="block font-medium">Language</label>
              <select
                name="language"
                value={form.language || "hi"}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  editMode ? "focus:ring-[#00acc1]" : "bg-gray-100"
                }`}
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="bn">Bengali</option>
                <option value="mr">Marathi</option>
              </select>
            </div>

            {/* Notification Preferences */}
            <div>
              <label className="block font-medium mb-1">Notification Preferences</label>
              <div className="flex space-x-4">
                <label>
                  <input
                    type="checkbox"
                    name="whatsapp"
                    checked={form.notificationPreference?.whatsapp || false}
                    onChange={(e) => handleNestedChange(e, "notificationPreference")}
                    disabled={!editMode}
                  /> WhatsApp
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="sms"
                    checked={form.notificationPreference?.sms || false}
                    onChange={(e) => handleNestedChange(e, "notificationPreference")}
                    disabled={!editMode}
                  /> SMS
                </label>
              </div>
            </div>

            {/* Risk Category */}
            <div>
              <label className="block font-medium">Risk Category</label>
              <select
                name="riskCategory"
                value={form.riskCategory || "normal"}
                onChange={handleChange}
                disabled={!editMode}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  editMode ? "focus:ring-[#00acc1]" : "bg-gray-100"
                }`}
              >
                <option value="normal">Normal</option>
                <option value="elderly">Elderly</option>
                <option value="pregnant">Pregnant</option>
                <option value="child">Child</option>
                <option value="chronic_disease">Chronic Disease</option>
              </select>
            </div>

            {/* Active */}
            <div>
              <label className="block font-medium mb-1">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive || false}
                  onChange={handleChange}
                  disabled={!editMode}
                  className="mr-2"
                />
                Active
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-center space-x-4 mt-6">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="py-2 px-6 bg-gradient-to-r from-[#00796b] to-[#00acc1] text-white font-semibold rounded-lg hover:shadow-lg transition"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleUpdate}
                    disabled={loading}
                    className="py-2 px-6 bg-gradient-to-r from-[#00796b] to-[#00acc1] text-white font-semibold rounded-lg hover:shadow-lg transition"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => {
                      setForm(user);
                      setEditMode(false);
                    }}
                    className="py-2 px-6 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:shadow-lg transition"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
