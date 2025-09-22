import { PrismaClient, Level, CourseStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'web-development' },
      update: {},
      create: {
        name: 'Web Development',
        slug: 'web-development',
        description: 'Learn web development from basics to advanced',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'programming' },
      update: {},
      create: {
        name: 'Programming',
        slug: 'programming',
        description: 'Master programming languages and concepts',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'mobile-development' },
      update: {},
      create: {
        name: 'Mobile Development',
        slug: 'mobile-development',
        description: 'Build mobile applications for iOS and Android',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'data-science' },
      update: {},
      create: {
        name: 'Data Science',
        slug: 'data-science',
        description: 'Learn data analysis, machine learning, and AI',
      },
    }),
  ]);

  // Create instructor user
  const instructor = await prisma.user.upsert({
    where: { email: 'instructor@ghanatechonline.com' },
    update: {},
    create: {
      email: 'instructor@ghanatechonline.com',
      name: 'Dr. Samuel Kwame',
      role: 'ADMIN',
      bio: 'Senior Software Engineer with 10+ years of experience in teaching programming and web development.',
    },
  });

  // Create courses with YouTube videos
  const courses = [
    {
      title: 'Complete HTML & CSS for Beginners',
      description: 'Learn HTML and CSS from scratch. Build beautiful, responsive websites with modern web standards.',
      slug: 'html-css-beginners',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500',
      level: Level.BEGINNER,
      price: 0,
      duration: '8 hours',
      categoryId: categories[0].id,
      lessons: [
        {
          title: 'HTML Basics - Structure of a Web Page',
          description: 'Learn the basic structure of HTML documents',
          content: 'Introduction to HTML tags, elements, and document structure',
          videoUrl: 'https://www.youtube.com/watch?v=UB1O30fR-EE',
          duration: '45 minutes',
          order: 1,
        },
        {
          title: 'CSS Fundamentals - Styling Your Website',
          description: 'Learn CSS basics for styling web pages',
          content: 'CSS selectors, properties, and basic styling techniques',
          videoUrl: 'https://www.youtube.com/watch?v=yfoY53QXEnI',
          duration: '60 minutes',
          order: 2,
        },
        {
          title: 'Responsive Web Design',
          description: 'Make your websites mobile-friendly',
          content: 'Media queries, flexbox, and responsive design principles',
          videoUrl: 'https://www.youtube.com/watch?v=srvUrASNdFs',
          duration: '75 minutes',
          order: 3,
        },
      ],
    },
    {
      title: 'JavaScript for Complete Beginners',
      description: 'Master JavaScript programming from basics to advanced concepts. Build interactive web applications.',
      slug: 'javascript-beginners',
      image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=500',
      level: Level.BEGINNER,
      price: 0,
      duration: '12 hours',
      categoryId: categories[1].id,
      lessons: [
        {
          title: 'JavaScript Basics - Variables and Data Types',
          description: 'Learn JavaScript fundamentals',
          content: 'Variables, data types, and basic operations in JavaScript',
          videoUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
          duration: '90 minutes',
          order: 1,
        },
        {
          title: 'Functions and Control Flow',
          description: 'Master JavaScript functions and conditional statements',
          content: 'Functions, if statements, loops, and control structures',
          videoUrl: 'https://www.youtube.com/watch?v=N8ap4k_1QEQ',
          duration: '85 minutes',
          order: 2,
        },
        {
          title: 'DOM Manipulation',
          description: 'Make your websites interactive with JavaScript',
          content: 'Document Object Model, event handling, and dynamic content',
          videoUrl: 'https://www.youtube.com/watch?v=0ik6X4DJKCc',
          duration: '95 minutes',
          order: 3,
        },
      ],
    },
    {
      title: 'React.js Complete Course',
      description: 'Build modern web applications with React.js. Learn components, hooks, and state management.',
      slug: 'react-complete-course',
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500',
      level: Level.INTERMEDIATE,
      price: 0,
      duration: '15 hours',
      categoryId: categories[0].id,
      lessons: [
        {
          title: 'Introduction to React',
          description: 'Getting started with React.js',
          content: 'React basics, components, and JSX syntax',
          videoUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
          duration: '120 minutes',
          order: 1,
        },
        {
          title: 'React Hooks and State Management',
          description: 'Master React hooks for state management',
          content: 'useState, useEffect, and custom hooks',
          videoUrl: 'https://www.youtube.com/watch?v=O6P86uwfdR0',
          duration: '100 minutes',
          order: 2,
        },
        {
          title: 'Building a Complete React App',
          description: 'Build a full-stack React application',
          content: 'Routing, API integration, and deployment',
          videoUrl: 'https://www.youtube.com/watch?v=u6gSSpfsoOQ',
          duration: '180 minutes',
          order: 3,
        },
      ],
    },
    {
      title: 'Python Programming Masterclass',
      description: 'Learn Python from beginner to advanced. Perfect for automation, web development, and data science.',
      slug: 'python-masterclass',
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500',
      level: Level.BEGINNER,
      price: 0,
      duration: '20 hours',
      categoryId: categories[1].id,
      lessons: [
        {
          title: 'Python Basics - Getting Started',
          description: 'Learn Python programming fundamentals',
          content: 'Python syntax, variables, and data structures',
          videoUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
          duration: '240 minutes',
          order: 1,
        },
        {
          title: 'Object-Oriented Programming in Python',
          description: 'Master OOP concepts in Python',
          content: 'Classes, objects, inheritance, and polymorphism',
          videoUrl: 'https://www.youtube.com/watch?v=Ej_02ICOIgs',
          duration: '150 minutes',
          order: 2,
        },
        {
          title: 'Python Web Development with Django',
          description: 'Build web applications with Django framework',
          content: 'Django basics, models, views, and templates',
          videoUrl: 'https://www.youtube.com/watch?v=F5mRW0jo-U4',
          duration: '300 minutes',
          order: 3,
        },
      ],
    },
    {
      title: 'Flutter Mobile App Development',
      description: 'Create beautiful mobile apps for iOS and Android using Flutter and Dart programming language.',
      slug: 'flutter-mobile-development',
      image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500',
      level: Level.INTERMEDIATE,
      price: 0,
      duration: '18 hours',
      categoryId: categories[2].id,
      lessons: [
        {
          title: 'Flutter Basics and Setup',
          description: 'Get started with Flutter development',
          content: 'Flutter installation, project setup, and basic widgets',
          videoUrl: 'https://www.youtube.com/watch?v=1gDhl4leEzA',
          duration: '120 minutes',
          order: 1,
        },
        {
          title: 'Building User Interfaces in Flutter',
          description: 'Create beautiful UIs with Flutter widgets',
          content: 'Layout widgets, styling, and custom widgets',
          videoUrl: 'https://www.youtube.com/watch?v=wE7khGHVkYY',
          duration: '180 minutes',
          order: 2,
        },
        {
          title: 'Flutter App with Firebase Backend',
          description: 'Build a complete mobile app with backend integration',
          content: 'Firebase authentication, database, and deployment',
          videoUrl: 'https://www.youtube.com/watch?v=sfA3NWDBPZ4',
          duration: '240 minutes',
          order: 3,
        },
      ],
    },
    {
      title: 'Data Science with Python',
      description: 'Learn data analysis, visualization, and machine learning with Python libraries like Pandas and Scikit-learn.',
      slug: 'data-science-python',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500',
      level: Level.INTERMEDIATE,
      price: 0,
      duration: '25 hours',
      categoryId: categories[3].id,
      lessons: [
        {
          title: 'Data Analysis with Pandas',
          description: 'Master data manipulation with Pandas',
          content: 'DataFrames, data cleaning, and analysis techniques',
          videoUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg',
          duration: '180 minutes',
          order: 1,
        },
        {
          title: 'Data Visualization with Matplotlib',
          description: 'Create stunning visualizations',
          content: 'Charts, graphs, and interactive visualizations',
          videoUrl: 'https://www.youtube.com/watch?v=3Xc3CA655Y4',
          duration: '120 minutes',
          order: 2,
        },
        {
          title: 'Machine Learning Fundamentals',
          description: 'Introduction to machine learning with Scikit-learn',
          content: 'Supervised learning, model training, and evaluation',
          videoUrl: 'https://www.youtube.com/watch?v=hDKCxebp88A',
          duration: '300 minutes',
          order: 3,
        },
      ],
    },
  ];

  // Create courses and lessons
  for (const courseData of courses) {
    const { lessons, ...courseInfo } = courseData;
    
    const course = await prisma.course.upsert({
      where: { slug: courseData.slug },
      update: {},
      create: {
        ...courseInfo,
        instructorId: instructor.id,
        status: CourseStatus.PUBLISHED,
        averageRating: Math.random() * 2 + 3, // Random rating between 3-5
        totalReviews: Math.floor(Math.random() * 100) + 10, // Random reviews 10-110
      },
    });

    // Create lessons for each course
    for (const lessonData of lessons) {
      await prisma.lesson.upsert({
        where: { 
          courseId_order: {
            courseId: course.id,
            order: lessonData.order
          }
        },
        update: {},
        create: {
          ...lessonData,
          courseId: course.id,
        },
      });
    }
  }

  console.log('✅ Database seeding completed successfully!');
  console.log(`Created ${categories.length} categories`);
  console.log(`Created ${courses.length} courses`);
  console.log(`Created ${courses.reduce((total, course) => total + course.lessons.length, 0)} lessons`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });