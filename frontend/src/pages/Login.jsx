import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TRANSITION_DURATION = 560;

const steps = [
  {
    name: 'email',
    label: 'Email',
    prompt: "What's your email?",
    type: 'email',
    placeholder: 'you@example.com',
    autoComplete: 'email',
    validate: (value) => {
      if (!value.trim()) return 'Please enter your email address.';
      if (!emailRegex.test(value.trim())) return 'Enter a valid email address.';
      return null;
    },
  },
  {
    name: 'password',
    label: 'Password',
    prompt: 'Enter your password',
    type: 'password',
    placeholder: '••••••••',
    autoComplete: 'current-password',
    validate: (value) => {
      if (!value) return 'Please enter your password.';
      return null;
    },
  },
];

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);
  const transitionTimeoutRef = useRef(null);
  const [previousStepIndex, setPreviousStepIndex] = useState(null);
  const [transitionDirection, setTransitionDirection] = useState('forward');
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!isTransitioning) {
      inputRef.current?.focus();
    }
  }, [currentStep, isTransitioning]);

  useEffect(() => () => {
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    if (!isTransitioning) return undefined;
    const timeout = setTimeout(() => {
      setIsTransitioning(false);
      setPreviousStepIndex(null);
    }, TRANSITION_DURATION);
    transitionTimeoutRef.current = timeout;
    return () => clearTimeout(timeout);
  }, [isTransitioning]);

  const handleChange = (event) => {
    if (isTransitioning || submitting) return;
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus((prev) => (prev.type === 'error' ? { type: null, message: '' } : prev));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    }
  };

  const startStepTransition = (targetIndex, direction) => {
    if (
      targetIndex < 0 ||
      targetIndex >= steps.length ||
      isTransitioning ||
      submitting
    ) {
      return;
    }
    setPreviousStepIndex(currentStep);
    setTransitionDirection(direction);
    setIsTransitioning(true);
    setCurrentStep(targetIndex);
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    if (isTransitioning || submitting) return;

    const step = steps[currentStep];
    const rawValue = formData[step.name] ?? '';
    const value = step.type === 'password' ? rawValue : rawValue.trim();

    const errorMessage = step.validate ? step.validate(value) : null;
    if (errorMessage) {
      setStatus({ type: 'error', message: errorMessage });
      return;
    }

    if (step.type !== 'password') {
      setFormData((prev) => ({ ...prev, [step.name]: value }));
    }

    const isLastStep = currentStep === steps.length - 1;
    if (!isLastStep) {
      setStatus({ type: null, message: '' });
      startStepTransition(currentStep + 1, 'forward');
      return;
    }

    setSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockUser = { email: formData.email, name: 'User' };
      localStorage.setItem('pmmpUser', JSON.stringify(mockUser));
      setStatus({ type: 'success', message: 'Login successful! Redirecting you now.' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 900);
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const activeStep = steps[currentStep];
  const outgoingStep = previousStepIndex !== null ? steps[previousStepIndex] : null;

  const activeAnimationClass =
    isTransitioning && transitionDirection === 'forward'
      ? 'animate-group-in-up'
      : isTransitioning && transitionDirection === 'backward'
      ? 'animate-group-in-down'
      : '';

  const outgoingAnimationClass =
    transitionDirection === 'forward' ? 'animate-group-out-up' : 'animate-group-out-down';

  const renderStepBlock = (step, index, interactive) => (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="mb-2 flex flex-wrap items-end gap-3 text-3xl font-normal text-gray-900 md:text-4xl">
          <span className="inline-flex items-center gap-2 text-blue-600 text-lg md:text-xl font-semibold leading-none">
            <span>{index + 1}</span>
            <svg
              aria-hidden="true"
              className="h-5 w-5 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 12h12M13 7l5 5-5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="leading-snug">{step.prompt}</span>
        </h1>
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col">
          <span className="sr-only">{step.label}</span>
          <input
            ref={interactive ? inputRef : undefined}
            type={step.type}
            name={step.name}
            value={formData[step.name]}
            onChange={interactive ? handleChange : undefined}
            onKeyDown={interactive ? handleKeyDown : undefined}
            placeholder={step.placeholder}
            autoComplete={step.autoComplete}
            readOnly={!interactive}
            disabled={!interactive || submitting || isTransitioning}
            className="border-b-2 border-gray-300 bg-transparent pb-3 text-2xl md:text-3xl font-semibold text-blue-900 caret-blue-600 outline-none placeholder:text-gray-300 focus:border-blue-600"
          />
        </label>

        {interactive && status.message && (
          <div
            role="status"
            className={`${
              status.type === 'success' ? 'text-blue-700' : 'text-red-600'
            } text-sm font-medium`}
          >
            {status.message}
          </div>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={interactive ? handleSubmit : undefined}
            disabled={submitting || isTransitioning}
            className="inline-flex h-12 min-w-[110px] items-center justify-center rounded bg-blue-600 px-10 text-2xl font-bold uppercase tracking-wide text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            OK
          </button>
          <span className="text-sm font-bold uppercase tracking-widest text-black">
            press <span className="font-black">Enter</span> ↵
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col relative font-sans">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="relative w-full max-w-3xl min-h-[320px] overflow-hidden">
          {outgoingStep && isTransitioning && (
            <div
              className={`pointer-events-none absolute inset-0 z-10 ${outgoingAnimationClass}`}
            >
              {renderStepBlock(outgoingStep, previousStepIndex, false)}
            </div>
          )}

          <div
            className={`relative z-20 w-full ${activeAnimationClass} ${
              isTransitioning ? 'pointer-events-none' : ''
            }`}
          >
            {renderStepBlock(activeStep, currentStep, true)}
          </div>
        </div>
      </div>

      {/* New here? Sign up at bottom */}
      <div className="w-full text-center absolute left-0 bottom-8">
        <span className="text-base text-gray-700">New here? </span>
        <Link
          to="/auth/signup"
          className="text-blue-600 underline text-base font-semibold hover:text-blue-800"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}