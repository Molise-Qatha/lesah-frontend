import React, { useState, useEffect, useRef } from 'react';
import './GameSection.css';

function GameSection() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [showGame, setShowGame] = useState(false);
  const [score, setScore] = useState(0);
  const [currentRiddle, setCurrentRiddle] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [riddleCount, setRiddleCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [options, setOptions] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const [correctAnimation, setCorrectAnimation] = useState(false);
  const [totalRiddles] = useState(20);
  
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const streakSoundRef = useRef(null);

  useEffect(() => {
    const createBeep = (frequency, duration, type = 'sine') => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = type;
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + duration);
      oscillator.stop(audioContext.currentTime + duration);
      
      audioContext.resume();
    };
    
    correctSoundRef.current = () => createBeep(523.25, 0.3, 'sine');
    wrongSoundRef.current = () => createBeep(220, 0.5, 'sawtooth');
    streakSoundRef.current = (streakCount) => {
      if (streakCount >= 3) {
        createBeep(659.25, 0.2, 'sine');
        setTimeout(() => createBeep(783.99, 0.2, 'sine'), 200);
        setTimeout(() => createBeep(987.77, 0.3, 'sine'), 400);
      }
    };
  }, []);

  const riddles = [
    { sesotho: "'Me nt'soare ke nye", answer: "nko" },
    { sesotho: "Masimo a mothating", answer: "lint'si" },
    { sesotho: "Phutse le hara thota", answer: "mokhubu" },
    { sesotho: "Mohlankana ea lulang lehaheng", answer: "leleme" },
    { sesotho: "Senya ka 'mele", answer: "motlhotlo" },
    { sesotho: "Lipoli tsa makeleketla li fula li bothile", answer: "sekele" },
    { sesotho: "Mosali ea linyao mpeng", answer: "sesiu" },
    { sesotho: "Monna ea sekhoalita hlohong", answer: "lesokoana" },
    { sesotho: "'Mamonyamane motsoa lehlakeng", answer: "katse" },
    { sesotho: "Khare ea leifo", answer: "ntja" },
    { sesotho: "Phate lia lekana", answer: "Leholimo le lefat'se" },
    { sesotho: "Mala a nku marang-rang", answer: "mohloa/joang" },
    { sesotho: "Monna eo e reng ha khot'se a roalle", answer: "noka" },
    { sesotho: "Lithung-thung tsa tlapa le leholo", answer: "linaleli" },
    { sesotho: "Nthethe a bina moholo a lutse", answer: "sefate" },
    { sesotho: "Ka qhala phoofo ka ja mokotla", answer: "moholu" },
    { sesotho: "Maqheku a qabana ka lehaheng", answer: "likhobe" },
    { sesotho: "Thankha-thankha ketla tsoalla kae", answer: "mokopu" },
    { sesotho: "O monate feela oa hlaba", answer: "torofeie" },
    { sesotho: "Botala ke joang, bofubelu ke ba mali, monate ke oa tsoekere", answer: "lehapu" }
  ];

  const allAnswers = riddles.map(r => r.answer);

  const generateOptions = (correctAnswer) => {
    const wrongAnswers = allAnswers
      .filter(a => a !== correctAnswer)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const allOptions = [correctAnswer, ...wrongAnswers];
    return allOptions.sort(() => 0.5 - Math.random());
  };

  useEffect(() => {
    const savedLeaderboard = localStorage.getItem('lilothoLeaderboard');
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    } else {
      const sampleData = [
        { name: "Thabo Mokoena", score: 450, correct: 9, date: "2026-03-23" },
        { name: "Lerato Mofolo", score: 400, correct: 8, date: "2026-03-22" },
        { name: "Mpho Letsie", score: 350, correct: 7, date: "2026-03-21" },
        { name: "John Malefetsane", score: 300, correct: 6, date: "2026-03-20" },
        { name: "Mary Ntsane", score: 250, correct: 5, date: "2026-03-19" }
      ];
      setLeaderboard(sampleData);
      localStorage.setItem('lilothoLeaderboard', JSON.stringify(sampleData));
    }
  }, []);

  const startGame = () => {
    if (!playerName.trim()) {
      alert("Ka kopo, kenya lebitso la hao!");
      return;
    }
    setShowNameInput(false);
    setShowGame(true);
    setScore(0);
    setStreak(0);
    setRiddleCount(0);
    setGameOver(false);
    setFeedback('');
    pickRandomRiddle();
  };

  const pickRandomRiddle = () => {
    const randomIndex = Math.floor(Math.random() * riddles.length);
    const riddle = riddles[randomIndex];
    setCurrentRiddle(riddle);
    setOptions(generateOptions(riddle.answer));
    setSelectedAnswer('');
  };

  const playCelebration = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 1500);
    
    if (streak + 1 >= 3) {
      setShowFireworks(true);
      setTimeout(() => setShowFireworks(false), 2000);
    }
    
    setCorrectAnimation(true);
    setTimeout(() => setCorrectAnimation(false), 500);
    
    if (correctSoundRef.current) {
      correctSoundRef.current();
    }
    
    if (streakSoundRef.current && streak + 1 >= 3) {
      streakSoundRef.current(streak + 1);
    }
  };

  const checkAnswer = (selected) => {
    if (!currentRiddle) return;

    const isCorrect = selected === currentRiddle.answer;
    
    if (isCorrect) {
      const points = 25 + (streak * 5);
      const newScore = score + points;
      setScore(newScore);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setRiddleCount(riddleCount + 1);
      
      playCelebration();
      
      let feedbackMessage = `✅ U nepile! +${points} lintlha!`;
      if (newStreak >= 3) {
        feedbackMessage += ` 🔥 Letoto la ${newStreak}!`;
      }
      if (newStreak >= 5) {
        feedbackMessage += ` ⭐ Lets'oao la bohlale!`;
      }
      setFeedback(feedbackMessage);
      
      setTimeout(() => {
        setFeedback('');
        if (riddleCount + 1 < totalRiddles) {
          pickRandomRiddle();
        } else {
          endGame();
        }
      }, 1800);
    } else {
      if (wrongSoundRef.current) {
        wrongSoundRef.current();
      }
      
      setFeedback(`❌ U fositse! Karabo e nepahetseng ke: "${currentRiddle.answer}"`);
      setTimeout(() => {
        endGame();
      }, 2500);
    }
  };

  const endGame = () => {
    setGameOver(true);
    saveScore();
  };

  const saveScore = () => {
    const newScore = {
      name: playerName,
      score: score,
      correct: riddleCount,
      total: totalRiddles,
      date: new Date().toISOString().split('T')[0]
    };
    
    const updatedLeaderboard = [...leaderboard, newScore];
    updatedLeaderboard.sort((a, b) => b.score - a.score);
    const top10 = updatedLeaderboard.slice(0, 10);
    
    setLeaderboard(top10);
    localStorage.setItem('lilothoLeaderboard', JSON.stringify(top10));
  };

  const resetGame = () => {
    setShowGame(false);
    setShowNameInput(true);
    setPlayerName('');
    setScore(0);
    setStreak(0);
    setRiddleCount(0);
    setGameOver(false);
  };

  const playAgain = () => {
    setGameOver(false);
    setScore(0);
    setStreak(0);
    setRiddleCount(0);
    setFeedback('');
    pickRandomRiddle();
  };

  return (
    <section id="game-section" className="game-section">
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 2 + 's',
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                width: Math.random() * 10 + 5 + 'px',
                height: Math.random() * 10 + 5 + 'px'
              }}
            />
          ))}
        </div>
      )}
      
      {showFireworks && (
        <div className="fireworks-container">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="firework"
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 80 + 10 + '%',
                animationDelay: Math.random() * 1 + 's',
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 60%)`
              }}
            />
          ))}
        </div>
      )}
      
      <div className="container">
        <div className="game-content">
          <h2>🎭 Lilotho</h2>
          <p className="game-description">Papali ea Maele a Basotho</p>
          
          <div className="leaderboard">
            <h3>🏆 Lethathamo la Bahlōli</h3>
            <div className="leaderboard-list">
              {leaderboard.slice(0, 5).map((player, index) => (
                <div key={index} className="leaderboard-item">
                  <span className="rank">{index + 1}</span>
                  <span className="player-name">{player.name}</span>
                  <span className="player-score">{player.score} pts</span>
                </div>
              ))}
            </div>
            <div className="game-quote">
              <p>"Me n't soare ke nye"</p>
            </div>
          </div>

          {showNameInput && !showGame && (
            <div className="name-input-container">
              <input
                type="text"
                placeholder="Lebitso la hao"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="name-input"
                onKeyPress={(e) => e.key === 'Enter' && startGame()}
              />
              <button className="game-button" onClick={startGame}>
                Qala Papali
              </button>
            </div>
          )}

          {showGame && !gameOver && currentRiddle && (
            <div className={`game-area ${correctAnimation ? 'correct-animation' : ''}`}>
              <div className="game-header">
                <div className="score">🎯 Lintlha: {score}</div>
                <div className={`streak ${streak >= 3 ? 'streak-active' : ''}`}>
                  🔥 Letoto: {streak}
                  {streak >= 3 && <span className="streak-bonus"> +{streak * 5} bonus!</span>}
                </div>
                <div className="riddle-count">📖 Lilotho: {riddleCount + 1}/{totalRiddles}</div>
              </div>
              
              <div className="riddle-conversation">
                <div className="speech-bubble setter">
                  <strong>Kao lotha!</strong>
                </div>
                <div className="speech-bubble responder">
                  <strong>Ka eng?</strong>
                </div>
              </div>
              
              <div className="riddle-box">
                <div className="riddle-text">{currentRiddle.sesotho}</div>
              </div>
              
              <div className="options-container">
                {options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-btn ${selectedAnswer === option ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedAnswer(option);
                      checkAnswer(option);
                    }}
                    disabled={feedback !== ''}
                  >
                    {option}
                  </button>
                ))}
              </div>
              
              {feedback && (
                <div className={`feedback ${feedback.includes('✅') ? 'correct' : 'incorrect'}`}>
                  {feedback}
                </div>
              )}
            </div>
          )}

          {gameOver && (
            <div className="game-over">
              <h3>🎉 Papali e Felile! 🎉</h3>
              <div className="final-score">
                <span>Lintlha tsa ho Qetela:</span>
                <strong>{score} points</strong>
              </div>
              <div className="correct-count">
                <span>Likarabo tse Nepahetseng:</span>
                <strong>{riddleCount}/{totalRiddles}</strong>
              </div>
              {riddleCount === totalRiddles && (
                <div className="perfect-game">
                  ⭐ KE SETSEBI SA LILOTHO! ⭐
                </div>
              )}
              <div className="game-over-buttons">
                <button className="play-again-btn" onClick={playAgain}>
                  🎮 Bapala Hape
                </button>
                <button className="reset-btn" onClick={resetGame}>
                  👤 Motho e Mocha
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default GameSection;