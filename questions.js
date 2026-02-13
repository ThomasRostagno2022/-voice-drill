const QUESTIONS = [
    // ========================================
    // BEHAVIORAL - Core Stories (15 questions)
    // ========================================
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
    {
        category: "Behavioral",
        question: "Tell me about a time you had to learn something new quickly to solve a problem.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Behavioral",
        question: "Describe a time when you received critical feedback. How did you respond?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Behavioral",
        question: "Tell me about a time you went above and beyond for a customer or stakeholder.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Behavioral",
        question: "Describe a situation where you had to work with someone difficult.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Behavioral",
        question: "Tell me about a time you took initiative without being asked.",
        targetWords: 100,
        targetTime: 75
    },

    // ========================================
    // MOTIVATION & FIT (10 questions)
    // ========================================
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
    {
        category: "Motivation",
        question: "What's the most important thing for you in your next role?",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Motivation",
        question: "What would make you leave a job?",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Motivation",
        question: "How do you stay motivated when work gets repetitive?",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Motivation",
        question: "What's a professional accomplishment you're still working toward?",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Motivation",
        question: "How do you define success in your career?",
        targetWords: 80,
        targetTime: 60
    },

    // ========================================
    // GTM STRATEGY (12 questions)
    // ========================================
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
    {
        category: "GTM Strategy",
        question: "How do you think about pricing strategy for a new market?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "GTM Strategy",
        question: "What metrics matter most when evaluating GTM effectiveness?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "GTM Strategy",
        question: "How would you approach entering a new geographic market?",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "GTM Strategy",
        question: "How do you balance short-term revenue vs. long-term market positioning?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "GTM Strategy",
        question: "What's your framework for competitive positioning?",
        targetWords: 100,
        targetTime: 75
    },

    // ========================================
    // SITUATIONAL (12 questions)
    // ========================================
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
    {
        category: "Situational",
        question: "Your analysis shows the sales team is underperforming. How do you present this?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Situational",
        question: "A project deadline moved up by 2 weeks. What do you do?",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Situational",
        question: "Two executives give you conflicting priorities. How do you handle it?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Situational",
        question: "Your recommendation was implemented but isn't working. What now?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Situational",
        question: "A key team member resigns mid-project. How do you adapt?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Situational",
        question: "You discover a significant error in a report that's already been shared. What do you do?",
        targetWords: 100,
        targetTime: 75
    },

    // ========================================
    // DATA & ANALYSIS (10 questions)
    // ========================================
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
    {
        category: "Data & Analysis",
        question: "Walk me through how you'd build a sales forecasting model.",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "Data & Analysis",
        question: "How do you explain a complex analysis to a non-technical stakeholder?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Data & Analysis",
        question: "What's your process for identifying the root cause of a business problem?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Data & Analysis",
        question: "How do you know when you have enough data to make a recommendation?",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Data & Analysis",
        question: "Describe a time when data told a different story than expected.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Data & Analysis",
        question: "How do you balance speed vs. accuracy in your analysis?",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Data & Analysis",
        question: "What's your approach to presenting data that contradicts popular belief?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Data & Analysis",
        question: "How do you ensure your analysis is actionable, not just informative?",
        targetWords: 100,
        targetTime: 75
    },

    // ========================================
    // PRESENTATIONS & PUBLIC SPEAKING (10 questions)
    // ========================================
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
    {
        category: "Presentation",
        question: "Present a controversial recommendation to a skeptical audience.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Presentation",
        question: "You're asked to present without your slides. Give the key points.",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Presentation",
        question: "Introduce a new team member to the company during an all-hands.",
        targetWords: 60,
        targetTime: 45
    },
    {
        category: "Presentation",
        question: "Present three options for solving a problem with your recommendation.",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "Presentation",
        question: "Kick off a project meeting by explaining the goals and timeline.",
        targetWords: 80,
        targetTime: 60
    },

    // ========================================
    // MEETINGS & DISCUSSIONS (10 questions)
    // ========================================
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
    {
        category: "Meeting",
        question: "How do you facilitate a brainstorming session effectively?",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Meeting",
        question: "Someone in the meeting is dominating the conversation. How do you handle it?",
        targetWords: 60,
        targetTime: 45
    },
    {
        category: "Meeting",
        question: "You need to wrap up a meeting that's running over time. What do you say?",
        targetWords: 50,
        targetTime: 30
    },
    {
        category: "Meeting",
        question: "How do you get a quiet team member to share their perspective?",
        targetWords: 60,
        targetTime: 45
    },
    {
        category: "Meeting",
        question: "You join a meeting late. How do you catch up without disrupting?",
        targetWords: 50,
        targetTime: 30
    },

    // ========================================
    // NETWORKING & SMALL TALK (10 questions)
    // ========================================
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
    {
        category: "Networking",
        question: "How do you gracefully exit a conversation at a networking event?",
        targetWords: 50,
        targetTime: 30
    },
    {
        category: "Networking",
        question: "You meet someone in a completely different industry. Find common ground.",
        targetWords: 60,
        targetTime: 45
    },
    {
        category: "Networking",
        question: "Ask for advice from a senior leader you just met without seeming presumptuous.",
        targetWords: 60,
        targetTime: 45
    },
    {
        category: "Networking",
        question: "Someone asks what you're working on. Make it sound interesting.",
        targetWords: 70,
        targetTime: 45
    },
    {
        category: "Networking",
        question: "Follow up with someone you met briefly. What's your message?",
        targetWords: 50,
        targetTime: 30
    },

    // ========================================
    // DIFFICULT CONVERSATIONS (10 questions)
    // ========================================
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
    {
        category: "Difficult Conversation",
        question: "You need to ask for a raise. Make your case.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Difficult Conversation",
        question: "A team member's behavior is affecting team morale. Address it.",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Difficult Conversation",
        question: "You disagree with a decision that's already been made. How do you voice concerns?",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Difficult Conversation",
        question: "A vendor isn't delivering as promised. How do you address it?",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Difficult Conversation",
        question: "You need to deliver constructive criticism to a peer. How do you approach it?",
        targetWords: 80,
        targetTime: 60
    },

    // ========================================
    // PERSUASION & INFLUENCE (10 questions)
    // ========================================
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
    {
        category: "Persuasion",
        question: "Pitch a risky idea that could have high reward.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Persuasion",
        question: "Convince your manager to let you work on a passion project.",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Persuasion",
        question: "You need to get buy-in from someone who has rejected this idea before.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Persuasion",
        question: "Persuade a customer to expand their contract with you.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Persuasion",
        question: "Convince leadership to invest in a long-term initiative with delayed ROI.",
        targetWords: 100,
        targetTime: 75
    },

    // ========================================
    // EXPLANATIONS & TEACHING (8 questions)
    // ========================================
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
    {
        category: "Explanation",
        question: "Explain a trend in your industry to someone outside of it.",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Explanation",
        question: "Teach a colleague a skill you're good at in 90 seconds.",
        targetWords: 90,
        targetTime: 60
    },
    {
        category: "Explanation",
        question: "Explain why a project failed without placing blame.",
        targetWords: 80,
        targetTime: 60
    },

    // ========================================
    // STORYTELLING (8 questions)
    // ========================================
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
    {
        category: "Storytelling",
        question: "Tell a story about overcoming a significant obstacle in your career.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Storytelling",
        question: "Share a story that demonstrates your problem-solving approach.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Storytelling",
        question: "Tell a story about a team accomplishment and your role in it.",
        targetWords: 100,
        targetTime: 75
    },

    // ========================================
    // QUICK RESPONSES (10 questions)
    // ========================================
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
    },
    {
        category: "Quick Response",
        question: "'Why didn't this work?' Respond without being defensive.",
        targetWords: 60,
        targetTime: 45
    },
    {
        category: "Quick Response",
        question: "'What's your biggest weakness?' Answer authentically.",
        targetWords: 60,
        targetTime: 45
    },
    {
        category: "Quick Response",
        question: "'We've always done it this way.' Challenge the status quo respectfully.",
        targetWords: 60,
        targetTime: 45
    },
    {
        category: "Quick Response",
        question: "'That's not my job.' Your colleague says this. How do you respond?",
        targetWords: 50,
        targetTime: 30
    },
    {
        category: "Quick Response",
        question: "'We don't have budget for that.' Find another path forward.",
        targetWords: 60,
        targetTime: 45
    },

    // ========================================
    // APPLIED AI / TECHNICAL LEADERSHIP (25 questions)
    // Persona: Alena Fedorenko, Head of Applied AI at Anthropic
    // ========================================
    {
        category: "Applied AI",
        question: "Tell me about a technically complex project you led. How did you navigate the ambiguity?",
        targetWords: 150,
        targetTime: 90
    },
    {
        category: "Applied AI",
        question: "How do you evaluate whether an AI/ML solution is the right approach vs. a simpler heuristic?",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "Applied AI",
        question: "Describe a time you had to make a product decision with significant technical uncertainty.",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "Applied AI",
        question: "How do you think about the tradeoffs between model capability and safety?",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "Applied AI",
        question: "Tell me about a time you had to push back on a technical approach that wasn't right.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Applied AI",
        question: "How do you stay current with the rapidly evolving AI landscape?",
        targetWords: 80,
        targetTime: 60
    },
    {
        category: "Applied AI",
        question: "Describe how you've built trust with engineering teams as a non-engineer or cross-functional leader.",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "Applied AI",
        question: "What's your framework for prioritizing features when everything seems urgent?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Technical Leadership",
        question: "How do you lead engineers through ambiguity when requirements are unclear?",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "Technical Leadership",
        question: "Tell me about a time you had to deliver a project with a team that was skeptical of the direction.",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "Technical Leadership",
        question: "How do you balance technical debt with shipping new features?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Technical Leadership",
        question: "Describe a time you had to make a difficult resource allocation decision.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Technical Leadership",
        question: "How do you give feedback to engineers who are more technically deep than you?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Technical Leadership",
        question: "Tell me about a project that failed. What did you learn about your leadership?",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "Technical Leadership",
        question: "How do you create psychological safety in a high-pressure technical environment?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Engineering Management",
        question: "How do you evaluate and develop talent on your engineering teams?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Engineering Management",
        question: "Describe your approach to running effective technical reviews.",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Engineering Management",
        question: "How do you handle conflict between engineers with different technical opinions?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Engineering Management",
        question: "What's your approach to setting technical direction without micromanaging?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Engineering Management",
        question: "How do you know when to be hands-on vs. delegate technical decisions?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Technical Strategy",
        question: "How do you think about build vs. buy decisions for AI capabilities?",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "Technical Strategy",
        question: "Describe how you've influenced technical roadmap decisions at the executive level.",
        targetWords: 120,
        targetTime: 90
    },
    {
        category: "Technical Strategy",
        question: "How do you communicate complex technical tradeoffs to non-technical stakeholders?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Technical Strategy",
        question: "What's your framework for evaluating emerging technologies vs. proven solutions?",
        targetWords: 100,
        targetTime: 75
    },
    {
        category: "Technical Strategy",
        question: "How do you think about platform investments that have long-term payoffs?",
        targetWords: 100,
        targetTime: 75
    }
];

// Filler words to detect (including French-influenced hesitations)
const FILLER_WORDS = [
    // Classic hesitation sounds
    'uh', 'um', 'eh', 'ah', 'er', 'euh', 'mh', 'hmm', 'hm', 'mm',
    // Verbal fillers
    'like', 'you know', 'basically', 'actually', 'literally',
    'right', 'so', 'well', 'i mean', 'kind of', 'sort of',
    'honestly', 'obviously', 'definitely', 'probably',
    'just', 'really', 'very', 'stuff', 'things',
    'anyway', 'anyways',
    // Additional fillers
    'okay so', 'and so', 'but like', 'so like', 'i think', 'i guess',
    'in fact', 'to be honest', 'at the end of the day'
];
