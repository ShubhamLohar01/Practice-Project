// Fetch questions from the Open Trivia Database API
async function fetchQuestions() {
  const apiURL = "https://opentdb.com/api.php?amount=5&type=multiple";
  try {
    const response = await fetch(apiURL);
    const data = await response.json();//convert to json
    return data.results;
  } catch (error) {
    console.error("Failed to fetch questions:", error);
  }
}

// Display the first question and handle user interaction
function displayQuiz(questions) {
  let currentQuestionIndex = 0;
  let score = 0; // Track correct answers
  const questionElement = document.getElementById("question");
  const answerButtons = document.querySelectorAll(".btn");
  const nextButton = document.getElementById("next");
  const scoreElement = document.createElement("div");

  scoreElement.id = "score";
  scoreElement.style.marginTop = "20px";
  document.querySelector(".quiz").appendChild(scoreElement);

  // Load a question
  function loadQuestion(index) {
    const questionData = questions[index];
    questionElement.innerHTML = questionData.question;

    // Randomize answers and attach them to buttons
    const answers = [...questionData.incorrect_answers];
    const correctIndex = Math.floor(Math.random() * 4);
    answers.splice(correctIndex, 0, questionData.correct_answer);

    answerButtons.forEach((button, idx) => {
      button.innerText = answers[idx];
      button.dataset.correct = answers[idx] === questionData.correct_answer;
      button.classList.remove("correct", "incorrect", "selected");
      button.disabled = false;
    });

    nextButton.style.display = "none";
  }

  // Handle answer selection
  answerButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      answerButtons.forEach((btn) => {
        btn.disabled = true; // Disable all buttons after selection
        btn.classList.remove("selected");
      });
      event.target.classList.add("selected"); // Highlight the selected button
      const isCorrect = event.target.dataset.correct === "true";
      if (isCorrect) {
        score++; // Increment score for correct answers
        event.target.classList.add("correct");
      } else {
        event.target.classList.add("incorrect");
      }
      nextButton.style.display = "block"; // Show the next button
    });
  })

  // Load the next question or show completion
  nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      loadQuestion(currentQuestionIndex);
    } else {
      questionElement.innerHTML = `Quiz Completed! 🎉<br>Correct Answers: ${score}<br>Wrong Answers: ${questions.length - score}`;
      document.getElementById("ans").style.display = "none";
      nextButton.style.display = "none";
    }
  });

  // Load the first question
  loadQuestion(currentQuestionIndex);
}

// Initialize the quiz
document.addEventListener("DOMContentLoaded", async () => {
  const questions = await fetchQuestions();
  if (questions) {
    displayQuiz(questions);
  }
});


//another method
// const questions = [
//     {
//       question: "What is the capital of France?",
//       options: ["Berlin", "Madrid", "Paris", "Rome"],
//       correct: "Paris",
//     },
//     {
//       question: "Which language is used for web development?",
//       options: ["Python", "JavaScript", "C++", "Ruby"],
//       correct: "JavaScript",
//     },
//     {
//       question: "What does CSS stand for?",
//       options: [
//         "Computer Style Sheets",
//         "Creative Style Sheets",
//         "Cascading Style Sheets",
//         "Custom Style Sheets",
//       ],
//       correct: "Cascading Style Sheets",
//     },
//     {
//       question: "Who invented the World Wide Web?",
//       options: [
//         "Alan Turing",
//         "Bill Gates",
//         "Tim Berners-Lee",
//         "Steve Jobs",
//       ],
//       correct: "Tim Berners-Lee",
//     },
//     {
//       question: "Which HTML tag is used to insert a line break?",
//       options: ["<br>", "<lb>", "<break>", "<hr>"],
//       correct: "<br>",
//     },
//   ];
//   const quesel= document.getElementById("question");
//   const ansel = document.getElementById("ans");
//   const nextBtn = document.getElementById("next");
