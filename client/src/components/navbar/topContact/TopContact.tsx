import Container from "@/components/container/Container";
import React from "react";
import { FaGraduationCap, FaPhoneAlt } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

const TopContact = () => {
  return (
    <div className="py-3 bg-white">
      <Container>
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-accent-500">
              <MdOutlineEmail size={30} />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Mail Us</span>
              support@widemy.com
            </div>
          </div>
          <div className="flex items-center gap-2 text-4xl font-semibold">
            <div className="text-accent-500">
              <FaGraduationCap size={30} />
            </div>
            E-Learning
          </div>
          <div className="flex items-center gap-2">
            <div className="text-accent-500">
              <FaPhoneAlt size={30} />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Call Us</span>
              +1-432-456-7793
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TopContact;
