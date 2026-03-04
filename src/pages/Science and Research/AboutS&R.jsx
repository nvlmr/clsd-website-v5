import React from "react";
import NavBar from "../../navigation/NavBar.jsx";
import Footer from "../../navigation/Footer.jsx";
import AutoScroll from "../AutoScroll.jsx";
import SRLImg from "../../assets/images/About Science and Research/SRL.jpg";
import { 
  Target, 
  Calendar, 
  Award, 
  TrendingUp, 
  ChevronRight,
  Building2,
  FlaskConical,
  Fish,
  Mic,
  Timer,
  MapPin,
  Shield,
  Droplets,
  Users,
  Heart,
  ArrowRight
} from "lucide-react";

function AboutScienceAndResearch() {
  // Timeline data for better visual representation
  const timelineEvents = [
    {
      year: "2015",
      title: "Initial Visit & Workshop",
      description: "Dr. Dalisay G. Fernandez and team from DOST-PCAARRD conducted a seminar-workshop on project proposal writing.",
      icon: Mic,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      year: "2016",
      title: "First Major Breakthrough",
      description: "Milkfish aqua-synbiotic technology project approved with PhP 4M funding - first externally-funded research.",
      icon: Fish,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    },
    {
      year: "2017",
      title: "Research Station Development",
      description: "Additional Php 10M funding for facility improvement and state-of-the-art equipment.",
      icon: FlaskConical,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  // Stats data - Key Milestones with white background
  const stats = [
    { label: "Total External Funding", value: "₱14M+", icon: TrendingUp },
    { label: "First Major Project", value: "2016", icon: Calendar },
    { label: "Institutional Investment", value: "₱1.6M", icon: Building2 }
  ];

  // Mission points
  const missionPoints = [
    { icon: Shield, text: "Food Security & Safety" },
    { icon: Droplets, text: "Environmental Protection" },
    { icon: Users, text: "Public Health" },
    { icon: Heart, text: "Social Equality" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <AutoScroll />
      <NavBar />
      <main className="flex-grow pt-16 sm:pt-20 lg:pt-24">

        {/* Image Section - Fixed hover effect */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-14">
          <div className="relative group">
            {/* Blur effect - positioned behind the image */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-25 transition duration-300 -z-10"></div>
            
            {/* Image container with proper border radius */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img 
                src={SRLImg} 
                alt="Science and Research Laboratory" 
                className="w-full h-auto object-cover transform group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
          </div>
        </section>

        {/* Content Section - Enhanced with equal height columns */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content - Takes 2/3 on large screens */}
            <div className="lg:col-span-2">
              <div className="h-full flex flex-col">
                <div className="prose prose-lg max-w-none flex-1">
                  <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                    The first major opportunity for SRL came when our "champion," Dr. Dalisay G. Fernandez and her team from the Inland Aquatic Resources Division (IARD), Department of Science and Technology - Philippine Council for Agriculture, Aquatic, and Natural Resources Research and Development (DOST-PCAARRD) – paid a visit in mid-2015 for a seminar-workshop on project proposal writing for possible funding by the agency.
                  </p>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 sm:p-8 rounded-2xl border-l-4 border-blue-600 my-8 relative">
                    <div className="absolute -left-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <ChevronRight className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed italic pl-4">
                      "In response, the research team led by Prof. de la Cruz (as Project Leader) was able to submit a viable project proposal on the development of milkfish aqua-synbiotic technology, that was approved for implementation in July 2016, with a total budget of <span className="font-bold text-blue-600 not-italic">PhP 4M</span>. Considered as the first externally-funded research, the milkfish aqua-synbiotic project was a huge breakthrough in the R&D history of LSPU."
                    </p>
                  </div>

                  <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                    In line with the government's initiatives on regional scientific-research development, additional funding from DOST-PCAARRD was approved in mid-2017, amounting to <span className="font-semibold text-blue-600">Php 10M</span> to cover the "improvement of the research station for fisheries biotechnology and post-harvest technology." The amount was used to rehabilitate the fish ponds and tanks (part of the Aquaculture Research Station) and also for purchase of additional state-of-the-art laboratory equipment, in support of on-going activities in relation to the milkfish project.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all group">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">LSPU Investment</h4>
                      <p className="text-gray-600">Php 1.6M for laboratory enhancements and furniture</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all group">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Target className="w-6 h-6 text-purple-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2">Core Mission</h4>
                      <p className="text-gray-600">Support research in fisheries for food security and safety</p>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                    LSPU-LBC, for its counterpart, has also disbursed the amount of Php 1.6M, that were spent on repairs/enhancement of laboratory rooms and purchase of furniture. To this end, the SRL is mandated to support research undertakings in fisheries that are responsive to pressing issues linked to food security and safety, environmental degradation in aquatic ecosystems, public health risks, and social equality.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar - Timeline/Stats on the right - Equal height with main content */}
            <div className="lg:col-span-1">
              <div className="h-full flex flex-col space-y-6 sm:space-y-8">
                {/* Key Stats Card - Now with White Background for Minimalist Look */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 text-gray-900 shadow-xl border border-gray-100 flex-shrink-0">
                  <h4 className="text-lg font-semibold mb-6 text-gray-900 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-blue-600" />
                    Key Milestones
                  </h4>
                  <div className="space-y-6">
                    {stats.map((stat, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                          <stat.icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                          <div className="text-sm text-gray-500">{stat.label}</div>
                          {stat.change && (
                            <div className="flex items-center gap-1 mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full w-fit">
                              <TrendingUp className="w-3 h-3" />
                              {stat.change}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline Cards */}
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 px-2 mb-8 flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                    Research Timeline
                  </h4>
                  <div className="relative h-full">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    <div className="space-y-15">
                      {timelineEvents.map((event, index) => {
                        const Icon = event.icon;
                        return (
                          <div key={index} className="relative pl-14">
                            {/* Timeline dot with icon */}
                            <div className={`absolute left-4 w-8 h-8 rounded-full ${event.bgColor} flex items-center justify-center z-10`}>
                              <Icon className={`w-4 h-4 ${event.color}`} />
                            </div>
                            
                            {/* Content card */}
                            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
                              <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-600 mb-2">
                                {event.year}
                              </span>
                              <h5 className="font-semibold text-gray-900 mb-1">{event.title}</h5>
                              <p className="text-sm text-gray-600">{event.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutScienceAndResearch;