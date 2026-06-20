import { useMemo, useState } from 'react'

const SCENARIOS = {
  resume: {
    label: '简历优化',
    input:
      '以下是我的实习经历，请帮我优化简历要点，突出贡献和影响力：\n\n在 ABC 科技公司产品部实习（2024.03–2024.06），主要负责用户调研、竞品分析、需求文档撰写；参与了新功能的需求评审与优先级讨论；协助跟进开发进度和上线后的数据跟踪；使用过 Excel、Notion、飞书多维表格。',
    risk: {
      level: '中风险',
      tone: 'amber',
      title: '成果信息缺口可能诱发无依据扩展',
      description:
        '当前输入缺少成果指标、项目规模和个人贡献边界。若直接生成优化文案，可能产生未经验证的成果描述。',
    },
    provided: [
      '在 ABC 科技公司产品部实习，时间为 2024.03–2024.06',
      '负责用户调研、竞品分析和需求文档撰写',
      '参与新功能需求评审与优先级讨论',
      '协助跟进开发进度及上线后数据',
      '使用 Excel、Notion、飞书多维表格',
    ],
    inferred: [
      '参与需求评审，说明对产品目标和用户价值有基础理解',
      '跟进开发与上线数据，可能具备跨角色协作经验',
      '可将工作内容改写为更清晰的行动表述，但不能新增成果',
    ],
    confirm: [
      '你独立负责的具体任务与协作边界是什么？',
      '是否有可核验的项目结果、用户规模或效率指标？',
      '上线后重点跟踪了哪些数据，得出了什么结论？',
      '项目成果发生的时间范围和统计口径是什么？',
    ],
    conservative: [
      '围绕新功能开展用户调研与竞品分析，整理用户需求并参与需求优先级讨论。',
      '撰写和维护需求文档，协助产品、设计与研发同步信息并跟进开发进度。',
      '参与功能上线后的数据跟踪，使用 Excel、Notion 与飞书多维表格支持日常协作。',
    ],
    rewrite:
      '基于用户提供的信息，可将经历表述为：参与 AI 产品相关项目，负责用户调研、竞品分析、需求文档撰写与上线后数据跟踪，协助团队优化产品体验。量化成果、项目规模和具体指标需用户进一步确认后再写入简历。',
    advanced: {
      title: '补充事实后，可升级为“行动—方法—结果”表达',
      body:
        '先补充你独立负责的环节、调研对象与样本、交付物，以及可核验的上线结果。确认后再把每条经历整理为“负责什么—如何完成—产生什么结果”，避免先写数字、后找证据。',
      prompts: ['项目名称与目标', '个人职责边界', '样本或覆盖规模', '结果指标与统计口径'],
    },
  },
  research: {
    label: '研究设计',
    input:
      '我想研究大学生使用生成式 AI 学习工具时，事实边界提示是否会提升用户信任。请帮我设计一个可执行的研究方案。',
    risk: {
      level: '中高风险',
      tone: 'red',
      title: '数据来源与执行条件尚未明确',
      description:
        '研究问题已明确，但样本来源、招募渠道、周期、预算与可用数据尚未提供。直接给出固定样本量和复杂实验流程，可能超出真实执行条件。',
    },
    provided: [
      '目标人群为使用生成式 AI 学习工具的大学生',
      '核心变量是事实边界提示与用户信任',
      '用户希望获得一套可执行的研究方案',
    ],
    inferred: [
      '可比较“无提示”与“有事实边界提示”两种原型体验',
      '访谈、可用性测试与短问卷都可作为候选方法',
      '信任感需要拆成可观察、可追问的具体维度',
    ],
    confirm: [
      '参与者从哪里招募，能接触到多少人？',
      '项目周期、预算和可投入的人力是多少？',
      '是否已有原型、日志或历史问卷等数据来源？',
      '是否涉及录音、隐私同意与研究伦理要求？',
    ],
    conservative: [
      '先制作两版静态原型：一版直接输出，一版增加“已提供信息 / 合理推断 / 需确认”提示。',
      '用 5–8 名目标用户开展小规模可用性测试，观察理解、信任与继续使用意愿。该人数仅作为轻量探索建议，需按招募条件确认。',
      '结合任务完成后的短问卷与半结构访谈，记录用户在哪些输出处产生信任或疑虑。',
    ],
    rewrite:
      '基于当前研究目标，可将方案表述为：围绕大学生使用生成式 AI 学习工具的场景，比较有无事实边界提示时的理解、信任与使用意愿。参与者来源、样本规模、研究周期、预算与伦理要求需确认后再确定具体研究设计。',
    advanced: {
      title: '条件明确后，可升级为对照研究',
      body:
        '若能稳定招募参与者并获得更长周期，可预注册研究假设，随机分配提示条件，并同时测量任务正确率、主观信任和事实核查行为。样本量需基于效应假设与资源条件计算，不能由 Demo 直接给出。',
      prompts: ['可用样本来源', '测试周期与预算', '原型成熟度', '信任指标定义'],
    },
  },
  feedback: {
    label: '用户反馈洞察',
    input:
      '用户反馈：“回答看起来很专业，但经常多写我没说过的数据，我需要反复删除。”请分析问题，并帮我制定下一阶段的产品目标。',
    risk: {
      level: '高风险',
      tone: 'red',
      title: '缺少数据基线，不能直接生成具体指标目标',
      description:
        '单条反馈能说明风险类型，但无法代表问题发生率。若没有投诉率、触发场景和版本基线，不能直接承诺“错误率降低 30%”等量化目标。',
    },
    provided: [
      '用户认为回答表面专业，但包含未提供的数据',
      '用户需要手动删除新增内容，产生额外校对成本',
      '当前任务是分析问题并制定下一阶段产品目标',
    ],
    inferred: [
      '核心 badcase 可归因为“无依据扩展”',
      '用户风险包括误用虚构信息、返工和信任下降',
      '事实边界提示与确认机制可能降低误用概率',
    ],
    confirm: [
      '同类反馈在全部反馈中的数量与占比是多少？',
      '问题集中在哪些场景、模型版本和输出位置？',
      '当前无依据扩展率与用户修改率的基线是多少？',
      '怎样定义一次可被计数的“无依据扩展”？',
    ],
    conservative: [
      '产品目标：让用户在采用输出前识别哪些内容来自输入、哪些只是推断、哪些必须补充确认。',
      '优先覆盖简历优化、研究设计和用户反馈洞察三个高风险场景，记录边界提示的展开与确认行为。',
      '先建立 badcase 标注口径和现状基线，再设定量化改善目标；当前不生成未经数据支持的具体百分比。',
    ],
    rewrite:
      '基于当前反馈，可将产品问题表述为：用户因模型补写未提供的数据而产生额外校对成本，下一阶段应优先展示事实、推断与待确认信息，并回收 badcase 标签。问题发生率、版本基线和量化目标需完成数据统计后再设定。',
    advanced: {
      title: '建立基线后，可进入指标闭环',
      body:
        '统一“无依据扩展”标注标准，对真实会话分层抽样；再跟踪无依据扩展率、用户删除率、确认完成率和负反馈率。目标值应基于基线与最小可行改善幅度制定。',
      prompts: ['问题发生率基线', '高风险场景分布', '用户修改行为', '版本与提示策略'],
    },
  },
}

const METRICS = [
  { value: '15', label: '组任务' },
  { value: '45', label: '条回答' },
  { value: '10', label: '条无依据扩展' },
  { value: '1', label: '个 PRD 原型' },
]

const FEEDBACK_TAGS = ['无依据扩展', '回答过泛', '解释不足', '格式不稳定']

const DESIGN_NOTES = [
  {
    index: '01',
    title: '评测发现',
    content: '无依据扩展是高频 badcase',
    detail: '模型在信息不足时补写成果、指标或研究条件，增加误用与返工风险。',
  },
  {
    index: '02',
    title: '功能方案',
    content: '事实边界拆分 + 保守/进阶输出 + badcase 标签反馈',
    detail: '先暴露信息边界，再用渐进输出和反馈闭环降低用户判断成本。',
  },
  {
    index: '03',
    title: '迭代指标',
    content: '高风险识别触发率、保守版选择率、badcase 反馈提交率',
    detail: '用行为指标验证风险提示是否被看见、被采用，并持续回收问题样本。',
  },
]

function SparkIcon({ className = 'h-4 w-4' }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 20 20" fill="none">
      <path d="m10 2 1.15 3.85L15 7l-3.85 1.15L10 12 8.85 8.15 5 7l3.85-1.15L10 2Z" fill="currentColor" />
      <path d="m15.5 12 .65 2.35L18.5 15l-2.35.65L15.5 18l-.65-2.35L12.5 15l2.35-.65L15.5 12Z" fill="currentColor" opacity=".72" />
    </svg>
  )
}

function ChevronIcon({ open }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="m6.5 8 3.5 3.5L13.5 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
      <path d="m3 8 3 3 7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MetricCard({ metric }) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:px-5">
      <p className="text-2xl font-semibold tracking-[-0.03em] text-[#0F172A]">{metric.value}</p>
      <p className="mt-1 text-xs font-medium text-[#64748B] sm:text-sm">{metric.label}</p>
    </div>
  )
}

function SectionTitle({ title, description, action }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-base font-semibold tracking-[-0.01em] text-[#0F172A]">{title}</h2>
        {description ? <p className="mt-1 text-xs leading-5 text-[#64748B]">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

function FactCard({ type, items }) {
  const styles = {
    provided: {
      title: '已提供信息',
      subtitle: '可直接引用的事实',
      mark: '✓',
      shell: 'bg-[#ECFDF5]',
      accent: 'text-[#047857]',
      dot: 'bg-[#047857]',
    },
    inferred: {
      title: '合理推断',
      subtitle: '基于场景的谨慎判断',
      mark: '~',
      shell: 'bg-[#EFF6FF]',
      accent: 'text-[#1D4ED8]',
      dot: 'bg-[#1D4ED8]',
    },
    confirm: {
      title: '需用户确认',
      subtitle: '信息缺失，不能补写',
      mark: '?',
      shell: 'bg-[#FFF7ED]',
      accent: 'text-[#C2410C]',
      dot: 'bg-[#C2410C]',
    },
  }

  const style = styles[type]

  return (
    <section className={`min-w-0 rounded-2xl p-4 ${style.shell}`}>
      <div className="flex items-center gap-2">
        <span className={`flex h-5 w-5 items-center justify-center rounded-md bg-white/75 text-xs font-semibold ${style.accent}`}>
          {style.mark}
        </span>
        <h3 className={`text-sm font-semibold ${style.accent}`}>{style.title}</h3>
      </div>
      <p className="mt-1 pl-7 text-[11px] text-[#64748B]">{style.subtitle}</p>
      <ul className="mt-4 space-y-2.5 text-xs leading-5 text-[#334155]">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-current opacity-35" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function App() {
  const [sceneKey, setSceneKey] = useState('resume')
  const [input, setInput] = useState(SCENARIOS.resume.input)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState(['无依据扩展'])
  const [analyzing, setAnalyzing] = useState(false)
  const [runCount, setRunCount] = useState(0)

  const scene = useMemo(() => SCENARIOS[sceneKey], [sceneKey])

  const handleSceneChange = (nextKey) => {
    setSceneKey(nextKey)
    setInput(SCENARIOS[nextKey].input)
    setAdvancedOpen(false)
    setSelectedFeedback([])
    setRunCount(0)
  }

  const handleAnalyze = () => {
    if (analyzing || !input.trim()) return

    setAnalyzing(true)
    window.setTimeout(() => {
      setAnalyzing(false)
      setAdvancedOpen(false)
      setRunCount((count) => count + 1)
    }, 520)
  }

  const toggleFeedback = (tag) => {
    setSelectedFeedback((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <header className="border-b border-[#E2E8F0] bg-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(420px,0.75fr)] lg:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-[#1D4ED8]">
                AI Product Demo
              </span>
              <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#0F172A] sm:text-5xl">
                AI 输出可信度检查
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#475569] sm:text-lg">
                帮助用户识别 AI 回答中的事实、推断与待确认内容，降低无依据扩展风险。
              </p>
              <p className="mt-3 text-xs leading-5 text-[#94A3B8]">
                基于 15 组任务、45 条模型回答与 10 条无依据扩展 badcase 推导。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {METRICS.map((metric) => (
                <MetricCard key={metric.label} metric={metric} />
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
          <aside className="rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,0.05)] sm:p-6 lg:sticky lg:top-6">
            <SectionTitle
              title="输入你的 AI 使用场景"
              description="选择场景并编辑预设内容，体验事实边界拆分流程。"
            />

            <div className="mt-6" role="group" aria-label="使用场景">
              <p className="mb-2.5 text-xs font-medium text-[#64748B]">使用场景</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(SCENARIOS).map(([key, item]) => {
                  const selected = sceneKey === key

                  return (
                    <button
                      key={key}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => handleSceneChange(key)}
                      className={`rounded-full px-3.5 py-2 text-xs font-medium transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                        selected
                          ? 'bg-[#1D4ED8] text-white'
                          : 'border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#BFDBFE] hover:bg-[#EFF6FF] hover:text-[#1D4ED8]'
                      }`}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-2.5 block text-xs font-medium text-[#64748B]" htmlFor="user-input">
                输入内容或问题
              </label>
              <div className="relative">
                <textarea
                  id="user-input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  maxLength={2000}
                  className="min-h-[300px] w-full resize-y rounded-2xl border border-[#CBD5E1] bg-white px-4 py-3.5 pb-9 text-sm leading-7 text-[#334155] outline-none transition placeholder:text-[#94A3B8] focus:border-[#1D4ED8] focus:ring-4 focus:ring-blue-100"
                  placeholder="输入你希望 AI 帮助处理的内容……"
                />
                <span className="pointer-events-none absolute bottom-3 right-4 text-[11px] tabular-nums text-[#94A3B8]">
                  {input.length}/2000
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={analyzing || !input.trim()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1E293B] focus:outline-none focus:ring-4 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SparkIcon className={`h-4 w-4 ${analyzing ? 'animate-soft-pulse' : ''}`} />
              {analyzing ? '正在进行 AI 分析…' : runCount > 0 ? '重新开始 AI 分析' : '开始 AI 分析'}
            </button>

            <div className="mt-4 rounded-xl bg-[#EFF6FF] px-4 py-3 text-xs leading-5 text-[#1E40AF]">
              <span className="font-semibold">演示说明：</span>
              本 Demo 使用静态示例模拟 AI 分析流程，用于展示产品逻辑与交互设计。
            </div>
          </aside>

          <section className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-[0_8px_28px_rgba(15,23,42,0.05)]">
            <div className="p-5 sm:p-6">
              <SectionTitle
                title="AI 分析结果"
                description="系统将当前输入拆分为事实、推断与待确认信息，并给出低风险输出建议。"
              />

              <div className="mt-5 rounded-2xl bg-[#FEFCE8] p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className="w-fit rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-[#A16207]">
                    风险识别 · {scene.risk.level}
                  </span>
                  <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#A16207]/70">
                    AI Risk Check
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-[#713F12]">{scene.risk.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#854D0E]">{scene.risk.description}</p>
              </div>
            </div>

            <div className="border-t border-[#F1F5F9] p-5 sm:p-6">
              <SectionTitle title="事实边界拆分" description="将 AI 输出依据拆成事实、推断和待确认信息。" />
              <div key={sceneKey} className="mt-5 grid gap-3 md:grid-cols-3">
                <FactCard type="provided" items={scene.provided} />
                <FactCard type="inferred" items={scene.inferred} />
                <FactCard type="confirm" items={scene.confirm} />
              </div>
            </div>

            <div className="border-t border-[#F1F5F9] p-5 sm:p-6">
              <SectionTitle
                title="输出建议"
                description="默认给出保守版，用户可主动展开进阶方案。"
                action={(
                  <button
                    type="button"
                    aria-expanded={advancedOpen}
                    onClick={() => setAdvancedOpen((open) => !open)}
                    className="flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-xs font-medium text-[#475569] transition hover:bg-[#F8FAFC] focus:outline-none focus:ring-4 focus:ring-slate-100"
                  >
                    {advancedOpen ? '收起进阶版' : '展开进阶版'}
                    <ChevronIcon open={advancedOpen} />
                  </button>
                )}
              />

              <div className="mt-5 rounded-2xl bg-[#EFF6FF] p-4 sm:p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#1D4ED8]">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
                    <CheckIcon />
                  </span>
                  保守版输出
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-[#334155]">
                  {scene.conservative.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span className="mt-[10px] h-1 w-1 shrink-0 rounded-full bg-[#1D4ED8]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {advancedOpen ? (
                <div className="mt-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 sm:p-5">
                  <h3 className="text-sm font-semibold text-[#0F172A]">{scene.advanced.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#64748B]">{scene.advanced.body}</p>
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-[#E2E8F0] pt-4">
                    {scene.advanced.prompts.map((prompt) => (
                      <span key={prompt} className="rounded-full bg-white px-3 py-1.5 text-[11px] text-[#64748B] ring-1 ring-inset ring-[#E2E8F0]">
                        待确认：{prompt}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-4 rounded-2xl border border-[#DBEAFE] bg-white p-4 sm:p-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1D4ED8]">
                    <SparkIcon className="h-3.5 w-3.5" />
                  </span>
                  <h3 className="text-sm font-semibold text-[#0F172A]">AI 建议改写</h3>
                </div>
                <p className="mt-3 text-sm leading-7 text-[#475569]">{scene.rewrite}</p>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-[#F1F5F9] pt-4">
                  <span className="rounded-full bg-[#ECFDF5] px-2.5 py-1 text-[11px] font-medium text-[#047857]">来自已提供信息</span>
                  <span className="rounded-full bg-[#EFF6FF] px-2.5 py-1 text-[11px] font-medium text-[#1D4ED8]">谨慎推断</span>
                  <span className="rounded-full bg-[#FFF7ED] px-2.5 py-1 text-[11px] font-medium text-[#C2410C]">需确认后使用</span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#F1F5F9] p-5 sm:p-6">
              <SectionTitle title="Badcase 反馈" description="标记输出问题，为后续规则和评测迭代回收样本。" />
              <div className="mt-4 flex flex-wrap gap-2">
                {FEEDBACK_TAGS.map((tag) => {
                  const selected = selectedFeedback.includes(tag)

                  return (
                    <button
                      key={tag}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleFeedback(tag)}
                      className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                        selected
                          ? 'bg-[#1D4ED8] text-white'
                          : 'border border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#BFDBFE] hover:bg-[#EFF6FF] hover:text-[#1D4ED8]'
                      }`}
                    >
                      {selected ? <CheckIcon /> : null}
                      {tag}
                    </button>
                  )
                })}
              </div>
              <p className="mt-3 text-xs text-[#94A3B8]">
                {selectedFeedback.length > 0 ? `已选择：${selectedFeedback.join('、')}` : '尚未选择反馈标签'}
              </p>
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-[20px] border border-[#E2E8F0] bg-white p-5 shadow-[0_8px_28px_rgba(15,23,42,0.04)] sm:p-6 lg:p-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#1D4ED8]">Product Rationale</p>
            <h2 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-[#0F172A]">产品设计说明</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#64748B]">
              该 Demo 基于 15 组任务、45 条模型回答和 10 条无依据扩展 badcase 推导，用于展示从评测发现到产品功能设计的完整链路。
            </p>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3 md:divide-x md:divide-[#E2E8F0]">
            {DESIGN_NOTES.map((note, index) => (
              <article key={note.title} className={index > 0 ? 'md:pl-6' : ''}>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold tabular-nums text-[#94A3B8]">{note.index}</span>
                  <h3 className="text-sm font-semibold text-[#0F172A]">{note.title}</h3>
                </div>
                <p className="mt-3 text-sm font-medium leading-6 text-[#334155]">{note.content}</p>
                <p className="mt-2 text-xs leading-5 text-[#64748B]">{note.detail}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#E2E8F0] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-xs leading-5 text-[#94A3B8] sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>AI 学习助手 · AI 输出可信度检查 Demo</p>
          <p>静态预设数据，仅用于展示产品逻辑与交互流程</p>
        </div>
      </footer>
    </div>
  )
}

export default App
