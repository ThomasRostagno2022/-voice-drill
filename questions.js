const QUESTIONS = [
    // Behavioral - Core Stories
    {
        category: "Behavioral",
        question: "Tell me about yourself and your background.",
        targetWords: 150,
        targetTime: 90
    },
    {
        category: "Behavioral",
        question: "Tell me about a project you're most proud of.",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "Behavioral",
        question: "Tell me about a time you failed. What did you learn?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Behavioral",
        question: "Describe a time you influenced a senior leader who disagreed with you.",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "Behavioral",
        question: "Tell me about a time you had to deliver bad news to leadership.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Behavioral",
        question: "Describe a situation where you had to make a decision with incomplete data.",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "Behavioral",
        question: "Tell me about a time you had to get alignment across multiple stakeholders.",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "Behavioral",
        question: "Describe a time you changed someone's mind with data.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Behavioral",
        question: "Tell me about a time you inherited a project or analysis you thought was wrong.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Behavioral",
        question: "Describe a situation where you had to prioritize competing demands.",
        targetWords: 100,
        targetTime: 75
    },

    // Motivation & Fit
    {
        category: "Motivation",
        question: "Why this company? Why this role? Why now?",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "Motivation",
        question: "This is an IC role. You've managed teams. Are you OK with that?",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Motivation",
        question: "What type of leader do you work best with?",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Motivation",
        question: "What frustrates you most in a role like this?",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Motivation",
        question: "Where do you see yourself in 3-5 years?",
        targetWords: 80,
        targetTime: 60
    },

    // GTM Strategy
    {
        category: "GTM Strategy",
        question: "How would you diagnose a GTM problem you've never seen before?",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "GTM Strategy",
        question: "How do you think about coverage models?",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "GTM Strategy",
        question: "How would you approach building a business case with unreliable data?",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "GTM Strategy",
        question: "What's the biggest GTM lever to go from $5B to $10B?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "GTM Strategy",
        question: "How do you think about land vs. expand motions differently?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "GTM Strategy",
        question: "How would you think about GTM for a brand new product vs. a mature one?",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "GTM Strategy",
        question: "When would you use partners vs. direct sales?",
        targetWords: 100,
        targetTime: 75
    },

    // Situational
    {
        category: "Situational",
        question: "A Regional VP says 60% of rep time goes to 15% of revenue. What do you do?",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "Situational",
        question: "The CRO disagrees with your recommendation. How do you handle it?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Situational",
        question: "I give you 3 urgent projects at once. How do you prioritize?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Situational",
        question: "Walk me through how you'd structure a Q3 executive GTM review.",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "Situational",
        question: "How would you approach your first 90 days in this role?",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "Situational",
        question: "How would you work with Rev Ops vs. the BU GTM teams?",
        targetWords: 100,
        targetTime: 75
    },

    // Data & Analysis
    {
        category: "Data & Analysis",
        question: "Tell me about building a model with bad or incomplete data.",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "Data & Analysis",
        question: "How do you validate assumptions when you don't have historical data?",
        targetWords: 100,
        targetTime: 75
    },

    // ========================================
    // COMMUNICATION SKILLS - Beyond Interviews
    // ========================================

    // Presentations & Public Speaking
    {
        category: "Presentation",
        question: "You have 2 minutes to pitch a new initiative to your CEO. Go.",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Presentation",
        question: "Explain a complex technical concept to a non-technical audience.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Presentation",
        question: "You're presenting quarterly results. Revenue is down 15%. How do you frame it?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Presentation",
        question: "Deliver the opening of a team all-hands meeting to energize the room.",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Presentation",
        question: "Summarize a 50-page report in 90 seconds for an executive.",
        targetWords: 90,
        targetTime: 60
    },

    // Meetings & Discussions
    {
        category: "Meeting",
        question: "You disagree with your manager's direction in a team meeting. What do you say?",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Meeting",
        question: "A meeting is going off-track. How do you redirect it professionally?",
        targetWords: 60,
        targetTime: 45
    },
    {
        category: "Meeting",
        question: "You need to interrupt a long-winded colleague to make your point. How?",
        targetWords: 50,
        targetTime: 30
    },
    {
        category: "Meeting",
        question: "Someone asks for your opinion on a topic you're unprepared for. What do you say?",
        targetWords: 70,
        targetTime: 45
    },
    {
        category: "Meeting",
        question: "You're asked to give a quick status update on your project. 60 seconds.",
        targetWords: 80,
        targetTime: 60
    },

    // Networking & Small Talk
    {
        category: "Networking",
        question: "Someone at a conference asks: 'So what do you do?' Give your elevator pitch.",
        targetWords: 60,
        targetTime: 45
    },
    {
        category: "Networking",
        question: "You meet a potential mentor. How do you introduce yourself and your goals?",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Networking",
        question: "You're at a dinner with executives you don't know. Start a conversation.",
        targetWords: 50,
        targetTime: 30
    },
    {
        category: "Networking",
        question: "Someone you admire asks about your career journey. Tell your story.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Networking",
        question: "You want to reconnect with someone you haven't spoken to in years. What do you say?",
        targetWords: 60,
        targetTime: 45
    },

    // Difficult Conversations
    {
        category: "Difficult Conversation",
        question: "You need to tell a direct report their performance is not meeting expectations.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Difficult Conversation",
        question: "A client is unhappy with a deliverable. How do you address their concerns?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Difficult Conversation",
        question: "You have to say no to a request from a senior leader. What do you say?",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Difficult Conversation",
        question: "A colleague takes credit for your work. How do you address it?",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Difficult Conversation",
        question: "You made a mistake that cost the company money. How do you own it?",
        targetWords: 100,
        targetTime: 75
    },

    // Persuasion & Influence
    {
        category: "Persuasion",
        question: "Convince your team to adopt a new tool they're resistant to.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Persuasion",
        question: "You need a budget increase. Make your case to the CFO.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Persuasion",
        question: "A stakeholder wants to go in a direction you think is wrong. Persuade them.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Persuasion",
        question: "You need cross-functional teams to prioritize your project. How do you pitch it?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Persuasion",
        question: "Convince a skeptical audience that AI will benefit their workflow.",
        targetWords: 100,
        targetTime: 75
    },

    // Explanations & Teaching
    {
        category: "Explanation",
        question: "Explain what your company does to someone at a party.",
        targetWords: 60,
        targetTime: 45
    },
    {
        category: "Explanation",
        question: "A new hire asks you to explain how your team fits into the organization.",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Explanation",
        question: "Break down a recent business decision and the reasoning behind it.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Explanation",
        question: "Explain the difference between two similar concepts in your field.",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Explanation",
        question: "Describe a process you follow and why each step matters.",
        targetWords: 100,
        targetTime: 75
    },

    // Storytelling
    {
        category: "Storytelling",
        question: "Tell a story about a time something didn't go as planned but worked out.",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "Storytelling",
        question: "Share an experience that shaped how you approach your work.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Storytelling",
        question: "Describe a customer success story that demonstrates your product's value.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Storytelling",
        question: "Tell a brief story to illustrate the importance of attention to detail.",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Storytelling",
        question: "Share a lesson you learned from a mentor or leader you admire.",
        targetWords: 100,
        targetTime: 75
    },

    // Quick Responses
    {
        category: "Quick Response",
        question: "Someone says 'I don't think that's a good idea.' Respond constructively.",
        targetWords: 50,
        targetTime: 30
    },
    {
        category: "Quick Response",
        question: "'Why should we trust you with this project?' Answer confidently.",
        targetWords: 60,
        targetTime: 45
    },
    {
        category: "Quick Response",
        question: "'What makes you different from others in your field?' Answer.",
        targetWords: 60,
        targetTime: 45
    },
    {
        category: "Quick Response",
        question: "'Can you do this by Friday?' (It's aggressive). How do you respond?",
        targetWords: 50,
        targetTime: 30
    },
    {
        category: "Quick Response",
        question: "'I've heard mixed reviews about this approach.' Address the concern.",
        targetWords: 60,
        targetTime: 45
    }
];

// Filler words to detect
const FILLER_WORDS = [
    'uh', 'um', 'eh', 'ah', 'er',
    'like', 'you know', 'basically', 'actually', 'literally',
    'right', 'so', 'well', 'i mean', 'kind of', 'sort of',
    'honestly', 'obviously', 'definitely', 'probably',
    'just', 'really', 'very', 'stuff', 'things',
    'anyway', 'anyways'
];
