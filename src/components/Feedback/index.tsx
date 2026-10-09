import React, {useState, type ReactNode} from 'react';
import Translate from '@docusaurus/Translate';

const ISSUES = 'https://github.com/cloudground-it/cloudground-docs/issues';

/**
 * "Was this page useful?" It only changes what this page shows: nothing is
 * stored or sent anywhere.
 */
export default function Feedback(): ReactNode {
  const [answer, setAnswer] = useState<'' | 'yes' | 'no'>('');
  return (
    <div className="cg-feedback" aria-live="polite">
      {answer === '' && (
        <>
          <span className="cg-feedback__q">
            <Translate id="cg.feedback.question">Questa pagina ti è stata utile?</Translate>
          </span>
          <button type="button" className="hud cg-btn-line" onClick={() => setAnswer('yes')}>
            <Translate id="cg.feedback.yes">Sì</Translate>
          </button>
          <button type="button" className="hud cg-btn-line" onClick={() => setAnswer('no')}>
            <Translate id="cg.feedback.no">No</Translate>
          </button>
        </>
      )}
      {answer === 'yes' && (
        <span className="cg-feedback__q">
          <Translate id="cg.feedback.thanks">Grazie.</Translate>
        </span>
      )}
      {answer === 'no' && (
        <span className="cg-feedback__q">
          <Translate
            id="cg.feedback.thanksNo"
            values={{
              github: <a href={ISSUES}>GitHub</a>,
            }}>
            {'Grazie: dicci cosa manca su {github}.'}
          </Translate>
        </span>
      )}
    </div>
  );
}
