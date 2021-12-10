//text for hovers on SDG and Samoa Pathways filters

const sdgColorsSeb = ["#E5243B", "#DDA63A", "#4C9F38", "#C5192D", "#FF3A21",
    "#26BDE2", "#FCC30B", "#A21942", "#FD6925", "#DD1367", "#FD9D24",
    "#BF8B2E", "#3F7E44", "#0A97D9", "#56C02B", "#00689D", "#19486A"
]
const samoaColorsSeb = ["#A21942", "#3F7E44", "#FCC30B", "#19486A", "#0A97D9",
    "#DDA63A", "#26BDE2", "green", "blue", "#FD9D24", "#4C9F38",
    "#FF3A21", "#DD1367", "#0A97D9", "#00689D", "#00A99D", "#F4F5F8"
]

// Predefined data for side tooltip 
var sdg = [
	{
        "title": "Goal 1 - No Poverty",
        "content": "To end poverty in all its forms, everywhere, through a powerful commitment to leave no one behind and to reach those fathest behind first."
      },
      {
        "title": "Goal 2 - Zero Hunger",
        "content": "To end hunger, achieve food security and improve nutrition and promote sustainable agriculture."
      },
      {
        "title": "Goal 3 - Good Health and Well-Being",
        "content": "To ensure healthy lives and promote well-being for all at all ages."
      },
      {
        "title": "Goal 4 - Quality Education",
        "content": "To ensure inclusive and equitable quality education and promote lifelong learning opportunities for all."
      },
      {
        "title": "Goal 5 - Gender Equality",
        "content": "To achieve gender equality and empower all women and girls."
      },
      {
        "title": "Goal 6 - Clean Water and Sanitation",
        "content": "To ensure availability and sustainable management of water and sanitation for all."
      },
      {
        "title": "Goal 7 - Affordable and Clean Energy",
        "content": "To ensure access to affordable, reliable, sustainable and modern energy for all."
      },
      {
        "title": "Goal 8 - Decent Work and Economic Growth",
        "content": "To foster sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all."
      },
      {
        "title": "Goal 9 - Industry, Innovation, and Infrastructure",
        "content": "To build resilient infrastructure, promote inclusive and sustainable industrialization, and foster innovation"
      },
      {
        "title": "Goal 10 - Reduced Inequality",
        "content": "To reduce income inequality within and among countries."
      },
      {
        "title": "Goal 11 - Sustainable cities and communities",
        "content": "To make cities and human settlements inclusive, safe, resilient, and sustainable."
      },
      {
        "title": "Goal 12 - Responsible consumption and production",
        "content": "To ensure sustainable consumption and production patterns"
      },
      {
        "title": "Goal 13 - Climate Action",
        "content": "To take urgent action to combat climate change and its impacts by regulating emissions and promoting developments in renewable energy"
      },
      {
        "title": "Goal 14 - Life Below Water",
        "content": "To conserve and sustainably use the oceans, seas and marine resources for sustainable development."
      },
      {
        "title": "Goal 15 - Life on Land",
        "content": "To protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss"
      },
      {
        "title": "Goal 16 - Peace, justice and strong institutions",
        "content": "To promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels."
      },
      {
        "title": "Goal 17 - Partnership for the goals",
        "content": "To strengthen the means of implementation and revitalize the global partnership for sustainable development."
      }
]; 

var arrsamoa = [
	{
        "title": "1. Sustained and sustainable, inclusive and equitable economic growth with decent work for all",
        "content": "To support SIDS to achieve sustained, inclusive and equitable growth with full and productive employment, social protection and the creation of decent work for all."
      },
      {
        "title": "2. Climate Change",
        "content": "To help SIDS with climate adaptation, including persistent drought and extreme weather events, sea-level rise, coastal erosion and ocean acidification."
      },
      {
        "title": "3. Sustainable Energy",
        "content": "To address challenges in accessing sustainable energy in the SIDS including enhanced accessibility to modern energy services, energy efficiency and use of economically viable and environmentally sound technology"
      },
      {
        "title": "4. Disaster risk reduction",
        "content": "To address the critical need to build resilience, strengthen monitoring and prevention, reduce vulnerability, raise awareness and increase preparedness to respond to and recover from disasters in SIDS"
      },
      {
        "title": "5. Oceans and seas",
        "content": "To support healthy, productive and resilient oceans and coasts are critical for, inter alia, poverty eradication, access to sufficient, safe and nutritious food, livelihoods, economic development, essential ecosystem services, and identity and culture in SIDS."
      },
      {
        "title": "6. Food security and nutrition",
        "content": "To support the right to have access to safe, sufficient and nutritious food, the eradication of hunger and the provision of livelihoods while conserving, protecting and ensuring the sustainable use of land, soil, forests, water, plants and animals, biodiversity and ecosystems."
      },
      {
        "title": "7. Water and sanitation",
        "content": "To support the efforts of small island developing States to develop capacities for the effective, inclusive and sustainable implementation of the integrated management of water resources and related ecosystems"
      },
      {
        "title": "8. Sustainable transportation",
        "content": "To support SIDS to gain access to environmentally sound, safe, affordable, sustainable and well-maintained transportation"
      },
      {
        "title": "9. Sustainable consumption and production",
        "content": "To support SIDS on sustainable consumption and production patterns to advance sustainable consumption and production, with an emphasis on MSMEs, sustainable tourism, waste management, food and nutrition, lifestyles, and rural supply chains."
      },
      {
        "title": "10. Management of chemicals and waste, including hazardous waste",
        "content": "To support SIDS in sound management of chemicals throughout their life cycle and of waste is crucial for the protection of human health and the environment"
      },
      {
        "title": "11. Health and non-communicable diseases",
        "content": "To support prevention, treatment, care, and education in health as well as support the national actions of SIDS in addressing communicable and non-communicable diseases."
      },
      {
        "title": "12. Gender Equality and women’s empowerment",
        "content": "To support gender equality and women’s empowerment and the full realization of human rights for women and girls have a transformative and multiplier effect on sustainable development and is a driver of economic growth in SIDS."
      },
      {
        "title": "13. Social Development",
        "content": "To support efforts to enhance social protection and inclusion, to improve well-being and to guarantee opportunities for the most vulnerable and disadvantaged to have equal access to education, health, food, water and sanitation, and productive resources."
      },
      {
        "title": "14. Biodiversity",
        "content": "To suport the conservation and sustainable use of biodiversity, as well as their access to and the fair and equitable sharing of benefits arising from the utilization of genetic resources, with the vision of living in harmony with nature"
      },
      {
        "title": "15. Invasive alien species",
        "content": "To help multisectoral collaboration in SIDS to address invasive alien species in order to protect biodiversity and livelihoods, preserve and maintain ocean resources and ecosystem resiliency, and enhance food security and adapt to climate change"
      },
      {
        "title": "16. Means of implementation, including partnerships",
        "content": "To support SIDS in enhanced global partnership for development, adequate provision and mobilization of all means of implementation and continued international support to achieve internationally agreed goals."
      }
];