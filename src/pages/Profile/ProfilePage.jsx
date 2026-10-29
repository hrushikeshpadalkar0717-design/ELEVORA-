import React, { useState, useRef } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, TextArea, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Camera,
  Upload,
  Check,
  Trash2,
  Smile,
  Image as ImageIcon
} from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../../components/common/BrandIcons';
import { useResume } from '../../context/ResumeContext';
import { useToast } from '../../context/ToastContext';
import { MAIN_FIELDS, getSubfields, getFieldDisplayLabel, normalizeLegacyProfile } from '../../data/careerTaxonomy';

// ── Emoji presets grouped by category ───────────────────────────────────────
const EMOJI_CATEGORIES = [
  {
    name: 'Tech & Engineering',
    emojis: ['👨‍💻', '👩‍💻', '🧑‍💻', '💻', '🚀', '⚡', '🤖', '🧠', '🔬', '⚙️'],
  },
  {
    name: 'Business & Management',
    emojis: ['👔', '🧑‍💼', '👩‍💼', '🎯', '📈', '🏆', '💡', '💎', '🤝', '🏛️'],
  },
  {
    name: 'Medical & Science',
    emojis: ['🩺', '👨‍⚕️', '👩‍⚕️', '🧬', '🌿', '🧪', '💊', '🛡️', '⚕️', '🌡️'],
  },
  {
    name: 'Creative & Design',
    emojis: ['🎨', '🎭', '🔮', '✨', '🌟', '🌈', '📸', '🖋️', '🎬', '🎧'],
  },
  {
    name: 'Mascots & Fun',
    emojis: ['🦁', '🦊', '🐯', '🐼', '🐨', '🦄', '🦅', '🦉', '🐺', '🐬'],
  },
];

// ── Background gradient presets for emoji avatars ───────────────────────────
const GRADIENT_PRESETS = [
  { id: 'blue', name: 'Ocean', colors: ['#2563eb', '#06b6d4'] },
  { id: 'purple', name: 'Royal', colors: ['#6366f1', '#a855f7'] },
  { id: 'sunset', name: 'Sunset', colors: ['#f59e0b', '#ef4444'] },
  { id: 'emerald', name: 'Emerald', colors: ['#10b981', '#059669'] },
  { id: 'rose', name: 'Rose', colors: ['#ec4899', '#f43f5e'] },
  { id: 'midnight', name: 'Carbon', colors: ['#1e293b', '#0f172a'] },
];

/**
 * Generate a standalone SVG Data URL containing the chosen emoji and gradient.
 * Works natively in any standard <img> tag across all templates and top navigation.
 */
const generateEmojiSvg = (emoji, gradientColors) => {
  const [c1, c2] = gradientColors;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
    <defs>
      <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="100%" stop-color="${c2}" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="60" fill="url(#avatarGrad)" />
    <text x="60" y="68" font-size="64" text-anchor="middle" dominant-baseline="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif">${emoji}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

/**
 * Resizes any uploaded photo to a lightweight 256x256 JPEG data URL.
 */
const resizeImageFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 256;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      img.onerror = () => reject(new Error('Failed to load image file.'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
};

export const ProfilePage = () => {
  const { profile, updateProfile, careerGoal, updateCareerGoal } = useResume();
  const { showToast } = useToast();

  const fileInputRef = useRef(null);

  // Avatar Modal State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarTab, setAvatarTab] = useState('emoji'); // 'upload' | 'emoji'
  const [selectedEmoji, setSelectedEmoji] = useState('👨‍💻');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_PRESETS[0]);
  const [uploadedPhotoPreview, setUploadedPhotoPreview] = useState(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);

  // Ensure stored profile values are normalized before populating the form
  const normalized = normalizeLegacyProfile(profile.field || '', profile.subfield || '');

  const [formData, setFormData] = useState({
    fullName: profile.fullName || '',
    email: profile.email || '',
    phone: profile.phone || '',
    field: normalized.field,
    subfield: normalized.subfield,
    location: profile.location || 'Pune, Maharashtra',
    linkedin: profile.linkedin || '',
    portfolio: profile.portfolio || '',
    github: profile.github || '',
    summary: careerGoal.summary || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      field: formData.field,
      subfield: formData.subfield,
      location: formData.location,
      linkedin: formData.linkedin,
      portfolio: formData.portfolio,
      github: formData.github
    });
    updateCareerGoal({ summary: formData.summary });
    showToast('Profile updated successfully!', 'success');
  };

  // ── Avatar Handlers ────────────────────────────────────────────────────────

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WEBP).', 'error');
      return;
    }

    try {
      setIsProcessingPhoto(true);
      const dataUrl = await resizeImageFile(file);
      setUploadedPhotoPreview(dataUrl);
    } catch (err) {
      showToast(err.message || 'Error processing photo.', 'error');
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleApplyUploadedPhoto = () => {
    if (!uploadedPhotoPreview) {
      showToast('Please select a photo first.', 'error');
      return;
    }
    updateProfile({ avatar: uploadedPhotoPreview });
    setIsAvatarModalOpen(false);
    showToast('Profile photo updated successfully!', 'success');
  };

  const handleApplyEmojiAvatar = () => {
    const svgDataUrl = generateEmojiSvg(selectedEmoji, selectedGradient.colors);
    updateProfile({ avatar: svgDataUrl });
    setIsAvatarModalOpen(false);
    showToast('Emoji avatar applied successfully!', 'success');
  };

  const handleRemoveAvatar = () => {
    updateProfile({ avatar: '' });
    setUploadedPhotoPreview(null);
    setIsAvatarModalOpen(false);
    showToast('Avatar reset to default initials.', 'info');
  };

  const currentAvatar = profile.avatar;
  const initials = formData.fullName
    ? formData.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'JD';

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">User Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your identity, contact information, and public links.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Card */}
        <Card className="flex flex-col sm:flex-row items-center gap-6 p-6">
          <div className="relative group">
            <div
              onClick={() => setIsAvatarModalOpen(true)}
              className="w-24 h-24 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-3xl overflow-hidden border-4 border-white shadow-md cursor-pointer transition-transform group-hover:scale-105"
            >
              {currentAvatar ? (
                <img
                  src={currentAvatar}
                  alt={formData.fullName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                initials
              )}
            </div>
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-slate-900 text-white hover:bg-blue-600 transition-colors shadow-md border-2 border-white"
              title="Change Photo or Choose Emoji"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1 text-center sm:text-left flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{formData.fullName || 'John Doe'}</h2>
                <p className="text-xs font-semibold text-blue-600">{formData.field} • {formData.subfield}</p>
                <p className="text-xs text-slate-400">{formData.email}</p>
              </div>

              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors self-center sm:self-auto"
              >
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                <span>Customize Avatar</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Form fields card */}
        <Card className="space-y-5 p-6">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            Personal & Contact Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              icon={User}
              required
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              required
            />
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              icon={Phone}
            />
            <Input
              label="Location (City, State)"
              name="location"
              value={formData.location}
              onChange={handleChange}
              icon={MapPin}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Select
              label="Main Field"
              name="field"
              value={getFieldDisplayLabel(formData.field)}
              onChange={(e) => {
                const rawField = MAIN_FIELDS.find((f) => getFieldDisplayLabel(f) === e.target.value) || e.target.value;
                const firstSub = getSubfields(rawField)[0] || '';
                setFormData((prev) => ({ ...prev, field: rawField, subfield: firstSub }));
              }}
              options={MAIN_FIELDS.map((f) => getFieldDisplayLabel(f))}
            />
            <Select
              label="Sub-field / Specialization"
              name="subfield"
              value={formData.subfield}
              onChange={(e) => setFormData((prev) => ({ ...prev, subfield: e.target.value }))}
              options={getSubfields(formData.field)}
            />
          </div>

          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider pt-4 pb-2 border-b border-slate-100">
            Web & Social Profiles
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="LinkedIn URL"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              icon={LinkedinIcon}
              placeholder="https://linkedin.com/in/..."
            />
            <Input
              label="Portfolio / Website"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              icon={Globe}
              placeholder="https://yourportfolio.com"
            />
            <Input
              label="GitHub URL"
              name="github"
              value={formData.github}
              onChange={handleChange}
              icon={GithubIcon}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="pt-2">
            <TextArea
              label="Professional Bio"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button variant="primary" size="md" type="submit" className="px-6">
              Save Changes
            </Button>
          </div>
        </Card>
      </form>

      {/* ── Avatar Customization Modal ────────────────────────────────────── */}
      <Modal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        title="Customize Profile Avatar"
        subtitle="Import your own photo or choose a stylized website emoji avatar."
        maxWidth="max-w-xl"
      >
        <div className="space-y-6 text-left">
          {/* Tab Selector */}
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setAvatarTab('emoji')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                avatarTab === 'emoji'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smile className="w-4 h-4" />
              <span>Emoji Avatar</span>
            </button>
            <button
              type="button"
              onClick={() => setAvatarTab('upload')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                avatarTab === 'upload'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Import Photo</span>
            </button>
          </div>

          {/* TAB 1: EMOJI AVATAR */}
          {avatarTab === 'emoji' && (
            <div className="space-y-5">
              {/* Live Preview */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-md border-2 border-white shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${selectedGradient.colors[0]}, ${selectedGradient.colors[1]})`,
                  }}
                >
                  <span>{selectedEmoji}</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Avatar Preview</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Selected: <strong className="text-slate-700">{selectedEmoji}</strong> with {selectedGradient.name} gradient
                  </p>
                </div>
              </div>

              {/* Gradient selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  1. Choose Background Style
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {GRADIENT_PRESETS.map((grad) => (
                    <button
                      key={grad.id}
                      type="button"
                      onClick={() => setSelectedGradient(grad)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                        selectedGradient.id === grad.id
                          ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/40'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full shadow-xs"
                        style={{
                          background: `linear-gradient(135deg, ${grad.colors[0]}, ${grad.colors[1]})`,
                        }}
                      />
                      <span className="text-[10px] font-semibold text-slate-700">{grad.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Emojis categorized */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  2. Select Emoji Avatar
                </label>
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {EMOJI_CATEGORIES.map((cat) => (
                    <div key={cat.name} className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        {cat.name}
                      </span>
                      <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                        {cat.emojis.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setSelectedEmoji(emoji)}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform hover:scale-110 ${
                              selectedEmoji === emoji
                                ? 'bg-blue-100 border-2 border-blue-600 shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-200 border border-slate-200'
                            }`}
                          >
                            <span>{emoji}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                {currentAvatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset to Initials</span>
                  </button>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <Button variant="outline" size="sm" onClick={() => setIsAvatarModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleApplyEmojiAvatar}>
                    <Check className="w-4 h-4 mr-1" />
                    Apply Emoji Avatar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD CUSTOM PHOTO */}
          {avatarTab === 'upload' && (
            <div className="space-y-5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-blue-50/30"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-800">Click to upload your photo</h4>
                <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, or WEBP (Max 5MB)</p>
                <button
                  type="button"
                  className="mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-white border border-blue-200 shadow-2xs hover:bg-blue-50"
                >
                  Browse Device
                </button>
              </div>

              {/* Selected Photo Preview */}
              {uploadedPhotoPreview && (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md shrink-0 bg-slate-200">
                    <img
                      src={uploadedPhotoPreview}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Photo Ready</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Photo optimized and ready to apply as your profile picture.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedPhotoPreview(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove selected photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                {currentAvatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset to Initials</span>
                  </button>
                )}
                <div className="flex items-center gap-2 ml-auto">
                  <Button variant="outline" size="sm" onClick={() => setIsAvatarModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!uploadedPhotoPreview || isProcessingPhoto}
                    onClick={handleApplyUploadedPhoto}
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Save Profile Photo
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
