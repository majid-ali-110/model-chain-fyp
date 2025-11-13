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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Output Display */}
      <div style={{ 
        flex: 1,
        backgroundColor: '#161b22', 
        borderRadius: '0.5rem', 
        border: '1px solid #30363d',
        padding: '1rem',
        overflowY: 'auto',
        fontSize: '0.875rem',
        color: '#f0f6fc',
        fontFamily: 'monospace',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}
      ref={ref}>
        {isLoading && (
          <div style={{ color: '#8b949e', fontStyle: 'italic' }}>
            ⏳ Processing...
          </div>
        )}
        {data ? data : (
          <div style={{ color: '#8b949e', fontStyle: 'italic' }}>
            Output will appear here after you run a test...
          </div>
        )}
      </div>

      {/* Metadata */}
      {testInfo && (
        <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#0d1117', borderRadius: '0.375rem', border: '1px solid #30363d', fontSize: '0.75rem', color: '#8b949e' }}>
          {testInfo.status === 'completed' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '1rem' }}>
              <div>Execution Time: <span style={{ color: '#58a6ff' }}>{testInfo.executionTime}ms</span></div>
              <div>Tokens Used: <span style={{ color: '#58a6ff' }}>{testInfo.tokensUsed}</span></div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
        <Button 
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          disabled={!data}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
          title="Copy to clipboard"
        >
          <DocumentDuplicateIcon style={{ height: '0.875rem', width: '0.875rem' }} />
          Copy
        </Button>
        <Button 
          variant="outline"
          size="sm"
          onClick={downloadOutput}
          disabled={!data}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
          title="Download output"
        >
          <ArrowDownTrayIcon style={{ height: '0.875rem', width: '0.875rem' }} />
          Download
        </Button>
      </div>
    </div>
  );
});

OutputPanel.displayName = 'OutputPanel';

export default OutputPanel;
