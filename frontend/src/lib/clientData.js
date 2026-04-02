// Enhanced Shaun Case Client Data - Complete Profile

export const SHAUN_CASE = {
  // Basic Info
  id: 1,
  name: "Shaun Case",
  ndisNumber: "431005774",
  dob: "1982-10-12",
  age: 43,
  
  // Contact Information
  phone: "0412 345 678",
  email: "shaun.case@email.com",
  address: "123 Main Street, Nowra NSW 2541",
  
  // Emergency Contacts
  emergencyContacts: [
    {
      name: "Mary Case",
      relationship: "Mother",
      phone: "0423 456 789",
      isPrimary: true
    },
    {
      name: "John Case",
      relationship: "Father",
      phone: "0434 567 890",
      isPrimary: false
    }
  ],

  // NDIS Plan Details
  planManager: "Plan Partners NSW",
  planManagerEmail: "support@planpartners.com.au",
  planManagerPhone: "1300 123 456",
  supportCoordinator: "Emma Wilson",
  fundingType: "Plan Managed",
  planStartDate: "2025-07-01",
  planEndDate: "2026-06-30",
  weeklyHours: 15,

  // Goals
  goals: [
    {
      id: 1,
      title: "Improve daily living skills and independence",
      progress: 75,
      target: "Independently manage personal care and household tasks",
      status: "on_track"
    },
    {
      id: 2,
      title: "Develop social connections in community",
      progress: 60,
      target: "Attend 2+ community activities per week",
      status: "on_track"
    },
    {
      id: 3,
      title: "Increase participation in recreational activities",
      progress: 80,
      target: "Try 3 new activities and choose favorites",
      status: "achieved"
    },
    {
      id: 4,
      title: "Build confidence in public transport use",
      progress: 45,
      target: "Independently use bus for familiar routes",
      status: "in_progress"
    }
  ],

  // Likes & Interests
  likes: [
    "Shopping at local supermarket",
    "Watching movies and TV shows",
    "Listening to music (especially 80s rock)",
    "Going to cafes for coffee",
    "Walking in parks",
    "Playing simple video games",
    "Cooking simple meals",
    "Spending time with family"
  ],

  // Dislikes & Triggers
  dislikes: [
    "Loud sudden noises",
    "Crowded shopping centers (especially weekends)",
    "Being rushed or pressured",
    "Changes to routine without warning",
    "Spicy or unfamiliar foods"
  ],

  // Behavioral Triggers
  triggers: [
    {
      trigger: "Unexpected changes to schedule",
      response: "Becomes anxious, may refuse to participate",
      strategy: "Give advance notice of any changes, use visual schedule"
    },
    {
      trigger: "Loud environments or noise",
      response: "Covers ears, seeks quiet space, may leave area",
      strategy: "Offer noise-canceling headphones, choose quieter times for outings"
    },
    {
      trigger: "Being told 'no' directly",
      response: "Argumentative, may escalate frustration",
      strategy: "Offer alternatives, use 'first-then' statements"
    }
  ],

  // Key Strategies
  strategies: [
    "Use visual supports (pictures, written lists)",
    "Give choices whenever possible",
    "Allow processing time - don't rush responses",
    "Use positive reinforcement for good behaviors",
    "Maintain consistent routines",
    "Provide clear, simple instructions",
    "Give 5-minute warnings before transitions"
  ],

  // Places to Go
  placesToGo: [
    {
      name: "Stockland Nowra",
      type: "Shopping Center",
      address: "Lot 101 Princes Hwy, Nowra NSW 2541",
      notes: "Best on weekday mornings (9-11am) when quieter",
      favorite: true
    },
    {
      name: "Shoalhaven Entertainment Centre",
      type: "Cinema",
      address: "12-14 Bridge Rd, Nowra NSW 2541",
      notes: "Enjoys action and comedy movies",
      favorite: true
    },
    {
      name: "Meroogal Park",
      type: "Outdoor Recreation",
      address: "West St, Nowra NSW 2541",
      notes: "Good for walks, has playground nearby",
      favorite: false
    },
    {
      name: "Local Cafes (Gloria Jeans, The Coffee Club)",
      type: "Cafe",
      address: "Stockland Nowra",
      notes: "Orders flat white, likes to sit and people-watch",
      favorite: true
    }
  ],

  // Things to Avoid
  thingsToAvoid: [
    "Saturday shopping (too crowded)",
    "Peak hour public transport",
    "Restaurants with loud music",
    "Activities requiring long waiting periods",
    "Group activities with strangers (needs gradual introduction)"
  ],

  // Medical Information
  medical: {
    conditions: ["Autism Spectrum Disorder", "Anxiety"],
    medications: [
      {
        name: "Sertraline 50mg",
        dosage: "1 tablet daily (morning)",
        purpose: "Anxiety management"
      }
    ],
    allergies: ["None known"],
    gp: {
      name: "Dr. Sarah Johnson",
      clinic: "Nowra Medical Centre",
      phone: "02 4421 5678",
      address: "45 Junction St, Nowra NSW 2541"
    }
  },

  // Support Workers
  supportWorkers: ["Daniel Hayward"],

  // Appointments
  upcomingAppointments: [
    {
      date: "2026-03-15",
      time: "10:00 AM",
      type: "GP Check-up",
      provider: "Dr. Sarah Johnson",
      location: "Nowra Medical Centre",
      notes: "Regular 3-month review"
    },
    {
      date: "2026-03-22",
      time: "2:00 PM",
      type: "Support Coordination",
      provider: "Emma Wilson",
      location: "Virtual (Zoom)",
      notes: "Plan review meeting"
    }
  ]
};

// Complete worked days from Jan 9, 2026 onwards (46 days total)
export const WORKED_DAYS_2026 = [
  // January 2026
  { date: "2026-01-09", hours: 6, km: 15, status: "completed" },
  { date: "2026-01-10", hours: 6, km: 15, status: "completed" },
  { date: "2026-01-13", hours: 6, km: 15, status: "completed" },
  { date: "2026-01-14", hours: 6, km: 15, status: "completed" },
  { date: "2026-01-15", hours: 6, km: 15, status: "completed" },
  { date: "2026-01-16", hours: 6, km: 15, status: "completed" },
  { date: "2026-01-17", hours: 6, km: 15, status: "completed" },
  { date: "2026-01-20", hours: 6, km: 15, status: "completed" },
  { date: "2026-01-21", hours: 6, km: 15, status: "completed" },
  { date: "2026-01-22", hours: 6, km: 15, status: "completed" },
  { date: "2026-01-23", hours: 6, km: 15, status: "completed" },
  { date: "2026-01-24", hours: 6, km: 15, status: "completed" },
  { date: "2026-01-27", hours: 6, km: 15, status: "completed" },
  { date: "2026-01-28", hours: 6, km: 15, status: "completed" },
  { date: "2026-01-29", hours: 6, km: 15, status: "completed" },
  { date: "2026-01-30", hours: 6, km: 15, status: "completed" },
  { date: "2026-01-31", hours: 6, km: 15, status: "completed" },
  
  // February 2026
  { date: "2026-02-03", hours: 6, km: 15, status: "completed" },
  { date: "2026-02-04", hours: 6, km: 15, status: "completed" },
  { date: "2026-02-05", hours: 6, km: 15, status: "completed" },
  { date: "2026-02-06", hours: 6, km: 15, status: "completed" },
  { date: "2026-02-07", hours: 6, km: 15, status: "completed" },
  { date: "2026-02-09", hours: 6, km: 15, status: "completed" },
  { date: "2026-02-10", hours: 6, km: 15, status: "completed" },
  { date: "2026-02-11", hours: 6, km: 15, status: "completed" },
  { date: "2026-02-12", hours: 6, km: 15, status: "completed" },
  { date: "2026-02-13", hours: 6, km: 15, status: "completed" },
  { date: "2026-02-14", hours: 6, km: 15, status: "completed" },
  { date: "2026-02-17", hours: 6, km: 15, status: "completed" },
  { date: "2026-02-18", hours: 6, km: 15, status: "completed" },
  { date: "2026-02-19", hours: 6, km: 15, status: "completed" },
  { date: "2026-02-20", hours: 6, km: 15, status: "completed" },
  { date: "2026-02-21", hours: 6, km: 15, status: "completed" },
  { date: "2026-02-24", hours: 6, km: 15, status: "completed" },
  { date: "2026-02-25", hours: 6, km: 15, status: "completed" },
  { date: "2026-02-26", hours: 6, km: 15, status: "completed" },
  { date: "2026-02-27", hours: 6, km: 15, status: "completed" },
  { date: "2026-02-28", hours: 6, km: 15, status: "completed" },

  // March 2026 (partial)
  { date: "2026-03-03", hours: 6, km: 15, status: "completed" },
  { date: "2026-03-04", hours: 6, km: 15, status: "completed" },
  { date: "2026-03-05", hours: 6, km: 15, status: "completed" },
  { date: "2026-03-06", hours: 6, km: 15, status: "completed" },
  { date: "2026-03-07", hours: 6, km: 15, status: "completed" },
  { date: "2026-03-09", hours: 6, km: 15, status: "completed" },
  { date: "2026-03-10", hours: 6, km: 15, status: "completed" },
  { date: "2026-03-11", hours: 6, km: 15, status: "completed" },
];

export default {
  SHAUN_CASE,
  WORKED_DAYS_2026
};
