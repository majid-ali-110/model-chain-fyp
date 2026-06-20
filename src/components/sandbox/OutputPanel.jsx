import React, { forwardRef } from 'react';
import {
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';

// ── helpers ──────────────────────────────────────────────────────────────────

const tryParseStructured = (data) => {
  if (!data || !data.trim().startsWith('{')) return null;
  try { return JSON.parse(data); } catch { return null; }
};

const toPlainText = (parsed, raw) => {
  if (!parsed) return raw;
  if (parsed.type === 'classification') {
    const hasReal = parsed.predictedLabel && !/^class[_ ]?\d+$/i.test(parsed.predictedLabel.trim());
    const displayName = hasReal
      ? parsed.predictedLabel.replace(/_/g, ' ')
      : `Class ${parsed.predictedClass}`;
    const lines = [
      hasReal
        ? `Result: ${displayName} (class_${parsed.predictedClass})`
        : `Predicted Class: ${displayName}`
    ];
    if (parsed.probabilities?.length) {
      lines.push('Class Probabilities:');
      parsed.probabilities.forEach((p, i) => {
        const niceName = !/^class[_ ]?\d+$/i.test(p.label.trim())
          ? p.label.replace(/_/g, ' ')
          : `Class ${i}`;
        lines.push(`  ${niceName}: ${p.percent}%`);
      });
    }
    return lines.join('\n');
  }
  return raw;
};

/** Convert a raw label like "has_mask" or "class_0" to "Has Mask" or "Class 0" */
const humanizeLabel = (label) => {
  if (!label) return null;
  return label
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

/** Return true when the label is just a raw class index fallback */
const isRawClassLabel = (label) =>
  !label || /^class[_ ]?\d+$/i.test(label.trim());

// ── Classification result view ────────────────────────────────────────────────

const ClassificationResult = ({ parsed }) => {
  const { predictedClass, predictedLabel, probabilities = [] } = parsed;
  const maxProb = Math.max(...probabilities.map(p => p.percent), 0);
  const winner = probabilities.find(p => p.percent === maxProb);
  const confidence = winner?.percent ?? null;

  const hasRealLabel = predictedLabel && !isRawClassLabel(predictedLabel);
  const readableLabel = hasRealLabel
    ? humanizeLabel(predictedLabel)
    : null;

  return (
    <div className="flex flex-col gap-5">
      {/* Top prediction badge */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
        <CheckBadgeIcon className="h-8 w-8 text-green-400 flex-shrink-0" />
        <div>
          <p className="text-xs text-dark-text-muted uppercase tracking-wider mb-0.5">
            {hasRealLabel ? 'Result' : 'Predicted Class'}
          </p>

          {hasRealLabel ? (
            <>
              <p className="text-2xl font-bold text-green-400">{readableLabel}</p>
              <p className="text-xs text-dark-text-muted mt-0.5 font-mono">
                class_{predictedClass}
              </p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-green-400">
                Class {predictedClass}
              </p>
              <p className="text-xs text-dark-text-muted mt-0.5">
                Labels not configured for this model
              </p>
            </>
          )}

          {confidence !== null && (
            <p className="text-sm text-dark-text-secondary mt-1">
              {confidence}% confidence
            </p>
          )}
        </div>
      </div>

      {/* Probability bars */}
      {probabilities.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-dark-text-muted uppercase tracking-wider mb-3">
            Class Probabilities
          </p>
          <div className="flex flex-col gap-3">
            {probabilities.map((p, i) => {
              const isWinner = p.percent === maxProb;
              const niceLabel = !isRawClassLabel(p.label)
                ? humanizeLabel(p.label)
                : `Class ${i}`;
              return (
                <div key={p.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-medium ${isWinner ? 'text-green-400' : 'text-dark-text-secondary'}`}>
                      {niceLabel}
                    </span>
                    <span className={`text-sm font-semibold tabular-nums ${isWinner ? 'text-green-400' : 'text-dark-text-muted'}`}>
                      {p.percent}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-dark-surface-elevated rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isWinner ? 'bg-green-400' : 'bg-primary-500/50'}`}
                      style={{ width: `${p.percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main OutputPanel ──────────────────────────────────────────────────────────

const OutputPanel = forwardRef(({
  data = '',
  modelType = 'text',
  isLoading = false,
  testInfo = null
}, ref) => {
  const parsed = tryParseStructured(data);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(toPlainText(parsed, data));
  };

  const downloadOutput = () => {
    const content = toPlainText(parsed, data);
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `output-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Output Display */}
      <div
        className="flex-1 bg-dark-surface rounded-lg border border-dark-border p-4 overflow-y-auto"
        ref={ref}
      >
        {isLoading && (
          <p className="text-dark-text-muted italic text-sm">⏳ Processing...</p>
        )}

        {!isLoading && !data && (
          <p className="text-dark-text-muted italic text-sm">
            Output will appear here after you run a test...
          </p>
        )}

        {!isLoading && data && parsed?.type === 'classification' && (
          <ClassificationResult parsed={parsed} />
        )}

        {/* Fallback: plain text for unknown output shapes or errors */}
        {!isLoading && data && !parsed && (
          <pre className="text-sm text-dark-text-primary font-mono whitespace-pre-wrap break-words">
            {data}
          </pre>
        )}
      </div>

      {/* Metadata */}
      {testInfo?.status === 'completed' && (
        <div className="mt-3 px-3 py-2 bg-dark-surface rounded-md border border-dark-border text-xs text-dark-text-muted flex gap-6">
          <span>Time: <span className="text-primary-400">{testInfo.executionTime}ms</span></span>
          <span>Tokens: <span className="text-primary-400">{testInfo.tokensUsed}</span></span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-3">
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          disabled={!data}
          className="flex-1 flex items-center justify-center gap-1"
          title="Copy to clipboard"
        >
          <DocumentDuplicateIcon className="h-3.5 w-3.5" />
          Copy
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={downloadOutput}
          disabled={!data}
          className="flex-1 flex items-center justify-center gap-1"
          title="Download output"
        >
          <ArrowDownTrayIcon className="h-3.5 w-3.5" />
          Download
        </Button>
      </div>
    </div>
  );
});

OutputPanel.displayName = 'OutputPanel';

export default OutputPanel;

