import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionStore } from '../lib/api';
import localRules from '../data/diagnosticRules.json';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Activity,
  Layers,
  Cpu,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';

interface QuestionItem {
  id: string;
  text: string;
  category?: string;
  tag?: string;
  why?: string;
  isAdaptive?: boolean;
  adaptiveTrigger?: string;
}

/**
 * Adaptive clinical question generator:
 * Computes 2 tailored follow-up questions (Q4 & Q5) dynamically
 * based on the user's previous responses, symptom category, and device context.
 */
function getAdaptiveFollowUps(
  baseAnswers: Record<string, boolean>,
  deviceId: string,
  problemText: string,
  primarySymptomId = ''
): QuestionItem[] {
  const pText = (problemText || '').toLowerCase();
  const dev = (deviceId || '').toLowerCase();
  const sId = (primarySymptomId || '').toLowerCase();

  // Evaluate responses from base questions
  const answerEntries = Object.entries(baseAnswers);
  const yesCount = answerEntries.filter(([, v]) => v === true).length;
  const firstAnswer = answerEntries.length > 0 ? answerEntries[0][1] : true;

  // Domain 1: Display / Screen / Lines / Touch
  const isDisplayDomain =
    sId.includes('screen') ||
    sId.includes('line') ||
    sId.includes('display') ||
    sId.includes('touch') ||
    pText.includes('screen') ||
    pText.includes('display') ||
    pText.includes('glass') ||
    pText.includes('line') ||
    pText.includes('crack') ||
    pText.includes('flicker') ||
    pText.includes('touch');

  if (isDisplayDomain) {
    if (firstAnswer === false) {
      // Touch failed or severe damage
      return [
        {
          id: 'adaptive_q4_deadzones',
          text: 'Are there specific localized "dead zones" (such as the top notification bar or keyboard area) where touch fails while other sections still respond?',
          tag: 'Precision Probe: ITO Digitizer Matrix',
          why: 'Isolated dead zones indicate micro-fractures in specific conductive ITO traces rather than a total controller IC failure, enabling targeted sub-assembly repair.',
          isAdaptive: true,
          adaptiveTrigger: 'Generated from absent touch response in Question 1',
        },
        {
          id: 'adaptive_q5_ghost_touch',
          text: 'Does the screen register erratic phantom touches ("ghost clicking" or random apps opening) on its own without you touching it?',
          tag: 'Precision Probe: Capacitive Signal Leakage',
          why: 'Ghost touches indicate localized moisture ingress or warped casing pressure on the digitizer layer, which often does not require replacing the costly AMOLED matrix.',
          isAdaptive: true,
          adaptiveTrigger: 'Generated from touch matrix instability telemetry',
        },
      ];
    } else {
      // Touch still works, lines or outer glass crack
      return [
        {
          id: 'adaptive_q4_ribbon_flex',
          text: 'When you gently press along the bezel edges or frame, do the colored vertical lines shift, multiply, or flicker in brightness?',
          tag: 'Micro-Bonding Test: COF IC & Flex Cable',
          why: 'Lines that flicker or shift with light frame pressure point to loose COF (Chip-on-Film) ribbon bonding rather than a cracked OLED core. This can often be revived via micro-laser rebonding at 60% lower cost.',
          isAdaptive: true,
          adaptiveTrigger: 'Generated from confirmed touch responsiveness in Question 1',
        },
        {
          id: 'adaptive_q5_boot_persistence',
          text: 'Do the visual lines or artifacts appear immediately during the initial boot logo (before Android/iOS loads)?',
          tag: 'Substrate vs Firmware Isolation',
          why: 'Defects visible during early boot logo definitively rule out software driver corruption or GPU kernel glitches, confirming physical display layer isolation.',
          isAdaptive: true,
          adaptiveTrigger: 'Generated to confirm hardware substrate vs GPU driver isolation',
        },
      ];
    }
  }

  // Domain 2: Battery / Power / Draining
  const isBatteryDomain =
    sId.includes('battery') ||
    sId.includes('drain') ||
    pText.includes('battery') ||
    pText.includes('drain') ||
    pText.includes('shutting down') ||
    pText.includes('percent');

  if (isBatteryDomain) {
    return [
      {
        id: 'adaptive_q4_voltage_sag',
        text: 'Does the battery percentage suddenly drop by 15%–30% in just a few minutes, or shut off unexpectedly while still showing above 20%?',
        tag: 'Electrochemical Degradation Probe',
        why: 'Abrupt percentage cliffs confirm high internal chemical cell resistance (voltage sag under load), proving cell retirement rather than normal background app drain.',
        isAdaptive: true,
        adaptiveTrigger: `Generated from ${yesCount > 0 ? 'confirmed power draw' : 'drain characteristics'}`,
      },
      {
        id: 'adaptive_q5_casing_lift',
        text: 'When placing the device screen-up on a flat table, does it wobble or is there any visible gap / frame lift near the battery area?',
        tag: 'Safety Protocol: Lithium Pouch Swelling Check',
        why: 'Pouch expansion is a critical safety hazard caused by electrolyte decomposition. Early detection prevents chassis deformation and combustion risk.',
        isAdaptive: true,
        adaptiveTrigger: 'Generated as mandatory safety telemetry',
      },
    ];
  }

  // Domain 3: Charging / Port / Cable
  const isChargingDomain =
    sId.includes('charging') ||
    sId.includes('charge') ||
    sId.includes('port') ||
    pText.includes('charging') ||
    pText.includes('charge') ||
    pText.includes('cable') ||
    pText.includes('usb') ||
    pText.includes('port');

  if (isChargingDomain) {
    return [
      {
        id: 'adaptive_q4_port_wiggle',
        text: 'Does charging only connect or stay active when the charging cable is held firmly at a specific angle or pushed in hard?',
        tag: 'CC Pin & Solder Pad Fatigue',
        why: 'Intermittent connection only at certain angles confirms mechanical solder fatigue on the port CC pins rather than a burnt charging IC.',
        isAdaptive: true,
        adaptiveTrigger: 'Generated from charging port mechanics analysis',
      },
      {
        id: 'adaptive_q5_port_heating',
        text: 'Does the area immediately surrounding the charging port feel noticeably hot to touch during the first 5 minutes of plugging in?',
        tag: 'Thermal Dissipation & Short Isolation',
        why: 'Excess heat at the connector points to high contact resistance from pin oxidation or lint arcing rather than healthy fast-charge negotiation.',
        isAdaptive: true,
        adaptiveTrigger: 'Generated from thermal safety profile',
      },
    ];
  }

  // Domain 4: Liquid / Ingress
  const isLiquidDomain =
    sId.includes('water') ||
    sId.includes('liquid') ||
    pText.includes('water') ||
    pText.includes('liquid') ||
    pText.includes('drop in') ||
    pText.includes('spill') ||
    pText.includes('rain');

  if (isLiquidDomain) {
    return [
      {
        id: 'adaptive_q4_liquid_type',
        text: 'Was the liquid exposure clean tap water, or did it involve corrosive liquids like coffee, tea, soda, or saline water?',
        tag: 'Galvanic Oxidation Speed Profiler',
        why: 'Acidic or sugary liquids accelerate component oxidation 5x faster than pure water, requiring immediate ultrasonic PCB decontamination.',
        isAdaptive: true,
        adaptiveTrigger: 'Generated from liquid ingress event classification',
      },
      {
        id: 'adaptive_q5_lens_fogging',
        text: 'Is there any visible condensation, moisture droplets, or fogging visible inside the front or rear camera lenses?',
        tag: 'Hermetic Cavity Seal Test',
        why: 'Moisture inside the lens housing confirms vapor penetration into sealed optical modules, requiring desiccant thermal chamber treatment.',
        isAdaptive: true,
        adaptiveTrigger: 'Generated from moisture propagation telemetry',
      },
    ];
  }

  // Domain 5: Sound / Audio / Microphone
  const isAudioDomain =
    sId.includes('sound') ||
    sId.includes('audio') ||
    sId.includes('silent') ||
    sId.includes('mic') ||
    pText.includes('sound') ||
    pText.includes('audio') ||
    pText.includes('speaker') ||
    pText.includes('mic') ||
    pText.includes('muffled') ||
    pText.includes('crackling');

  if (isAudioDomain) {
    return [
      {
        id: 'adaptive_q4_audio_subsystem',
        text: 'Does the audio problem occur on both loudspeaker and wired/wireless earphones, or only on the built-in speaker?',
        tag: 'Audio DAC / Codec IC Isolation',
        why: 'Issues isolated to the built-in speaker point to physical voice coil or acoustic mesh damage, whereas universal distortion isolates the motherboard audio DAC.',
        isAdaptive: true,
        adaptiveTrigger: 'Generated from audio routing telemetry',
      },
      {
        id: 'adaptive_q5_haptic_resonance',
        text: 'Does the phone chassis vibrate or rattle uncomfortably when playing audio at volumes above 60%?',
        tag: 'Acoustic Chamber Gasket Integrity',
        why: 'Chassis rattle confirms a dislodged speaker dampener gasket or ruptured diaphragm cone rather than digital audio decoding errors.',
        isAdaptive: true,
        adaptiveTrigger: 'Generated from acoustic resonance check',
      },
    ];
  }

  // Domain 6: Camera & Optics
  const isCameraDomain =
    sId.includes('camera') ||
    sId.includes('lens') ||
    pText.includes('camera') ||
    pText.includes('lens') ||
    pText.includes('blurry') ||
    pText.includes('photo');

  if (isCameraDomain) {
    return [
      {
        id: 'adaptive_q4_ois_motor',
        text: 'When you open the camera app, do you hear a faint buzzing or clicking sound, or does the viewfinder visibly shake/jitter?',
        tag: 'Voice Coil OIS Actuator Diagnostic',
        why: 'Physical vibration or humming indicates a fractured Optical Image Stabilization spring coil rather than lens glass dirt, requiring module replacement.',
        isAdaptive: true,
        adaptiveTrigger: 'Generated from camera stabilization analysis',
      },
      {
        id: 'adaptive_q5_sensor_switching',
        text: 'Does the camera issue happen on all magnification levels (0.5x ultra-wide, 1x main, 3x telephoto) or only one specific lens?',
        tag: 'Multi-Sensor Array Mapping',
        why: 'Isolation to a single zoom tier confirms only one discrete optical sensor module is impaired, substantially lowering replacement costs.',
        isAdaptive: true,
        adaptiveTrigger: 'Generated from camera array probe',
      },
    ];
  }

  // Domain 7: Home Appliances (Washing machine, Refrigerator, AC, Blender)
  if (
    dev.includes('washing') ||
    dev.includes('refrigerat') ||
    dev.includes('conditioner') ||
    dev.includes('mixer') ||
    dev.includes('kettle')
  ) {
    return [
      {
        id: 'adaptive_q4_appliance_cycle',
        text: 'Does the unit fail immediately when starting the primary cycle, or does it operate normally for several minutes before cutting out?',
        tag: 'Thermal Overload & Relay Probe',
        why: 'Failure after a few minutes of operation isolates a thermal safety cutout relay or capacitor overheating rather than a dead primary motor stator.',
        isAdaptive: true,
        adaptiveTrigger: 'Generated from appliance duty cycle telemetry',
      },
      {
        id: 'adaptive_q5_appliance_noise',
        text: 'Is there an unusual rhythmic grinding, scraping, or high-pitched screeching sound during operation?',
        tag: 'Mechanical Bearing & Belt Wear',
        why: 'Rhythmic mechanical noise isolates drum bearings, motor carbon brushes, or drive belt slip rather than digital PCB failure.',
        isAdaptive: true,
        adaptiveTrigger: 'Generated from mechanical acoustics profile',
      },
    ];
  }

  // Default Domain: General Hardware / Logic Board / Power
  return [
    {
      id: 'adaptive_q4_trigger_event',
      text: 'Did this issue begin immediately after a physical shock, sudden power surge, or major firmware update?',
      tag: 'Etiology & Catalyst Classification',
      why: 'Isolating the trigger event enables the AI to distinguish motherboard power rail surge damage from mechanical solder fracture.',
      isAdaptive: true,
      adaptiveTrigger: 'Generated from diagnostic symptom timeline analysis',
    },
    {
      id: 'adaptive_q5_concurrent_failures',
      text: 'Are any secondary components (such as vibration motors, speakers, mic, or secondary sensors) malfunctioning at the same time?',
      tag: 'Shared PMIC Power Rail Isolation',
      why: 'Multiple peripheral failures pinpoint a shared sub-board power management IC rather than separate individual component defects.',
      isAdaptive: true,
      adaptiveTrigger: 'Generated from cross-component fault telemetry',
    },
  ];
}

export default function DiagnosticInterview() {
  const navigate = useNavigate();

  // Load session context
  const storedDevice = sessionStorage.getItem('deviceId') || 'smartphone';
  const storedProblemText = sessionStorage.getItem('problemText') || '';
  const storedSymptomId = sessionStorage.getItem('primarySymptomId') || '';
  const storedIntakeStr = sessionStorage.getItem('intakeData');
  const intakeData = storedIntakeStr ? JSON.parse(storedIntakeStr) : {};
  const deviceBrand = intakeData.brand || 'Your Device';
  const deviceModel = intakeData.model || '';

  // Base questions from sessionStore (usually 3 questions from DynamoDB rule)
  const baseQuestions: QuestionItem[] = useMemo(() => {
    let raw = sessionStore.getQuestions();
    if (!raw || raw.length === 0) {
      const devRules = (localRules as any[]).filter((r) => r.deviceId === storedDevice);
      let matched = devRules.find((r) => r.ruleId === storedSymptomId);
      if (!matched && storedSymptomId) {
        matched = devRules.find((r) => r.ruleId.includes(storedSymptomId) || storedSymptomId.includes(r.ruleId));
      }
      if (!matched) matched = devRules[0];
      if (matched?.questions) {
        raw = matched.questions;
        sessionStore.setQuestions(raw);
      }
    }
    return (raw || []).map((q: any) => ({
      id: q.id,
      text: q.text,
      tag: 'Core Diagnostic Verification',
      why: 'Primary clinical verification used to pinpoint the failure mode and rule out false-positive symptom overlap.',
      isAdaptive: false,
    }));
  }, [storedDevice, storedSymptomId]);

  const [answers, setAnswers] = useState<Record<string, boolean>>(() => {
    const saved = sessionStorage.getItem('answers');
    return saved ? JSON.parse(saved) : {};
  });

  // Dynamically compute the 2 adaptive questions based on current answers
  const adaptiveQuestions = useMemo(() => {
    return getAdaptiveFollowUps(answers, storedDevice, storedProblemText, storedSymptomId);
  }, [answers, storedDevice, storedProblemText, storedSymptomId]);

  // Combined questions list (Total: 5 questions)
  const allQuestions: QuestionItem[] = useMemo(() => {
    if (!baseQuestions || baseQuestions.length === 0) return [];
    return [...baseQuestions, ...adaptiveQuestions];
  }, [baseQuestions, adaptiveQuestions]);

  const initialIndex = Object.keys(answers).length;
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (allQuestions.length === 0) return 0;
    return Math.min(initialIndex, allQuestions.length - 1);
  });

  // Selected feedback animation state
  const [lastSelected, setLastSelected] = useState<boolean | null>(null);

  // If no questions loaded, redirect to device selection
  useEffect(() => {
    if (!baseQuestions || baseQuestions.length === 0) {
      navigate('/device');
    }
  }, [baseQuestions, navigate]);

  if (!allQuestions || allQuestions.length === 0) {
    return null;
  }

  const currentQ = allQuestions[currentIndex] || allQuestions[0];
  const totalQuestions = allQuestions.length;
  const answeredCount = Object.keys(answers).length;

  // Real-time calculated diagnostic confidence
  const confidenceScore = Math.min(98, Math.round(35 + (answeredCount / totalQuestions) * 63));

  // Dynamic fault probabilities that adjust based on responses and symptom domain
  const faultProbabilities = useMemo(() => {
    const vals = Object.values(answers);
    const yesRatio = vals.length > 0 ? vals.filter(Boolean).length / vals.length : 0.5;
    const pText = storedProblemText.toLowerCase();
    const sId = storedSymptomId.toLowerCase();

    // 1. Battery domain
    if (sId.includes('battery') || sId.includes('drain') || pText.includes('battery') || pText.includes('drain')) {
      const cellProb = Math.round(60 + yesRatio * 25);
      const bmsProb = Math.round(25 + (1 - yesRatio) * 15);
      const pmicProb = Math.max(5, 100 - cellProb - bmsProb);
      return [
        { label: 'Lithium-Ion Chemical Cell', pct: cellProb, color: 'bg-[#103D29]' },
        { label: 'BMS Protection Board', pct: bmsProb, color: 'bg-[#E28E5C]' },
        { label: 'Mainboard PMIC Regulator', pct: pmicProb, color: 'bg-[#68736A]' },
      ];
    }

    // 2. Charging domain
    if (sId.includes('charging') || sId.includes('charge') || pText.includes('charging') || pText.includes('port')) {
      const portProb = Math.round(65 + yesRatio * 20);
      const icProb = Math.round(22 + (1 - yesRatio) * 10);
      const flexProb = Math.max(5, 100 - portProb - icProb);
      return [
        { label: 'USB-C / Lightning Port Assembly', pct: portProb, color: 'bg-[#103D29]' },
        { label: 'Charging Controller IC', pct: icProb, color: 'bg-[#E28E5C]' },
        { label: 'Sub-board Interconnect Flex', pct: flexProb, color: 'bg-[#68736A]' },
      ];
    }

    // 3. Water domain
    if (sId.includes('water') || sId.includes('liquid') || pText.includes('water') || pText.includes('liquid')) {
      const corrosionProb = Math.round(55 + yesRatio * 30);
      const capProb = Math.round(30 - yesRatio * 15);
      const traceProb = Math.max(5, 100 - corrosionProb - capProb);
      return [
        { label: 'Surface Moisture Oxidation', pct: corrosionProb, color: 'bg-[#103D29]' },
        { label: 'SMD Capacitor Array Short', pct: capProb, color: 'bg-[#E28E5C]' },
        { label: 'Corroded Logic Board Traces', pct: traceProb, color: 'bg-[#68736A]' },
      ];
    }

    // 4. Audio domain
    if (sId.includes('sound') || sId.includes('audio') || sId.includes('speaker') || pText.includes('sound') || pText.includes('speaker')) {
      const speakerProb = Math.round(60 + yesRatio * 20);
      const dacProb = Math.round(25 - yesRatio * 10);
      const flexProb = Math.max(5, 100 - speakerProb - dacProb);
      return [
        { label: 'Acoustic Speaker Diaphragm', pct: speakerProb, color: 'bg-[#103D29]' },
        { label: 'Audio Codec / DAC Chip', pct: dacProb, color: 'bg-[#E28E5C]' },
        { label: 'Audio Flex Ribbon Interface', pct: flexProb, color: 'bg-[#68736A]' },
      ];
    }

    // 5. Camera domain
    if (sId.includes('camera') || pText.includes('camera') || pText.includes('lens')) {
      const oisProb = Math.round(65 + yesRatio * 20);
      const sensorProb = Math.round(25 - yesRatio * 10);
      const lensProb = Math.max(5, 100 - oisProb - sensorProb);
      return [
        { label: 'OIS Actuator & Voice Coil', pct: oisProb, color: 'bg-[#103D29]' },
        { label: 'CMOS Image Sensor Module', pct: sensorProb, color: 'bg-[#E28E5C]' },
        { label: 'Optical Lens Glass Housing', pct: lensProb, color: 'bg-[#68736A]' },
      ];
    }

    // 6. Display / Screen domain
    const isDisplay =
      sId.includes('screen') ||
      sId.includes('line') ||
      pText.includes('screen') ||
      pText.includes('display') ||
      pText.includes('glass') ||
      pText.includes('line') ||
      pText.includes('crack');

    if (isDisplay) {
      const glassProb = Math.round(65 + (1 - yesRatio) * 20);
      const digitizerProb = Math.round(25 + yesRatio * 20);
      const mainboardProb = Math.max(5, 100 - glassProb - digitizerProb);
      return [
        { label: 'Outer Glass / OCA Layer', pct: glassProb, color: 'bg-[#103D29]' },
        { label: 'AMOLED Matrix / Digitizer', pct: digitizerProb, color: 'bg-[#E28E5C]' },
        { label: 'Display Driver / Flex Cable', pct: mainboardProb, color: 'bg-[#68736A]' },
      ];
    }

    // 7. General hardware / Appliance
    return [
      { label: 'Primary Sub-assembly Failure', pct: Math.round(60 + yesRatio * 25), color: 'bg-[#103D29]' },
      { label: 'Interconnect / Ribbon Cable Wear', pct: Math.round(25 - yesRatio * 10), color: 'bg-[#E28E5C]' },
      { label: 'Main Logic Board Power Rail', pct: Math.max(5, Math.round(15 - yesRatio * 5)), color: 'bg-[#68736A]' },
    ];
  }, [answers, storedProblemText, storedSymptomId]);

  const handleAnswer = (value: boolean) => {
    setLastSelected(value);
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    // Briefly show selection visual feedback then move forward
    setTimeout(() => {
      setLastSelected(null);
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // Complete interview: persist all 5 questions and answers
        sessionStore.setQuestions(allQuestions);
        sessionStorage.setItem('answers', JSON.stringify(newAnswers));
        navigate('/analyzing');
      }
    }, 180);
  };

  // Keyboard shortcuts handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'y' || e.key === 'Y' || e.key === '1') {
        e.preventDefault();
        handleAnswer(true);
      } else if (e.key === 'n' || e.key === 'N' || e.key === '2') {
        e.preventDefault();
        handleAnswer(false);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        e.preventDefault();
        setCurrentIndex(currentIndex - 1);
      }
    },
    [currentIndex, currentQ, answers, totalQuestions]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const jumpToQuestion = (idx: number) => {
    if (idx >= 0 && idx < totalQuestions) {
      setCurrentIndex(idx);
    }
  };

  return (
    <div className="w-full max-w-[1700px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Top Clinical Progress Bar Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#103D29]/15 shadow-editorial space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm font-extrabold text-[#17251D]">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-full bg-[#103D29] text-white flex items-center justify-center text-xs font-mono font-bold shadow-xs">
              4
            </span>
            <div className="flex flex-col">
              <span className="text-[#103D29] font-black uppercase tracking-wider text-[11px]">
                Renewix Clinical Diagnosis
              </span>
              <span className="text-[#17251D] text-base font-extrabold">
                Interactive Diagnostic Interview
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF3E5] border border-[#103D29]/15 text-[#103D29] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#E28E5C]" />
              <span>
                Adaptive Clinical Flow ({totalQuestions} Questions)
              </span>
            </div>
            <span className="text-[#68736A] font-extrabold text-sm font-mono">
              Q{currentIndex + 1} of {totalQuestions}
            </span>
          </div>
        </div>

        {/* 5-Step Visual Stepper Bar */}
        <div className="grid grid-cols-5 gap-2 pt-1">
          {allQuestions.map((q, idx) => {
            const isAnswered = answers[q.id] !== undefined;
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => jumpToQuestion(idx)}
                className={`group relative h-2.5 rounded-full transition-all duration-300 cursor-pointer overflow-hidden ${
                  isCurrent
                    ? 'bg-[#103D29] ring-2 ring-[#103D29]/30 ring-offset-2'
                    : isAnswered
                    ? 'bg-[#103D29]'
                    : 'bg-[#103D29]/15 hover:bg-[#103D29]/30'
                }`}
                title={`Question ${idx + 1}: ${q.isAdaptive ? 'Adaptive Follow-up' : 'Core Question'}`}
              >
                {isCurrent && (
                  <span className="absolute inset-0 bg-white/30 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Question Card (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#103D29]/15 shadow-editorial space-y-7 relative overflow-hidden">
            {/* Header Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#D9E5C4] text-[#103D29] text-xs font-black uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5 text-[#103D29]" />
                <span>{currentQ.tag || 'AI Diagnostic Verification'}</span>
              </div>

              {currentQ.isAdaptive ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F9C49B]/30 border border-[#E28E5C]/30 text-[#17251D] text-[11px] font-bold animate-in fade-in">
                  <Sparkles className="w-3.5 h-3.5 text-[#E28E5C] animate-spin-slow" />
                  <span>Adaptive Dynamic Question</span>
                </div>
              ) : (
                <span className="text-[11px] font-extrabold text-[#68736A] uppercase tracking-wider">
                  Question {currentIndex + 1}
                </span>
              )}
            </div>

            {/* Question Text */}
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black text-[#17251D] leading-snug">
                {currentQ.text}
              </h2>

              {currentQ.adaptiveTrigger && (
                <div className="p-2.5 rounded-xl bg-[#FFF3E5] border border-[#103D29]/10 text-xs font-semibold text-[#103D29] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#E28E5C] flex-shrink-0" />
                  <span>{currentQ.adaptiveTrigger}</span>
                </div>
              )}
            </div>

            {/* Why This Matters Clinical Card */}
            {currentQ.why && (
              <div className="p-4 rounded-2xl bg-[#FFF3E5]/60 border border-[#103D29]/15 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 font-extrabold text-[#103D29] uppercase tracking-wider text-[11px]">
                  <HelpCircle className="w-3.5 h-3.5 text-[#103D29]" />
                  <span>Why the AI asks this</span>
                </div>
                <p className="text-[#17251D] font-medium leading-relaxed pl-5">
                  {currentQ.why}
                </p>
              </div>
            )}

            {/* Primary Interactive Choice Buttons */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* YES Button */}
                <button
                  type="button"
                  onClick={() => handleAnswer(true)}
                  className={`group relative flex flex-col items-center justify-center p-6 sm:p-7 rounded-3xl border-2 transition-all duration-200 cursor-pointer shadow-xs ${
                    answers[currentQ.id] === true || lastSelected === true
                      ? 'bg-[#103D29] text-white border-[#103D29] scale-[1.01]'
                      : 'bg-white hover:bg-[#D9E5C4]/35 border-[#103D29]/20 hover:border-[#103D29] text-[#17251D]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/5 text-[#68736A] uppercase">
                      Hotkey [Y]
                    </span>
                    <CheckCircle2
                      className={`w-7 h-7 transition-transform group-hover:scale-110 ${
                        answers[currentQ.id] === true || lastSelected === true
                          ? 'text-[#D9E5C4]'
                          : 'text-[#103D29]'
                      }`}
                    />
                  </div>
                  <span className="font-black text-xl mb-1">Yes</span>
                  <span
                    className={`text-xs font-semibold ${
                      answers[currentQ.id] === true || lastSelected === true
                        ? 'text-[#D9E5C4]'
                        : 'text-[#68736A]'
                    }`}
                  >
                    Confirmed / Present
                  </span>
                </button>

                {/* NO Button */}
                <button
                  type="button"
                  onClick={() => handleAnswer(false)}
                  className={`group relative flex flex-col items-center justify-center p-6 sm:p-7 rounded-3xl border-2 transition-all duration-200 cursor-pointer shadow-xs ${
                    answers[currentQ.id] === false || lastSelected === false
                      ? 'bg-[#17251D] text-white border-[#17251D] scale-[1.01]'
                      : 'bg-white hover:bg-[#F9C49B]/30 border-[#103D29]/20 hover:border-[#E28E5C] text-[#17251D]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-black/5 text-[#68736A] uppercase">
                      Hotkey [N]
                    </span>
                    <XCircle
                      className={`w-7 h-7 transition-transform group-hover:scale-110 ${
                        answers[currentQ.id] === false || lastSelected === false
                          ? 'text-[#F9C49B]'
                          : 'text-[#E28E5C]'
                      }`}
                    />
                  </div>
                  <span className="font-black text-xl mb-1">No</span>
                  <span
                    className={`text-xs font-semibold ${
                      answers[currentQ.id] === false || lastSelected === false
                        ? 'text-[#F9C49B]'
                        : 'text-[#68736A]'
                    }`}
                  >
                    Not Observed / Absent
                  </span>
                </button>
              </div>

              {/* Secondary Options: Intermittent & Not Sure */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleAnswer(true)}
                  className="px-4 py-3 rounded-2xl bg-white border border-[#103D29]/20 hover:border-[#103D29] hover:bg-[#FFF3E5] transition-all text-xs font-bold text-[#17251D] flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Activity className="w-3.5 h-3.5 text-[#E28E5C]" />
                  <span>Intermittent / Sometimes</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAnswer(false)}
                  className="px-4 py-3 rounded-2xl bg-white border border-[#103D29]/20 hover:border-[#103D29] hover:bg-[#FFF3E5] transition-all text-xs font-bold text-[#68736A] hover:text-[#17251D] flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[#68736A]" />
                  <span>Not Sure / Cannot Verify</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Navigation & Skip Actions */}
          <div className="flex items-center justify-between gap-4 pt-2">
            {currentIndex > 0 ? (
              <button
                type="button"
                onClick={() => setCurrentIndex(currentIndex - 1)}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-white text-[#103D29] border-2 border-[#103D29]/20 font-extrabold text-xs hover:bg-[#FFF3E5] transition-colors cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-4 h-4 text-[#103D29]" />
                <span>Previous Question</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={() => {
                sessionStore.setQuestions(allQuestions);
                sessionStorage.setItem('answers', JSON.stringify(answers));
                navigate('/analyzing');
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#103D29] text-white font-extrabold text-xs sm:text-sm hover:bg-[#174C32] transition-colors shadow-editorial cursor-pointer"
            >
              <span>Skip Remaining & Run Analysis</span>
              <ArrowRight className="w-4 h-4 text-[#F9C49B]" />
            </button>
          </div>
        </div>

        {/* Right Column: Live AI Diagnostic Telemetry & Dynamic Hypothesis (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Telemetry Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-[#103D29]/15 shadow-editorial space-y-6">
            {/* Live Indicator Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#103D29]/10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#103D29]" />
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-[#103D29]">
                  Live Diagnostic Telemetry
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-[#68736A]">
                RENEWIX v2.4
              </span>
            </div>

            {/* Device Snapshot */}
            <div className="p-4 rounded-2xl bg-[#FFF3E5] border border-[#103D29]/15 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#103D29] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Smartphone className="w-5 h-5 text-[#F9C49B]" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-[10px] font-extrabold text-[#68736A] uppercase tracking-wider">
                  Target Device Under Test
                </div>
                <div className="text-sm font-extrabold text-[#17251D] truncate">
                  {deviceBrand} {deviceModel}
                </div>
              </div>
            </div>

            {/* Real-time Confidence Score Gauge */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-extrabold text-[#17251D]">
                  Diagnostic Confidence Index
                </span>
                <span className="text-lg font-black text-[#103D29] font-mono">
                  {confidenceScore}%
                </span>
              </div>
              <div className="h-3 bg-[#103D29]/10 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#103D29] to-[#E28E5C] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${confidenceScore}%` }}
                />
              </div>
              <p className="text-[11px] text-[#68736A] font-medium leading-snug">
                {answeredCount < 3
                  ? 'Gathering primary symptoms to form fault hypothesis...'
                  : answeredCount < 5
                  ? 'Refining component-level precision through adaptive branching...'
                  : 'Maximum clinical certainty achieved. Ready for component pricing.'}
              </p>
            </div>

            {/* Real-time Fault Probability Breakdown */}
            <div className="space-y-3 pt-2 border-t border-[#103D29]/10">
              <div className="flex items-center justify-between text-xs font-extrabold text-[#17251D]">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#103D29]" />
                  <span>Estimated Fault Distribution</span>
                </span>
                <span className="text-[10px] text-[#68736A] font-mono font-bold">
                  Dynamic
                </span>
              </div>

              <div className="space-y-2.5">
                {faultProbabilities.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-[#17251D]">
                      <span className="truncate pr-2">{item.label}</span>
                      <span className="font-mono text-[#103D29] flex-shrink-0">
                        {item.pct}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#103D29]/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Answer Log & Instant Jump */}
            <div className="space-y-2.5 pt-3 border-t border-[#103D29]/10">
              <div className="flex items-center justify-between text-xs font-extrabold text-[#17251D]">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#103D29]" />
                  <span>Session Response History</span>
                </span>
                <span className="text-[10px] text-[#68736A]">
                  Click to revise
                </span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {allQuestions.map((q, idx) => {
                  const ans = answers[q.id];
                  const hasAnswer = ans !== undefined;
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => jumpToQuestion(idx)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                        isCurrent
                          ? 'bg-[#FFF3E5] border border-[#103D29]/20'
                          : 'bg-white hover:bg-black/5 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="font-mono font-extrabold text-[#68736A] text-[11px]">
                          Q{idx + 1}
                        </span>
                        <span className="truncate font-medium text-[#17251D]">
                          {q.text}
                        </span>
                      </div>

                      {hasAnswer ? (
                        <span
                          className={`flex-shrink-0 px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                            ans
                              ? 'bg-[#D9E5C4] text-[#103D29]'
                              : 'bg-[#F9C49B]/50 text-[#17251D]'
                          }`}
                        >
                          {ans ? 'Yes' : 'No'}
                        </span>
                      ) : (
                        <span className="flex-shrink-0 text-[10px] text-[#68736A] font-semibold">
                          Pending
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Clinical Diagnostic Guarantee Card */}
          <div className="p-4 rounded-3xl bg-[#D9E5C4]/40 border border-[#103D29]/15 flex items-start gap-3 text-xs text-[#17251D]">
            <ShieldCheck className="w-5 h-5 text-[#103D29] flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-black text-[#103D29] block">
                Non-Destructive Testing Safety Protocol
              </strong>
              <p className="text-[#68736A] leading-relaxed">
                All questions adhere to non-destructive electrical and structural diagnostic standards. No disassembly or tools required during this stage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}