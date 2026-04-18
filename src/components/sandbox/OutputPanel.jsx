import React, { forwardRef, useState } from 'react';
import {
  DocumentDuplicateIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  EyeSlashIcon,
} from '@heroicons/react/24/outline';
import Button from '../ui/Button';

const OutputPanel = forwardRef(({
  data = '',
  modelType = 'text',
  isLoading = false,
  testInfo = null
}, ref) => {
  const [fullscreen, setFullscreen] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(data);
  };

  const downloadOutput = () => {
    const element = document.createElement('a');
    const file = new Blob([data], { type: 'text/plain' });
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
        className="flex-1 bg-dark-surface rounded-lg border border-dark-border p-4 overflow-y-auto text-sm text-dark-text-primary font-mono whitespace-pre-wrap break-words"
        ref={ref}
      >
        {isLoading && (
          <div className="text-dark-text-muted italic">
            ⏳ Processing...
          </div>
        )}
        {data ? data : (
          <div className="text-dark-text-muted italic">
            Output will appear here after you run a test...
          </div>
        )}
      </div>

      {/* Metadata */}
      {testInfo && (
        <div className="mt-4 p-3 bg-dark-surface rounded-md border border-dark-border text-xs text-dark-text-muted">
          {testInfo.status === 'completed' && (
            <div className="grid grid-cols-2 gap-4">
              <div>Execution Time: <span className="text-primary-400">{testInfo.executionTime}ms</span></div>
              <div>Tokens Used: <span className="text-primary-400">{testInfo.tokensUsed}</span></div>
            </div>
          )}
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
