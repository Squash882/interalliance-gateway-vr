/*
  INTERalliance: The Gateway — source-grounded orientation content.
  Facts checked against INTERalliance's own public pages (Nov 2026).
  Do not infer that this prototype is officially endorsed by INTERalliance.
  Editing guide: each chapter has an introduction, evidence-backed facts,
  and 1–3 checkpoints; the last chapter is a personal-path choice.
*/
window.GATEWAY_CHAPTERS = Object.freeze([
  {
    id: 'origins', name: 'The Origins', short: 'HISTORY', title: 'Where it all began',
    kicker: '01 / THE ORIGINS', color: '#65ead0',
    subtitle: 'Trace the milestones that built a student-powered technology community.',
    story: 'INTERalliance grew out of Greater Cincinnati schools, employers, universities and community leaders working to connect young people with careers in technology. Its history is a story of students gaining more responsibility—not merely attending events.',
    vr: 'INTERalliance grew from a Cincinnati collaboration that connected students with technology careers. Explore its landmark milestones.',
    facts: [
      '2007 · INTERalliance was founded by Greater Cincinnati community and industry leaders.',
      '2008 · The INTERalliance Leadership Council (ILC) was established.',
      '2009 · The first INTERalliance interns were employed.',
      '2010 · The first TechOlympics was held.',
      '2015 · The Women in IT collaboration began.',
      '2017 · The IT Intern Summit collaboration began.'
    ],
    rounds: [
      {
        kind: 'timeline',
        question: 'Chronology breach! Activate the three historical milestones in the order they happened.',
        vrQuestion: 'TIME MACHINE: ACTIVATE EARLIEST TO LATEST.',
        options: [
          { label: '2010 · First TechOlympics', why: '2010 followed the founding and creation of ILC.' },
          { label: '2007 · INTERalliance founded', why: 'The founding year was 2007, according to the official impact report.' },
          { label: '2008 · ILC established', why: 'ILC was created in 2008, after the founding.' }
        ],
        sequence: [1, 2, 0]
      },
      {
        question: 'You traveled to 2010. Which INTERalliance milestone would you witness?',
        vrQuestion: '2010: WHICH MILESTONE WAS UNLOCKED?',
        options: [
          { label: 'First TechOlympics', correct: true, why: 'Yes. The first TechOlympics took place in 2010.' },
          { label: 'First ILC formation', correct: false, why: 'ILC was already established in 2008.' },
          { label: 'Women in IT collaboration', correct: false, why: 'That partnership began in 2015.' }
        ]
      }
    ],
    source: 'https://interalliance.org/about-us/impact-report/',
    narration: 'INTERalliance was founded in 2007 to connect Greater Cincinnati students with technology careers. The I L C was established in 2008, the first interns were employed in 2009, TechOlympics began in 2010, the Women in I T partnership began in 2015, and the Intern Summit collaboration began in 2017.'
  },
  {
    id: 'mission', name: 'The Mission', short: 'MISSION', title: 'Why INTERalliance exists',
    kicker: '02 / THE MISSION', color: '#79c5ff',
    subtitle: 'Technology pathways, not just coding classes.',
    story: 'INTERalliance is a student-led Greater Cincinnati nonprofit whose mission is to inspire and assist young talent to pursue an IT career in the region. Students connect with each other, educators, and local employers—and can move from exploration to practical career experience.',
    vr: 'MISSION: Inspire and assist young talent to pursue IT careers in Greater Cincinnati. The framework is INSPIRE, NETWORK, TRAIN, EMPLOY, RETAIN.',
    facts: [
      'INSPIRE · Get curious about the technology sector.',
      'NETWORK · Meet students, mentors, and working professionals.',
      'TRAIN · Develop technical and workplace-ready skills.',
      'EMPLOY · Connect with meaningful work experiences.',
      'RETAIN · Encourage tech talent to develop careers in the region.'
    ],
    rounds: [
      {
        question: 'Which description best matches the mission?',
        vrQuestion: 'MISSION CHECK: WHAT ARE WE HERE TO DO?',
        options: [
          { label: 'Host only computer competitions', correct: false, why: 'Competitions are only one part of the mission.' },
          { label: 'Help local students explore IT careers', correct: true, why: 'Exactly. The mission connects talent to IT career pathways in Greater Cincinnati.' },
          { label: 'Train professional engineers exclusively', correct: false, why: 'The organization explicitly serves high school students exploring technology.' }
        ]
      },
      {
        question: 'A professional introduces a student to an employer. Which INTER principle fits best?',
        vrQuestion: 'CONNECT THE DOTS: WHICH INTER PRINCIPLE?',
        options: [
          { label: 'Network', correct: true, why: 'Correct: NETWORK is about relationships and professional connections.' },
          { label: 'Retain', correct: false, why: 'Retain concerns keeping talent in the region longer term.' },
          { label: 'Inspire', correct: false, why: 'Inspire sparks interest; this scenario centers on making a connection.' }
        ]
      }
    ],
    source: 'https://interalliance.org/about-us/impact-report/',
    narration: 'The mission of INTERalliance is to inspire and assist young talent to pursue an I T career in Greater Cincinnati. Its framework is Inspire, Network, Train, Employ, and Retain. Students can explore, build skills, meet professionals, and gain work experience.'
  },
  {
    id: 'programs', name: 'The Opportunities', short: 'PROGRAMS', title: 'Your opportunities',
    kicker: '03 / THE OPPORTUNITIES', color: '#ffd589',
    subtitle: 'There are paths for newcomers, competitors, leaders, and future interns.',
    story: 'You might start at a school chapter, meet professionals and compete at TechOlympics, participate in JumpStart training, explore Women in IT events, or pursue paid summer INTERnships. INTERalliance creates multiple entry points into a regional technology community.',
    vr: 'PROGRAMS: School chapters. TechOlympics. JumpStart. Women in IT. Paid summer INTERnships. The IT Intern Summit.',
    facts: [
      'CHAPTERS · School-based meetings, speakers, and competitions.',
      'TECHOLYMPICS · A student-run tech conference with challenges and networking.',
      'JUMPSTART · Training in skills and professional readiness.',
      'INTERNSHIPS · Paid summer roles with participating employers.',
      'WOMEN IN IT · Career exploration and mentoring through a dedicated conference.'
    ],
    rounds: [
      {
        question: 'You want paid, real-world technology experience over the summer. Where do you look?',
        vrQuestion: 'CHOOSE THE PATH: PAID SUMMER EXPERIENCE?',
        options: [
          { label: 'INTERalliance INTERnships', correct: true, why: 'Correct. INTERnships connect students with paid summer work at participating employers. Eligibility and availability vary.' },
          { label: 'Monthly chapter meeting', correct: false, why: 'Meetings build community, but are not paid summer roles.' },
          { label: 'Chapter Showcase', correct: false, why: 'The Showcase is a student event, not employment.' }
        ]
      },
      {
        question: 'You want a tech conference with challenges, speakers and employer networking. Choose your destination.',
        vrQuestion: 'WHICH EVENT MIXES CHALLENGES AND NETWORKING?',
        options: [
          { label: 'TechOlympics', correct: true, why: 'Right. TechOlympics combines technology challenges, professional speakers and networking.' },
          { label: 'A regular chapter meeting', correct: false, why: 'Chapters are excellent year-round entry points, but the large conference is TechOlympics.' },
          { label: 'JumpStart', correct: false, why: 'JumpStart primarily focuses on technical and professional preparation.' }
        ]
      }
    ],
    source: 'https://interalliance.org/about-us/impact-report/',
    narration: 'Students can get involved through school chapters, TechOlympics, JumpStart, the Women in I T Conference, paid INTERnships, and the Intern Summit. There is more than one path to start building your career.'
  },
  {
    id: 'leadership', name: 'The Leadership', short: 'LEADERSHIP', title: 'Run the mission',
    kicker: '04 / THE LEADERSHIP', color: '#b49aff',
    subtitle: 'ILC is where students help deliver the programs.',
    story: 'The INTERalliance Leadership Council (ILC) is a team of high school students working with Central Office to help deliver real events and operations. Its six teams are Systems, Data, Programs, Marketing, Chapters, and Finance. Members handle meaningful responsibilities rather than merely observing.',
    vr: 'ILC = STUDENT OPERATIONS. Six teams: Systems, Data, Programs, Marketing, Chapters, Finance. Match each real-world task to its team.',
    facts: [
      'SYSTEMS · Websites, technology, and event setup.',
      'DATA · Program information and data management.',
      'PROGRAMS · Coordinate major experiences and events.',
      'MARKETING · Campaigns, materials, and promotion.',
      'CHAPTERS · Support school chapters and competitions.',
      'FINANCE · Budgets and sponsorship.',
      'ILC welcomes students from incoming freshmen through seniors; confirm current application details.',
      'ILC expects consistent work during the school year, with additional time around TechOlympics.'
    ],
    rounds: [
      {
        kind: 'dispatch',
        question: 'You are running the ILC operations desk. Route each incoming request to the right team.',
        vrQuestion: 'ILC HQ: ASSIGN EACH INCOMING REQUEST.',
        options: [
          { label: 'Systems', why: 'Systems maintains technology and the websites.' },
          { label: 'Data', why: 'Data organizes and maintains program information.' },
          { label: 'Finance', why: 'Finance works on budgets and sponsorship.' }
        ],
        tickets: [
          { label: '01 · Registration site crashed before TechOlympics.', vr: 'REQUEST: TECHOLYMPICS WEBSITE IS DOWN.', answer: 0, why: 'Systems repairs the technical infrastructure.' },
          { label: '02 · Attendee records contain duplicates.', vr: 'REQUEST: DUPLICATE ATTENDEE RECORDS.', answer: 1, why: 'Data manages program information and its quality.' },
          { label: '03 · An event needs its sponsor budget reviewed.', vr: 'REQUEST: REVIEW EVENT SPONSOR BUDGET.', answer: 2, why: 'Finance handles sponsorship and budgeting.' }
        ]
      },
      {
        question: 'A chapter competition needs coordination among schools. Which team is the closest match?',
        vrQuestion: 'TEAM MATCH: COORDINATE SCHOOL CHAPTERS.',
        options: [
          { label: 'Data', correct: false, why: 'Data maintains and manages program information.' },
          { label: 'Chapters', correct: true, why: 'Yes. The Chapters team coordinates chapter competitions and support.' },
          { label: 'Marketing', correct: false, why: 'Marketing promotes activities, rather than coordinating chapters.' }
        ]
      },
      {
        question: 'Your event needs posters and a campaign. Which team should take the lead?',
        vrQuestion: 'TEAM MATCH: CREATE A PROMOTIONAL CAMPAIGN.',
        options: [
          { label: 'Marketing', correct: true, why: 'Exactly. Marketing produces branded materials and expands INTERalliance outreach.' },
          { label: 'Systems', correct: false, why: 'Systems handles technology infrastructure and websites.' },
          { label: 'Finance', correct: false, why: 'Finance handles sponsorship and budgeting.' }
        ]
      }
    ],
    source: 'https://interalliance.org/programs/ilc/',
    narration: 'I L C is the INTERalliance Leadership Council. Students work with Central Office across six teams. Systems supports websites and technology, Data supports information, Programs coordinates events, Marketing creates campaigns, Chapters works with school chapters, and Finance handles budgets and sponsorship.'
  },
  {
    id: 'path', name: 'Your Future', short: 'YOUR PATH', title: 'Choose your route',
    kicker: '05 / YOUR FUTURE', color: '#ff9ec2',
    subtitle: 'There is no single right way into a career in tech.',
    story: 'You have explored the organization; now choose a starting point. Your recommendation is not an application or automatic admission—it is a direction for your next step. Check program dates and eligibility on INTERalliance’s website.',
    vr: 'THE FINAL PORTAL: Choose your route—BUILD, LEAD, or LAUNCH. Your choice opens a tailored next step.',
    facts: [
      'BUILD · Join a chapter, explore challenges and workshops.',
      'LEAD · Run a chapter activity and explore ILC involvement.',
      'LAUNCH · Attend events, make connections, and check INTERnship applications.'
    ],
    rounds: [
      {
        question: 'Which part of INTERalliance would you explore first?',
        vrQuestion: 'FINAL PORTAL: CHOOSE YOUR FUTURE.',
        options: [
          { label: 'BUILD · Compete and create', correct: true, path: 'BUILD', why: 'Start with a school chapter, explore chapter challenges, and check out TechOlympics.' },
          { label: 'LEAD · Organize and influence', correct: true, path: 'LEAD', why: 'Try organizing a chapter event and explore ILC team responsibilities and application information.' },
          { label: 'LAUNCH · Network and work', correct: true, path: 'LAUNCH', why: 'Attend networking and skill-building events, then review eligibility for paid INTERnships.' }
        ]
      }
    ],
    source: 'https://interalliance.org/chapters/',
    narration: 'Your future is yours to choose. Build by joining a chapter and competing; lead by organizing chapter activities and exploring I L C; or launch by building career skills, meeting professionals, and exploring INTERnships.'
  }
]);

