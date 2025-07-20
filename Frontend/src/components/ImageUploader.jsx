
import React, { useEffect, useState } from "react";
import {Camera,Plus,Trash} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const ProfileImageUploader = ({ userProfile, setUserProfile }) => {
  // const [load,setload]=useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [load,setload]=useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showHoverPreview, setShowHoverPreview] = useState(false);
  const deleteImage =async(e) => {
  try {
    setload(true);
    const res = await axios.put('http://localhost:3001/api/users/deleteProfileImage', {
      userId: userProfile.id,
    }, { withCredentials: true });
    // if (res.status == 201) {
      toast.success("Profile image removed");
      setUserProfile(prev => ({ ...prev, photoURL: '' }));
    // }
  } catch (err) {
    console.log(err);
    toast.error("Failed to remove image");
  } finally {
    setload(false);
  }
};  
  const imageSrc = previewImage || userProfile?.photoURL;
  const handleAvatarUpload = async (e) => {
    setload(true);
    const file = e.target.files[0];
    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewImage(localUrl);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "Profiles_unsinged");

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dt3qgccok/image/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          },
        }
      );

      const imageUrl = res.data.secure_url;
      setUserProfile((prev) => ({ ...prev, photoURL: imageUrl }));
      await axios.put(
        "http://localhost:3001/api/users/updateProfile",
        { userid: userProfile.id, imageurl: imageUrl },
        { withCredentials: true }
      );
      setload(false);
      toast.success("Profile Updated Successfully");
      setPreviewImage(imageUrl);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  useEffect(() => {
    setload(true);
    if (!previewImage && userProfile?.photoURL) {
      setPreviewImage(userProfile.photoURL);
    }
    setload(false);
  }, [userProfile?.photoURL]);
  return (
    <>
  <input
    type="file"
    accept="image/*"
    id="avatarUpload"
    style={{ display: "none" }}
    onChange={handleAvatarUpload}
  />

  {/* Avatar + Camera icon container */}
  <div className="relative w-20 h-20">
    {/* Profile Image Circle */}
    <div
      className="w-full h-full rounded-full overflow-hidden cursor-pointer border-2 border-white"
      onClick={() => document.getElementById("avatarUpload").click()}
      onMouseEnter={() => setShowHoverPreview(true)}
      onMouseLeave={() => setShowHoverPreview(false)}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      ) :(
        <Plus className="w-full h-full text-center bg-white " />
      )}
    </div>

    {/* Camera Icon Positioned Outside Bottom-Right */}
    <div
      className="absolute -right-3 bottom-0 bg-black bg-opacity-70 rounded-full p-1 shadow-md transition-transform duration-200 hover:scale-110 cursor-pointer"
      onClick={() => document.getElementById("avatarUpload").click()}
    >
      <Camera className="w-4 h-4 text-white" />
    </div>
  </div>

  {/* Enlarged Image Preview on Hover */}
  {imageSrc && (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out pointer-events-none ${
        showHoverPreview ? 'opacity-100 backdrop-blur-md bg-black/60' : 'opacity-0'
      }`}
    >
      <img
        src={imageSrc}
        alt="Hover Enlarged"
        className={`transition-transform duration-500 transform ${
          showHoverPreview ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } max-w-xs max-h-[80%] rounded-xl shadow-xl pointer-events-none`}
      />
    </div>
  )}
   {imageSrc && (
    <div
      className="absolute -left-3 bottom-0 bg-black p-1 rounded-full shadow-md transition-transform duration-200 hover:scale-110 cursor-pointer"
      onClick={deleteImage}
    >
      <Trash className="w-4 h-4 text-white bg-black" />
    </div>
  )}
 
  {load && (
        <div className="fixed inset-0 z-50 bg-transparent backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="w-12 h-12 border-4 border-[#960018] border-t-transparent rounded-full animate-spin pointer-events-auto"></div>
        </div>
      )}  
</>
  );
};

export default ProfileImageUploader;

