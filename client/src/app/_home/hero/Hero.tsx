import React from "react";
import Container from "@/components/container/Container";

const Hero = () => {
  return (
    <section className="w-full md:h-screen bg-hero bg-cover bg-center bg-no-repeat">
      <div className="w-full h-full pt-[140px] bg-black/40">
        <Container>
          <div className="w-full text-white flex flex-col items-center">
            <div className="w-full max-w-[800px] flex flex-col items-center gap-5">
              <h1 className="text-5xl font-bold uppercase">
                Welcome to <span className="">wiDemy</span> lms
              </h1>
              <p className="font-bold text-center">
                Our LMS is more than just a platform, {`it's`} a catalyst for
                positive change. Join our community and experience the
                transformation power of education for yourself.
              </p>
              <div className="flex gap-5">
                <button className="px-10 py-3 font-semibold rounded-full cursor-pointer uppercase text-white bg-gray-700">
                  Read more
                </button>
                <button className="px-10 py-3 font-semibold rounded-full cursor-pointer uppercase text-white bg-accent-500">
                  Get started
                </button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
};

export default Hero;
