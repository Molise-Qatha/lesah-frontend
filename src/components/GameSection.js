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
  const [gameMode, setGameMode] = useState('lilotho'); // 'lilotho' or 'english'
  
  const correctSoundRef = useRef(null);
  const wrongSoundRef = useRef(null);
  const streakSoundRef = useRef(null);

  // ----- Audio Setup -----
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

  // ----- Riddle Databases -----
  const lilothoRiddles = [
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

  const englishRiddles = [
    { question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", answer: "echo", difficulty: "medium", hint: "You might hear me in a canyon." },
    { question: "The more you take, the more you leave behind. What am I?", answer: "footsteps", difficulty: "medium", hint: "You make them when you walk." },
    { question: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?", answer: "map", difficulty: "hard", hint: "It's a representation of the world." },
    { question: "What is so fragile that saying its name breaks it?", answer: "silence", difficulty: "easy", hint: "It is the absence of sound." },
    { question: "I'm tall when I'm young and short when I'm old. What am I?", answer: "candle", difficulty: "easy", hint: "I provide light and melt over time." },
    { question: "What has keys but can't open locks?", answer: "piano", difficulty: "easy", hint: "It makes music." },
    { question: "What has hands but can't clap?", answer: "clock", difficulty: "easy", hint: "It tells the time." },
    { question: "What has a head, a tail, is brown, and has no legs?", answer: "penny", difficulty: "easy", hint: "It's a coin." },
    { question: "What comes once in a minute, twice in a moment, but never in a thousand years?", answer: "m", difficulty: "medium", hint: "It's the 13th letter of the alphabet." },
    { question: "What has many teeth but can't bite?", answer: "comb", difficulty: "easy", hint: "It's used to style hair." },
    { question: "What has one eye but can't see?", answer: "needle", difficulty: "easy", hint: "It's used for sewing." },
    { question: "What gets wetter the more it dries?", answer: "towel", difficulty: "easy", hint: "You use it after a shower." },
    { question: "I have branches, but no fruit, trunk, or leaves. What am I?", answer: "bank", difficulty: "medium", hint: "It deals with money." },
    { question: "What can you break, even if you never pick it up or touch it?", answer: "promise", difficulty: "medium", hint: "It's an assurance you give to someone." },
    { question: "What is always in front of you but can't be seen?", answer: "future", difficulty: "medium", hint: "It hasn't happened yet." },
    { question: "What has a neck but no head?", answer: "bottle", difficulty: "easy", hint: "It often holds liquids." },
    { question: "What is full of holes but still holds water?", answer: "sponge", difficulty: "easy", hint: "It's used for cleaning." },
    { question: "What goes up but never comes down?", answer: "age", difficulty: "easy", hint: "It increases every year on your birthday." },
    { question: "What can run but never walks, has a mouth but never talks, has a head but never weeps, has a bed but never sleeps?", answer: "river", difficulty: "hard", hint: "It's a flowing body of water." },
    { question: "I'm light as a feather, yet the strongest person can't hold me for five minutes. What am I?", answer: "breath", difficulty: "medium", hint: "It's what you're doing right now to stay alive." },
    { question: "What has words but never speaks?", answer: "book", difficulty: "easy", hint: "You can read me." },
    { question: "What belongs to you, but other people use it more than you do?", answer: "name", difficulty: "medium", hint: "It's what people call you." },
    { question: "I follow you all day long, but disappear when the sun goes down. What am I?", answer: "shadow", difficulty: "easy", hint: "I'm a dark shape on the ground." },
    { question: "What has 13 hearts but no other organs?", answer: "deck of cards", difficulty: "hard", hint: "It's used for playing games." },
    { question: "What can you catch but not throw?", answer: "cold", difficulty: "easy", hint: "It makes you sneeze." },
    { question: "What has to be broken before you can use it?", answer: "egg", difficulty: "easy", hint: "You usually eat it for breakfast." },
    { question: "I'm found in socks, scarves and mittens; and often in the paws of playful kittens. What am I?", answer: "yarn", difficulty: "medium", hint: "Cats love playing with it." },
    { question: "What has a heart that doesn't beat?", answer: "artichoke", difficulty: "medium", hint: "It's a vegetable." },
    { question: "What can travel around the world while staying in one spot?", answer: "stamp", difficulty: "easy", hint: "It's used on letters." },
    { question: "What has legs but doesn't walk?", answer: "table", difficulty: "easy", hint: "Furniture." },
    { question: "What has a ring but no finger?", answer: "phone", difficulty: "easy", hint: "It makes calls." },
    { question: "What kind of room has no doors or windows?", answer: "mushroom", difficulty: "easy", hint: "It's a fungus." },
    { question: "What goes up and down but doesn't move?", answer: "stairs", difficulty: "easy", hint: "You use them to change floors." },
    { question: "What begins with T, ends with T, and has T in it?", answer: "teapot", difficulty: "medium", hint: "You pour from it." },
    { question: "The more of this there is, the less you see. What is it?", answer: "darkness", difficulty: "easy", hint: "It comes at night." },
    { question: "What has an eye but cannot see?", answer: "hurricane", difficulty: "medium", hint: "It's a storm." },
    { question: "What is always running but never tired?", answer: "clock", difficulty: "easy", hint: "It tells time." },
    { question: "What can fill a room but takes up no space?", answer: "light", difficulty: "easy", hint: "You turn it on." },
    { question: "What has four wheels and flies?", answer: "garbage truck", difficulty: "medium", hint: "It collects trash." },
    { question: "What has a bottom at the top?", answer: "legs", difficulty: "medium", hint: "Part of your body." },
    { question: "What runs all around a backyard, yet never moves?", answer: "fence", difficulty: "medium", hint: "It surrounds things." },
    { question: "What can you hold in your right hand, but never in your left?", answer: "left hand", difficulty: "hard", hint: "Think carefully." },
    { question: "What gets bigger the more you take away?", answer: "hole", difficulty: "easy", hint: "Digging makes it larger." },
    { question: "What is always coming but never arrives?", answer: "tomorrow", difficulty: "medium", hint: "It's always one day away." },
    { question: "What has one head, one foot, and four legs?", answer: "bed", difficulty: "medium", hint: "You sleep on it." },
    { question: "What can you keep after giving to someone?", answer: "word", difficulty: "medium", hint: "You promise it." },
    { question: "What has a face and two hands but no arms or legs?", answer: "clock", difficulty: "easy", hint: "Time related." },
    { question: "What has many keys but can't open doors?", answer: "keyboard", difficulty: "easy", hint: "You type on it." },
    { question: "What comes down but never goes up?", answer: "rain", difficulty: "easy", hint: "Weather." },
    { question: "What has an endless supply of letters but starts empty?", answer: "mailbox", difficulty: "medium", hint: "Near your house." },
    { question: "What is easy to lift but hard to throw?", answer: "feather", difficulty: "easy", hint: "Very light." },
    { question: "What has a thumb and four fingers but is not alive?", answer: "glove", difficulty: "easy", hint: "You wear it." },
    { question: "What gets sharper the more you use it?", answer: "brain", difficulty: "medium", hint: "Thinking improves it." },
    { question: "What can fly without wings?", answer: "time", difficulty: "medium", hint: "It passes quickly." },
    { question: "I shave every day, but my beard stays the same. What am I?", answer: "barber", difficulty: "hard", hint: "It's a profession." },
    { question: "You see a boat filled with people, yet there isn't a single person on board. How is that possible?", answer: "all married", difficulty: "hard", hint: "Single means unmarried." },
    { question: "What can't be put in a saucepan?", answer: "its lid", difficulty: "hard", hint: "Think about parts of cookware." },
    { question: "The person who makes it sells it. The person who buys it never uses it. The person who uses it never knows they're using it. What is it?", answer: "coffin", difficulty: "hard", hint: "Associated with funerals." },
    { question: "What can bring back the dead, make you cry, make you laugh, make you young, is born in an instant yet lasts a lifetime?", answer: "memory", difficulty: "hard", hint: "It's in your mind." },
    { question: "What has many needles, but doesn't sew?", answer: "pine tree", difficulty: "hard", hint: "It's a type of tree." },
    { question: "Forward I am heavy, but backward I am not. What am I?", answer: "ton", difficulty: "hard", hint: "Reverse spelling." },
    { question: "What begins and has no end, and is the ending of all that begins?", answer: "death", difficulty: "hard", hint: "Inevitable." },
    { question: "I have no life, but I can die. What am I?", answer: "battery", difficulty: "hard", hint: "Used in electronics." },
    { question: "What can you hold without touching it?", answer: "conversation", difficulty: "hard", hint: "You do it when you talk." },
    { question: "What has no beginning, end, or middle?", answer: "circle", difficulty: "hard", hint: "Shape." },
    { question: "What has a neck but no head, two arms but no hands?", answer: "shirt", difficulty: "hard", hint: "Clothing." },
    { question: "I am not alive, but I grow. I don't have lungs, but I need air. What am I?", answer: "fire", difficulty: "hard", hint: "Hot and dangerous." },
    { question: "I can be cracked, made, told, and played. What am I?", answer: "joke", difficulty: "hard", hint: "Funny." },
    { question: "What comes once in a year, twice in a week, but never in a day?", answer: "e", difficulty: "hard", hint: "It's a letter." },
    { question: "I fly without wings, cry without eyes. Wherever I go, darkness flies. What am I?", answer: "cloud", difficulty: "hard", hint: "Sky." },
    { question: "What has many rings but no fingers?", answer: "tree", difficulty: "hard", hint: "Age indicator." }
  ];

  // ----- Helper Functions -----
  const generateOptions = (correctAnswer, sourceRiddles) => {
    const allPossibleAnswers = sourceRiddles.map(r => r.answer);
    const wrongAnswers = allPossibleAnswers
      .filter(a => a.toLowerCase() !== correctAnswer.toLowerCase())
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    
    const allOptions = [correctAnswer, ...wrongAnswers];
    return allOptions.sort(() => 0.5 - Math.random());
  };

  // ----- Leaderboard Initialization -----
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

  // ----- Game Flow -----
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
    const source = gameMode === 'lilotho' ? lilothoRiddles : englishRiddles;
    const randomIndex = Math.floor(Math.random() * source.length);
    const riddle = source[randomIndex];
    setCurrentRiddle(riddle);
    setOptions(generateOptions(riddle.answer, source));
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
    
    if (correctSoundRef.current) correctSoundRef.current();
    if (streakSoundRef.current && streak + 1 >= 3) streakSoundRef.current(streak + 1);
  };

  const earnPoints = async (pointsEarned) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/v1/game/lilotho/points`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ points: pointsEarned }),
      });
    } catch (error) {
      console.error('Failed to save points:', error);
    }
  };

  const checkAnswer = (selected) => {
    if (!currentRiddle) return;
    const isCorrect = selected.toLowerCase() === currentRiddle.answer.toLowerCase();
    
    if (isCorrect) {
      const basePoints = gameMode === 'lilotho' ? 25 : 40;
      const points = basePoints + (streak * 5);
      const newScore = score + points;
      setScore(newScore);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setRiddleCount(riddleCount + 1);
      
      playCelebration();
      earnPoints(points);
      
      let feedbackMessage = `✅ U nepile! +${points} lintlha!`;
      if (newStreak >= 3) feedbackMessage += ` 🔥 Letoto la ${newStreak}!`;
      if (newStreak >= 5) feedbackMessage += ` ⭐ Lets'oao la bohlale!`;
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
      if (wrongSoundRef.current) wrongSoundRef.current();
      setFeedback(`❌ U fositse! Karabo e nepahetseng ke: "${currentRiddle.answer}"`);
      setTimeout(() => endGame(), 2500);
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
    setFeedback('');
  };

  const playAgain = () => {
    setGameOver(false);
    setScore(0);
    setStreak(0);
    setRiddleCount(0);
    setFeedback('');
    pickRandomRiddle();
  };

  // ----- Render -----
  return (
    <section id="game-section" className="game-section">
      {showConfetti && (
        <div className="confetti-container">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="confetti" style={{
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 2 + 's',
              backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
              width: Math.random() * 10 + 5 + 'px',
              height: Math.random() * 10 + 5 + 'px'
            }} />
          ))}
        </div>
      )}
      
      {showFireworks && (
        <div className="fireworks-container">
          {[...Array(30)].map((_, i) => (
            <div key={i} className="firework" style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 80 + 10 + '%',
              animationDelay: Math.random() * 1 + 's',
              backgroundColor: `hsl(${Math.random() * 360}, 100%, 60%)`
            }} />
          ))}
        </div>
      )}
      
      <div className="container">
        <div className="game-content">
          <h2>🎭 Lilotho</h2>
          <p className="game-description">Papali ea Maele a Basotho</p>
          
          {/* Leaderboard */}
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
              <div className="mode-selector">
                <button className={gameMode === 'lilotho' ? 'active' : ''} onClick={() => setGameMode('lilotho')}>
                  🇱🇸 Lilotho (Sesotho)
                </button>
                <button className={gameMode === 'english' ? 'active' : ''} onClick={() => setGameMode('english')}>
                  🧠 Mind Benders (English)
                </button>
              </div>
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
                <button className="back-button" onClick={resetGame} title="Khutlela morao">
                  ← Khutlela
                </button>
              </div>
              
              <div className="riddle-conversation">
                <div className="speech-bubble setter"><strong>Kao lotha!</strong></div>
                <div className="speech-bubble responder"><strong>Ka eng?</strong></div>
              </div>
              
              <div className="riddle-box">
                <div className="riddle-text">
                  {gameMode === 'lilotho' ? currentRiddle.sesotho : currentRiddle.question}
                </div>
                {gameMode === 'english' && currentRiddle.hint && (
                  <div className="riddle-hint">💡 Hint: {currentRiddle.hint}</div>
                )}
              </div>
              
              <div className="options-container">
                {options.map((option, index) => (
                  <button
                    key={index}
                    className={`option-btn ${selectedAnswer === option ? 'selected' : ''}`}
                    onClick={() => { setSelectedAnswer(option); checkAnswer(option); }}
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
                <div className="perfect-game">⭐ KE SETSEBI SA LILOTHO! ⭐</div>
              )}
              <div className="game-over-buttons">
                <button className="play-again-btn" onClick={playAgain}>🎮 Bapala Hape</button>
                <button className="reset-btn" onClick={resetGame}>👤 Motho e Mocha</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default GameSection;
