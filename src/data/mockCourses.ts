import { Course } from '../types/course';

export const mockCourses: Course[] = [
  {
    id: 'programming-fundamentals',
    title: 'Programming Fundamentals',
    description: 'Master the core concepts of programming logic, independent of any specific language. Perfect foundation for your coding journey.',
    category: 'Programming',
    image: 'https://images.unsplash.com/photo-1635775017492-1eb935a082a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGNvZGluZyUyMGNvbXB1dGVyfGVufDF8fHx8MTc1ODQ2Mjk1OHww&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '4 weeks',
    level: 'Beginner',
    instructor: 'Bawah Josephus',
    rating: 4.8,
    students: 1250,
    price: 'Free',
    tags: ['Logic', 'Algorithms', 'Problem Solving'],
    totalLessons: 8,
    completedLessons: 0,
    lessons: [
      {
        id: 'lesson-1',
        title: 'Introduction to Programming',
        description: 'Learn what programming is and why it matters in today\'s world.',
        videoUrl: 'https://www.youtube.com/watch?v=zOjov-2OZ0E',
        duration: "10:00", // 10 minutes
        order: 1,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'lesson-2',
        title: 'Understanding Variables and Data Types',
        description: 'Explore how computers store and manipulate different types of data.',
        videoUrl: 'https://www.youtube.com/watch?v=9rhT3P1MDHk',
        duration: "10:00", // 12 minutes
        order: 2,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'lesson-3',
        title: 'Control Structures: If Statements',
        description: 'Learn how to make decisions in your programs using conditional statements.',
        videoUrl: 'https://www.youtube.com/watch?v=IsG4Xd6LlsM',
        duration: "10:00", // 9 minutes
        order: 3,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'lesson-4',
        title: 'Loops and Iteration',
        description: 'Understand how to repeat actions efficiently using loops.',
        videoUrl: 'https://www.youtube.com/watch?v=wxds6MAtUQ0',
        duration: "10:00", // 11 minutes
        order: 4,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'lesson-5',
        title: 'Functions and Procedures',
        description: 'Learn to organize your code into reusable functions.',
        videoUrl: 'https://www.youtube.com/watch?v=N_Ls37qeQ4c',
        duration: "10:00", // 13 minutes
        order: 5,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'lesson-6',
        title: 'Problem Solving Strategies',
        description: 'Develop systematic approaches to solving programming problems.',
        videoUrl: 'https://www.youtube.com/watch?v=azcrPFhaY9k',
        duration: "10:00", // 15 minutes
        order: 6,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'lesson-7',
        title: 'Algorithm Design Basics',
        description: 'Introduction to designing efficient algorithms.',
        videoUrl: 'https://www.youtube.com/watch?v=KEEKn7Me-ms',
        duration: "10:00", // 14 minutes
        order: 7,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'lesson-8',
        title: 'Debugging and Testing',
        description: 'Learn essential skills for finding and fixing errors in your code.',
        videoUrl: 'https://www.youtube.com/watch?v=gF_qQYrCcjM',
        duration: "10:00", // 12 minutes
        order: 8,
        isCompleted: false,
        watchProgress: 0
      }
    ]
  },
  {
    id: 'javascript-full',
    title: 'JavaScript Full Stack Development',
    description: 'Complete JavaScript mastery from basics to advanced concepts. Build real-world applications with modern JavaScript.',
    category: 'Programming',
    image: 'https://images.unsplash.com/photo-1635775017492-1eb935a082a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGNvZGluZyUyMGNvbXB1dGVyfGVufDF8fHx8MTc1ODQ2Mjk1OHww&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '8 weeks',
    level: 'Intermediate',
    instructor: 'Bawah Josephus',
    rating: 4.9,
    students: 980,
    price: 'Free',
    tags: ['ES6+', 'DOM', 'APIs', 'React'],
    totalLessons: 12,
    completedLessons: 0,
    lessons: [
      {
        id: 'js-lesson-1',
        title: 'JavaScript Fundamentals',
        description: 'Get started with JavaScript syntax and basic concepts.',
        videoUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
        duration: "10:00",
        order: 1,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'js-lesson-2',
        title: 'Variables and Data Types in JavaScript',
        description: 'Deep dive into JavaScript variables, primitives, and objects.',
        videoUrl: 'https://www.youtube.com/watch?v=9rhT3P1MDHk',
        duration: "10:00",
        order: 2,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'js-lesson-3',
        title: 'Functions in JavaScript',
        description: 'Master function declarations, expressions, and arrow functions.',
        videoUrl: 'https://www.youtube.com/watch?v=N_Ls37qeQ4c',
        duration: "10:00",
        order: 3,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'js-lesson-4',
        title: 'DOM Manipulation',
        description: 'Learn to interact with HTML elements using JavaScript.',
        videoUrl: 'https://www.youtube.com/watch?v=5fb2aPlgoys',
        duration: "10:00",
        order: 4,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'js-lesson-5',
        title: 'Event Handling',
        description: 'Handle user interactions with event listeners.',
        videoUrl: 'https://www.youtube.com/watch?v=XF1_MlZ5l6M',
        duration: "10:00",
        order: 5,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'js-lesson-6',
        title: 'Asynchronous JavaScript',
        description: 'Understand promises, async/await, and handling API calls.',
        videoUrl: 'https://www.youtube.com/watch?v=PoRJizFvM7s',
        duration: "10:00",
        order: 6,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'js-lesson-7',
        title: 'Modern JavaScript (ES6+)',
        description: 'Explore modern JavaScript features and syntax.',
        videoUrl: 'https://www.youtube.com/watch?v=nZ1DMMsyVyI',
        duration: "10:00",
        order: 7,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'js-lesson-8',
        title: 'Object-Oriented Programming in JS',
        description: 'Learn OOP concepts and classes in JavaScript.',
        videoUrl: 'https://www.youtube.com/watch?v=PFmuCDHHpwk',
        duration: "10:00",
        order: 8,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'js-lesson-9',
        title: 'Error Handling and Debugging',
        description: 'Master error handling and debugging techniques.',
        videoUrl: 'https://www.youtube.com/watch?v=gF_qQYrCcjM',
        duration: "10:00",
        order: 9,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'js-lesson-10',
        title: 'Working with APIs',
        description: 'Learn to fetch and manipulate data from external APIs.',
        videoUrl: 'https://www.youtube.com/watch?v=cuEtnrL9-H0',
        duration: "10:00",
        order: 10,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'js-lesson-11',
        title: 'Local Storage and Session Storage',
        description: 'Store data in the browser for better user experience.',
        videoUrl: 'https://www.youtube.com/watch?v=GihQAC1I39Q',
        duration: "10:00",
        order: 11,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'js-lesson-12',
        title: 'Building a Complete Project',
        description: 'Put everything together in a real-world JavaScript project.',
        videoUrl: 'https://www.youtube.com/watch?v=3PHXvlpOkf4',
        duration: "10:00",
        order: 12,
        isCompleted: false,
        watchProgress: 0
      }
    ]
  },
  {
    id: 'python-beginner',
    title: 'Python for Beginners',
    description: 'Learn Python programming from scratch. Ideal for complete beginners with hands-on projects and real applications.',
    category: 'Programming',
    image: 'https://images.unsplash.com/photo-1635775017492-1eb935a082a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGNvZGluZyUyMGNvbXB1dGVyfGVufDF8fHx8MTc1ODQ2Mjk1OHww&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '6 weeks',
    level: 'Beginner',
    instructor: 'Sarah Johnson',
    rating: 4.7,
    students: 1500,
    price: 'Free',
    tags: ['Syntax', 'Data Types', 'Functions', 'Projects'],
    totalLessons: 10,
    completedLessons: 0,
    lessons: [
      {
        id: 'py-lesson-1',
        title: 'Python Installation and Setup',
        description: 'Get Python installed and set up your development environment.',
        videoUrl: 'https://www.youtube.com/watch?v=YYXdXT2l-Gg',
        duration: "10:00",
        order: 1,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'py-lesson-2',
        title: 'Python Basics and Syntax',
        description: 'Learn the fundamental syntax and structure of Python.',
        videoUrl: 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
        duration: "10:00",
        order: 2,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'py-lesson-3',
        title: 'Variables and Data Types',
        description: 'Understand Python data types and variable assignment.',
        videoUrl: 'https://www.youtube.com/watch?v=9rhT3P1MDHk',
        duration: "10:00",
        order: 3,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'py-lesson-4',
        title: 'Control Flow: If Statements',
        description: 'Learn conditional statements and decision making in Python.',
        videoUrl: 'https://www.youtube.com/watch?v=IsG4Xd6LlsM',
        duration: "10:00",
        order: 4,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'py-lesson-5',
        title: 'Loops in Python',
        description: 'Master for loops and while loops for iteration.',
        videoUrl: 'https://www.youtube.com/watch?v=wxds6MAtUQ0',
        duration: "10:00",
        order: 5,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'py-lesson-6',
        title: 'Functions in Python',
        description: 'Create and use functions to organize your code.',
        videoUrl: 'https://www.youtube.com/watch?v=N_Ls37qeQ4c',
        duration: "10:00",
        order: 6,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'py-lesson-7',
        title: 'Lists and Dictionaries',
        description: 'Work with Python\'s most important data structures.',
        videoUrl: 'https://www.youtube.com/watch?v=W8KRzm-HUcc',
        duration: "10:00",
        order: 7,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'py-lesson-8',
        title: 'File Handling',
        description: 'Learn to read from and write to files in Python.',
        videoUrl: 'https://www.youtube.com/watch?v=Uh2ebFW8OYM',
        duration: "10:00",
        order: 8,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'py-lesson-9',
        title: 'Error Handling',
        description: 'Handle exceptions and errors gracefully in Python.',
        videoUrl: 'https://www.youtube.com/watch?v=6SPDvPK38tw',
        duration: "10:00",
        order: 9,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'py-lesson-10',
        title: 'Final Project: Python Calculator',
        description: 'Build a complete calculator application using Python.',
        videoUrl: 'https://www.youtube.com/watch?v=iTX3Ljhq-LM',
        duration: "10:00",
        order: 10,
        isCompleted: false,
        watchProgress: 0
      }
    ]
  },
  {
    id: 'cybersecurity-basics',
    title: 'Cybersecurity Fundamentals',
    description: 'Essential cybersecurity concepts for protecting systems and data. Learn about threats, vulnerabilities, and defense strategies.',
    category: 'Cybersecurity',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHNlY3VyaXR5fGVufDF8fHx8MTc1ODQ2Mjk1OHww&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '5 weeks',
    level: 'Beginner',
    instructor: 'Michael Chen',
    rating: 4.6,
    students: 850,
    price: 'Free',
    tags: ['Security', 'Networking', 'Risk Management'],
    totalLessons: 8,
    completedLessons: 0,
    lessons: [
      {
        id: 'cyber-lesson-1',
        title: 'Introduction to Cybersecurity',
        description: 'Overview of cybersecurity landscape and why it matters.',
        videoUrl: 'https://www.youtube.com/watch?v=inWWhr5tnEA',
        duration: "10:00",
        order: 1,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'cyber-lesson-2',
        title: 'Common Cyber Threats',
        description: 'Understanding malware, phishing, and other common threats.',
        videoUrl: 'https://www.youtube.com/watch?v=YLVP1_BTR0c',
        duration: "10:00",
        order: 2,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'cyber-lesson-3',
        title: 'Password Security and Authentication',
        description: 'Best practices for creating and managing secure passwords.',
        videoUrl: 'https://www.youtube.com/watch?v=3NjQ9b3pgIg',
        duration: "10:00",
        order: 3,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'cyber-lesson-4',
        title: 'Network Security Basics',
        description: 'Understanding firewalls, VPNs, and network protection.',
        videoUrl: 'https://www.youtube.com/watch?v=6aJAo3KdRS0',
        duration: "10:00",
        order: 4,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'cyber-lesson-5',
        title: 'Data Protection and Privacy',
        description: 'Protecting sensitive data and understanding privacy laws.',
        videoUrl: 'https://www.youtube.com/watch?v=l8iXMgk2Dcc',
        duration: "10:00",
        order: 5,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'cyber-lesson-6',
        title: 'Incident Response',
        description: 'How to respond to security breaches and incidents.',
        videoUrl: 'https://www.youtube.com/watch?v=nvTEVQpJjQ4',
        duration: "10:00",
        order: 6,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'cyber-lesson-7',
        title: 'Security Tools and Software',
        description: 'Overview of essential cybersecurity tools.',
        videoUrl: 'https://www.youtube.com/watch?v=2TofunAI6fU',
        duration: "10:00",
        order: 7,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'cyber-lesson-8',
        title: 'Building a Security Mindset',
        description: 'Developing good security habits and awareness.',
        videoUrl: 'https://www.youtube.com/watch?v=VXnyq-6Fd_M',
        duration: "10:00",
        order: 8,
        isCompleted: false,
        watchProgress: 0
      }
    ]
  },
  {
    id: 'data-science-intro',
    title: 'Introduction to Data Science',
    description: 'Explore the exciting world of data science with Python, statistics, and machine learning fundamentals.',
    category: 'AI',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwc2NpZW5jZXxlbnwxfHx8fDE3NTg0NjI5NTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '7 weeks',
    level: 'Intermediate',
    instructor: 'Dr. Aisha Osman',
    rating: 4.8,
    students: 1200,
    price: 'Free',
    tags: ['Python', 'Statistics', 'Machine Learning', 'Visualization'],
    totalLessons: 10,
    completedLessons: 0,
    lessons: [
      {
        id: 'ds-lesson-1',
        title: 'What is Data Science?',
        description: 'Introduction to data science and its applications.',
        videoUrl: 'https://www.youtube.com/watch?v=ua-CiDNNj30',
        duration: "10:00",
        order: 1,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'ds-lesson-2',
        title: 'Python for Data Science',
        description: 'Setting up Python environment and essential libraries.',
        videoUrl: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
        duration: "10:00",
        order: 2,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'ds-lesson-3',
        title: 'Data Collection and Cleaning',
        description: 'Gathering and preparing data for analysis.',
        videoUrl: 'https://www.youtube.com/watch?v=ZOX18HfLHGQ',
        duration: "10:00",
        order: 3,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'ds-lesson-4',
        title: 'Exploratory Data Analysis',
        description: 'Understanding your data through visualization and statistics.',
        videoUrl: 'https://www.youtube.com/watch?v=OY4eQrekQvs',
        duration: "10:00",
        order: 4,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'ds-lesson-5',
        title: 'Statistical Analysis',
        description: 'Fundamental statistical concepts for data science.',
        videoUrl: 'https://www.youtube.com/watch?v=xxpc-HPKN28',
        duration: "10:00",
        order: 5,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'ds-lesson-6',
        title: 'Data Visualization',
        description: 'Creating effective charts and graphs with matplotlib and seaborn.',
        videoUrl: 'https://www.youtube.com/watch?v=UO98lJQ3QGI',
        duration: "10:00",
        order: 6,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'ds-lesson-7',
        title: 'Introduction to Machine Learning',
        description: 'Basic concepts of machine learning and algorithms.',
        videoUrl: 'https://www.youtube.com/watch?v=aircAruvnKk',
        duration: "10:00",
        order: 7,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'ds-lesson-8',
        title: 'Supervised Learning',
        description: 'Classification and regression algorithms.',
        videoUrl: 'https://www.youtube.com/watch?v=1FZ0A1QCMWc',
        duration: "10:00",
        order: 8,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'ds-lesson-9',
        title: 'Model Evaluation',
        description: 'Measuring and improving model performance.',
        videoUrl: 'https://www.youtube.com/watch?v=85dtiMz9tSo',
        duration: "10:00",
        order: 9,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'ds-lesson-10',
        title: 'Data Science Project',
        description: 'Complete end-to-end data science project.',
        videoUrl: 'https://www.youtube.com/watch?v=MpF9HENQjDo',
        duration: "10:00",
        order: 10,
        isCompleted: false,
        watchProgress: 0
      }
    ]
  },
  {
    id: 'gdpr-compliance',
    title: 'GDPR and Data Protection',
    description: 'Understanding GDPR requirements and implementing data protection measures in your organization.',
    category: 'Data Protection',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcml2YWN5JTIwZGF0YSUyMHByb3RlY3Rpb258ZW58MXx8fHwxNzU4NDYyOTU4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '4 weeks',
    level: 'Intermediate',
    instructor: 'Rebecca Thompson',
    rating: 4.5,
    students: 650,
    price: 'Free',
    tags: ['GDPR', 'Privacy', 'Compliance', 'Legal'],
    totalLessons: 6,
    completedLessons: 0,
    lessons: [
      {
        id: 'gdpr-lesson-1',
        title: 'Introduction to GDPR',
        description: 'Overview of GDPR and its global impact.',
        videoUrl: 'https://www.youtube.com/watch?v=l8iXMgk2Dcc',
        duration: "10:00",
        order: 1,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'gdpr-lesson-2',
        title: 'Key GDPR Principles',
        description: 'Understanding the core principles of data protection.',
        videoUrl: 'https://www.youtube.com/watch?v=GWIdRx7jGHE',
        duration: "10:00",
        order: 2,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'gdpr-lesson-3',
        title: 'Data Subject Rights',
        description: 'Understanding individual rights under GDPR.',
        videoUrl: 'https://www.youtube.com/watch?v=dHQ3kHdeYXk',
        duration: "10:00",
        order: 3,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'gdpr-lesson-4',
        title: 'Data Processing and Consent',
        description: 'Legal basis for processing and obtaining valid consent.',
        videoUrl: 'https://www.youtube.com/watch?v=stxVBJem3Rs',
        duration: "10:00",
        order: 4,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'gdpr-lesson-5',
        title: 'Data Breach Response',
        description: 'Handling and reporting data breaches under GDPR.',
        videoUrl: 'https://www.youtube.com/watch?v=_pK9H_6MzGE',
        duration: "10:00",
        order: 5,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'gdpr-lesson-6',
        title: 'GDPR Compliance Framework',
        description: 'Building a comprehensive compliance program.',
        videoUrl: 'https://www.youtube.com/watch?v=6BQM7rCVaRM',
        duration: "10:00",
        order: 6,
        isCompleted: false,
        watchProgress: 0
      }
    ]
  },
  {
    id: 'react-advanced',
    title: 'Advanced React Development',
    description: 'Master advanced React concepts including hooks, context, performance optimization, and modern patterns.',
    category: 'Programming',
    image: 'https://images.unsplash.com/photo-1635775017492-1eb935a082a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGNvZGluZyUyMGNvbXB1dGVyfGVufDF8fHx8MTc1ODQ2Mjk1OHww&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '6 weeks',
    level: 'Advanced',
    instructor: 'Alex Rodriguez',
    rating: 4.9,
    students: 780,
    price: 'Free',
    tags: ['React', 'Hooks', 'Performance', 'Testing'],
    totalLessons: 8,
    completedLessons: 0,
    lessons: [
      {
        id: 'react-adv-lesson-1',
        title: 'Advanced React Hooks',
        description: 'Deep dive into useEffect, useCallback, useMemo, and custom hooks.',
        videoUrl: 'https://www.youtube.com/watch?v=0ZJgIjIuY7U',
        duration: "10:00",
        order: 1,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'react-adv-lesson-2',
        title: 'Context API and State Management',
        description: 'Managing global state with Context API and useReducer.',
        videoUrl: 'https://www.youtube.com/watch?v=35lXWvCuM8o',
        duration: "10:00",
        order: 2,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'react-adv-lesson-3',
        title: 'Performance Optimization',
        description: 'React.memo, lazy loading, and performance best practices.',
        videoUrl: 'https://www.youtube.com/watch?v=KEDUqA9JeIo',
        duration: "10:00",
        order: 3,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'react-adv-lesson-4',
        title: 'Error Boundaries and Error Handling',
        description: 'Implementing robust error handling in React applications.',
        videoUrl: 'https://www.youtube.com/watch?v=DNYXgtZBRPE',
        duration: "10:00",
        order: 4,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'react-adv-lesson-5',
        title: 'Testing React Components',
        description: 'Unit testing and integration testing with Jest and React Testing Library.',
        videoUrl: 'https://www.youtube.com/watch?v=7dTTFW7yACQ',
        duration: "10:00",
        order: 5,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'react-adv-lesson-6',
        title: 'Advanced Patterns',
        description: 'Render props, HOCs, and compound components.',
        videoUrl: 'https://www.youtube.com/watch?v=BcVAq3YFiuc',
        duration: "10:00",
        order: 6,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'react-adv-lesson-7',
        title: 'Server-Side Rendering',
        description: 'Introduction to Next.js and SSR concepts.',
        videoUrl: 'https://www.youtube.com/watch?v=mTz0GXj8NN0',
        duration: "10:00",
        order: 7,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'react-adv-lesson-8',
        title: 'Building Production Apps',
        description: 'Deployment, monitoring, and maintaining React applications.',
        videoUrl: 'https://www.youtube.com/watch?v=7CqJlxBYj-M',
        duration: "10:00",
        order: 8,
        isCompleted: false,
        watchProgress: 0
      }
    ]
  },
  {
    id: 'ai-ethics',
    title: 'AI Ethics and Responsible AI',
    description: 'Explore the ethical implications of AI technology and learn to build responsible AI systems.',
    category: 'AI',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaSUyMGV0aGljc3xlbnwxfHx8fDE3NTg0NjI5NTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '3 weeks',
    level: 'Intermediate',
    instructor: 'Prof. David Kim',
    rating: 4.7,
    students: 920,
    price: 'Free',
    tags: ['Ethics', 'Bias', 'Fairness', 'Responsibility'],
    totalLessons: 6,
    completedLessons: 0,
    lessons: [
      {
        id: 'ai-ethics-lesson-1',
        title: 'Introduction to AI Ethics',
        description: 'Why ethics matter in AI development and deployment.',
        videoUrl: 'https://www.youtube.com/watch?v=0Fy4vgTk24M',
        duration: "10:00",
        order: 1,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'ai-ethics-lesson-2',
        title: 'Bias and Fairness in AI',
        description: 'Understanding and mitigating bias in AI systems.',
        videoUrl: 'https://www.youtube.com/watch?v=fMym_BKWQzk',
        duration: "10:00",
        order: 2,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'ai-ethics-lesson-3',
        title: 'Privacy and AI',
        description: 'Protecting privacy in AI applications.',
        videoUrl: 'https://www.youtube.com/watch?v=yVo3WXhE-iw',
        duration: "10:00",
        order: 3,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'ai-ethics-lesson-4',
        title: 'Transparency and Explainability',
        description: 'Making AI decisions interpretable and transparent.',
        videoUrl: 'https://www.youtube.com/watch?v=XRjGXSDwRos',
        duration: "10:00",
        order: 4,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'ai-ethics-lesson-5',
        title: 'AI Governance and Regulation',
        description: 'Legal and regulatory frameworks for AI.',
        videoUrl: 'https://www.youtube.com/watch?v=b4kGm-HqOS0',
        duration: "10:00",
        order: 5,
        isCompleted: false,
        watchProgress: 0
      },
      {
        id: 'ai-ethics-lesson-6',
        title: 'Building Ethical AI Systems',
        description: 'Practical approaches to implementing ethical AI.',
        videoUrl: 'https://www.youtube.com/watch?v=ynMqzj_S8lM',
        duration: "10:00",
        order: 6,
        isCompleted: false,
        watchProgress: 0
      }
    ]
  }
];

export const getCourseById = (id: string): Course | undefined => {
  return mockCourses.find(course => course.id === id);
};

export const getLessonById = (courseId: string, lessonId: string) => {
  const course = getCourseById(courseId);
  return course?.lessons.find(lesson => lesson.id === lessonId);
};

export const getAllCourses = (): Course[] => {
  return mockCourses;
};