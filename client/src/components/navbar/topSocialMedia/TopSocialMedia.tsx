import Container from "@/components/container/Container";
import Link from "next/link";
import React from "react";
import {
  FaFacebookF,
  FaGraduationCap,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

const TopSocialMedia = () => {
  return (
    <div className="w-full py-2 text-white bg-black">
      <Container>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="text-accent-500">
              <FaGraduationCap size={25} />
            </div>
            Welcome to wiDemy
          </div>
          <div className="flex items-center gap-5">
            <FaFacebookF size={15} className="opacity-60" />
            <FaInstagram size={15} className="opacity-60" />
            <FaTwitter size={15} className="opacity-60" />
            <Link href="/" className="font-semibold text-accent-500">
              Start Learning
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TopSocialMedia;
