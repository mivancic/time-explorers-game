import questions from './questions';

// Question manager to handle random selection and tracking of used questions
class QuestionManager {
  constructor() {
    this.questions = questions;
    this.usedQuestionIds = new Set();
    this.currentLevelQuestions = [];
    this.currentLevel = 1;
  }

  // Initialize or reset the manager for a specific level
  initForLevel(level, characterName) {
    this.currentLevel = level;
    this.currentLevelQuestions = [];
    
    // Get all questions for the current level
    const levelQuestions = this.questions[level] || [];
    
    // Create instances of each question template with generated data
    levelQuestions.forEach(questionTemplate => {
      // Generate data for this question template
      const data = questionTemplate.generateData();
      
      // Replace character name placeholder if present
      if (data.name === "{{CHARACTER_NAME}}") {
        data.name = characterName;
      }
      
      // Create question instance
      const question = {
        id: questionTemplate.id,
        question: questionTemplate.template(data),
        answer: data.answer,
        hint: data.hint,
        answerType: data.answerType,
        data: data
      };
      
      this.currentLevelQuestions.push(question);
    });
  }

  // Get a random unused question for the current level
  getRandomQuestion() {
    // Filter out already used questions
    const availableQuestions = this.currentLevelQuestions.filter(
      q => !this.usedQuestionIds.has(q.id)
    );
    
    // If no questions left, return null
    if (availableQuestions.length === 0) {
      return null;
    }
    
    // Pick a random question
    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const selectedQuestion = availableQuestions[randomIndex];
    
    // Mark as used
    this.usedQuestionIds.add(selectedQuestion.id);
    
    return selectedQuestion;
  }

  // Check if we've used all questions for this level
  areAllQuestionsUsed() {
    const totalQuestions = this.currentLevelQuestions.length;
    const usedCount = this.currentLevelQuestions.filter(
      q => this.usedQuestionIds.has(q.id)
    ).length;
    
    return usedCount >= totalQuestions;
  }

  // Reset used questions tracking
  resetUsedQuestions() {
    this.usedQuestionIds.clear();
  }

  // Get total number of questions for a level
  getTotalQuestionsForLevel(level) {
    return (this.questions[level] || []).length;
  }
}

// Create a singleton instance
const questionManagerInstance = new QuestionManager();

export default questionManagerInstance; 