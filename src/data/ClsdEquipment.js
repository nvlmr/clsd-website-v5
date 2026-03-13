// src/data/ClsdEquipment.js

import miniCentrifuge from "../assets/images/Equipments/mini centrifuge.jpg";
import multiParameter from "../assets/images/Equipments/multi parameter.jpg";
import photometer from "../assets/images/Equipments/photometer.jpg";
import reciprocalShaker from "../assets/images/Equipments/Reciprocal shaker.jpg";
import rotaryEvaporator from "../assets/images/Equipments/rotary evaporator.jpg";
import spectroPhotometer from "../assets/images/Equipments/spectro photometer.jpg";
import thermoShaker from "../assets/images/Equipments/thermo shaker.jpg";
import trinocularMicroscope from "../assets/images/Equipments/trinocular microscope.jpg";
import uvVisSpectrophotometer from "../assets/images/Equipments/UV VIS spectrophotometer.jpg";
import vanDorn from "../assets/images/Equipments/van dorn.jpg";
import waterBath from "../assets/images/Equipments/water bath.jpg";
import waterPurificationSystem from "../assets/images/Equipments/water purification system.jpg";
import xrf from "../assets/images/Equipments/xrf.jpg";
import analyticalWeighingScale from "../assets/images/Equipments/analytical digital weighing scale.jpg";
import autoclave from "../assets/images/Equipments/autoclave.jpg";
import benchtopCentrifuge from "../assets/images/Equipments/benchtop centrifuge.jpg";
import bioFreezer from "../assets/images/Equipments/bio-freezer.jpg";
import convectionOven from "../assets/images/Equipments/convection oven.jpg";
import conventionalPCR from "../assets/images/Equipments/conventional pcr.jpg";
import drone from "../assets/images/Equipments/drone.jpg";
import exo1MultiParameterSonde from "../assets/images/Equipments/EXO1 Multi-Parameter Sonde(CTD).jpg";
import freezeDryer from "../assets/images/Equipments/freeze dryer.jpg";
import fumeHood from "../assets/images/Equipments/fume hood.jpg";
import furnace from "../assets/images/Equipments/furnace.jpg";
import hplc from "../assets/images/Equipments/hplc.jpg";
import hybridCentrifuge from "../assets/images/Equipments/hybrid centrifuge.jpg";
import incubator from "../assets/images/Equipments/incubator.jpg";
import ionChrom from "../assets/images/Equipments/ion-chrom.jpg";
import laminarFlowHood from "../assets/images/Equipments/laminar flow hood.jpg";
import microplateReader from "../assets/images/Equipments/microplate reader.jpg";

// Mock data structure matching database schema
const mockEquipmentData = [
  { 
    id: 1,
    name: "Mini Centrifuge", 
    image: miniCentrifuge,
    description: "Compact laboratory device used for rapid separation of fluids based on density. Ideal for clinical and research applications requiring quick spin-down of samples.",
    model: "MiniSpin Plus",
    year_acquired: 2020,
    status: "available",
    applications: ["Clinical sample preparation", "DNA/RNA isolation", "Cell separation"],
    published: 1
  },
  { 
    id: 2,
    name: "Multi Parameter", 
    image: multiParameter,
    description: "Advanced water quality monitoring system that measures multiple parameters simultaneously including pH, conductivity, dissolved oxygen, and temperature.",
    model: "HQ40D",
    year_acquired: 2021,
    status: "available",
    applications: ["Water quality testing", "Environmental monitoring", "Aquaculture"],
    published: 1
  },
  { 
    id: 3,
    name: "Photometer", 
    image: photometer,
    description: "Precision instrument for measuring light intensity and chemical concentrations through colorimetric analysis. Essential for water quality testing and chemical analysis.",
    model: "PhotoFlex",
    year_acquired: 2020,
    status: "available",
    applications: ["Colorimetric analysis", "Water quality testing", "Clinical chemistry"],
    published: 1
  },
  { 
    id: 4,
    name: "Reciprocal Shaker", 
    image: reciprocalShaker,
    description: "Laboratory equipment providing consistent horizontal shaking motion for mixing, dissolving, and suspending samples in various containers.",
    model: "RS-10",
    year_acquired: 2019,
    status: "available",
    applications: ["Sample mixing", "Cell culture", "Extraction procedures"],
    published: 1
  },
  { 
    id: 5,
    name: "Rotary Evaporator", 
    image: rotaryEvaporator,
    description: "Efficient solvent removal system that uses vacuum distillation to gently concentrate or purify chemical samples at reduced pressures.",
    model: "RE-2000",
    year_acquired: 2021,
    status: "maintenance",
    applications: ["Solvent removal", "Sample concentration", "Chemical synthesis"],
    published: 1
  },
  { 
    id: 6,
    name: "Spectro Photometer", 
    image: spectroPhotometer,
    description: "Analytical instrument measuring light intensity across wavelengths to determine concentration of chemical substances in solutions.",
    model: "UV-1900",
    year_acquired: 2022,
    status: "available",
    applications: ["Quantitative analysis", "Enzyme kinetics", "DNA/Protein quantification"],
    published: 1
  },
  { 
    id: 7,
    name: "Thermo Shaker", 
    image: thermoShaker,
    description: "Combined heating and shaking device for precise temperature control during sample incubation and mixing processes.",
    model: "TS-100",
    year_acquired: 2020,
    status: "available",
    applications: ["Cell culture", "Enzyme reactions", "Sample incubation"],
    published: 1
  },
  { 
    id: 8,
    name: "Trinocular Microscope", 
    image: trinocularMicroscope,
    description: "Advanced microscope with three eyepiece tubes allowing simultaneous observation, photography, and video recording of specimens.",
    model: "CX43",
    year_acquired: 2021,
    status: "available",
    applications: ["Cell imaging", "Histology", "Pathology"],
    published: 1
  },
  { 
    id: 9,
    name: "UV VIS Spectrophotometer", 
    image: uvVisSpectrophotometer,
    description: "High-precision instrument for measuring light absorption in ultraviolet and visible ranges, crucial for quantitative chemical analysis.",
    model: "UV-2600",
    year_acquired: 2022,
    status: "available",
    applications: ["Nucleic acid quantification", "Protein analysis", "Enzyme assays"],
    published: 1
  },
  { 
    id: 10,
    name: "Van Dorn", 
    image: vanDorn,
    description: "Horizontal water sampling bottle designed for collecting water samples at specific depths without contamination from other depths.",
    model: "VD-2.5L",
    year_acquired: 2019,
    status: "available",
    applications: ["Water column sampling", "Limnology", "Oceanography"],
    published: 1
  },
  { 
    id: 11,
    name: "Water Bath", 
    image: waterBath,
    description: "Temperature-controlled water bath for incubating samples, thawing materials, and conducting temperature-sensitive experiments.",
    model: "WB-20",
    year_acquired: 2020,
    status: "available",
    applications: ["Sample incubation", "Thawing", "Chemical reactions"],
    published: 1
  },
  { 
    id: 12,
    name: "Water Purification System", 
    image: waterPurificationSystem,
    description: "Multi-stage filtration system producing high-purity water for sensitive laboratory applications and analytical procedures.",
    model: "Direct-Q 3",
    year_acquired: 2021,
    status: "available",
    applications: ["Reagent preparation", "Glassware rinsing", "Buffer preparation"],
    published: 1
  },
  { 
    id: 13,
    name: "XRF", 
    image: xrf,
    description: "X-Ray Fluorescence spectrometer for non-destructive elemental analysis of materials, from solids to liquids and powders.",
    model: "X-200",
    year_acquired: 2022,
    status: "available",
    applications: ["Elemental analysis", "Material identification", "Quality control"],
    published: 1
  },
  { 
    id: 14,
    name: "Analytical Weighing Scale", 
    image: analyticalWeighingScale,
    description: "High-precision balance with microgram sensitivity for accurate measurement of small sample masses in analytical chemistry.",
    model: "AX224",
    year_acquired: 2020,
    status: "available",
    applications: ["Sample preparation", "Standard preparation", "Analytical chemistry"],
    published: 1
  },
  { 
    id: 15,
    name: "Autoclave", 
    image: autoclave,
    description: "Sterilization equipment using high-pressure steam to eliminate microorganisms from laboratory instruments and media.",
    model: "CL-40M",
    year_acquired: 2019,
    status: "maintenance",
    applications: ["Media sterilization", "Waste decontamination", "Instrument sterilization"],
    published: 1
  },
  { 
    id: 16,
    name: "Benchtop Centrifuge", 
    image: benchtopCentrifuge,
    description: "Compact centrifugal separator for rapid sedimentation of cellular components, proteins, and nucleic acids.",
    model: "5702",
    year_acquired: 2021,
    status: "available",
    applications: ["Cell separation", "DNA/RNA precipitation", "Sample clarification"],
    published: 1
  },
  { 
    id: 17,
    name: "Bio-Freezer", 
    image: bioFreezer,
    description: "Ultra-low temperature freezer for long-term storage of biological samples, enzymes, and temperature-sensitive reagents.",
    model: "MDF-U76VC",
    year_acquired: 2022,
    status: "available",
    applications: ["Sample storage", "Enzyme preservation", "Cell banking"],
    published: 1
  },
  { 
    id: 18,
    name: "Convection Oven", 
    image: convectionOven,
    description: "Laboratory oven with forced air circulation for uniform heating, drying, and sterilization of glassware and samples.",
    model: "OF-12",
    year_acquired: 2020,
    status: "available",
    applications: ["Glassware drying", "Sample drying", "Heat treatment"],
    published: 1
  },
  { 
    id: 19,
    name: "Conventional PCR", 
    image: conventionalPCR,
    description: "Polymerase Chain Reaction thermal cycler for DNA amplification, genetic analysis, and molecular biology research.",
    model: "T100",
    year_acquired: 2021,
    status: "available",
    applications: ["Gene amplification", "Genetic testing", "Molecular diagnostics"],
    published: 1
  },
  { 
    id: 20,
    name: "Drone", 
    image: drone,
    description: "Unmanned aerial vehicle equipped with sensors for environmental monitoring, lake surveying, and aerial imaging.",
    model: "Phantom 4 Pro",
    year_acquired: 2022,
    status: "available",
    applications: ["Environmental monitoring", "Aerial imaging", "Lake surveying"],
    published: 1
  },
  { 
    id: 21,
    name: "EXO1 Multi-Parameter Sonde", 
    image: exo1MultiParameterSonde,
    description: "Advanced water quality monitoring platform with multiple sensors for real-time environmental data collection.",
    model: "EXO1",
    year_acquired: 2021,
    status: "available",
    applications: ["Water quality monitoring", "Environmental research", "Field studies"],
    published: 1
  },
  { 
    id: 22,
    name: "Freeze Dryer", 
    image: freezeDryer,
    description: "Lyophilization system for preserving biological materials by removing water through sublimation under vacuum.",
    model: "FreeZone 2.5",
    year_acquired: 2020,
    status: "available",
    applications: ["Sample preservation", "Pharmaceutical storage", "Food preservation"],
    published: 1
  },
  { 
    id: 23,
    name: "Fume Hood", 
    image: fumeHood,
    description: "Ventilated enclosure for safely handling hazardous chemicals, containing fumes and protecting laboratory personnel.",
    model: "Protector XL",
    year_acquired: 2019,
    status: "available",
    applications: ["Chemical handling", "Sample preparation", "Hazardous procedures"],
    published: 1
  },
  { 
    id: 24,
    name: "Furnace", 
    image: furnace,
    description: "High-temperature laboratory furnace for ashing samples, heat treatment, and material testing up to 1200°C.",
    model: "FB1400",
    year_acquired: 2020,
    status: "available",
    applications: ["Ashing", "Heat treatment", "Material testing"],
    published: 1
  },
  { 
    id: 25,
    name: "HPLC", 
    image: hplc,
    description: "High-Performance Liquid Chromatography system for separating, identifying, and quantifying compounds in complex mixtures.",
    model: "1260 Infinity",
    year_acquired: 2022,
    status: "available",
    applications: ["Compound separation", "Quantitative analysis", "Purity assessment"],
    published: 1
  },
  { 
    id: 26,
    name: "Hybrid Centrifuge", 
    image: hybridCentrifuge,
    description: "Versatile centrifuge combining refrigeration and multiple rotor options for various separation applications.",
    model: "Sorvall ST 8",
    year_acquired: 2021,
    status: "available",
    applications: ["Cell culture processing", "Protein purification", "DNA isolation"],
    published: 1
  },
  { 
    id: 27,
    name: "Incubator", 
    image: incubator,
    description: "Temperature-controlled chamber for cultivating microorganisms, cell cultures, and maintaining biological samples.",
    model: "Heracell 150i",
    year_acquired: 2020,
    status: "available",
    applications: ["Cell culture", "Microbial growth", "Temperature-sensitive storage"],
    published: 1
  },
  { 
    id: 28,
    name: "Ion Chromatography", 
    image: ionChrom,
    description: "Analytical system for separating and quantifying ions in solution, essential for water quality and environmental analysis.",
    model: "ICS-6000",
    year_acquired: 2022,
    status: "available",
    applications: ["Anion analysis", "Cation analysis", "Water quality testing"],
    published: 1
  },
  { 
    id: 29,
    name: "Laminar Flow Hood", 
    image: laminarFlowHood,
    description: "Sterile workbench providing particle-free workspace for handling sensitive biological samples and cell cultures.",
    model: "MSC-Advantage",
    year_acquired: 2021,
    status: "available",
    applications: ["Cell culture work", "Sterile handling", "Sample preparation"],
    published: 1
  },
  { 
    id: 30,
    name: "Microplate Reader", 
    image: microplateReader,
    description: "Multi-well plate analyzer for high-throughput screening, ELISA assays, and various photometric measurements.",
    model: "Multiskan GO",
    year_acquired: 2020,
    status: "available",
    applications: ["ELISA assays", "High-throughput screening", "Enzyme activity assays"],
    published: 1
  }
];

// Filter only published equipment
export const getPublishedEquipment = () => {
  return mockEquipmentData.filter(item => item.published === 1);
};

export default mockEquipmentData;