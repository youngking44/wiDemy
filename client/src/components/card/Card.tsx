import React from "react";
import { FaGraduationCap } from "react-icons/fa";

const Card = () => {
  return (
    <div
      className="group relative flex-1 flex flex-col items-center gap-4 mb-5 mt-[-120px] px-5 py-8 
      text-center cursor-pointer transition-all duration-300 text-white bg-secondary-400 
      hover:bg-accent-500 before:content-[''] before:h-[4px] before:absolute before:right-0 
      before:bottom-0 before:left-0 before:scale-0 before:origin-left before:bg-black 
      before:transition-all before:duration-500 before:ease-in-out hover:before:scale-100"
    >
      <div
        className="w-[80px] h-[80px] rounded-full flex justify-center items-center
       text-accent-500 bg-black group-hover:text-white"
      >
        <FaGraduationCap size={35} />
      </div>
      <h4 className="text-xl font-bold">Trending Courses</h4>
      <p className="opacity-60">
        Lorem ipsum dolor sit amet Sed nec molestie justo
      </p>
    </div>
  );
};

export default Card;
