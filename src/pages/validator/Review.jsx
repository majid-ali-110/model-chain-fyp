import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import { useModel } from '../../contexts/ModelContext';
import { useNotification } from '../../contexts/NotificationContext';

const Review = () => {
  const { modelId } = useParams();
  const navigate = useNavigate();
  const { getModelById } = useModel();
  const { showError, showSuccess } = useNotification();

  const [decision, setDecision] = useState('approve');
  const [score, setScore] = useState('80');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const model = useMemo(() => getModelById?.(modelId), [getModelById, modelId]);

  const submitValidation = async (e) => {
    e.preventDefault();

    if (!model) {
      showError('Model not found for validation.', { title: 'Validation Failed' });
      return;
    }

    const numericScore = Number(score);
    if (!Number.isFinite(numericScore) || numericScore < 0 || numericScore > 100) {
      showError('Score must be between 0 and 100.', { title: 'Invalid Score' });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        id: `${model.id}-${Date.now()}`,
        modelId: model.id,
        modelName: model.name,
        decision,
        score: numericScore,
        notes,
        completedAt: new Date().toISOString(),
      };

      const existing = JSON.parse(localStorage.getItem('validator_validation_records') || '[]');
      existing.push(payload);
      localStorage.setItem('validator_validation_records', JSON.stringify(existing));

      showSuccess(`${decision === 'approve' ? 'Approved' : 'Rejected'} ${model.name}`, {
        title: 'Validation Submitted',
        duration: 2500,
      });

      navigate('/validator/dashboard');
    } catch (error) {
      showError(error.message || 'Unable to submit validation.', { title: 'Validation Failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!model) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-dark-text-primary">Model Review</h1>
        <Card>
          <Card.Content className="py-10 text-center">
            <p className="text-dark-text-tertiary mb-4">Model not found.</p>
            <Link to="/validator/dashboard">
              <Button>Back to Queue</Button>
            </Link>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark-text-primary">Validate Model</h1>
        <p className="text-dark-text-tertiary">Review and submit your validator decision</p>
      </div>

      <Card>
        <Card.Header>
          <div className="flex items-center justify-between">
            <Card.Title>{model.name}</Card.Title>
            <Badge variant="secondary">{model.category}</Badge>
          </div>
        </Card.Header>
        <Card.Content>
          <p className="text-dark-text-secondary mb-3">{model.description || 'No description provided.'}</p>
          <div className="text-sm text-dark-text-tertiary space-y-1">
            <p>Owner: {model.owner ? `${model.owner.slice(0, 6)}...${model.owner.slice(-4)}` : 'Unknown'}</p>
            <p>Downloads: {(model.downloads || 0).toLocaleString()}</p>
            <p>Current Status: {model.status}</p>
          </div>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title>Validation Submission</Card.Title>
        </Card.Header>
        <Card.Content>
          <form onSubmit={submitValidation} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">Decision</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDecision('approve')}
                  className={`px-4 py-3 rounded-lg border ${
                    decision === 'approve' ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-dark-border-light text-dark-text-secondary'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <CheckCircleIcon className="h-4 w-4" /> Approve
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setDecision('reject')}
                  className={`px-4 py-3 rounded-lg border ${
                    decision === 'reject' ? 'border-red-500 bg-red-500/10 text-red-400' : 'border-dark-border-light text-dark-text-secondary'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <XCircleIcon className="h-4 w-4" /> Reject
                  </span>
                </button>
              </div>
            </div>

            <Input
              label="Validation Score (0-100)"
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              min="0"
              max="100"
              required
            />

            <div>
              <label className="block text-sm font-medium text-dark-text-secondary mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                className="w-full rounded-lg border border-dark-border-light bg-dark-surface px-3 py-2 text-dark-text-primary placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Summarize validation results, quality checks, and rationale."
                required
              />
            </div>

            <div className="flex gap-3">
              <Link to="/validator/dashboard" className="flex-1">
                <Button variant="outline" className="w-full">Cancel</Button>
              </Link>
              <Button type="submit" className="flex-1" loading={isSubmitting}>
                Submit Validation
              </Button>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
};

export default Review;
