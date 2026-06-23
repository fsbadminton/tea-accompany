export function CeremonyTimeline({ steps, currentStepIndex, completedSteps, onStepClick }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="ceremony-timeline">
      {steps.map((step, index) => {
        const isCompleted = completedSteps.has(step.id);
        const isCurrent = index === currentStepIndex;
        const isFuture = !isCompleted && !isCurrent;

        const dotClass = [
          "step-dot",
          isCompleted && "is-completed",
          isCurrent && "is-current",
        ]
          .filter(Boolean)
          .join(" ");

        const labelClass = [
          "step-label",
          isCurrent && "is-current",
          isCompleted && "is-completed",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div key={step.id}>
            <div
              className="ceremony-step"
              onClick={() => onStepClick(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onStepClick(index);
              }}
            >
              <div className={dotClass} />
              <span className={labelClass}>{step.label}</span>
            </div>
            {index < steps.length - 1 && <div className="step-line" />}
          </div>
        );
      })}
    </div>
  );
}
