import React, { useState } from "react";
import { Edit, Save, Phone, Mail, Droplets, MapPin, Camera, Send } from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(true); // initially verified

  const [profile, setProfile] = useState({
    img: "/MedPulse logo.jpg",
    name: "vivek kumar",
    phone: "+91 9876543210",
    email: "vivekkumarbth05@gmail.com",
    bloodGroup: "O+",
    address: {
      house: "123A",
      street: "MG Road",
      city: "Patna",
      state: "Bihar",
      pin: "800001",
      country: "India",
    },
  });

  const handleInputChange = (field, value, isAddress = false) => {
    if (field === "email") {
      setIsVerified(false);
      setShowOtpField(true);
    }

    if (isAddress) {
      setProfile({
        ...profile,
        address: {
          ...profile.address,
          [field]: value,
        },
      });
    } else {
      setProfile({ ...profile, [field]: value });
    }
  };

  const toggleEdit = () => {
    if (isEditing && !isVerified) {
      alert("⚠ Please verify your new email before saving!");
      return;
    }
    setIsEditing(!isEditing);
  };

  const handleRequestOtp = () => {
    alert("📩 OTP sent to your new email! (Backend API needed)");
  };

  const handleVerifyOtp = () => {
    if (otp.trim() === "") {
      alert("Enter OTP to verify!");
      return;
    }
    setIsVerified(true);
    setShowOtpField(false);
    alert("✔ Email Verified Successfully!");
  };

  return (
    <div className="bg-[#e0f7fa] min-h-screen py-16 px-6 flex justify-center">
      <div className="max-w-3xl w-full bg-white shadow-2xl rounded-2xl p-10 relative transition-all border-t-8 border-[#00796b]">

        {/* Edit / Save Button */}
        <button
          onClick={toggleEdit}
          className={`absolute top-6 right-6 p-3 rounded-full transition-all 
            ${isEditing 
              ? "bg-[#ff9800] text-white hover:bg-[#e68900]" 
              : "bg-[#00796b] text-white hover:bg-[#005f50]"}`
          }
        >
          {isEditing ? <Save size={20} /> : <Edit size={20} />}
        </button>

        {/* Profile Image */}
        <div className="relative w-32 h-32 mx-auto">
          <img
            src={profile.img}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-[#00796b] shadow-md"
          />
          {isEditing && (
            <button className="absolute bottom-1 right-1 bg-[#00796b] text-white p-2 rounded-full">
              <Camera size={15} />
            </button>
          )}
        </div>

        {/* Name */}
        {isEditing ? (
          <input
            type="text"
            className="text-2xl font-bold text-center w-full mt-4 border-b-2 border-[#00796b] outline-none"
            value={profile.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        ) : (
          <h2 className="text-3xl text-center font-bold mt-4 text-[#004d40]">
            {profile.name}
          </h2>
        )}

        {/* Details */}
        <div className="mt-8 space-y-4 text-[#004d40]">

          {/* Phone */}
          <div className="flex gap-3 items-center bg-[#e0f2f1] p-3 rounded-lg">
            <Phone size={20} />
            {isEditing ? (
              <input
                type="text"
                className="bg-transparent w-full outline-none"
                value={profile.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            ) : (
              <span>{profile.phone}</span>
            )}
          </div>

          {/* Email + OTP Section */}
          <div className="bg-[#e0f2f1] p-3 rounded-lg space-y-2">
            <div className="flex gap-3 items-center">
              <Mail size={20} />
              {isEditing ? (
                <input
                  type="email"
                  className="bg-transparent w-full outline-none"
                  value={profile.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              ) : (
                <span>{profile.email}</span>
              )}
            </div>

            {isEditing && showOtpField && (
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="border border-[#00796b] rounded-xl px-3 py-1 w-full outline-none"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  onClick={handleRequestOtp}
                  className="bg-[#00acc1] text-white py-1 px-3 rounded-lg hover:bg-[#008b92]"
                >
                  <Send size={16} />
                </button>
                <button
                  onClick={handleVerifyOtp}
                  className="bg-green-600 text-white py-1 px-3 rounded-lg hover:bg-green-700"
                >
                  Verify
                </button>
              </div>
            )}

            {!isVerified && isEditing && (
              <p className="text-red-600 text-xs mt-1">
                * Please verify your new email!
              </p>
            )}
          </div>

          {/* Blood */}
          <div className="flex gap-3 items-center bg-[#e0f2f1] p-3 rounded-lg">
            <Droplets size={20} />
            {isEditing ? (
              <input
                type="text"
                className="bg-transparent w-full outline-none"
                value={profile.bloodGroup}
                onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
              />
            ) : (
              <span>Blood Group: {profile.bloodGroup}</span>
            )}
          </div>

          {/* Address */}
          <div className="flex gap-3 items-start bg-[#e0f2f1] p-3 rounded-lg">
            <MapPin size={20} className="mt-1" />
            <div className="w-full space-y-1">
              {Object.keys(profile.address).map((field) =>
                isEditing ? (
                  <input
                    key={field}
                    type="text"
                    className="bg-transparent w-full outline-none"
                    value={profile.address[field]}
                    onChange={(e) =>
                      handleInputChange(field, e.target.value, true)
                    }
                  />
                ) : (
                  <p key={field}>{profile.address[field]}</p>
                )
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
