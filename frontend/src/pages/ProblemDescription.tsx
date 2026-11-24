import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Camera,
  Upload,
  ArrowRight,
  Loader2,
  Sparkles,
  RefreshCw,
  Trash2,
  AlertCircle,
  Film,
  Check,
  X,
} from 'lucide-react';
import { api, sessionStore } from '../lib/api';
import {
  resizeAndCompressImage,
  extractVideoFrame,
  inspectHardwareDamageOrGlitch,
  matchSymptomsFromDamageText,
  DamageOrGlitchResult,
} from '../lib/visionDetector';

interface SymptomOption {
  id: string;
  label: string;
  tag?: string;
  priority?: number;
}

const BASE_DEVICE_SYMPTOMS: Record<string, SymptomOption[]> = {
  smartphone: [
    { id: 'screen_cracked', label: 'Screen cracked or shattered' },
    { id: 'lines_on_screen', label: 'Vertical or horizontal colored lines' },
    { id: 'battery_drain', label: 'Battery draining fast' },
    { id: 'not_charging', label: 'Won\'t charge / loose port' },
    { id: 'water_damage', label: 'Water or liquid ingress' },
    { id: 'camera_not_working', label: 'Camera blurry or crashing' },
    { id: 'buttons_unresponsive', label: 'Power/volume buttons unresponsive' },
    { id: 'network_issues', label: 'No cellular signal / dropped calls' },
    { id: 'touchscreen_frozen', label: 'Touchscreen frozen or ghost touch' },
  ],
  laptop: [
    { id: 'not_charging', label: 'Not charging / adapter failure' },
    { id: 'wont_turn_on', label: 'Won\'t turn on / black screen' },
    { id: 'screen_issue', label: 'Screen flickering, lines, or cracked' },
    { id: 'overheating', label: 'Overheating & loud fan noise' },
    { id: 'slow_performance', label: 'Running very slow or freezing' },
    { id: 'wifi_issues', label: 'WiFi disconnecting or no signal' },
    { id: 'trackpad_issues', label: 'Trackpad jumping or not clicking' },
  ],
  headphones: [
    { id: 'one_side_silent', label: 'One side silent or muffled' },
    { id: 'bluetooth_disconnect', label: 'Bluetooth disconnects or won\'t pair' },
    { id: 'distorted_sound', label: 'Distorted or crackling audio' },
    { id: 'case_not_charging', label: 'Charging case won\'t charge' },
    { id: 'broken_hinge_cable', label: 'Broken hinge, headband, or cable' },
    { id: 'mic_not_working', label: 'Microphone not picking up audio' },
  ],
  television: [
    { id: 'screen_black_no_display', label: 'Black screen with sound' },
    { id: 'lines_on_screen', label: 'Horizontal/vertical colored lines' },
    { id: 'no_sound', label: 'Picture fine but no sound' },
    { id: 'wont_turn_on', label: 'Won\'t turn on / standby LED blinking' },
    { id: 'hdmi_not_working', label: 'HDMI port not recognizing input' },
  ],
  washing_machine: [
    { id: 'not_spinning', label: 'Drum not spinning / agitating' },
    { id: 'leaking_water', label: 'Water leaking from bottom or door' },
    { id: 'not_draining', label: 'Water not draining out' },
    { id: 'excessive_vibration', label: 'Violent shaking or vibration' },
    { id: 'wont_start_no_power', label: 'Won\'t start / no power' },
  ],
  refrigerator: [
    { id: 'not_cooling', label: 'Not cooling / freezer warm' },
    { id: 'excessive_frost_ice', label: 'Heavy ice or frost buildup' },
    { id: 'water_leakage', label: 'Water pooling inside or underneath' },
    { id: 'compressor_clicking_noise', label: 'Compressor clicking / humming loudly' },
  ],
  air_conditioner: [
    { id: 'not_cooling_blowing_warm', label: 'Blowing warm air instead of cooling' },
    { id: 'water_dripping_leak', label: 'Water dripping down indoor unit' },
    { id: 'foul_smell_or_smoke', label: 'Foul smell or odor from vents' },
    { id: 'remote_unresponsive_pcb', label: 'Display or remote unresponsive' },
  ],
  router: [
    { id: 'no_internet_led_red', label: 'No Internet / Red LED light' },
    { id: 'frequent_disconnects', label: 'Frequent WiFi dropouts' },
    { id: 'slow_wifi_speeds', label: 'Extremely slow throughput' },
  ],
  printer: [
    { id: 'paper_jam', label: 'Paper repeatedly jamming' },
    { id: 'faded_or_streaked_prints', label: 'Faded, streaked, or missing lines' },
    { id: 'printer_offline', label: 'Printer showing offline or disconnected' },
  ],
  mixer_blender: [
    { id: 'motor_smells_burning', label: 'Burning smell or sparks from motor' },
    { id: 'blades_not_spinning_jammed', label: 'Blades jammed or motor humming' },
    { id: 'jar_leaking_bottom', label: 'Liquid leaking from jar base' },
  ],
  electric_kettle: [
    { id: 'not_heating_water', label: 'Power light on but water stays cold' },
    { id: 'auto_shutoff_not_working', label: 'Does not turn off automatically' },
    { id: 'water_leaking_seals', label: 'Water leaking from bottom base' },
  ],
  gaming_console: [
    { id: 'overheating_fan_jet_noise', label: 'Loud jet fan & thermal shutdown' },
    { id: 'no_video_hdmi_port', label: 'Console powers on but TV has no signal' },
    { id: 'disc_drive_not_reading', label: 'Disc drive not reading or ejecting' },
  ],
  power_bank: [
    { id: 'swollen_battery_casing', label: 'Bulging or swollen battery casing' },
    { id: 'not_holding_charge', label: 'Charge drops from 100% to 0% fast' },
    { id: 'wont_charge_itself', label: 'Power bank itself will not recharge' },
  ],
  other_device: [
    { id: 'wont_turn_on', label: 'Device will not power on' },
    { id: 'physical_damage', label: 'Visible physical damage or crack' },
    { id: 'intermittent_operation', label: 'Cuts out intermittently' },
  ],
};

export default function ProblemDescription() {
  const [searchParams] = useSearchParams();
  const deviceId = searchParams.get('device') || 'laptop';
  const navigate = useNavigate();

  const [text, setText] = useState('');
  // Multi-select state for symptoms
  const [selectedSymptomIds, setSelectedSymptomIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzingMedia, setAnalyzingMedia] = useState(false);
  const [error, setError] = useState('');

  // AI Suggestion Banner State (persists from previous step or media upload)
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  // Media attachment states (Image or Video)
  const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const [mediaFileName, setMediaFileName] = useState<string | null>(null);
  const [inspectionResult, setInspectionResult] = useState<DamageOrGlitchResult | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Retrieve intakeData to dynamically adapt symptoms
  const intakeData = useMemo(() => {
    try {
      const stored = sessionStorage.getItem('intakeData');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }, []);

  // Compute dynamically adapted common symptoms
  const adaptedSymptoms = useMemo(() => {
    const list: SymptomOption[] = [
      ...(BASE_DEVICE_SYMPTOMS[deviceId.toLowerCase()] || BASE_DEVICE_SYMPTOMS.other_device),
    ];

    // Boost or add based on device age (e.g. > 3 years)
    if (intakeData.ageYears && intakeData.ageYears >= 3) {
      if (!list.some((s) => s.id === 'battery_drain')) {
        list.unshift({
          id: 'battery_drain',
          label: 'Degraded battery / early shutdown',
          tag: `Age (${Math.round(intakeData.ageYears)} yrs)`,
        });
      }
    }

    // Boost based on prior repairs
    if (intakeData.priorRepairs && intakeData.priorRepairs !== 'NONE') {
      list.unshift({
        id: 'prior_repair_recurrence',
        label: 'Recurring fault from prior repair',
        tag: 'Prior Repair',
      });
    }

    // Boost based on heavy usage
    if (intakeData.usageIntensity === 'HEAVY') {
      list.unshift({
        id: 'overheating_heavy_load',
        label: 'Overheating / throttling under heavy use',
        tag: 'Heavy Usage',
      });
    }

    // Identify AI-suggested symptoms matching the damage description
    const currentDamageText =
      inspectionResult?.detectedDamage ||
      inspectionResult?.problemDescription ||
      aiSuggestion ||
      intakeData.detectedDamage ||
      '';

    const aiMatchedIds = matchSymptomsFromDamageText(currentDamageText, list);

    // Boost AI-suggested symptoms to the top with prominent AI badges
    if (aiMatchedIds.length > 0) {
      const prioritized: SymptomOption[] = [];
      const remaining: SymptomOption[] = [];

      list.forEach((item) => {
        if (aiMatchedIds.includes(item.id)) {
          prioritized.push({
            ...item,
            tag: '⚡ AI Suggested',
          });
        } else {
          remaining.push(item);
        }
      });

      return [...prioritized, ...remaining];
    }

    return list;
  }, [deviceId, intakeData, inspectionResult, aiSuggestion]);

  // Initialize AI suggestion on mount (from previous intake scan if available)
  useEffect(() => {
    const damage = intakeData.detectedDamage || intakeData.detectedSpecs;
    if (
      damage &&
      damage !== 'No physical damage visible' &&
      !damage.toLowerCase().includes('none detected') &&
      !damage.toLowerCase().includes('unknown')
    ) {
      setAiSuggestion(damage);
      setText(damage);

      // Auto-match and auto-select matching symptoms based on recognized damage!
      const matched = matchSymptomsFromDamageText(damage, adaptedSymptoms);
      if (matched.length > 0) {
        setSelectedSymptomIds(matched);
      }
    } else if (intakeData.imagePreview) {
      // If an intake photo was provided but damage wasn't explicitly saved, inspect it now
      const base64 = intakeData.imagePreview.includes(',')
        ? intakeData.imagePreview.split(',')[1]
        : intakeData.imagePreview;

      if (base64) {
        setAnalyzingMedia(true);
        inspectHardwareDamageOrGlitch(base64, 'image/jpeg', deviceId, false)
          .then((res) => {
            const desc = res.problemDescription || res.detectedDamage;
            if (
              desc &&
              !desc.toLowerCase().includes('component evaluation') &&
              !desc.toLowerCase().includes('no physical damage')
            ) {
              setAiSuggestion(desc);
              setText(desc);
              const matched = matchSymptomsFromDamageText(desc, adaptedSymptoms);
              if (res.matchedSymptomId && !matched.includes(res.matchedSymptomId)) {
                matched.push(res.matchedSymptomId);
              }
              if (matched.length > 0) {
                setSelectedSymptomIds(matched);
              }
            }
          })
          .catch((err) => console.warn('Background damage inspection error:', err))
          .finally(() => setAnalyzingMedia(false));
      }
    }

    if (intakeData.imagePreview) {
      setMediaPreviewUrl(intakeData.imagePreview);
      setMediaType('image');
      setMediaFileName('Intake Photo Scan');
    }
  }, [intakeData, deviceId]);

  // Handle Photo / Screenshot Upload
  const handleImageUpload = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;

    setAnalyzingMedia(true);
    setError('');
    setMediaType('image');
    setMediaFileName(file.name);

    try {
      const { base64, mimeType, previewUrl } = await resizeAndCompressImage(file, 1024, 0.78);
      setMediaPreviewUrl(previewUrl);

      const result = await inspectHardwareDamageOrGlitch(base64, mimeType, deviceId, false);
      setInspectionResult(result);

      const suggestion = result.detectedDamage || result.problemDescription;
      if (suggestion) {
        setAiSuggestion(suggestion);
        setText(result.problemDescription || suggestion);

        // Auto-match and auto-select symptoms based on detected damage
        const matched = matchSymptomsFromDamageText(suggestion, adaptedSymptoms);
        if (result.matchedSymptomId && !matched.includes(result.matchedSymptomId)) {
          matched.push(result.matchedSymptomId);
        }
        if (matched.length > 0) {
          setSelectedSymptomIds((prev) => Array.from(new Set([...prev, ...matched])));
        }
      }
    } catch (err: any) {
      console.warn('Image damage inspection issue:', err);
      setError('Could not inspect image automatically. You can describe the issue below.');
    } finally {
      setAnalyzingMedia(false);
    }
  };

  // Handle Video / Screen Recording Upload (glitch in motion)
  const handleVideoUpload = async (file: File) => {
    if (!file || !file.type.startsWith('video/')) return;

    setAnalyzingMedia(true);
    setError('');
    setMediaType('video');
    setMediaFileName(file.name);

    const videoUrl = URL.createObjectURL(file);
    setMediaPreviewUrl(videoUrl);

    try {
      const { base64, mimeType } = await extractVideoFrame(file, 1);
      const result = await inspectHardwareDamageOrGlitch(base64, mimeType, deviceId, true);
      setInspectionResult(result);

      const suggestion = result.detectedDamage || result.problemDescription;
      if (suggestion) {
        setAiSuggestion(suggestion);
        setText(result.problemDescription || suggestion);

        // Auto-match and auto-select symptoms based on video glitch
        const matched = matchSymptomsFromDamageText(suggestion, adaptedSymptoms);
        if (result.matchedSymptomId && !matched.includes(result.matchedSymptomId)) {
          matched.push(result.matchedSymptomId);
        }
        if (matched.length > 0) {
          setSelectedSymptomIds((prev) => Array.from(new Set([...prev, ...matched])));
        }
      }
    } catch (err: any) {
      console.warn('Video glitch extraction issue:', err);
      setError('Could not inspect video frame automatically. Please describe the glitch below.');
    } finally {
      setAnalyzingMedia(false);
    }
  };

  const clearAttachedMedia = () => {
    setMediaType(null);
    setMediaPreviewUrl(null);
    setMediaFileName(null);
    setInspectionResult(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  // Multi-select toggle for symptoms
  const toggleSymptom = (symptom: SymptomOption) => {
    setSelectedSymptomIds((prev) => {
      const isAlreadySelected = prev.includes(symptom.id);
      const updated = isAlreadySelected
        ? prev.filter((id) => id !== symptom.id)
        : [...prev, symptom.id];

      // Current labels before toggle
      const currentSelectedLabels = adaptedSymptoms
        .filter((s) => prev.includes(s.id))
        .map((s) => s.label);

      // Only sync text to symptom labels if user hasn't provided a rich description / AI suggestion
      const isTextJustSymptoms =
        !text.trim() ||
        text === currentSelectedLabels.join(', ') ||
        currentSelectedLabels.some((l) => text.trim() === l);

      const newSelectedLabels = adaptedSymptoms
        .filter((s) => updated.includes(s.id))
        .map((s) => s.label);

      if (isTextJustSymptoms) {
        if (newSelectedLabels.length > 0) {
          setText(newSelectedLabels.join(', '));
        } else {
          setText('');
        }
      }

      return updated;
    });
  };

  const clearAllSymptoms = () => {
    setSelectedSymptomIds([]);
    if (!aiSuggestion) {
      setText('');
    }
  };

  const handleUseAiSuggestion = () => {
    if (!aiSuggestion) return;
    setText(aiSuggestion);

    // Auto-match and auto-select all symptoms matching this damage recognized
    const matched = matchSymptomsFromDamageText(aiSuggestion, adaptedSymptoms);
    if (matched.length > 0) {
      setSelectedSymptomIds(matched);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError('');

    try {
      const primarySymptomId = selectedSymptomIds[0] || inspectionResult?.matchedSymptomId;
      let sessId = 'session_' + Date.now();
      let qList: any[] = [];

      try {
        const res = await api.startDiagnosis(
          deviceId,
          text,
          {
            ...intakeData,
            selectedSymptoms: selectedSymptomIds,
          },
          primarySymptomId || undefined
        );

        if (res?.data?.sessionId) sessId = res.data.sessionId;
        else if (res?.sessionId) sessId = res.sessionId;

        if (Array.isArray(res?.data?.questions)) qList = res.data.questions;
        else if (Array.isArray(res?.questions)) qList = res.questions;
      } catch (callErr: any) {
        console.warn('api.startDiagnosis caught issue, continuing autonomously:', callErr);
      }

      sessionStore.setSessionId(sessId);
      if (qList && qList.length > 0) {
        sessionStore.setQuestions(qList);
      }
      sessionStorage.setItem('deviceId', deviceId);
      sessionStorage.setItem('problemText', text);
      if (primarySymptomId) {
        sessionStorage.setItem('primarySymptomId', primarySymptomId);
      }
      sessionStorage.setItem('selectedSymptoms', JSON.stringify(selectedSymptomIds));
      sessionStorage.removeItem('answers');
      navigate('/interview');
    } catch (err: any) {
      console.warn('Unhandled navigation issue, falling back to autonomous interview:', err);
      sessionStore.setSessionId('session_' + Date.now());
      sessionStorage.setItem('deviceId', deviceId);
      sessionStorage.setItem('problemText', text);
      navigate('/interview');
    }
  };

  return (
    <div className="w-full max-w-[1700px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Multi-Step Diagnostic Progress Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#103D29]/15 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#17251D]">
          <span className="flex items-center gap-2 text-[#103D29]">
            <span className="w-6 h-6 rounded-full bg-[#103D29] text-white flex items-center justify-center text-xs">3</span>
            Step 3 of 4: Symptom Description & Glitch Media
          </span>
          <span className="text-[#68736A]">Next: Diagnostic Clinical Interview</span>
        </div>
        <div className="w-full h-2 bg-[#103D29]/10 rounded-full overflow-hidden">
          <div className="w-3/4 h-full bg-[#103D29] rounded-full transition-all duration-500" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#D9E5C4]/70 border border-[#103D29]/20 text-[#103D29] text-[11px] font-bold uppercase tracking-wider mb-1">
            Defect Analysis
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#17251D] tracking-tight">
            What's the issue with your {intakeData.brand || ''} {deviceId.replace(/_/g, ' ')}?
          </h2>
          <p className="text-xs sm:text-sm text-[#68736A] font-medium mt-1">
            Describe the malfunction, attach photo or glitch video, or pick symptoms from the right-hand panel.
          </p>
        </div>
      </div>

      {/* Full-width Responsive 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Textarea, Attachments, and Primary Submission */}
        <div className="lg:col-span-7 space-y-6">
          {/* AI Visual Inspection Suggestion Banner */}
          {aiSuggestion && (
            <div className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#D9E5C4] border-2 border-[#103D29]/25 text-xs sm:text-sm text-[#103D29] shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center gap-2.5 truncate">
                <Sparkles className="w-5 h-5 text-[#103D29] flex-shrink-0 animate-pulse" />
                <span className="truncate">
                  <strong className="font-extrabold">AI Visual Inspection Suggestion:</strong> {aiSuggestion}
                </span>
              </div>
              <button
                type="button"
                onClick={handleUseAiSuggestion}
                className="flex-shrink-0 font-extrabold px-3 py-1.5 rounded-xl bg-[#103D29] text-white hover:bg-[#174C32] transition-colors cursor-pointer shadow-xs text-xs"
              >
                Use This
              </button>
            </div>
          )}

          {/* Main Text & Media Form */}
          <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 sm:p-7 rounded-3xl border-2 border-[#103D29]/15 shadow-editorial">
            {/* Hidden Inputs */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImageUpload(f);
              }}
            />
            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleVideoUpload(f);
              }}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImageUpload(f);
              }}
            />

            {/* Media Preview Box (Photo or Video Player) */}
            {mediaPreviewUrl && (
              <div className="relative rounded-2xl border-2 border-[#103D29]/20 bg-[#FFF3E5] p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#103D29]">
                    {mediaType === 'video' ? <Film className="w-4 h-4 text-[#103D29]" /> : <Camera className="w-4 h-4 text-[#103D29]" />}
                    {mediaType === 'video' ? 'Glitch Recording Attached' : 'Inspection Photo Attached'}
                  </span>
                  <button
                    type="button"
                    onClick={clearAttachedMedia}
                    className="p-1 rounded-lg text-[#68736A] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Remove attached media"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {mediaType === 'video' ? (
                  <video
                    src={mediaPreviewUrl}
                    controls
                    playsInline
                    className="w-full max-h-64 rounded-xl bg-black object-contain border border-[#103D29]/15"
                  />
                ) : (
                  <div className="h-52 w-full rounded-xl overflow-hidden bg-white flex items-center justify-center border border-[#103D29]/15 shadow-inner">
                    <img src={mediaPreviewUrl} alt="Inspection" className="h-full w-auto object-contain" />
                  </div>
                )}

                {mediaFileName && (
                  <span className="text-xs font-semibold text-[#68736A] truncate">{mediaFileName}</span>
                )}
              </div>
            )}

            {/* Problem Description Textarea with Integrated Media Controls */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#17251D]">
                Detailed Problem Description *
              </label>
              <div className="relative rounded-2xl border-2 border-[#103D29]/20 bg-white focus-within:border-[#103D29] focus-within:ring-2 focus-within:ring-[#103D29]/20 transition-all overflow-hidden shadow-inner">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-transparent p-4 min-h-[160px] focus:outline-none resize-none placeholder:text-[#68736A]/60 text-sm sm:text-base text-[#17251D] font-bold"
                  placeholder="e.g., Severe display panel failure with flickering vertical green lines and touch ghosting after dropped on pavement..."
                  required
                />

                {/* Action Attachment Bar at the bottom of the textarea */}
                <div className="flex flex-wrap items-center justify-between border-t-2 border-[#103D29]/10 px-4 py-3 bg-[#FFF3E5]/60 gap-2">
                  <div className="flex items-center gap-2">
                    {/* Photo Upload */}
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      disabled={analyzingMedia}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border-2 border-[#103D29]/20 hover:bg-[#F9EBDD] text-[#103D29] text-xs font-extrabold transition-all cursor-pointer shadow-xs"
                      title="Upload screenshot or photo of damage"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#103D29]" />
                      <span>Upload Photo</span>
                    </button>

                    {/* Video Upload for motion glitches */}
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      disabled={analyzingMedia}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border-2 border-[#103D29]/20 hover:bg-[#F9EBDD] text-[#103D29] text-xs font-extrabold transition-all cursor-pointer shadow-xs"
                      title="Upload video recording of screen flicker, bootloop, or glitch"
                    >
                      <Film className="w-3.5 h-3.5 text-[#103D29]" />
                      <span>Glitch Video</span>
                    </button>

                    {/* Live Camera */}
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current?.click()}
                      disabled={analyzingMedia}
                      className="p-2 rounded-xl bg-white border-2 border-[#103D29]/20 hover:bg-[#F9EBDD] text-[#103D29] transition-all cursor-pointer shadow-xs"
                      title="Take live photo with camera"
                    >
                      <Camera className="w-4 h-4 text-[#103D29]" />
                    </button>
                  </div>

                  {analyzingMedia && (
                    <span className="flex items-center gap-2 text-xs text-[#103D29] font-extrabold animate-pulse">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>AI inspecting visual defect...</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-200 text-xs text-red-800 font-bold flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="flex items-center justify-center gap-2.5 w-full min-h-[56px] py-4 rounded-2xl bg-[#103D29] hover:bg-[#174C32] text-white font-extrabold text-base disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-editorial hover:shadow-editorial-lg cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#F9C49B]" />
              ) : (
                <>
                  <span>Continue to Diagnostic Interview</span>
                  <ArrowRight className="w-5 h-5 text-[#F9C49B]" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column (5 cols): Dynamically Adapted Common Symptoms (Multi-Select Enabled) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border-2 border-[#103D29]/15 shadow-editorial space-y-4">
          <div className="flex items-center justify-between border-b border-[#103D29]/10 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-[#17251D] uppercase tracking-wider">
                Common Symptoms
              </h3>
              <p className="text-xs text-[#68736A] font-medium">Select multiple symptoms that apply</p>
            </div>

            {selectedSymptomIds.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#103D29] text-white font-extrabold">
                  {selectedSymptomIds.length} active
                </span>
                <button
                  type="button"
                  onClick={clearAllSymptoms}
                  className="text-xs text-[#68736A] hover:text-red-600 transition-colors flex items-center gap-0.5 cursor-pointer font-bold"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            {adaptedSymptoms.map((symptom) => {
              const isSelected = selectedSymptomIds.includes(symptom.id);
              return (
                <button
                  key={symptom.id}
                  type="button"
                  onClick={() => toggleSymptom(symptom)}
                  className={`group flex items-center justify-between p-3.5 rounded-2xl text-xs sm:text-sm font-extrabold border-2 transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-[#103D29] border-[#103D29] text-white shadow-sm'
                      : 'bg-white border-[#103D29]/15 text-[#17251D] hover:bg-[#F9EBDD] hover:border-[#103D29]/30'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-4 h-4 rounded-md flex items-center justify-center border-2 text-[10px] transition-colors shrink-0 ${
                        isSelected
                          ? 'bg-white border-white text-[#103D29] font-bold'
                          : 'border-[#103D29]/30 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                    <span className="truncate">{symptom.label}</span>
                  </div>
                  {symptom.tag && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-bold shrink-0 ml-2 ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : symptom.tag.includes('AI')
                          ? 'bg-[#D9E5C4] text-[#103D29]'
                          : 'bg-black/5 text-[#68736A]'
                      }`}
                    >
                      {symptom.tag}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
