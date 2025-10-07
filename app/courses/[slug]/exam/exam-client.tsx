"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  Trophy,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Award,
  FileText,
  XCircle
} from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: string[];
}

interface ExamPageClientProps {
  course: any;
  allLessonsCompleted: boolean;
  completedLessons: number;
  totalLessons: number;
  previousResults: any[];
  hasCertificate: boolean;
}

export default function ExamPageClient({
  course,
  allLessonsCompleted,
  completedLessons,
  totalLessons,
  previousResults,
  hasCertificate,
}: ExamPageClientProps) {
  const router = useRouter();
  const [examStarted, setExamStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState(90 * 60); // 90 minutes in seconds

  // Timer countdown
  useEffect(() => {
    if (!examStarted || result) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [examStarted, result]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartExam = async () => {
    setGenerating(true);
    setError(null);

    try {
      // First, check if questions already exist
      const checkResponse = await fetch(`/api/exams/generate?courseId=${course.id}`);
      const checkData = await checkResponse.json();

      let questionsData;

      if (checkData.questions && checkData.questions.length >= 40) {
        // Use existing questions
        questionsData = checkData.questions;
      } else {
        // Generate new questions
        const generateResponse = await fetch('/api/exams/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId: course.id, regenerate: false }),
        });

        if (!generateResponse.ok) {
          throw new Error('Failed to generate exam questions');
        }

        const generateData = await generateResponse.json();
        questionsData = generateData.questions;
      }

      if (!questionsData || questionsData.length < 40) {
        throw new Error('Insufficient questions generated. Please try again.');
      }

      // Randomly select 50 questions
      const shuffled = [...questionsData].sort(() => Math.random() - 0.5);
      const selectedQuestions = shuffled.slice(0, Math.min(50, questionsData.length));

      setQuestions(selectedQuestions);
      setExamStarted(true);
      setGenerating(false);
    } catch (err: any) {
      setError(err.message || 'Failed to start exam');
      setGenerating(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmitExam = async () => {
    if (Object.keys(answers).length < questions.length) {
      if (!confirm('You have unanswered questions. Do you want to submit anyway?')) {
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));

      const response = await fetch('/api/exams/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          answers: formattedAnswers,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit exam');
      }

      const data = await response.json();
      setResult(data.result);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Failed to submit exam');
      setLoading(false);
    }
  };

  // If lessons not completed
  if (!allLessonsCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Card className="border-2 border-yellow-200 dark:border-yellow-900">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
              <CardTitle className="text-2xl">Exam Not Available</CardTitle>
              <CardDescription>
                You must complete all course lessons before taking the exam
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Course Progress</span>
                  <span className="font-medium">
                    {completedLessons} / {totalLessons} lessons
                  </span>
                </div>
                <Progress value={(completedLessons / totalLessons) * 100} className="h-3" />
              </div>
              <Button onClick={() => router.push(`/learn/${course.lessons[0]?.id}`)} className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                Continue Learning
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show result
  if (result) {
    const passed = result.passed;
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Card className={`border-2 ${passed ? 'border-green-200 dark:border-green-900' : 'border-red-200 dark:border-red-900'}`}>
            <CardHeader className="text-center">
              <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
              }`}>
                {passed ? (
                  <Trophy className="w-10 h-10 text-green-600 dark:text-green-400" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                )}
              </div>
              <CardTitle className="text-3xl">
                {passed ? 'Congratulations!' : 'Keep Learning!'}
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                {result.message}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl font-bold text-primary">{result.score}</div>
                    <div className="text-sm text-muted-foreground mt-1">Score (out of 1000)</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-4xl font-bold text-primary">{result.percentageScore}%</div>
                    <div className="text-sm text-muted-foreground mt-1">Percentage</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Correct Answers:</span>
                  <span className="font-semibold text-green-600">{result.correctAnswers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Incorrect Answers:</span>
                  <span className="font-semibold text-red-600">{result.incorrectAnswers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Questions:</span>
                  <span className="font-semibold">{result.totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pass Threshold:</span>
                  <span className="font-semibold">{result.passThreshold}/1000</span>
                </div>
              </div>

              {passed && (
                <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
                  <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-300">
                    You've earned a certificate! Click below to view and download it.
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                {passed ? (
                  <Button 
                    onClick={() => router.push(`/courses/${course.slug}/certificate`)} 
                    className="flex-1"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    View Certificate
                  </Button>
                ) : (
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="flex-1"
                  >
                    Retake Exam
                  </Button>
                )}
                <Button 
                  onClick={() => router.push('/dashboard')} 
                  variant="outline"
                  className="flex-1"
                >
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Exam in progress
  if (examStarted && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const answeredCount = Object.keys(answers).length;
    const isTimeWarning = timeRemaining <= 5 * 60; // Last 5 minutes

    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold">{course.title}</h1>
                  <p className="text-muted-foreground">Final Examination</p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isTimeWarning 
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                }`}>
                  <Clock className="w-5 h-5" />
                  <span className="font-mono text-lg font-bold">{formatTime(timeRemaining)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <span>{answeredCount} answered</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Question */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Question {currentQuestionIndex + 1}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {currentQuestion.text}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQuestion.id] || ''}
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              >
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        answers[currentQuestion.id] === option
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                      }`}
                    >
                      <RadioGroupItem value={option} id={`option-${idx}`} className="mt-1" />
                      <Label htmlFor={`option-${idx}`} className="flex-1 cursor-pointer text-base">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <Button
                  onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                {currentQuestionIndex === questions.length - 1 ? (
                  <Button
                    onClick={handleSubmitExam}
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Submit Exam
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                    disabled={currentQuestionIndex === questions.length - 1}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    );
  }

  // Exam start screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Card className="border-2 border-blue-200 dark:border-blue-900">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <CardTitle className="text-3xl">Final Examination</CardTitle>
            <CardDescription className="text-lg mt-2">
              {course.title}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {hasCertificate && (
              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-300">
                  You've already passed this exam and earned a certificate!
                </AlertDescription>
              </Alert>
            )}

            {previousResults.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Previous Attempts</h3>
                <div className="space-y-2">
                  {previousResults.slice(0, 3).map((result, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span className="text-sm">Attempt {previousResults.length - idx}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={result.passed ? 'default' : 'destructive'}>
                          {result.score}/1000
                        </Badge>
                        {result.passed && <CheckCircle className="w-4 h-4 text-green-600" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">Exam Instructions</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>The exam consists of 50 multiple-choice questions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>You have 90 minutes to complete the exam</span>
                </li>
                <li className="flex items-start gap-2">
                  <Trophy className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>You need a score of 800/1000 (80%) to pass</span>
                </li>
                <li className="flex items-start gap-2">
                  <Award className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Passing the exam earns you a certificate of completion</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>You can retake the exam if you don't pass</span>
                </li>
              </ul>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleStartExam} 
              disabled={generating}
              className="w-full"
              size="lg"
            >
              {generating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Preparing Exam Questions...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5 mr-2" />
                  Start Exam
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
