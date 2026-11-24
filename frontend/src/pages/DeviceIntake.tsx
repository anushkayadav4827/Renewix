import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Camera,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  Info,
} from 'lucide-react';
import {
  resizeAndCompressImage,
  detectDeviceSpecs,
  inspectHardwareDamageOrGlitch,
  DeviceSpecsResult,
} from '../lib/visionDetector';

export default function DeviceIntake() {
  const [searchParams] = useSearchParams();
  const deviceId = searchParams.get('device') || 'laptop';
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    city: '',
    purchaseDate: '',
    purchasePriceINR: '',
    warrantyStatus: 'UNSURE',
    warrantyExpiry: '',
    priorRepairs: 'NONE',
    usageIntensity: 'MODERATE',
    budgetINR: '',
  });

  // Track fields populated by AI
  const [autoFilledFields, setAutoFilledFields] = useState<Record<string, boolean>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [aiSpecs, setAiSpecs] = useState<DeviceSpecsResult | null>(null);
  const [detectedDamage, setDetectedDamage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Once user manually edits a field, clear the auto-filled tag
    if (autoFilledFields[name]) {
      setAutoFilledFields((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleProcessImage = async (file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setAnalysisError('Please select a valid image (PNG, JPG, WEBP).');
      return;
    }

    setAnalyzingImage(true);
    setAnalysisError(null);
    setDetectedDamage(null);

    try {
      // 1. Fast in-browser resize (< 80ms)
      const { base64, mimeType, previewUrl } = await resizeAndCompressImage(file, 1024, 0.78);
      setImagePreview(previewUrl);

      // 2. Fast Spec Extraction AND Damage Inspection in Parallel (~1-1.5s)
      const [specsResult, damageResult] = await Promise.allSettled([
        detectDeviceSpecs(base64, mimeType, deviceId, file.name),
        inspectHardwareDamageOrGlitch(base64, mimeType, deviceId, false),
      ]);

      const specs = specsResult.status === 'fulfilled' ? specsResult.value : null;
      if (specs) {
        setAiSpecs(specs);
      }

      // Check for recognized hardware damage
      let damageDesc = '';
      if (damageResult.status === 'fulfilled') {
        const d = damageResult.value;
        const potentialDesc = d.problemDescription || d.detectedDamage || '';
        if (
          potentialDesc &&
          potentialDesc.toLowerCase() !== 'physical hardware damage' &&
          !potentialDesc.toLowerCase().includes('component evaluation') &&
          !potentialDesc.toLowerCase().includes('no physical damage')
        ) {
          damageDesc = potentialDesc;
        }
      }

      if (!damageDesc && specs?.detectedDamage && specs.detectedDamage.trim() !== '') {
        damageDesc = specs.detectedDamage;
      }

      if (damageDesc) {
        setDetectedDamage(damageDesc);
      }

      // 3. Auto-fill form fields
      if (specs) {
        const newAutoFilled: Record<string, boolean> = {};

        setFormData((prev) => {
          const updated = { ...prev };

          if (specs.brand && specs.brand.toLowerCase() !== 'unknown') {
            updated.brand = specs.brand;
            newAutoFilled.brand = true;
          }

          if (specs.model && specs.model.toLowerCase() !== 'unknown') {
            updated.model = specs.model;
            newAutoFilled.model = true;
          }

          if (specs.purchaseDate && /^\d{4}-\d{2}$/.test(specs.purchaseDate)) {
            updated.purchaseDate = specs.purchaseDate;
            newAutoFilled.purchaseDate = true;
          }

          if (specs.purchasePriceINR && /^\d+$/.test(specs.purchasePriceINR)) {
            updated.purchasePriceINR = specs.purchasePriceINR;
            newAutoFilled.purchasePriceINR = true;
          }

          if (specs.warrantyStatus) {
            updated.warrantyStatus = specs.warrantyStatus;
            newAutoFilled.warrantyStatus = true;
          }

          if (specs.priorRepairs) {
            updated.priorRepairs = specs.priorRepairs;
            newAutoFilled.priorRepairs = true;
          }

          if (specs.usageIntensity) {
            updated.usageIntensity = specs.usageIntensity;
            newAutoFilled.usageIntensity = true;
          }

          return updated;
        });

        setAutoFilledFields(newAutoFilled);
      }
    } catch (err: any) {
      console.warn('AI specs extraction issue:', err);
      setAnalysisError('Could not auto-read specs. You can fill the fields manually below.');
    } finally {
      setAnalyzingImage(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessImage(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleProcessImage(file);
  };

  const clearImage = () => {
    setImagePreview(null);
    setAiSpecs(null);
    setDetectedDamage(null);
    setAnalysisError(null);
    setAutoFilledFields({});
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate dynamic ageYears from purchaseDate
    let computedAgeYears = 0;
    if (formData.purchaseDate) {
      const pDate = new Date(formData.purchaseDate);
      const diffMs = Date.now() - pDate.getTime();
      computedAgeYears = Math.max(0, diffMs / (1000 * 60 * 60 * 24 * 365.25));
    }

    // Save to sessionStorage to pass to next screen
    sessionStorage.setItem(
      'intakeData',
      JSON.stringify({
        ...formData,
        ageYears: computedAgeYears,
        purchasePriceINR: Number(formData.purchasePriceINR) || 0,
        budgetINR: formData.budgetINR ? Number(formData.budgetINR) : undefined,
        detectedSpecs: aiSpecs?.detectedSpecs,
        detectedDamage: detectedDamage || aiSpecs?.detectedDamage || undefined,
        imagePreview: imagePreview || undefined,
      })
    );

    navigate(`/problem?device=${deviceId}`);
  };

  const isFormValid =
    formData.brand.trim() !== '' &&
    formData.model.trim() !== '' &&
    formData.city.trim() !== '' &&
    formData.purchaseDate !== '' &&
    formData.purchasePriceINR !== '';

  return (
    <div className="w-full max-w-[1700px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Multi-Step Diagnostic Progress Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#103D29]/15 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-[#17251D]">
          <span className="flex items-center gap-2 text-[#103D29]">
            <span className="w-6 h-6 rounded-full bg-[#103D29] text-white flex items-center justify-center text-xs">2</span>
            Step 2 of 4: Device Specifications & Intake
          </span>
          <span className="text-[#68736A]">Next: Symptom Description</span>
        </div>
        <div className="w-full h-2 bg-[#103D29]/10 rounded-full overflow-hidden">
          <div className="w-2/4 h-full bg-[#103D29] rounded-full transition-all duration-500" />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/device')}
            className="p-3 rounded-2xl bg-white border-2 border-[#103D29]/15 text-[#103D29] hover:bg-[#F9EBDD] transition-colors cursor-pointer shadow-sm"
            title="Back to device selection"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#D9E5C4]/70 border border-[#103D29]/20 text-[#103D29] text-[11px] font-bold uppercase tracking-wider mb-1">
              Diagnostic Intake
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#17251D] flex items-center gap-2.5">
              <ClipboardList className="w-7 h-7 text-[#103D29]" />
              Device Specifications
            </h2>
            <p className="text-xs sm:text-sm text-[#68736A] font-medium">
              Provide hardware details for your {deviceId.replace(/_/g, ' ')} or use AI auto-detection.
            </p>
          </div>
        </div>
      </div>

      {/* Full-width Responsive 2-Column Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 cols): AI Camera Scanner & Vision Assistant */}
        <div className="lg:col-span-5 space-y-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-300 p-6 bg-white shadow-editorial ${
              isDragging
                ? 'border-[#103D29] bg-[#D9E5C4]/30'
                : imagePreview
                ? 'border-[#103D29]/30'
                : 'border-dashed border-[#103D29]/30 hover:border-[#103D29]'
            }`}
          >
            {/* Hidden File Inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            {!imagePreview && !analyzingImage ? (
              <div className="space-y-5">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D9E5C4] text-[#103D29] text-xs font-extrabold border border-[#103D29]/20">
                    <Sparkles className="w-3.5 h-3.5 text-[#103D29]" />
                    AI Instant Specs Auto-Fill
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#17251D]">
                    Upload 'About' Screen, Settings, or Sticker
                  </h3>
                  <p className="text-xs sm:text-sm text-[#68736A] leading-relaxed font-medium">
                    Take a photo of your device settings screen or product label. Our AI vision detector reads brand, model, purchase timing, and recognized physical damage in ~1-2 seconds.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#103D29] text-white text-xs sm:text-sm font-extrabold hover:bg-[#174C32] transition-all shadow-sm cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-[#F9C49B]" />
                    <span>Upload Screenshot / Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border-2 border-[#103D29]/20 text-[#17251D] text-xs sm:text-sm font-extrabold hover:bg-[#F9EBDD] transition-all cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-[#103D29]" />
                    <span>Use Camera</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFF3E5] border border-[#103D29]/15 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#103D29]">
                    <Info className="w-4 h-4 text-[#103D29]" />
                    <span>Smart Autofill Tips</span>
                  </div>
                  <ul className="text-xs text-[#68736A] space-y-1 list-disc list-inside font-medium">
                    <li>Settings &gt; About Phone / About Device screen</li>
                    <li>Rear barcode or model number label on laptops/appliances</li>
                    <li>Receipt or invoice screenshot with model information</li>
                  </ul>
                </div>
              </div>
            ) : analyzingImage ? (
              <div className="py-10 flex flex-col items-center justify-center space-y-4">
                <RefreshCw className="w-10 h-10 text-[#103D29] animate-spin" />
                <div className="text-center space-y-1.5">
                  <p className="text-base font-extrabold text-[#17251D]">
                    Extracting device specifications...
                  </p>
                  <p className="text-xs sm:text-sm text-[#68736A] font-medium">
                    Scanning model identifiers, release timeframe, and hardware state (~1–2s)
                  </p>
                </div>
              </div>
            ) : (
              /* Image Preview & AI Extraction Results */
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#103D29]/20 flex-shrink-0 bg-black/5 shadow-sm">
                    <img
                      src={imagePreview || undefined}
                      alt="Device scan"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 text-[#103D29] text-xs font-extrabold bg-[#D9E5C4] px-2.5 py-1 rounded-full border border-[#103D29]/20">
                        <CheckCircle2 className="w-4 h-4 text-[#103D29]" />
                        {Object.values(autoFilledFields).filter(Boolean).length > 0
                          ? `Autofilled ${Object.values(autoFilledFields).filter(Boolean).length} Specs`
                          : 'AI Visual Scan Completed'}
                      </div>
                      <button
                        type="button"
                        onClick={clearImage}
                        className="p-1.5 rounded-xl text-[#68736A] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remove and retake"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {aiSpecs?.summary && (
                      <p className="text-xs font-semibold text-[#17251D] leading-snug line-clamp-2">
                        {aiSpecs.summary}
                      </p>
                    )}
                    {aiSpecs?.detectedSpecs && (
                      <p className="text-[11px] font-bold text-[#68736A] truncate">
                        Specs: {aiSpecs.detectedSpecs}
                      </p>
                    )}
                  </div>
                </div>

                {/* Recognized Hardware Damage */}
                {detectedDamage && (
                  <div className="p-3.5 rounded-2xl bg-[#FFF3E5] border-2 border-[#103D29]/25 text-xs text-[#17251D] space-y-1">
                    <div className="flex items-center gap-1.5 font-extrabold text-[#103D29]">
                      <Sparkles className="w-4 h-4 text-[#103D29]" />
                      <span>Hardware Damage Recognized:</span>
                    </div>
                    <p className="font-semibold text-[#17251D] pl-5">{detectedDamage}</p>
                  </div>
                )}

                {/* Verification Prompt */}
                <div className="p-3 rounded-xl bg-[#D9E5C4]/50 border border-[#103D29]/20 text-xs text-[#17251D] flex items-center gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 text-[#103D29]" />
                  <span className="font-medium">
                    Review and adjust any fields in the form if needed before proceeding.
                  </span>
                </div>
              </div>
            )}

            {analysisError && (
              <div className="mt-4 p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-xs text-amber-900 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                <span className="font-semibold">{analysisError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (7 cols): Clean High-Contrast Intake Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#103D29]/15 shadow-editorial space-y-6">
          <div className="border-b border-[#103D29]/10 pb-4">
            <h3 className="text-xl font-extrabold text-[#17251D]">Device Details Form</h3>
            <p className="text-xs sm:text-sm text-[#68736A] font-medium">Fields marked with an asterisk (*) are required for accurate repair vs replace calculation.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#17251D]">Brand *</label>
                  {autoFilledFields.brand && (
                    <span className="text-[10px] font-extrabold tracking-wide text-[#103D29] bg-[#D9E5C4] border border-[#103D29]/20 px-2 py-0.5 rounded-full">
                      AI Detected
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className={`w-full bg-white border-2 rounded-xl p-3 text-sm sm:text-base text-[#17251D] font-bold focus:outline-none focus:border-[#103D29] focus:ring-2 focus:ring-[#103D29]/20 placeholder:text-[#68736A]/60 transition-all ${
                    autoFilledFields.brand ? 'border-[#103D29] bg-[#D9E5C4]/20' : 'border-[#103D29]/20'
                  }`}
                  placeholder="e.g., Apple, Samsung, Dell"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#17251D]">Model *</label>
                  {autoFilledFields.model && (
                    <span className="text-[10px] font-extrabold tracking-wide text-[#103D29] bg-[#D9E5C4] border border-[#103D29]/20 px-2 py-0.5 rounded-full">
                      AI Detected
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className={`w-full bg-white border-2 rounded-xl p-3 text-sm sm:text-base text-[#17251D] font-bold focus:outline-none focus:border-[#103D29] focus:ring-2 focus:ring-[#103D29]/20 placeholder:text-[#68736A]/60 transition-all ${
                    autoFilledFields.model ? 'border-[#103D29] bg-[#D9E5C4]/20' : 'border-[#103D29]/20'
                  }`}
                  placeholder="e.g., iPhone 13, XPS 15, Galaxy S22"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-extrabold uppercase tracking-wider text-[#17251D]">City (For local verified repair shops) *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full bg-white border-2 border-[#103D29]/20 rounded-xl p-3 text-sm sm:text-base text-[#17251D] font-bold focus:outline-none focus:border-[#103D29] focus:ring-2 focus:ring-[#103D29]/20 placeholder:text-[#68736A]/60 transition-all"
                placeholder="e.g., Bengaluru, Mumbai, Delhi, Hyderabad"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#17251D]">Purchase Date (Month & Year) *</label>
                  {autoFilledFields.purchaseDate && (
                    <span className="text-[10px] font-extrabold tracking-wide text-[#103D29] bg-[#D9E5C4] border border-[#103D29]/20 px-2 py-0.5 rounded-full">
                      AI Estimated
                    </span>
                  )}
                </div>
                <input
                  type="month"
                  name="purchaseDate"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  min={new Date(new Date().setFullYear(new Date().getFullYear() - 20)).toISOString().slice(0, 7)}
                  max={new Date().toISOString().slice(0, 7)}
                  className={`w-full bg-white border-2 rounded-xl p-3 text-sm sm:text-base text-[#17251D] font-bold focus:outline-none focus:border-[#103D29] focus:ring-2 focus:ring-[#103D29]/20 transition-all ${
                    autoFilledFields.purchaseDate ? 'border-[#103D29] bg-[#D9E5C4]/20' : 'border-[#103D29]/20'
                  }`}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#17251D]">Original Purchase Price (INR) *</label>
                  {autoFilledFields.purchasePriceINR && (
                    <span className="text-[10px] font-extrabold tracking-wide text-[#103D29] bg-[#D9E5C4] border border-[#103D29]/20 px-2 py-0.5 rounded-full">
                      AI Estimated
                    </span>
                  )}
                </div>
                <input
                  type="number"
                  name="purchasePriceINR"
                  value={formData.purchasePriceINR}
                  onChange={handleChange}
                  min="0"
                  className={`w-full bg-white border-2 rounded-xl p-3 text-sm sm:text-base text-[#17251D] font-bold focus:outline-none focus:border-[#103D29] focus:ring-2 focus:ring-[#103D29]/20 placeholder:text-[#68736A]/60 transition-all ${
                    autoFilledFields.purchasePriceINR ? 'border-[#103D29] bg-[#D9E5C4]/20' : 'border-[#103D29]/20'
                  }`}
                  placeholder="e.g., 65000"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#17251D]">Warranty Status</label>
                  {autoFilledFields.warrantyStatus && (
                    <span className="text-[10px] font-extrabold tracking-wide text-[#103D29] bg-[#D9E5C4] border border-[#103D29]/20 px-2 py-0.5 rounded-full">
                      AI Detected
                    </span>
                  )}
                </div>
                <select
                  name="warrantyStatus"
                  value={formData.warrantyStatus}
                  onChange={handleChange}
                  className={`w-full bg-white border-2 rounded-xl p-3 text-sm sm:text-base text-[#17251D] font-bold focus:outline-none focus:border-[#103D29] focus:ring-2 focus:ring-[#103D29]/20 transition-all ${
                    autoFilledFields.warrantyStatus ? 'border-[#103D29] bg-[#D9E5C4]/20' : 'border-[#103D29]/20'
                  }`}
                >
                  <option value="UNSURE">Unsure</option>
                  <option value="IN_WARRANTY">In Warranty</option>
                  <option value="OUT_OF_WARRANTY">Out of Warranty</option>
                </select>
              </div>

              {formData.warrantyStatus === 'IN_WARRANTY' ? (
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#17251D]">Warranty Expiry Date</label>
                  <input
                    type="date"
                    name="warrantyExpiry"
                    value={formData.warrantyExpiry}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-[#103D29]/20 rounded-xl p-3 text-sm sm:text-base text-[#17251D] font-bold focus:outline-none focus:border-[#103D29] focus:ring-2 focus:ring-[#103D29]/20 transition-all"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-extrabold uppercase tracking-wider text-[#17251D]">Prior Repairs</label>
                    {autoFilledFields.priorRepairs && (
                      <span className="text-[10px] font-extrabold tracking-wide text-[#103D29] bg-[#D9E5C4] border border-[#103D29]/20 px-2 py-0.5 rounded-full">
                        AI Detected
                      </span>
                    )}
                  </div>
                  <select
                    name="priorRepairs"
                    value={formData.priorRepairs}
                    onChange={handleChange}
                    className={`w-full bg-white border-2 rounded-xl p-3 text-sm sm:text-base text-[#17251D] font-bold focus:outline-none focus:border-[#103D29] focus:ring-2 focus:ring-[#103D29]/20 transition-all ${
                      autoFilledFields.priorRepairs ? 'border-[#103D29] bg-[#D9E5C4]/20' : 'border-[#103D29]/20'
                    }`}
                  >
                    <option value="NONE">None</option>
                    <option value="1">1 Repair</option>
                    <option value="2+">2 or more Repairs</option>
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-[#17251D]">Daily Usage Intensity</label>
                  {autoFilledFields.usageIntensity && (
                    <span className="text-[10px] font-extrabold tracking-wide text-[#103D29] bg-[#D9E5C4] border border-[#103D29]/20 px-2 py-0.5 rounded-full">
                      AI Detected
                    </span>
                  )}
                </div>
                <select
                  name="usageIntensity"
                  value={formData.usageIntensity}
                  onChange={handleChange}
                  className={`w-full bg-white border-2 rounded-xl p-3 text-sm sm:text-base text-[#17251D] font-bold focus:outline-none focus:border-[#103D29] focus:ring-2 focus:ring-[#103D29]/20 transition-all ${
                    autoFilledFields.usageIntensity ? 'border-[#103D29] bg-[#D9E5C4]/20' : 'border-[#103D29]/20'
                  }`}
                >
                  <option value="LIGHT">Light (1-2 hours/day)</option>
                  <option value="MODERATE">Moderate (3-5 hours/day)</option>
                  <option value="HEAVY">Heavy (6+ hours/day)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#17251D]">
                  Willing Repair Budget (INR) - Optional
                </label>
                <input
                  type="number"
                  name="budgetINR"
                  value={formData.budgetINR}
                  onChange={handleChange}
                  min="0"
                  className="w-full bg-white border-2 border-[#103D29]/20 rounded-xl p-3 text-sm sm:text-base text-[#17251D] font-bold focus:outline-none focus:border-[#103D29] focus:ring-2 focus:ring-[#103D29]/20 placeholder:text-[#68736A]/60 transition-all"
                  placeholder="e.g., 5000"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className="flex items-center justify-center gap-2.5 w-full min-h-[56px] p-4 mt-8 rounded-2xl bg-[#103D29] text-white font-extrabold text-base hover:bg-[#174C32] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-editorial hover:shadow-editorial-lg cursor-pointer"
            >
              <span>Continue to Symptom Description</span>
              <ArrowRight className="w-5 h-5 text-[#F9C49B]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
