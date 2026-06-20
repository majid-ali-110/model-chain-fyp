import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import {
  PhotoIcon,
  SpeakerWaveIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  TableCellsIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const TYPE_ICONS = {
  text: DocumentTextIcon,
  image: PhotoIcon,
  audio: SpeakerWaveIcon,
  video: VideoCameraIcon,
  tabular: TableCellsIcon,
};

const TYPE_LABELS = {
  text: 'Text',
  image: 'Image',
  audio: 'Audio',
  video: 'Video',
  tabular: 'Numeric',
};

const TYPE_ACCEPT = {
  image: 'image/*',
  audio: 'audio/*',
  video: 'video/*',
};

/** Parse a comma-separated or JSON-array string into an ordered float array. */
const parseTabularExample = (str) => {
  if (!str) return null;
  const trimmed = str.trim();
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed.map(Number);
  } catch {
    // fall through
  }
  if (trimmed.includes(',')) {
    const parts = trimmed.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
    if (parts.length > 0) return parts;
  }
  return null;
};

const InputPanel = ({
  model = null,
  inputData = '',
  onInputChange = () => {},
  isLoading = false
}) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [activeType, setActiveType] = useState(null);
  // Keyed by feature name for tabular inputs
  const [tabularValues, setTabularValues] = useState({});

  const inputTypes = useMemo(() => {
    const VALID = ['text', 'image', 'audio', 'video', 'tabular'];
    if (model?.inputTypes?.length) {
      const filtered = model.inputTypes.filter(t => VALID.includes(t));
      if (filtered.length > 0) return filtered;
    }
    const cat = (model?.category || 'text').toLowerCase();
    if (cat === 'multimodal') return ['text', 'image'];
    if (VALID.includes(cat)) return [cat];
    return ['text'];
  }, [model]);

  // Parse featureNames — supports both string ("a, b, c") and array
  const featureNames = useMemo(() => {
    const raw = model?.featureNames;
    if (!raw) return [];
    if (Array.isArray(raw)) return raw.filter(Boolean);
    return raw.split(',').map(f => f.trim()).filter(Boolean);
  }, [model]);

  const currentType = activeType || inputTypes[0] || 'text';
  const exampleInput = model?.exampleInputs?.[currentType] || '';
  const exampleOutput = model?.exampleOutputs?.[currentType] || '';

  // Reset tabular values when model or type changes
  useEffect(() => {
    const init = {};
    featureNames.forEach(name => { init[name] = ''; });
    setTabularValues(init);
    onInputChange('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model?.id, currentType]);

  // Reset everything when parent clears inputData
  useEffect(() => {
    if (inputData === '') {
      setPreviewUrl(null);
      if (currentType === 'tabular') {
        const init = {};
        featureNames.forEach(name => { init[name] = ''; });
        setTabularValues(init);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputData]);

  const switchType = (type) => {
    setActiveType(type);
    onInputChange('');
    setPreviewUrl(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviewUrl(ev.target.result);
      onInputChange(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleTabularChange = useCallback((name, value) => {
    setTabularValues(prev => {
      const next = { ...prev, [name]: value };
      // Serialize to JSON array in feature order
      const arr = featureNames.map(n => {
        const v = parseFloat(next[n]);
        return isNaN(v) ? null : v;
      });
      // Only emit if all fields have values (or partially — let inference decide)
      onInputChange(JSON.stringify(arr));
      return next;
    });
  }, [featureNames, onInputChange]);

  const fillTabularExample = useCallback(() => {
    const vals = parseTabularExample(exampleInput);
    if (!vals) return;
    const next = {};
    featureNames.forEach((name, i) => {
      next[name] = vals[i] !== undefined ? String(vals[i]) : '';
    });
    setTabularValues(next);
    onInputChange(JSON.stringify(featureNames.map((n, i) => vals[i] !== undefined ? Number(vals[i]) : null)));
  }, [exampleInput, featureNames, onInputChange]);

  const allTabularFilled = featureNames.length > 0
    && featureNames.every(n => tabularValues[n] !== '' && tabularValues[n] !== undefined && !isNaN(parseFloat(tabularValues[n])));

  return (
    <div className="bg-dark-surface rounded-lg border border-dark-border p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-dark-text-primary">Input</h3>
        {/* Use-example button: text and tabular only */}
        {exampleInput && (currentType === 'text') && (
          <Button variant="ghost" size="sm" onClick={() => onInputChange(exampleInput)}>
            <LightBulbIcon className="h-4 w-4 mr-1" />
            Use Example
          </Button>
        )}
        {exampleInput && currentType === 'tabular' && (
          <Button variant="ghost" size="sm" onClick={fillTabularExample}>
            <LightBulbIcon className="h-4 w-4 mr-1" />
            Fill Example
          </Button>
        )}
      </div>

      {/* Type tabs — only shown when the model supports multiple input types */}
      {inputTypes.length > 1 && (
        <div className="flex gap-1 bg-dark-surface-elevated rounded-lg p-1 flex-wrap">
          {inputTypes.map((type) => {
            const Icon = TYPE_ICONS[type] || DocumentTextIcon;
            return (
              <button
                key={type}
                onClick={() => switchType(type)}
                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex-1 ${
                  currentType === type
                    ? 'bg-dark-surface text-primary-400 border border-dark-border'
                    : 'text-dark-text-muted hover:text-dark-text-secondary'
                }`}
              >
                <Icon className="h-4 w-4" />
                {TYPE_LABELS[type]}
              </button>
            );
          })}
        </div>
      )}

      {/* ── TEXT input ── */}
      {currentType === 'text' && (
        <div>
          <textarea
            value={inputData}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={
              exampleInput
                ? `Example: ${exampleInput.slice(0, 100)}${exampleInput.length > 100 ? '...' : ''}`
                : 'Enter your input here...'
            }
            disabled={isLoading}
            className={`w-full min-h-[220px] p-3 bg-dark-surface border border-dark-border rounded-md text-dark-text-primary text-sm font-mono resize-y ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          <div className="mt-1 text-xs text-dark-text-muted">{inputData.length} characters</div>
        </div>
      )}

      {/* ── TABULAR / NUMERIC input ── */}
      {currentType === 'tabular' && (
        <div className="flex flex-col gap-3">
          {featureNames.length === 0 ? (
            <div className="flex items-start gap-2 p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/5">
              <ExclamationCircleIcon className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-300">
                The developer hasn't specified feature names for this model. Enter values as a comma-separated list or JSON array below.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs text-dark-text-muted">
                Enter a value for each feature. All fields are required.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {featureNames.map((name, i) => (
                  <div key={name} className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-purple-400 font-mono">
                      {name}
                      <span className="ml-1 text-dark-text-muted font-normal">[feature {i}]</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={tabularValues[name] ?? ''}
                      onChange={(e) => handleTabularChange(name, e.target.value)}
                      disabled={isLoading}
                      placeholder="0.0"
                      className={`w-full px-3 py-2 bg-dark-surface-elevated border rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${
                        tabularValues[name] !== '' && !isNaN(parseFloat(tabularValues[name]))
                          ? 'border-purple-500/50'
                          : 'border-dark-border'
                      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  </div>
                ))}
              </div>
              {/* Progress indicator */}
              <div className="flex items-center gap-2 text-xs text-dark-text-muted">
                <span className={allTabularFilled ? 'text-green-400' : ''}>
                  {featureNames.filter(n => tabularValues[n] !== '' && !isNaN(parseFloat(tabularValues[n]))).length}
                  /{featureNames.length} fields filled
                </span>
                {allTabularFilled && (
                  <span className="text-green-400">✓ Ready to run</span>
                )}
              </div>
            </>
          )}

          {/* Fallback textarea when no featureNames */}
          {featureNames.length === 0 && (
            <textarea
              value={inputData}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={'e.g. [5.1, 3.5, 1.4, 0.2]  or  5.1, 3.5, 1.4, 0.2'}
              disabled={isLoading}
              className={`w-full min-h-[100px] p-3 bg-dark-surface border border-dark-border rounded-md text-dark-text-primary text-sm font-mono resize-y ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          )}
        </div>
      )}

      {/* ── FILE-BASED inputs (image / audio / video) ── */}
      {(currentType === 'image' || currentType === 'audio' || currentType === 'video') && (
        <div className="flex flex-col gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept={TYPE_ACCEPT[currentType]}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className={`w-full p-8 border-2 border-dashed rounded-lg text-center transition-colors ${
              isLoading
                ? 'border-dark-border opacity-50 cursor-not-allowed'
                : previewUrl
                ? 'border-primary-400/50 bg-primary-400/5 cursor-pointer'
                : 'border-dark-border hover:border-primary-400 cursor-pointer'
            }`}
          >
            {React.createElement(TYPE_ICONS[currentType] || DocumentTextIcon, {
              className: `h-10 w-10 mx-auto mb-2 ${previewUrl ? 'text-primary-400' : 'text-dark-text-muted'}`,
            })}
            <p className="text-sm text-dark-text-secondary">
              {previewUrl ? 'Click to change file' : `Click to upload ${TYPE_LABELS[currentType]?.toLowerCase()}`}
            </p>
            {exampleInput && !previewUrl && (
              <p className="text-xs text-dark-text-muted mt-1">{exampleInput}</p>
            )}
          </button>

          {previewUrl && currentType === 'image' && (
            <img src={previewUrl} alt="Input preview" className="max-h-48 rounded-lg object-contain border border-dark-border" />
          )}
          {previewUrl && currentType === 'audio' && (
            <audio controls src={previewUrl} className="w-full" />
          )}
          {previewUrl && currentType === 'video' && (
            <video controls src={previewUrl} className="max-h-48 rounded-lg w-full" />
          )}
        </div>
      )}

      {/* ── Catch-all: render a textarea for any unrecognised input type ── */}
      {!['text', 'tabular', 'image', 'audio', 'video'].includes(currentType) && (
        <div>
          <textarea
            value={inputData}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={
              exampleInput
                ? `Example: ${exampleInput.slice(0, 100)}${exampleInput.length > 100 ? '...' : ''}`
                : 'Enter your input here...'
            }
            disabled={isLoading}
            className={`w-full min-h-[220px] p-3 bg-dark-surface border border-dark-border rounded-md text-dark-text-primary text-sm font-mono resize-y ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
          <div className="mt-1 text-xs text-dark-text-muted">{inputData.length} characters</div>
        </div>
      )}

      {/* ── Expected output hint ── */}
      {exampleOutput && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircleIcon className="h-4 w-4 text-green-400" />
            <span className="text-xs font-medium text-green-400">Expected Output (from developer)</span>
          </div>
          <p className="text-xs text-dark-text-secondary whitespace-pre-wrap">{exampleOutput}</p>
        </div>
      )}
    </div>
  );
};

export default InputPanel;

