import { useState } from "react";
import { Car } from "./components/Car";
import { ComparisonPage } from "./components/ComparisonPage";
import { HeaderNav } from "./components/HeaderNav";
import { SimulationPage } from "./components/SimulationPage";
import {
  algorithmLabels,
  defaultBlocks,
  defaultProcesses,
  generateQuizQuestions,
  buildExplanation,
} from "./simulationEngine";
import type {
  Algorithm,
  AnswerRecord,
  Difficulty,
  MemoryBlock,
  MemoryProcess,
  Page,
  QuizItem,
} from "./types";

const difficultyNames: Record<Difficulty, string> = {
  easy: "Mudah",
  medium: "Sedang",
  hard: "Sulit",
};

function Back({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="back" onClick={onClick}>
      ← Kembali
    </button>
  );
}

const lessons = [
  {
    title: "Apa Itu Memory Allocation?",
    text: "Memory allocation adalah cara komputer menyediakan ruang untuk program yang sedang berjalan.",
    visual: (
      <div className="analogy">
        <b>Memori</b>
        <span>Area parkir</span>
        <b>Block</b>
        <span>Tempat parkir</span>
        <b>Process</b>
        <span>Mobil</span>
      </div>
    ),
  },
  {
    title: "Memahami Ukuran Memori",
    text: "Ukuran dihitung dalam KB. Slot 100 KB dapat menampung mobil 70 KB, sehingga ada sisa 30 KB.",
    visual: (
      <div className="capacity">
        <span>70 KB terpakai</span>
        <i>30 KB sisa</i>
      </div>
    ),
  },
  {
    title: "First Fit",
    text: "Mobil memilih slot pertama yang cukup, sesuai urutan pemeriksaan dari awal.",
    visual: (
      <div className="mini-slots">
        <span>50</span>
        <strong>200 ✓</strong>
        <span>300</span>
      </div>
    ),
  },
  {
    title: "Best Fit",
    text: "Mobil memilih slot terkecil yang masih cukup agar ruang tersisa sesedikit mungkin.",
    visual: (
      <div className="mini-slots">
        <span>300</span>
        <strong>120 ✓</strong>
        <span>500</span>
      </div>
    ),
  },
  {
    title: "Worst Fit",
    text: "Mobil memilih slot terbesar yang masih cukup, sehingga menyisakan ruang paling besar.",
    visual: (
      <div className="mini-slots">
        <span>120</span>
        <span>300</span>
        <strong>500 ✓</strong>
      </div>
    ),
  },
  {
    title: "Memahami Hasil",
    text: "Berhasil berarti mobil mendapat satu slot. Gagal berarti tidak ada slot kosong yang cukup. Dalam fixed partition, satu slot hanya untuk satu mobil.",
    visual: (
      <div className="result-visual">
        <span>Berhasil dialokasikan</span>
        <span>Gagal dialokasikan</span>
      </div>
    ),
  },
];

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [lesson, setLesson] = useState(0);

  // Shared blocks and processes data for Simulation & Comparison
  const [blocks, setBlocks] = useState<MemoryBlock[]>(defaultBlocks);
  const [processes, setProcesses] = useState<MemoryProcess[]>(defaultProcesses);

  // Quiz states
  const [algorithm, setAlgorithm] = useState<Algorithm>("first");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [questions, setQuestions] = useState<QuizItem[]>(() =>
    generateQuizQuestions("easy", "first"),
  );
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [selected, setSelected] = useState<number | undefined>(undefined);

  const currentQ = questions[step] || questions[0];
  const score = answers.filter((answer) => answer.correct).length;

  function go(next: Page) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startQuiz(newQuestion = false) {
    if (newQuestion) {
      setQuestions(generateQuizQuestions(difficulty, algorithm));
    }
    setStep(0);
    setAnswers([]);
    setSelected(undefined);
    go("quiz");
  }

  function chooseQuizOption(index: number) {
    setSelected(index);
  }

  function submitQuizAnswer() {
    if (selected === undefined) return;
    const q = questions[step];
    const choice = selected;
    const correct = choice === q.expected;
    const remainder = q.blocks[q.expected] - q.processSize;
    const nextAnswers: AnswerRecord[] = [
      ...answers,
      {
        questionIndex: step,
        processSize: q.processSize,
        blocks: q.blocks,
        choice,
        expected: q.expected,
        correct,
        remainder,
      },
    ];
    setAnswers(nextAnswers);
    if (step + 1 >= questions.length) {
      go("result");
      return;
    }
    setStep(step + 1);
    setSelected(undefined);
  }

  return (
    <main>
      <HeaderNav currentPage={page} onNavigate={go} />

      {/* 1. HOME / BERANDA */}
      {page === "home" && (
        <section className="home">
          <div className="hero-copy">
            <p className="eyebrow">APLIKASI SIMULASI SISTEM OPERASI</p>
            <h1>Belajar Memori, Yuk Parkirkan Mobil!</h1>
            <p className="lead">
              Pahami cara komputer mengatur memori lewat permainan parkir mobil. Eksplorasi materi
              belajar, jalankan simulasi alokasi langkah demi langkah, bandingkan kinerja algoritma,
              dan uji pemahamanmu lewat kuis interaktif.
            </p>
          </div>

          <div className="hero-park" aria-hidden="true">
            <div className="sign">
              MEMORY
              <br />
              PARK
            </div>
            <div className="road-line" />
            <Car index={0} />
            <Car index={1} />
          </div>

          <div className="choice-grid four-grid">
            <article className="choice">
              <div className="book-art">
                <span />
                <span />
              </div>
              <div>
                <p className="choice-number">PILIHAN 01</p>
                <h2>Belajar Materi</h2>
                <p>
                  Kenali konsep memory allocation dan cara kerja First Fit, Best Fit, serta Worst
                  Fit.
                </p>
              </div>
              <button type="button" className="primary" onClick={() => go("learn")}>
                Mulai Belajar <span>→</span>
              </button>
            </article>

            <article className="choice highlight-choice">
              <div className="choice-car-art">
                <Car index={0} />
              </div>
              <div>
                <p className="choice-number featured-number">PILIHAN 02 · FITUR UTAMA</p>
                <h2>Simulasi Memori</h2>
                <p>
                  Atur blok memori & proses sendiri. Amati pergerakan mobil masuk slot langkah demi
                  langkah.
                </p>
              </div>
              <button type="button" className="primary coral" onClick={() => go("simulation")}>
                Buka Simulasi <span>→</span>
              </button>
            </article>

            <article className="choice">
              <div className="choice-car-art">
                <Car index={2} />
              </div>
              <div>
                <p className="choice-number">PILIHAN 03</p>
                <h2>Perbandingan Kinerja</h2>
                <p>
                  Bandingkan efisiensi, fragmentasi, dan keberhasilan ketiga algoritma dalam tabel &
                  grafik.
                </p>
              </div>
              <button type="button" className="primary" onClick={() => go("comparison")}>
                Lihat Perbandingan <span>→</span>
              </button>
            </article>

            <article className="choice">
              <div className="choice-car-art">
                <Car index={4} />
              </div>
              <div>
                <p className="choice-number">PILIHAN 04</p>
                <h2>Latihan / Kuis</h2>
                <p>Uji kemampuan analisismu dengan kuis alokasi memori 4 pilihan tanpa clue.</p>
              </div>
              <button type="button" className="primary" onClick={() => go("setup")}>
                Mulai Latihan <span>→</span>
              </button>
            </article>
          </div>
        </section>
      )}

      {/* 2. BELAJAR MATERI */}
      {page === "learn" && (
        <section className="page narrow">
          <Back onClick={() => (lesson ? setLesson(lesson - 1) : go("home"))} />
          <div className="progress-head">
            <span>Materi {lesson + 1} dari 6</span>
            <button type="button" className="text-button" onClick={() => go("simulation")}>
              Langsung Coba Simulasi
            </button>
          </div>
          <div className="progress">
            <i style={{ width: `${((lesson + 1) / 6) * 100}%` }} />
          </div>
          <article className="lesson-card">
            <div className="lesson-visual">{lessons[lesson].visual}</div>
            <p className="eyebrow">MATERI {String(lesson + 1).padStart(2, "0")}</p>
            <h1>{lessons[lesson].title}</h1>
            <p className="lead">{lessons[lesson].text}</p>
            {lesson === 1 && (
              <p className="note">
                <b>Model simulator:</b> Fixed Partition Allocation. Satu process menempati satu
                block dan block tidak dibagikan lagi. Sisa ruang dihitung sebagai internal
                fragmentation.
              </p>
            )}
          </article>
          <div className="lesson-actions">
            <button
              type="button"
              className="secondary"
              disabled={lesson === 0}
              onClick={() => setLesson(lesson - 1)}
            >
              Sebelumnya
            </button>
            {lesson < 5 ? (
              <button type="button" className="primary" onClick={() => setLesson(lesson + 1)}>
                Selanjutnya →
              </button>
            ) : (
              <button type="button" className="primary coral" onClick={() => go("simulation")}>
                Mulai Simulasi Interaktif →
              </button>
            )}
          </div>
        </section>
      )}

      {/* 3. SIMULASI MEMORI (FITUR UTAMA) */}
      {page === "simulation" && (
        <section className="page full-page">
          <SimulationPage
            blocks={blocks}
            setBlocks={setBlocks}
            processes={processes}
            setProcesses={setProcesses}
            onGoComparison={() => go("comparison")}
          />
        </section>
      )}

      {/* 4. PERBANDINGAN KINERJA ALGORITMA */}
      {page === "comparison" && (
        <section className="page full-page">
          <ComparisonPage
            blocks={blocks}
            processes={processes}
            onGoSimulation={() => go("simulation")}
            onGoQuiz={() => go("setup")}
          />
        </section>
      )}

      {/* 5. SETUP KUIS / LATIHAN */}
      {page === "setup" && (
        <section className="page narrow">
          <Back onClick={() => go("home")} />
          <div className="page-title">
            <p className="eyebrow">SIAPKAN TANTANGAN</p>
            <h1>Pilih Mode Latihanmu</h1>
            <p>Pilih aturan parkir dan tingkat kesulitan. Soal dibuat baru setiap kali bermain.</p>
          </div>
          <h2 className="section-label">1. Algoritma yang dilatih</h2>
          <div className="mode-grid algorithm-modes">
            {(
              [
                ["first", "First Fit", "Slot cukup pertama"],
                ["best", "Best Fit", "Slot cukup terkecil"],
                ["worst", "Worst Fit", "Slot cukup terbesar"],
              ] as const
            ).map(([id, name, text]) => (
              <button
                key={id}
                type="button"
                className={`mode-card ${algorithm === id ? "selected" : ""}`}
                onClick={() => setAlgorithm(id)}
              >
                <span className="algo-letter">{name[0]}</span>
                <b>{name}</b>
                <small>{text}</small>
                <i>{algorithm === id ? "Dipilih" : "Pilih"}</i>
              </button>
            ))}
          </div>
          <h2 className="section-label">2. Tingkat kesulitan</h2>
          <div className="mode-grid difficulty-modes">
            {(
              [
                ["easy", "Mudah", "5 soal · Angka bulat & selisih jelas"],
                ["medium", "Sedang", "5 soal · 4 slot variatif & ketat"],
                ["hard", "Sulit", "5 soal · 4 slot menantang & selisih tipis"],
              ] as const
            ).map(([id, name, text]) => (
              <button
                key={id}
                type="button"
                className={`difficulty-card ${difficulty === id ? "selected" : ""}`}
                onClick={() => setDifficulty(id)}
              >
                <b>{name}</b>
                <span>{text}</span>
              </button>
            ))}
          </div>
          <button type="button" className="primary full start-quiz" onClick={() => startQuiz(true)}>
            Mulai Tantangan Kuis →
          </button>
        </section>
      )}

      {/* 6. QUIZ RUNNER (4 OPSI, NO CLUE, DESKTOP SINGLE SCREEN) */}
      {page === "quiz" && (
        <section className="page quiz-page">
          <div className="quiz-layout">
            <aside className="quiz-sidebar">
              <Back onClick={() => go("setup")} />
              <p className="eyebrow">
                SOAL {step + 1} DARI {questions.length}
              </p>
              <div className="progress">
                <i
                  style={{
                    width: `${((step + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
              <span className="quiz-mode">
                {algorithmLabels[algorithm]} · {difficultyNames[difficulty]}
              </span>
              <h1>Pilih slot memori yang tepat untuk proses ini.</h1>
              <div className="current-process">
                <Car index={step} />
                <div>
                  <span>PROSES P{step + 1}</span>
                  <strong>{currentQ?.processSize} KB</strong>
                </div>
              </div>
              <div className="algorithm-hint exam-note">
                <b>Mode Latihan Kuis</b>
                <p>
                  Pilih salah satu dari 4 slot. Hasil, nilai, dan pembahasan lengkap akan
                  ditampilkan setelah semua soal selesai.
                </p>
              </div>
            </aside>
            <div className="quiz-workspace">
              <div className="workspace-heading">
                <div>
                  <p className="eyebrow">AREA PARKIR MEMORI</p>
                  <h2>4 Pilihan Slot Memori</h2>
                </div>
                <span>Pilih 1 dari 4 slot</span>
              </div>
              <QuizParking
                blocks={currentQ ? currentQ.blocks : []}
                selected={selected}
                onChoose={chooseQuizOption}
              />
            </div>
          </div>
          <footer className="quiz-actions">
            <div>
              <p>
                {selected === undefined
                  ? "Pilih salah satu dari 4 slot di atas untuk melanjutkan."
                  : `Slot ${String.fromCharCode(65 + selected)} (${
                      currentQ?.blocks[selected]
                    } KB) dipilih. Klik tombol untuk menyimpan jawaban.`}
              </p>
            </div>
            <button
              type="button"
              className="primary"
              disabled={selected === undefined}
              onClick={submitQuizAnswer}
            >
              {step + 1 === questions.length ? "Selesai & Lihat Hasil →" : "Soal Berikutnya →"}
            </button>
          </footer>
        </section>
      )}

      {/* 7. HASIL EVALUASI KUIS */}
      {page === "result" && (
        <section className="page">
          <div className="result-hero">
            <p className="eyebrow">TANTANGAN SELESAI</p>
            <h1>Hasil Evaluasi Latihan</h1>
            <div className="score-ring">
              <strong>{Math.round((score / questions.length) * 100)}</strong>
              <span>NILAI AKHIR</span>
            </div>
            <p>
              Kamu menjawab benar{" "}
              <b>
                {score} dari {questions.length}
              </b>{" "}
              soal.
            </p>
          </div>
          <div className="stats">
            <div>
              <strong>{score}</strong>
              <span>Jawaban benar</span>
            </div>
            <div>
              <strong>{questions.length - score}</strong>
              <span>Jawaban salah</span>
            </div>
            <div>
              <strong>
                {algorithmLabels[algorithm]} ({difficultyNames[difficulty]})
              </strong>
              <span>Mode yang Diuji</span>
            </div>
          </div>
          <h2 className="review-title">Pembahasan Setiap Soal</h2>
          <div className="review-list">
            {answers.map((ans, idx) => {
              const userLetter = String.fromCharCode(65 + ans.choice);
              const correctLetter = String.fromCharCode(65 + ans.expected);
              const explanation = buildExplanation(
                ans.blocks,
                ans.processSize,
                algorithm,
                ans.choice,
                ans.expected,
              );

              return (
                <article key={idx} className="review-card">
                  <div className="review-header">
                    <div className="review-meta">
                      <Car index={idx} small />
                      <div>
                        <h3>
                          Soal {idx + 1}: Proses P{idx + 1} ({ans.processSize} KB)
                        </h3>
                        <p className="algo-badge">Metode: {algorithmLabels[algorithm]}</p>
                      </div>
                    </div>
                    <span
                      className={`review-status ${ans.correct ? "status-correct" : "status-wrong"}`}
                    >
                      {ans.correct ? "Benar" : "Salah"}
                    </span>
                  </div>

                  <div className="review-options-grid">
                    {ans.blocks.map((cap, bIdx) => {
                      const letter = String.fromCharCode(65 + bIdx);
                      const isExpected = bIdx === ans.expected;
                      const isChoice = bIdx === ans.choice;
                      return (
                        <div
                          key={bIdx}
                          className={`review-option-pill ${
                            isExpected ? "pill-expected" : isChoice ? "pill-user-wrong" : ""
                          }`}
                        >
                          <strong>
                            Slot {letter}: {cap} KB
                          </strong>
                          <span className="pill-tag">
                            {cap < ans.processSize
                              ? "Tidak cukup"
                              : `Cukup (sisa ${cap - ans.processSize} KB)`}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="review-details">
                    <p className="user-answer-line">
                      <strong>Jawabanmu:</strong> Slot {userLetter} ({ans.blocks[ans.choice]} KB)
                    </p>
                    <p className="correct-answer-line">
                      <strong>Kunci Jawaban:</strong> Slot {correctLetter} (
                      {ans.blocks[ans.expected]} KB)
                    </p>
                    <p className="explanation-line">{explanation}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="bottom-actions">
            <button type="button" className="secondary" onClick={() => go("setup")}>
              ← Ganti Mode Kuis
            </button>
            <button type="button" className="primary" onClick={() => startQuiz(true)}>
              Coba Soal Baru ({algorithmLabels[algorithm]}) →
            </button>
            <button type="button" className="secondary" onClick={() => go("simulation")}>
              Buka Simulasi Memori ⚙
            </button>
          </div>
        </section>
      )}
    </main>
  );
}

function QuizParking({
  blocks,
  selected,
  onChoose,
}: {
  blocks: number[];
  selected: number | undefined;
  onChoose: (index: number) => void;
}) {
  return (
    <div className="parking quiz-parking">
      <div className="slots">
        {blocks.map((capacity, index) => {
          const letter = String.fromCharCode(65 + index);
          const isSelected = selected === index;
          return (
            <button
              key={index}
              type="button"
              onClick={() => onChoose(index)}
              className={`slot quiz-slot ${isSelected ? "selected" : ""}`}
            >
              <span className="slot-name">SLOT {letter}</span>
              <strong>{capacity} KB</strong>
              <span className="choose-slot">
                {isSelected ? "Jawaban dipilih" : `Pilih Slot ${letter}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
