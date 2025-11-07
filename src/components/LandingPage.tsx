import React from "react";
import { useNavigate } from "react-router-dom";
import Squares from "./ui/Squares";
import GlitchText from "./ui/GlitchText";
import img1 from "../assets/Images/img-4.png";
import img2 from "../assets/Images/img-5.png";
import img3 from "../assets/Images/img-6.png";
import img4 from "../assets/Images/img-7.png";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Left Side: 3D Model with Glowing Images - Hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-black items-center justify-center relative">
        {/* Squares Background */}
        <Squares
          direction="diagonal"
          speed={0.5}
          borderColor="rgba(58,58,58)"
          squareSize={60}
          hoverFillColor="#ffffff"
        />

        {/* Image Container with Glow Effect */}
        <div className="absolute z-10 flex flex-col items-center space-y-6">
          {/* Top Image */}
          <div className="relative group">
            <img
              src={img1}
              alt="Top Image"
              className="w-68 h-40 border border-red-500 object-cover rounded-lg shadow-lg transform transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Bottom Image */}
          <div className="flex gap-2">
            <div className="relative group">
              <p className="text-red-300 font-bold mb-2 ml-1">
                Video call your mates!
              </p>
              <img
                src={img2}
                alt="Bottom Image"
                className="w-84 h-60 border border-pink-500 object-cover rounded-lg shadow-lg transform transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col gap-2 ml-4">
              <div className="relative group mb-2">
                <p className="text-blue-300 font-bold text-end mb-2">
                  synchronised whiteboard
                </p>
                <img
                  src={img3}
                  alt="Bottom Image"
                  className="w-76 h-44 border border-green-500 object-cover rounded-lg shadow-lg transform transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="relative group">
                <p className="text-pink-200 font-bold mb-2">
                  talk effortlessly
                </p>
                <img
                  src={img4}
                  alt="Bottom Image"
                  className="w-84 h-40 object-cover rounded-lg shadow-lg transform transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Text and Button - Full width on mobile */}
      <div className="w-full md:w-1/2 bg-black flex flex-col items-center justify-center p-8 min-h-screen">
        <GlitchText
          enableShadows={true}
          enableOnHover={false}
          className="text-[clamp(2rem,10vw,8rem)]"
          speed={1.5}
        >
          Collabio
        </GlitchText>

        <GlitchText
          enableShadows={true}
          enableOnHover={false}
          className="text-4xl md:text-6xl"
          speed={1.5}
        >
          metaverse
        </GlitchText>

        <button
          className="mt-8 px-6 py-3 text-sm font-semibold text-white bg-transparent rounded-full border border-white transition-colors"
          onClick={() => navigate("/setup")}
        >
          <GlitchText
            enableShadows={true}
            enableOnHover={true}
            className="text-xl"
            speed={2}
          >
            {">"}
          </GlitchText>
        </button>
      </div>

      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSdEpQd1mYT54IdDqoiCMirh_i8yXnsD6DmrnhMjIx6IIlXnuQ/viewform?usp=header"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-12 right-12 z-50 px-4 py-2 bg-transparent border border-white text-white font-semibold rounded-xl shadow-lg hover:bg-white hover:text-black transition-colors"
      >
        Please leave a feedback! 💗
      </a>
    </div>
  );
};

export default LandingPage;
