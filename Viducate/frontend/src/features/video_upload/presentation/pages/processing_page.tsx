import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { XCircle,CheckCircle, X ,RotateCcw} from 'lucide-react';
import { FormattedMessage } from 'react-intl';
import { AnalysisStepItem } from '../componants/analysis_step_item';
import { TipCard } from '../componants/tip_card';
import { COLORS } from '../../../../core/constants/colors';
import { useProcessingStatus } from '../hooks/use_processing_status';

export function ProcessingPage() {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const { status, progress } = useProcessingStatus(videoId);
  useEffect(() => {
    if (status === 'completed') {
      const timeout = setTimeout(() => navigate(`/WatchVideo/${videoId}`), 2500);
      return () => clearTimeout(timeout);
    }
  }, [status, navigate, videoId]);


  const ringGradient = useMemo(() => ({
    background: status === 'failed'
      ? `conic-gradient(from 0deg, ${COLORS.state.error} 0%, ${COLORS.state.error} 100%)` // دائرة حمراء كاملة
      : status === 'completed'
      ? `conic-gradient(from 0deg, ${COLORS.state.success} 0%, ${COLORS.state.success} 100%)`
      : `conic-gradient(from 0deg, ${COLORS.brand.primary} 0%, ${COLORS.brand.secondary} ${progress}%, ${COLORS.effects.ringEmpty} ${progress}%)`
  }), [progress, status]);


  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden px-4 py-8 font-sans"
    style={{
    backgroundColor: '#fff',
    backgroundImage: COLORS.background.radialGradient,
  }}>
      <div className="relative z-10 w-full max-w-[600px] flex flex-col items-center gap-10">
        
        {/* Progress Section */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-indigo-100/30 rounded-full blur-3xl scale-150 animate-pulse" />
          <div className="relative w-40 h-40 md:w-44 md:h-44 rounded-full p-4 bg-white shadow-2xl flex items-center justify-center">
            <div className="absolute inset-0 rounded-full opacity-20 transition-all duration-500" style={ringGradient} />
            <div className="flex flex-col items-center text-center">
              {status === 'failed' ? (
                <XCircle size={64} className="text-red-500 animate-in zoom-in duration-500" />
              ) : status === 'completed' ? (
                <CheckCircle size={64} className="text-green-500 animate-in zoom-in duration-500" />
              ) : (
                <>
                  <span className="text-5xl font-black tracking-tighter" style={{ color: COLORS.brand.primary }}>{progress}%</span>
                
                </>
              )}
            </div>
          </div>
        </div>

        {/*Title Section */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: COLORS.text.primary }}>
            <FormattedMessage id={
              status === 'failed' ? "analysis.error.title" : 
              status === 'completed' ? "analysis.complete" : "analysis.title"
            } />

          </h1>
          <p className="text-lg font-medium" style={{ color: COLORS.text.secondary }}>
            <FormattedMessage id={
              status === 'failed' ? "analysis.error.subtitle" : 
              status === 'completed' ? "analysis.ready" : "analysis.subtitle"
            } />
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="w-full max-w-md bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-white/60 shadow-sm shadow-indigo-100/20">
          <AnalysisStepItem 
            labelId="analysis.step.fetching" 
            status={
              status === 'failed' ? 'failed'
               : status !== 'segmenting' && status !== 'completed' 
               ? 'active'
               : 'completed'
            } 
          />
          <AnalysisStepItem 
            labelId="analysis.step.segmenting" 
            status={ 
              status === 'failed' ? 'failed'
             : status === 'segmenting'
             ? 'active'
             : status === 'completed'
             ? 'completed'
             : 'pending'
            } 
            isLast 
          />
        </div>

        <TipCard />

        {/* Actions Area */}
        <div className="flex flex-col items-center gap-6 w-full pb-10"> 
          {status === 'failed' ? (
            <button 
               onClick={() => navigate('/UploadVideoPage')}
               className="flex items-center gap-3 px-8 py-3 rounded-full font-bold text-white transition-all active:scale-95 shadow-lg shadow-indigo-200/50 group"
               style={{ backgroundColor: COLORS.brand.primary }}
     >
              <RotateCcw size={20} className="group-hover:rotate-[-180deg] transition-transform" />
              <FormattedMessage id="analysis.retry" />
            </button>
          ) : status !== 'completed' && (
            <button 
              onClick={() => navigate('/UploadVideoPage')}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all hover:text-red-500 cursor-pointer active:scale-95"
              style={{ color: COLORS.text.muted }}
            >
              <X size={14} />
              <FormattedMessage id="analysis.cancel" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}