"use client";

import { useState } from "react";
import Container from "../container/Container";
import Link from "next/link";
import ThemeToggle from "./themeToggle/ThemeToggle";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import { CgClose } from "react-icons/cg";
import TopContact from "./topContact/TopContact";
import TopSocialMedia from "./topSocialMedia/TopSocialMedia";

const links = [
  {
    id: 1,
    title: "Home",
    path: "/",
  },
  {
    id: 2,
    title: "Courses",
    path: "/courses",
  },
  {
    id: 3,
    title: "About",
    path: "/about",
  },
  {
    id: 4,
    title: "Policy",
    path: "/policy",
  },
  {
    id: 5,
    title: "FAQ",
    path: "/faq",
  },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full">
      <TopSocialMedia />
      <TopContact />
      <div className="w-full py-2 shadow-md text-white bg-[#212121]">
        <Container>
          <div className="flex justify-between items-center">
            <div className="text-[25px] font-bold">
              <Link href="/">
                wi
                <span className="text-accent-500">Demy</span>
              </Link>
            </div>
            <div className="md:hidden flex items-center gap-10">
              <ThemeToggle />
              <div
                className="z-40 text-black dark:text-white cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                {open ? <CgClose size={25} /> : <HiOutlineMenuAlt3 size={25} />}
              </div>
            </div>
            <nav
              className={`w-[60%] md:w-auto h-screen md:h-auto absolute md:static top-0 transition-all 
              md:transition-none
              shadow-md md:shadow-none dark:shadow-none bg-white md:bg-transparent dark:bg-slate-900 
              dark:md:bg-transparent dark:bg-opacity-90 duration-300 ${
                open ? "right-0" : "-right-full"
              } `}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-10 pt-24 md:pt-0 px-5 md:px-0">
                <ul className="flex flex-col md:flex-row md:items-center gap-10">
                  {links.map((link) => (
                    <li
                      key={link.id}
                      onClick={() => setOpen(false)}
                      className="font-[500] transition-all duration-300 hover:text-[crimson] dark:hover:text-[#37a29a]"
                    >
                      <Link href={link.path}>{link.title}</Link>
                    </li>
                  ))}
                </ul>
                <div className="hidden md:block">
                  <ThemeToggle />
                </div>
                <div className="text-white cursor-pointer">
                  <HiOutlineUserCircle size={25} />
                </div>
              </div>
            </nav>
          </div>
        </Container>
      </div>
    </header>
  );
};

export default Navbar;
