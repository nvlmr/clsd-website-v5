import React, { Fragment } from "react";
import { ChevronRight } from "lucide-react";

// Logo imports
import lspulogo from "../assets/logo/LSPU.png";
import pcieerdlogo from "../assets/logo/PCIEERD.png";
import pcaarrdlogo from "../assets/logo/PCAARRD.png";
import nrcplogo from "../assets/logo/NRCP.png";
import dabfarlogo from "../assets/logo/DA-BFAR.png";
import denrlogo from "../assets/logo/DENR.png";
import uplblogo from "../assets/logo/UPLB.png";
import lagunalogo from "../assets/logo/LAGUNA.png";
import clsdlogo from "../assets/logo/LSD.png";
import dostlogo from "../assets/logo/DOST.png";

const Footer = () => {
  // Added unique IDs to each partner logo
  const partnerLogos = [
    { id: "lspu", src: lspulogo, alt: "LSPU Logo", name: "LSPU", href: 'https://lspu.edu.ph/' },
    { id: "dost", src: dostlogo, alt: "DOST Logo", name: "DOST", href: 'https://www.dost.gov.ph/' },
    { id: "pcieerd", src: pcieerdlogo, alt: "PCIEERD Logo", name: "PCIEERD", href: 'https://pcieerd.dost.gov.ph/' },
    { id: "pcaarrd", src: pcaarrdlogo, alt: "PCAARRD Logo", name: "PCAARRD", href: 'http://www.pcaarrd.dost.gov.ph/home/portal/' },
    { id: "nrcp", src: nrcplogo, alt: "NRCP Logo", name: "NRCP", href: 'https://nrcp.dost.gov.ph/' },
    { id: "dabfar", src: dabfarlogo, alt: "DA-BFAR Logo", name: "DA-BFAR", href: 'https://www.bfar.da.gov.ph/' },
    { id: "denr", src: denrlogo, alt: "DENR Logo", name: "DENR", href: 'https://calabarzon.denr.gov.ph/' },
    { id: "uplb", src: uplblogo, alt: "UPLB Logo", name: "UPLB", href: 'https://uplb.edu.ph/main/' },
    { id: "laguna", src: lagunalogo, alt: "Laguna Logo", name: "LAGUNA", href: 'http://laguna.gov.ph/' },
  ];

  // Added unique IDs to each government link
  const governmentLinks = [
    { id: "op", name: "Office of the President", url: "https://pco.gov.ph/" },
    { id: "ovp", name: "Office of the Vice President", url: "https://ovp.gov.ph/" },
    { id: "senate", name: "Senate of the Philippines", url: "http://legacy.senate.gov.ph/" },
    { id: "house", name: "House of Representatives", url: "https://www.congress.gov.ph/" },
    { id: "sc", name: "Supreme Court", url: "https://sc.judiciary.gov.ph/" },
    { id: "ca", name: "Court of Appeals", url: "https://ca.judiciary.gov.ph/" },
    { id: "sandiganbayan", name: "Sandiganbayan", url: "https://sb.judiciary.gov.ph/" },
  ];

  const FooterLink = ({ name, url }) => (
    <a
      href={url}
      target={url !== "#" ? "_blank" : undefined}
      rel={url !== "#" ? "noopener noreferrer" : undefined}
      className="group flex items-center text-sm text-slate-500 hover:text-blue-600 transition-all duration-300 py-1.5"
    >
      <ChevronRight className="h-3.5 w-3.5 mr-2 text-gray-500/70 group-hover:text-blue-600 transition-colors duration-300" />
      <span className="relative overflow-hidden">
        {name}
        <span className="absolute bottom-0 left-0 w-full h-px bg-blue-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
      </span>
    </a>
  );

  return (
    <footer className="relative bg-white overflow-hidden">
      {/* Partners Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center space-y-2 mt-10 mb-10">
          <h3 className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em]">
            Trusted By & Partnered With
          </h3>
          <div className="h-1 w-12 bg-blue-100 mx-auto rounded-full"></div>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 lg:gap-10">
          {partnerLogos.map((logo) => {
            const content = (
              <div className="group transition-transform duration-300 hover:scale-150">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.name}
                  className="h-9 md:h-14 w-auto object-contain cursor-pointer"
                />
              </div>
            );

            // KEY FIX: Added key prop to the outermost element
            if (logo.href) {
              return (
                <a
                  key={logo.id}
                  href={logo.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {content}
                </a>
              );
            }
            return <Fragment key={logo.id}>{content}</Fragment>;
          })}
        </div>
      </div>

      <div className="bg-slate-50/50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
            
            {/* Brand/About Section */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex flex-col space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 tracking-tight leading-tight">
                    Center for Lakes Sustainable Development
                  </h4>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-sm leading-snug">
                Under the <span className="text-slate-700 font-medium">"Accelerated R&D Program for Capacity Building of Research 
                and Development Institutions and Industrial Competitiveness Niche 
                Centers in the Regions for R&D (NICER)"</span>. 
                Dedicated to advancing lake ecosystem research through innovation.
              </p>
            </div>

            {/* GOVPH Info Column */}
            <div className="lg:col-span-4">
              <div className="flex items-center space-x-2 mb-1.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-1.5 border-l-2 border-blue-500 pl-3">
                  About GOVPH
                </h4>
              </div>
              <p className="text-sm text-slate-500 mb-6 leading-[1.3]">
                Learn more about the Philippine government, its structure, and the people behind it.
              </p>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-1.5 mt-7.5 border-l-2 border-blue-500 pl-3">
                Quick Links
              </h5>
              <div className="flex flex-col">
                <FooterLink name="Official Gazette" url="https://www.officialgazette.gov.ph/" />
                <FooterLink name="Open Data Portal" url="#" />
              </div>
            </div>

            {/* Government Links Column */}
            <div className="lg:col-span-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4 border-l-2 border-blue-500 pl-3">
                Government Links
              </h4>
              {/* KEY FIX: Added key prop to the div wrapper */}
              {governmentLinks.map((link) => (
                <div key={link.id} className="-mt-2">
                  <FooterLink name={link.name} url={link.url} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="bg-white border-t border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-2">
              <img
                src={clsdlogo}
                alt="CLSD Logo"
                className="h-15 w-auto"
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