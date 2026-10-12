import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { TextArea } from '../common/Input';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useToast } from '../../context/ToastContext';

export const AIEnhanceModal = ({ isOpen, onClose, initialText = '', onApply, field = '', subfield = '', role = '' }) => {
  const [inputText, setInputText] = useState(initialText);
  const [enhancedText, setEnhancedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleEnhance = async () => {
    if (!inputText.trim()) {
      showToast('Please enter text to enhance', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const res = await aiService.enhanceBulletPoint(inputText, role, field, subfield);
      setEnhancedText(res);
      showToast('Bullet point enhanced with AI!', 'success');
    } catch {
      showToast('Error enhancing text', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (enhancedText) {
      onApply(enhancedText);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AI Bullet Point Optimizer"
      subtitle="Transform simple descriptions into high-impact, ATS-optimized action achievements."
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        <div>
          <TextArea
            label="Original Statement"
            placeholder="e.g. worked on cad drawings and tested parts"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex justify-end">
          <Button
            variant="primary"
            size="sm"
            onClick={handleEnhance}
            isLoading={isLoading}
            icon={Sparkles}
          >
            Enhance with AI
          </Button>
        </div>

        {enhancedText && (
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/80 to-indigo-50/50 border border-blue-200 text-left animate-in fade-in">
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Optimized Output</span>
            </div>
            <p className="text-sm font-medium text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-blue-100">
              {enhancedText}
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEnhancedText('')}>
                Discard
              </Button>
              <Button variant="primary" size="sm" onClick={handleApply} icon={Check}>
                Use This Bullet Point
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
