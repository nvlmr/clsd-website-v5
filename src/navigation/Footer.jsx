import React from "react";
import { ChevronRight, ExternalLink, Globe } from "lucide-react";

// Logo imports (Keeping your exact paths)
import lspulogo from "../assets/logo/LSPU.png";
import dostlogo from "../assets/logo/DOST.png";
import pcieerdlogo from "../assets/logo/PCIEERD.png";
import pcaarrdlogo from "../assets/logo/PCAARRD.png";
import nrcplogo from "../assets/logo/NRCP.png";
import dabfarlogo from "../assets/logo/DA-BFAR.png";
import denrlogo from "../assets/logo/DENR.png";
import uplblogo from "../assets/logo/UPLB.png";
import lagunalogo from "../assets/logo/LAGUNA.png";
import clsdlogo from "../assets/logo/LSD.png";

const Footer = () => {
  const partnerLogos = [
    { src: lspulogo, alt: "LSPU Logo", name: "LSPU" },
    { src: dostlogo, alt: "DOST Logo", name: "DOST" },
    { src: pcieerdlogo, alt: "PCIEERD Logo", name: "PCIEERD" },
    { src: pcaarrdlogo, alt: "PCAARRD Logo", name: "PCAARRD" },
    { src: nrcplogo, alt: "NRCP Logo", name: "NRCP" },
    { src: dabfarlogo, alt: "DA-BFAR Logo", name: "DA-BFAR" },
    { src: denrlogo, alt: "DENR Logo", name: "DENR" },
    { src: uplblogo, alt: "UPLB Logo", name: "UPLB" },
    { src: lagunalogo, alt: "Laguna Logo", name: "LAGUNA" },
  ];

  const governmentLinks = [
    { name: "Office of the President", url: "#" },
    { name: "Office of the Vice President", url: "https://ovp.gov.ph/" },
    { name: "Senate of the Philippines", url: "http://legacy.senate.gov.ph/" },
    { name: "House of Representatives", url: "https://www.congress.gov.ph/" },
    { name: "Supreme Court", url: "#" },
    { name: "Court of Appeals", url: "https://sc.judiciary.gov.ph/" },
    { name: "Sandiganbayan", url: "https://sb.judiciary.gov.ph/" },
  ];

const FooterLink = ({ name, url }) => (
    <a
      href={url}
      target={url !== "#" ? "_blank" : undefined}
      rel={url !== "#" ? "noopener noreferrer" : undefined}
      className="group flex items-center text-sm text-slate-500 hover:text-blue-600 transition-all duration-300 py-1.5"
    >
      {/* The Arrow: Now always visible */}
      <ChevronRight className="h-3.5 w-3.5 mr-2 text-gray-500/70 group-hover:text-blue-600 transition-colors duration-300" />
      
      <span className="relative overflow-hidden">
        {name}
        {/* The Underline: Only appears on hover */}
        <span className="absolute bottom-0 left-0 w-full h-px bg-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
      </span>
    </a>
  );

  return (
    <footer className="relative bg-white pt-16 overflow-hidden">
      {/* Decorative top border with a subtle gradient */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-teal-400 to-blue-600"></div>

      {/* Partners Section - Only zoom hover effect */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center space-y-2 mb-10">
          <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">
            Trusted By & Partnered With
          </h3>
          <div className="h-1 w-12 bg-blue-100 mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-16">
          {partnerLogos.map((logo, index) => (
            <div
              key={index}
              className="group transition-transform duration-300 hover:scale-150"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                title={logo.name}
                className="h-9 md:h-14 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Brand/About Section */}
            <div className="lg:col-span-5 space-y-6">
              <div className="flex flex-col space-y-4">
                <div>
                  <h4 className="text-xl font-semibold text-slate-900 tracking-tight leading-tight">
                    Center for Lakes <br />
                    <span className="text-blue-600 font-bold italic">Sustainable Development</span>
                  </h4>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
                Under the <span className="text-slate-700 font-medium">"Accelerated R&D Program for Capacity Building of Research 
                and Development Institutions and Industrial Competitiveness Niche 
                Centers in the Regions for R&D (NICER)"</span>. 
                Dedicated to advancing lake ecosystem research through innovation.
              </p>
            </div>

            {/* GOVPH Info Column */}
            <div className="lg:col-span-3">
              <div className="flex items-center space-x-2 mb-1.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-1.5 border-l-2 border-blue-500 pl-3">
                  About GOVPH
                </h4>
              </div>
              <p className="text-sm text-slate-500 mb-11 leading-relaxed">
                Learn more about the Philippine government, its structure, and the people behind it.
              </p>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-1.5 border-l-2 border-blue-500 pl-3">
                Quick Links
              </h5>
              <div className="flex flex-col">
                <FooterLink name="Official Gazette" url="https://www.officialgazette.gov.ph/" />
                <FooterLink name="Open Data Portal" url="#" />
              </div>
            </div>

            {/* Government Links Column */}
            <div className="lg:col-span-4">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-1.5 border-l-2 border-blue-500 pl-3">
                Government Links
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-x-4">
                {governmentLinks.map((link, index) => (
                  <FooterLink key={index} name={link.name} url={link.url} />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="bg-white border-t border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-4">
              <img
                src={clsdlogo}
                alt="CLSD Logo"
                className="h-8 w-auto"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-900 uppercase tracking-tight">
                  Center for Lakes Sustainable Development
                </span>
                <span className="text-[10px] text-slate-400">
                  &copy; {new Date().getFullYear()} All rights reserved. 
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <a href="#" className="text-[11px] font-normal text-slate-400 hover:text-blue-600 uppercase tracking-tighter transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-[11px] font-normal text-slate-400 hover:text-blue-600 uppercase tracking-tighter transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;