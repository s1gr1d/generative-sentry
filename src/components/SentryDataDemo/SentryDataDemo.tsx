import { useState } from 'react';
import styles from './SentryDataDemo.module.css';
import { 
  SAMPLE_SENTRY_ENVELOPES, 
  ERROR_STATISTICS, 
  GROUPED_ERRORS_BY_TYPE, 
  GROUPED_ERRORS_BY_LEVEL,
  generateTimeSeriesData
} from '@/data/sampleSentryEnvelopes';
import type { SentryEnvelope, ErrorType } from '@/types/sentryEnvelope';
import { COLOR_PALETTE, getRandomColor } from '@/utils/colorPalette';

interface SentryDataDemoProps {
  className?: string;
}

const SentryDataDemo: React.FC<SentryDataDemoProps> = ({ className }) => {
  const [selectedErrorType, setSelectedErrorType] = useState<ErrorType | 'all'>('all');
  const [selectedEnvelope, setSelectedEnvelope] = useState<SentryEnvelope | null>(null);

  const filteredEnvelopes = selectedErrorType === 'all' 
    ? SAMPLE_SENTRY_ENVELOPES 
    : GROUPED_ERRORS_BY_TYPE[selectedErrorType];

  const handleEnvelopeClick = (envelope: SentryEnvelope) => {
    setSelectedEnvelope(envelope);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getErrorTypeColor = (errorType: string): string => {
    const colorMap: Record<string, string> = {
      javascript: COLOR_PALETTE.BLURPLE,
      network: COLOR_PALETTE.DK_ORANGE,
      database: COLOR_PALETTE.DK_VIOLET,
      authentication: COLOR_PALETTE.DK_PINK,
      validation: COLOR_PALETTE.DK_YELLOW,
      permission: COLOR_PALETTE.LT_PURPLE,
      timeout: COLOR_PALETTE.DK_BLUE,
      memory: COLOR_PALETTE.LT_PINK,
      syntax: COLOR_PALETTE.DK_GREEN
    };
    
    return colorMap[errorType] || COLOR_PALETTE.RICH_BLACK;
  };

  const getLevelColor = (level: string): string => {
    const levelMap: Record<string, string> = {
      debug: COLOR_PALETTE.LT_BLUE,
      info: COLOR_PALETTE.LT_GREEN,
      warning: COLOR_PALETTE.LT_YELLOW,
      error: COLOR_PALETTE.LT_ORANGE,
      fatal: COLOR_PALETTE.DK_PINK
    };
    
    return levelMap[level] || COLOR_PALETTE.RICH_BLACK;
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.header}>
        <h2>Sentry Error Data Visualization</h2>
        <p>Generated {SAMPLE_SENTRY_ENVELOPES.length} error envelopes across {Object.keys(GROUPED_ERRORS_BY_TYPE).length} error types</p>
      </div>

      <div className={styles.statistics}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Errors</h3>
            <div className={styles.statValue}>{ERROR_STATISTICS.total}</div>
          </div>
          <div className={styles.statCard}>
            <h3>Critical Errors</h3>
            <div className={styles.statValue}>{ERROR_STATISTICS.criticalErrorsCount}</div>
          </div>
          <div className={styles.statCard}>
            <h3>Production Errors</h3>
            <div className={styles.statValue}>{ERROR_STATISTICS.productionErrorsCount}</div>
          </div>
          <div className={styles.statCard}>
            <h3>Most Common Type</h3>
            <div className={styles.statValue}>{ERROR_STATISTICS.mostCommonErrorType}</div>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <label htmlFor="errorTypeFilter">Filter by Error Type:</label>
        <select 
          id="errorTypeFilter"
          value={selectedErrorType} 
          onChange={(e) => setSelectedErrorType(e.target.value as ErrorType | 'all')}
          className={styles.filter}
        >
          <option value="all">All Types ({SAMPLE_SENTRY_ENVELOPES.length})</option>
          {Object.entries(GROUPED_ERRORS_BY_TYPE).map(([type, errors]) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)} ({errors.length})
            </option>
          ))}
        </select>
      </div>

      <div className={styles.visualization}>
        <div className={styles.errorTypeDistribution}>
          <h3>Error Type Distribution</h3>
          <div className={styles.distributionBars}>
            {Object.entries(ERROR_STATISTICS.distribution).map(([type, count]) => (
              <div key={type} className={styles.distributionBar}>
                <div className={styles.barLabel}>{type}</div>
                <div 
                  className={styles.bar}
                  style={{ 
                    width: `${(count / ERROR_STATISTICS.total) * 100}%`,
                    backgroundColor: getErrorTypeColor(type)
                  }}
                >
                  <span className={styles.barValue}>{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.levelDistribution}>
          <h3>Error Level Distribution</h3>
          <div className={styles.levelBars}>
            {Object.entries(GROUPED_ERRORS_BY_LEVEL).map(([level, errors]) => (
              <div key={level} className={styles.levelBar}>
                <div className={styles.barLabel}>{level}</div>
                <div 
                  className={styles.bar}
                  style={{ 
                    width: `${(errors.length / ERROR_STATISTICS.total) * 100}%`,
                    backgroundColor: getLevelColor(level)
                  }}
                >
                  <span className={styles.barValue}>{errors.length}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.errorList}>
        <h3>Error Envelopes ({filteredEnvelopes.length})</h3>
        <div className={styles.envelopeGrid}>
          {filteredEnvelopes.slice(0, 20).map((envelope) => (
            <div 
              key={envelope.event_id} 
              className={styles.envelopeCard}
              onClick={() => handleEnvelopeClick(envelope)}
              style={{ borderLeftColor: getLevelColor(envelope.level) }}
            >
              <div className={styles.envelopeHeader}>
                <span className={styles.eventId}>{envelope.event_id.slice(0, 8)}...</span>
                <span 
                  className={styles.level}
                  style={{ backgroundColor: getLevelColor(envelope.level) }}
                >
                  {envelope.level}
                </span>
              </div>
              <div className={styles.envelopeTitle}>{envelope.title}</div>
              <div className={styles.envelopeDetails}>
                <span className={styles.environment}>{envelope.environment}</span>
                <span className={styles.platform}>{envelope.platform}</span>
                <span className={styles.timestamp}>{formatDate(envelope.timestamp)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedEnvelope && (
        <div className={styles.modal} onClick={() => setSelectedEnvelope(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Error Details</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setSelectedEnvelope(null)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.detailRow}>
                <strong>Event ID:</strong> {selectedEnvelope.event_id}
              </div>
              <div className={styles.detailRow}>
                <strong>Title:</strong> {selectedEnvelope.title}
              </div>
              <div className={styles.detailRow}>
                <strong>Level:</strong> 
                <span 
                  className={styles.levelBadge}
                  style={{ backgroundColor: getLevelColor(selectedEnvelope.level) }}
                >
                  {selectedEnvelope.level}
                </span>
              </div>
              <div className={styles.detailRow}>
                <strong>Environment:</strong> {selectedEnvelope.environment}
              </div>
              <div className={styles.detailRow}>
                <strong>Platform:</strong> {selectedEnvelope.platform}
              </div>
              <div className={styles.detailRow}>
                <strong>Timestamp:</strong> {formatDate(selectedEnvelope.timestamp)}
              </div>
              <div className={styles.detailRow}>
                <strong>User:</strong> {selectedEnvelope.user?.email || 'Unknown'}
              </div>
              <div className={styles.detailRow}>
                <strong>Location:</strong> {selectedEnvelope.user?.geo?.city}, {selectedEnvelope.user?.geo?.country_code}
              </div>
              {selectedEnvelope.exception?.values[0] && (
                <div className={styles.exceptionDetails}>
                  <strong>Exception:</strong>
                  <div className={styles.exception}>
                    <div><strong>Type:</strong> {selectedEnvelope.exception.values[0].type}</div>
                    <div><strong>Value:</strong> {selectedEnvelope.exception.values[0].value}</div>
                    {selectedEnvelope.exception.values[0].stacktrace?.frames && (
                      <div className={styles.stackTrace}>
                        <strong>Stack Trace:</strong>
                        <div className={styles.frames}>
                          {selectedEnvelope.exception.values[0].stacktrace.frames.slice(0, 3).map((frame, index) => (
                            <div key={index} className={styles.frame}>
                              <div>{frame.function} in {frame.filename}:{frame.lineno}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentryDataDemo;
