import { User, updateEmail, updateProfile } from "firebase/auth";
import { FormEvent, useContext, useState } from "react";
import Image from "next/image";
import Router from "next/router";
import { AuthContext } from "@/context/AuthContext";
import Chilling from "@/images/chilling.svg";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/firebase/clientApp";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Profile = () => {
  const currentUser = useContext(AuthContext) as User;
  const [name, setName] = useState(currentUser.displayName);
  const [email, setEmail] = useState(currentUser.email);
  const [image, setImage] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageURL, setImageURL] = useState(currentUser.photoURL);

  const handleUpdate = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);

    await Promise.all([
      updateProfile(currentUser, {
        displayName: name,
      }),
      updateEmail(currentUser, email as string),
      updateDoc(doc(db, "users", currentUser.uid), {
        displayName: name,
        email,
      }),
    ]).then(() => Router.reload());
  };

  const updateImage = () => {
    if (!image) return;
    setLoading(true);

    const imageRef = ref(storage, "userProfile/" + currentUser.displayName);
    const uploadTask = uploadBytesResumable(imageRef, image);

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          await Promise.all([
            updateProfile(currentUser, {
              photoURL: downloadURL,
            }),
            updateDoc(doc(db, "users", currentUser.uid), {
              photoURL: downloadURL,
            }),
          ]).then(() => Router.reload());
        });
      }
    );
  };

  const changeImage = (image: Blob) => {
    setImageURL(URL.createObjectURL(image));
    setImage(image);
  };

  const removeImage = async () => {
    await Promise.all([
      updateProfile(currentUser, {
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/zello-adienox.appspot.com/o/userProfile%2Fprofile.png?alt=media&token=469e73a4-7096-4aba-8fb6-d3272a4351e0",
      }),
      updateDoc(doc(db, "users", currentUser.uid), {
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/zello-adienox.appspot.com/o/userProfile%2Fprofile.png?alt=media&token=469e73a4-7096-4aba-8fb6-d3272a4351e0",
      }),
    ]).then(() => Router.reload());
  };

  return (
    <div className="grid h-[100vh] overflow-y-scroll bg-primary p-5 scrollbar-hide md:h-[calc(90vh-90px)] md:grid-cols-2 md:px-[8rem] md:pt-[2rem]">
      <div className="">
        <div>
          <h3 className="text-3xl text-white">My profile</h3>
          <span className="text-gray-500">Manage your profile settings</span>
        </div>
        <div className="mt-10 text-white">
          <span className="text-xl">Your Profile Picture</span>
          <div className="mt-5 flex items-center gap-5 md:gap-12">
            <label htmlFor="file">
              <img
                src={imageURL as string}
                className="h-[180px] w-[180px] cursor-pointer rounded-full bg-white object-cover md:h-[256px] md:w-[256px]"
                alt="profile picture"
              />
            </label>
            <input
              type="file"
              id="file"
              className="hidden"
              onChange={(e) => e.target.files && changeImage(e.target.files[0])}
            />
            <div className="flex flex-col gap-3">
              <button
                className="rounded bg-blueHighlight p-2 px-4 drop-shadow-sm disabled:cursor-not-allowed disabled:bg-blueHighlight/30"
                onClick={updateImage}
                disabled={loading}
              >
                Change Picture
              </button>
              <button
                className="rounded border border-gray-600 bg-primary p-2 px-4 drop-shadow-sm"
                onClick={removeImage}
                disabled={loading}
              >
                Remove picture
              </button>
            </div>
          </div>
          <p className="mt-5 text-gray-500">
            Update Your Photo. The recommended size is 256×256px
          </p>
        </div>
        <form
          onSubmit={handleUpdate}
          className="mt-10 flex w-full flex-col gap-5 text-white"
        >
          <div>
            <h4>Name</h4>
            <input
              value={name as string}
              type="text"
              className="mt-2 h-[42px] w-[75%] rounded border border-gray-800 bg-primaryDark p-3 outline-none drop-shadow-sm"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <h4>Email</h4>
            <input
              value={email as string}
              type="email"
              className="mt-2 h-[42px] w-[75%] rounded border border-gray-800 bg-primaryDark p-3 outline-none drop-shadow-sm"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            disabled={loading}
            className="w-[150px] rounded bg-blueHighlight p-2 px-4 drop-shadow-sm disabled:cursor-not-allowed disabled:bg-blueHighlight/30"
          >
            Update Profile
          </button>
        </form>
      </div>
      <div className="mt-10 pl-0 md:p-10">
        <div className="first-line: flex flex-col items-center rounded bg-blueHighlight p-5 md:flex-row">
          <div className="text-white">
            <h4 className="text-xl">Build Trust!</h4>
            <p className=" text-gray-300">
              Update your profile using the right information to build trust
              among the community.
            </p>
          </div>
          <Image className="h-[200px]" src={Chilling} alt="" />
        </div>
        <div className="h-[90px]"></div>
      </div>
    </div>
  );
};

export default Profile;
