// src/data/ClsdEquipment.js

// Equipment images imports
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

const equipmentData = [
  { 
    name: "Mini Centrifuge", 
    image: miniCentrifuge,
    description: "Compact laboratory device used for rapid separation of fluids based on density. Ideal for clinical and research applications requiring quick spin-down of samples.",
    applications: ["Clinical sample preparation", "DNA/RNA isolation", "Cell separation"]
  },
  { 
    name: "Multi Parameter", 
    image: multiParameter,
    description: "Advanced water quality monitoring system that measures multiple parameters simultaneously including pH, conductivity, dissolved oxygen, and temperature.",
    applications: ["Water quality testing", "Environmental monitoring", "Aquaculture"]
  },
  { 
    name: "Photometer", 
    image: photometer,
    description: "Precision instrument for measuring light intensity and chemical concentrations through colorimetric analysis. Essential for water quality testing and chemical analysis.",
    applications: ["Colorimetric analysis", "Water quality testing", "Clinical chemistry"]
  },
  { 
    name: "Reciprocal Shaker", 
    image: reciprocalShaker,
    description: "Laboratory equipment providing consistent horizontal shaking motion for mixing, dissolving, and suspending samples in various containers.",
    applications: ["Sample mixing", "Cell culture", "Extraction procedures"]
  },
  { 
    name: "Rotary Evaporator", 
    image: rotaryEvaporator,
    description: "Efficient solvent removal system that uses vacuum distillation to gently concentrate or purify chemical samples at reduced pressures.",
    applications: ["Solvent removal", "Sample concentration", "Chemical synthesis"]
  },
  { 
    name: "Spectro Photometer", 
    image: spectroPhotometer,
    description: "Analytical instrument measuring light intensity across wavelengths to determine concentration of chemical substances in solutions.",
    applications: ["Quantitative analysis", "Enzyme kinetics", "DNA/Protein quantification"]
  },
  { 
    name: "Thermo Shaker", 
    image: thermoShaker,
    description: "Combined heating and shaking device for precise temperature control during sample incubation and mixing processes.",
    applications: ["Cell culture", "Enzyme reactions", "Sample incubation"]
  },
  { 
    name: "Trinocular Microscope", 
    image: trinocularMicroscope,
    description: "Advanced microscope with three eyepiece tubes allowing simultaneous observation, photography, and video recording of specimens.",
    applications: ["Cell imaging", "Histology", "Pathology"]
  },
  { 
    name: "UV VIS Spectrophotometer", 
    image: uvVisSpectrophotometer,
    description: "High-precision instrument for measuring light absorption in ultraviolet and visible ranges, crucial for quantitative chemical analysis.",
    applications: ["Nucleic acid quantification", "Protein analysis", "Enzyme assays"]
  },
  { 
    name: "Van Dorn", 
    image: vanDorn,
    description: "Horizontal water sampling bottle designed for collecting water samples at specific depths without contamination from other depths.",
    applications: ["Water column sampling", "Limnology", "Oceanography"]
  },
  { 
    name: "Water Bath", 
    image: waterBath,
    description: "Temperature-controlled water bath for incubating samples, thawing materials, and conducting temperature-sensitive experiments.",
    applications: ["Sample incubation", "Thawing", "Chemical reactions"]
  },
  { 
    name: "Water Purification System", 
    image: waterPurificationSystem,
    description: "Multi-stage filtration system producing high-purity water for sensitive laboratory applications and analytical procedures.",
    applications: ["Reagent preparation", "Glassware rinsing", "Buffer preparation"]
  },
  { 
    name: "XRF", 
    image: xrf,
    description: "X-Ray Fluorescence spectrometer for non-destructive elemental analysis of materials, from solids to liquids and powders.",
    applications: ["Elemental analysis", "Material identification", "Quality control"]
  },
  { 
    name: "Analytical Weighing Scale", 
    image: analyticalWeighingScale,
    description: "High-precision balance with microgram sensitivity for accurate measurement of small sample masses in analytical chemistry.",
    applications: ["Sample preparation", "Standard preparation", "Analytical chemistry"]
  },
  { 
    name: "Autoclave", 
    image: autoclave,
    description: "Sterilization equipment using high-pressure steam to eliminate microorganisms from laboratory instruments and media.",
    applications: ["Media sterilization", "Waste decontamination", "Instrument sterilization"]
  },
  { 
    name: "Benchtop Centrifuge", 
    image: benchtopCentrifuge,
    description: "Compact centrifugal separator for rapid sedimentation of cellular components, proteins, and nucleic acids.",
    applications: ["Cell separation", "DNA/RNA precipitation", "Sample clarification"]
  },
  { 
    name: "Bio-Freezer", 
    image: bioFreezer,
    description: "Ultra-low temperature freezer for long-term storage of biological samples, enzymes, and temperature-sensitive reagents.",
    applications: ["Sample storage", "Enzyme preservation", "Cell banking"]
  },
  { 
    name: "Convection Oven", 
    image: convectionOven,
    description: "Laboratory oven with forced air circulation for uniform heating, drying, and sterilization of glassware and samples.",
    applications: ["Glassware drying", "Sample drying", "Heat treatment"]
  },
  { 
    name: "Conventional PCR", 
    image: conventionalPCR,
    description: "Polymerase Chain Reaction thermal cycler for DNA amplification, genetic analysis, and molecular biology research.",
    applications: ["Gene amplification", "Genetic testing", "Molecular diagnostics"]
  },
  { 
    name: "Drone", 
    image: drone,
    description: "Unmanned aerial vehicle equipped with sensors for environmental monitoring, lake surveying, and aerial imaging.",
    applications: ["Environmental monitoring", "Aerial imaging", "Lake surveying"]
  },
  { 
    name: "EXO1 Multi-Parameter Sonde", 
    image: exo1MultiParameterSonde,
    description: "Advanced water quality monitoring platform with multiple sensors for real-time environmental data collection.",
    applications: ["Water quality monitoring", "Environmental research", "Field studies"]
  },
  { 
    name: "Freeze Dryer", 
    image: freezeDryer,
    description: "Lyophilization system for preserving biological materials by removing water through sublimation under vacuum.",
    applications: ["Sample preservation", "Pharmaceutical storage", "Food preservation"]
  },
  { 
    name: "Fume Hood", 
    image: fumeHood,
    description: "Ventilated enclosure for safely handling hazardous chemicals, containing fumes and protecting laboratory personnel.",
    applications: ["Chemical handling", "Sample preparation", "Hazardous procedures"]
  },
  { 
    name: "Furnace", 
    image: furnace,
    description: "High-temperature laboratory furnace for ashing samples, heat treatment, and material testing up to 1200°C.",
    applications: ["Ashing", "Heat treatment", "Material testing"]
  },
  { 
    name: "HPLC", 
    image: hplc,
    description: "High-Performance Liquid Chromatography system for separating, identifying, and quantifying compounds in complex mixtures.",
    applications: ["Compound separation", "Quantitative analysis", "Purity assessment"]
  },
  { 
    name: "Hybrid Centrifuge", 
    image: hybridCentrifuge,
    description: "Versatile centrifuge combining refrigeration and multiple rotor options for various separation applications.",
    applications: ["Cell culture processing", "Protein purification", "DNA isolation"]
  },
  { 
    name: "Incubator", 
    image: incubator,
    description: "Temperature-controlled chamber for cultivating microorganisms, cell cultures, and maintaining biological samples.",
    applications: ["Cell culture", "Microbial growth", "Temperature-sensitive storage"]
  },
  { 
    name: "Ion Chromatography", 
    image: ionChrom,
    description: "Analytical system for separating and quantifying ions in solution, essential for water quality and environmental analysis.",
    applications: ["Anion analysis", "Cation analysis", "Water quality testing"]
  },
  { 
    name: "Laminar Flow Hood", 
    image: laminarFlowHood,
    description: "Sterile workbench providing particle-free workspace for handling sensitive biological samples and cell cultures.",
    applications: ["Cell culture work", "Sterile handling", "Sample preparation"]
  },
  { 
    name: "Microplate Reader", 
    image: microplateReader,
    description: "Multi-well plate analyzer for high-throughput screening, ELISA assays, and various photometric measurements.",
    applications: ["ELISA assays", "High-throughput screening", "Enzyme activity assays"]
  }
];

export default equipmentData;