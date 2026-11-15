import { useState } from "react"

type Page = "home" | "learn" | "setup" | "quiz" | "result"
type Algorithm = "first" | "best" | "worst"
type Difficulty = "easy" | "medium" | "hard"

export type QuizItem = {
  id: number
  processSize: number
  blocks: number[] // exactly 4 block capacities: Slot A, Slot B, Slot C, Slot D
  expected: number // index 0..3 of the correct block
}

export type AnswerRecord = {
  questionIndex: number
  processSize: number
  blocks: number[]
  choice: number // index 0..3 of user chosen block
  expected: number // index 0..3 of correct block
  correct: boolean
  remainder: number // blocks[expected] - processSize
}

const COLORS = [
  "#ef5d6c",
  "#4f8edc",
  "#f2b84b",
  "#7b61c9",
  "#38a887",
  "#e779b1",
]
const algorithmNames: Record<Algorithm, string> = {
  first: "First Fit",
  best: "Best Fit",
  worst: "Worst Fit",
}
const difficultyNames: Record<Difficulty, string> = {
  easy: "Mudah",
  medium: "Sedang",
  hard: "Sulit",
}

export function calculateExpected(
  blocks: number[],
  size: number,
  algorithm: Algorithm,
): number {
  const candidates = blocks
    .map((capacity, index) => ({ capacity, index }))
    .filter(({ capacity }) => capacity >= size)

  if (!candidates.length) return 0
  if (algorithm === "first") return candidates[0].index
  if (algorithm === "best") {
    return candidates.reduce((best, curr) =>
      curr.capacity < best.capacity ? curr : best,
    ).index
  }
  return candidates.reduce((worst, curr) =>
    curr.capacity > worst.capacity ? curr : worst,
  ).index
}

export function generateQuizQuestions(
  difficulty: Difficulty,
  algorithm: Algorithm,
): QuizItem[] {
  const configs = {
    easy: { processMin: 120, processMax: 300, step: 20 },
    medium: { processMin: 100, processMax: 450, step: 10 },
    hard: { processMin: 80, processMax: 600, step: 5 },
  }[difficulty]

  const questions: QuizItem[] = []

  for (let q = 0; q < 5; q++) {
    const pSize =
      Math.floor(
        Math.random() *
          ((configs.processMax - configs.processMin) / configs.step),
      ) *
        configs.step +
      configs.processMin

    const used = new Set<number>()
    const blocks: number[] = []

    // 1-2 blocks smaller than pSize (insufficient capacity)
    const smallCount = Math.random() > 0.5 ? 2 : 1
    let attempts = 0
    while (blocks.length < smallCount && attempts < 100) {
      attempts++
      const diff = (Math.floor(Math.random() * 5) + 1) * configs.step
      const cap = Math.max(40, pSize - diff)
      if (!used.has(cap) && cap < pSize) {
        used.add(cap)
        blocks.push(cap)
      }
    }

    // 2-3 blocks larger than or equal to pSize (sufficient capacity)
    attempts = 0
    while (blocks.length < 4 && attempts < 100) {
      attempts++
      const diff = (Math.floor(Math.random() * 12) + 1) * configs.step
      const cap = pSize + diff
      if (!used.has(cap)) {
        used.add(cap)
        blocks.push(cap)
      }
    }

    // Shuffle positions so correct answer varies among Slot A, B, C, D
    for (let i = blocks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[blocks[i], blocks[j]] = [blocks[j], blocks[i]]
    }

    const expected = calculateExpected(blocks, pSize, algorithm)
    questions.push({
      id: q,
      processSize: pSize,
      blocks,
      expected,
    })
  }

  return questions
}

export function buildExplanation(
  blocks: number[],
  processSize: number,
  algorithm: Algorithm,
  choice: number,
  expected: number,
) {
  const correctLetter = String.fromCharCode(65 + expected)
  const correctCap = blocks[expected]
  const remainder = correctCap - processSize

  const algoRule =
    algorithm === "first"
      ? `Algoritma First Fit menelusuri slot secara berurutan (A -> B -> C -> D) dan memilih slot pertama yang kapasitasnya mencukupi. Slot ${correctLetter} (${correctCap} KB) adalah slot pertama yang muat untuk proses ${processSize} KB.`
      : algorithm === "best"
        ? `Algoritma Best Fit mencari slot yang kapasitasnya mencukupi dengan sisa ruang paling kecil. Slot ${correctLetter} (${correctCap} KB) menyisakan ruang paling sedikit, yaitu ${remainder} KB.`
        : `Algoritma Worst Fit mencari slot yang kapasitasnya mencukupi dengan sisa ruang paling besar. Slot ${correctLetter} (${correctCap} KB) menyisakan ruang paling banyak, yaitu ${remainder} KB.`

  let userEvaluation = ""
  if (choice !== expected) {
    const userLetter = String.fromCharCode(65 + choice)
    const userCap = blocks[choice]
    if (userCap < processSize) {
      userEvaluation = ` Kamu memilih Slot ${userLetter} (${userCap} KB), namun kapasitasnya tidak cukup untuk menampung proses berukuran ${processSize} KB.`
    } else {
      userEvaluation = ` Kamu memilih Slot ${userLetter} (${userCap} KB). Walaupun kapasitasnya cukup, aturan ${algorithmNames[algorithm]} menentukan bahwa Slot ${correctLetter} adalah pilihan yang lebih tepat.`
    }
  }

  return `${algoRule}${userEvaluation}`
}

function Car({ index, small = false }: { index: number; small?: boolean }) {
  return (
    <div
      className={`car ${small ? "car-small" : ""}`}
      style={{ "--car": COLORS[index % COLORS.length] } as React.CSSProperties}
    >
      <span className="window" />
      <span className="window" />
      <span className="wheel left" />
      <span className="wheel right" />
    </div>
  )
}

function Back({ onClick }: { onClick: () => void }) {
  return (
    <button className="back" onClick={onClick}>
      ← Kembali
    </button>
  )
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
]

export default function App() {
  const [page, setPage] = useState<Page>("home")
  const [lesson, setLesson] = useState(0)
  const [algorithm, setAlgorithm] = useState<Algorithm>("first")
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [questions, setQuestions] = useState<QuizItem[]>(() =>
    generateQuizQuestions("easy", "first"),
  )
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [selected, setSelected] = useState<number | undefined>(undefined)

  const currentQ = questions[step] || questions[0]
  const score = answers.filter((answer) => answer.correct).length

  function go(next: Page) {
    setPage(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function start(newQuestion = false) {
    if (newQuestion) {
      setQuestions(generateQuizQuestions(difficulty, algorithm))
    }
    setStep(0)
    setAnswers([])
    setSelected(undefined)
    go("quiz")
  }

  function choose(index: number) {
    setSelected(index)
  }

  function submitAnswer() {
    if (selected === undefined) return
    const q = questions[step]
    const choice = selected
    const correct = choice === q.expected
    const remainder = q.blocks[q.expected] - q.processSize
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
    ]
    setAnswers(nextAnswers)
    if (step + 1 >= questions.length) {
      go("result")
      return
    }
    setStep(step + 1)
    setSelected(undefined)
  }

  return (
    <main>
      <header className="brand">
        <span className="brand-mark">P</span>
        <span>Memory Parking</span>
      </header>

      {page === "home" && (
        <section className="home">
          <div className="hero-copy">
            <p className="eyebrow">BELAJAR SISTEM OPERASI JADI SERU</p>
            <h1>Belajar Memori, Yuk Parkirkan Mobil!</h1>
            <p className="lead">
              Pahami cara komputer mengatur memori lewat permainan parkir mobil.
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
          <div className="choice-grid">
            <article className="choice">
              <div className="book-art">
                <span />
                <span />
              </div>
              <div>
                <p className="choice-number">PILIHAN 01</p>
                <h2>Belajar Materi</h2>
                <p>
                  Kenali konsep memory allocation dan algoritmanya sebelum
                  mencoba.
                </p>
              </div>
              <button className="primary" onClick={() => go("learn")}>
                Mulai Belajar <span>→</span>
              </button>
            </article>
            <article className="choice">
              <Car index={2} />
              <div>
                <p className="choice-number">PILIHAN 02</p>
                <h2>Langsung Latihan</h2>
                <p>
                  Kerjakan tantangan dan pilih slot parkir yang tepat untuk
                  setiap mobil.
                </p>
              </div>
              <button className="primary coral" onClick={() => go("setup")}>
                Mulai Latihan <span>→</span>
              </button>
            </article>
          </div>
        </section>
      )}

      {page === "learn" && (
        <section className="page narrow">
          <Back onClick={() => (lesson ? setLesson(lesson - 1) : go("home"))} />
          <div className="progress-head">
            <span>Materi {lesson + 1} dari 6</span>
            <button className="text-button" onClick={() => go("setup")}>
              Langsung Latihan
            </button>
          </div>
          <div className="progress">
            <i style={{ width: `${((lesson + 1) / 6) * 100}%` }} />
          </div>
          <article className="lesson-card">
            <div className="lesson-visual">{lessons[lesson].visual}</div>
            <p className="eyebrow">
              MATERI {String(lesson + 1).padStart(2, "0")}
            </p>
            <h1>{lessons[lesson].title}</h1>
            <p className="lead">{lessons[lesson].text}</p>
            {lesson === 1 && (
              <p className="note">
                <b>Model simulator:</b> Fixed partition. Satu process menempati
                satu block dan block tidak dibagikan lagi.
              </p>
            )}
          </article>
          <div className="lesson-actions">
            <button
              className="secondary"
              disabled={lesson === 0}
              onClick={() => setLesson(lesson - 1)}
            >
              Sebelumnya
            </button>
            {lesson < 5 ? (
              <button className="primary" onClick={() => setLesson(lesson + 1)}>
                Selanjutnya →
              </button>
            ) : (
              <button className="primary" onClick={() => go("setup")}>
                Mulai Latihan →
              </button>
            )}
          </div>
        </section>
      )}

      {page === "setup" && (
        <section className="page narrow">
          <Back onClick={() => go("home")} />
          <div className="page-title">
            <p className="eyebrow">SIAPKAN TANTANGAN</p>
            <h1>Pilih Mode Latihanmu</h1>
            <p>
              Pilih aturan parkir dan tingkat kesulitan. Soal dibuat baru setiap
              kali bermain.
            </p>
          </div>
          <h2 className="section-label">1. Algoritma yang dilatih</h2>
          <div className="mode-grid algorithm-modes">
            {([
              ["first", "First Fit", "Slot cukup pertama"],
              ["best", "Best Fit", "Slot cukup terkecil"],
              ["worst", "Worst Fit", "Slot cukup terbesar"],
            ] as const).map(([id, name, text]) => (
              <button
                key={id}
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
            {([
              ["easy", "Mudah", "5 soal · Angka bulat & selisih jelas"],
              ["medium", "Sedang", "5 soal · 4 slot variatif & ketat"],
              ["hard", "Sulit", "5 soal · 4 slot menantang & selisih tipis"],
            ] as const).map(([id, name, text]) => (
              <button
                key={id}
                className={`difficulty-card ${
                  difficulty === id ? "selected" : ""
                }`}
                onClick={() => setDifficulty(id)}
              >
                <b>{name}</b>
                <span>{text}</span>
              </button>
            ))}
          </div>
          <button
            className="primary full start-quiz"
            onClick={() => start(true)}
          >
            Mulai Tantangan →
          </button>
        </section>
      )}

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
                {algorithmNames[algorithm]} · {difficultyNames[difficulty]}
              </span>
              <h1>Pilih slot memori yang tepat untuk proses ini.</h1>
              <div className="current-process">
                <Car index={step} />
                <div>
                  <span>PROSES P{step + 1}</span>
                  <strong>{currentQ.processSize} KB</strong>
                </div>
              </div>
              <div className="algorithm-hint exam-note">
                <b>Mode Latihan</b>
                <p>
                  Pilih salah satu dari 4 slot. Hasil, nilai, dan pembahasan
                  lengkap akan ditampilkan setelah semua soal selesai.
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
                blocks={currentQ.blocks}
                selected={selected}
                onChoose={choose}
              />
            </div>
          </div>
          <footer className="quiz-actions">
            <div>
              <p>
                {selected === undefined
                  ? "Pilih salah satu dari 4 slot di atas untuk melanjutkan."
                  : `Slot ${String.fromCharCode(65 + selected)} (${
                      currentQ.blocks[selected]
                    } KB) dipilih. Klik tombol untuk menyimpan jawaban.`}
              </p>
            </div>
            <button
              className="primary"
              disabled={selected === undefined}
              onClick={submitAnswer}
            >
              {step + 1 === questions.length
                ? "Selesai & Lihat Hasil →"
                : "Soal Berikutnya →"}
            </button>
          </footer>
        </section>
      )}

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
              <strong>{algorithmNames[algorithm]}</strong>
              <span>Algoritma ({difficultyNames[difficulty]})</span>
            </div>
          </div>
          <h2 className="review-title">Pembahasan Setiap Soal</h2>
          <div className="review-list">
            {answers.map((ans, idx) => {
              const userLetter = String.fromCharCode(65 + ans.choice)
              const correctLetter = String.fromCharCode(65 + ans.expected)
              const explanation = buildExplanation(
                ans.blocks,
                ans.processSize,
                algorithm,
                ans.choice,
                ans.expected,
              )

              return (
                <article key={idx} className="review-card">
                  <div className="review-header">
                    <div className="review-meta">
                      <Car index={idx} small />
                      <div>
                        <h3>
                          Soal {idx + 1}: Proses P{idx + 1} ({ans.processSize}{" "}
                          KB)
                        </h3>
                        <p className="algo-badge">
                          Metode: {algorithmNames[algorithm]}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`review-status ${
                        ans.correct ? "status-correct" : "status-wrong"
                      }`}
                    >
                      {ans.correct ? "Benar" : "Salah"}
                    </span>
                  </div>

                  <div className="review-options-grid">
                    {ans.blocks.map((cap, bIdx) => {
                      const letter = String.fromCharCode(65 + bIdx)
                      const isExpected = bIdx === ans.expected
                      const isChoice = bIdx === ans.choice
                      return (
                        <div
                          key={bIdx}
                          className={`review-option-pill ${
                            isExpected
                              ? "pill-expected"
                              : isChoice
                                ? "pill-user-wrong"
                                : ""
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
                      )
                    })}
                  </div>

                  <div className="review-details">
                    <p className="user-answer-line">
                      <strong>Jawabanmu:</strong> Slot {userLetter} (
                      {ans.blocks[ans.choice]} KB)
                    </p>
                    <p className="correct-answer-line">
                      <strong>Kunci Jawaban:</strong> Slot {correctLetter} (
                      {ans.blocks[ans.expected]} KB)
                    </p>
                    <p className="explanation-line">{explanation}</p>
                  </div>
                </article>
              )
            })}
          </div>
          <div className="bottom-actions">
            <button className="secondary" onClick={() => go("setup")}>
              ← Ganti Mode Latihan
            </button>
            <button className="primary" onClick={() => start(true)}>
              Coba Soal Baru ({algorithmNames[algorithm]}) →
            </button>
          </div>
        </section>
      )}
    </main>
  )
}

function QuizParking({
  blocks,
  selected,
  onChoose,
}: {
  blocks: number[]
  selected: number | undefined
  onChoose: (index: number) => void
}) {
  return (
    <div className="parking quiz-parking">
      <div className="slots">
        {blocks.map((capacity, index) => {
          const letter = String.fromCharCode(65 + index)
          const isSelected = selected === index
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
          )
        })}
      </div>
    </div>
  )
}
