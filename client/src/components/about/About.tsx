import React from "react";
import Container from "../container/Container";
import Image from "next/image";
import Card from "../card/Card";

const About = () => {
  return (
    <section className="w-full md:min-h-screen py-10">
      <Container>
        <div className="flex gap-5">
          <Card />
          <Card />
          <Card />
          <Card />
        </div>
        <div className="flex flex-col items-center gap-55">
          <h2 className="text-[34px] font-bold uppercase">About us</h2>
          <p className="w-3/4 text-center">
            Our mission at wiDemy is to revolutionize the way people learn.
            {`We're `} dedicated to providing a platform {`that's`} intuitive,
            interactive, and inclusive. We believe that education is the key to
            unlocking individual and collective potential, and {`we're `}
            committed to making it more accessible and affordable for everyone.
          </p>
        </div>
        <div className="flex gap-5 mt-10">
          <div className="flex-1">
            <div className="w-full h-[350px] relative">
              <Image
                fill
                src="/assets/about.jpg"
                alt="About image"
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl mb-5 font-bold uppercase">
              Welcome to widemy
            </h3>
            <p>
              At wiDemy, our mission is to empower individuals and organizations
              to reach their full potential through innovative, user-friendly,
              and collaborative learning solutions.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default About;
