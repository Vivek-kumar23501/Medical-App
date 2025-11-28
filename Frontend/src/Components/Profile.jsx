import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setLoading(false);
      try {
        const res = await axios.get("http://localhost:5000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          setUser(res.data.data);
          setEditableUser(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("name", editableUser.name || "");
      formData.append("phone", editableUser.phone || "");
      formData.append("address", editableUser.address || "");
      formData.append("bloodGroup", editableUser.bloodGroup || "");
      formData.append("allergies", editableUser.allergies || "");
      formData.append("chronicDiseases", editableUser.chronicDiseases || "");
      if (editableUser.profileFile)
        formData.append("profilePicture", editableUser.profileFile);

      const res = await axios.put("http://localhost:5000/auth/me", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setUser(res.data.data);
        setEditableUser({ ...res.data.data, profileFile: null });
        setIsEditing(false);
        alert("Profile updated!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (!user)
    return <p className="text-center mt-10 text-red-500">User not found</p>;

  return (
    <>
      
      <div className="max-w-3xl mx-auto mt-12">
        <div className="bg-gradient-to-r from-teal-400 to-teal-600 rounded-t-xl h-40 relative">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img
              src={
                editableUser.profileFile
                  ? URL.createObjectURL(editableUser.profileFile)
                  : user.profilePicture || "/default.png"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditableUser({
                    ...editableUser,
                    profileFile: e.target.files[0],
                  })
                }
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white rounded-md p-1 cursor-pointer text-sm"
              />
            )}
          </div>
        </div>

        <div className="bg-white mt-20 rounded-b-xl shadow-lg p-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {editableUser.name || "User Name"}
          </h2>
          <p className="text-gray-500 mb-4">{user.email}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mt-6">
            {[
              ["Name", "name"],
              ["Phone", "phone"],
              ["Address", "address"],
              ["Blood Group", "bloodGroup"],
              ["Allergies", "allergies"],
              ["Chronic Diseases", "chronicDiseases"],
            ].map(([label, field]) => (
              <div key={field}>
                <p className="text-gray-700 font-medium">{label}:</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editableUser[field] || ""}
                    onChange={(e) =>
                      setEditableUser({
                        ...editableUser,
                        [field]: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-600">{user[field] || "-"}</p>
                )}
              </div>
            ))}

            <div>
              <p className="text-gray-700 font-medium">Email Verified:</p>
              <p className="mt-1 text-gray-600">
                {user.emailVerified ? "Yes" : "No"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-center space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditableUser(user);
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-full hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-teal-500 text-white px-6 py-2 rounded-full hover:bg-teal-600 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
