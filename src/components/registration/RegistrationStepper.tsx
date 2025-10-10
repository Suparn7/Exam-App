import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Circle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  completed: boolean;
  current: boolean;
  color: string;
}

interface RegistrationStepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepId: number) => void;
}

export function RegistrationStepper({ steps, currentStep, onStepClick }: RegistrationStepperProps) {
  const maxCompletedStep = steps.filter(s => s.completed).length;
  const maxAllowedStep = maxCompletedStep + 1;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full">
      {/* Mobile View - Vertical Stepper */}
      <div className="md:hidden">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {steps.map((step, index) => {
            const isClickable = step.id <= maxAllowedStep;
            const isActive = step.id === currentStep;
            const isCompleted = step.completed;
            const isLocked = step.id > maxAllowedStep;

            return (
              <motion.div
                key={step.id}
                variants={item}
                onClick={() => isClickable && onStepClick(step.id)}
                className={cn(
                  "relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer",
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-teal-500 border-transparent shadow-xl scale-105"
                    : isCompleted
                    ? "bg-white/90 border-green-300 hover:shadow-lg"
                    : isLocked
                    ? "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed"
                    : "bg-white/80 border-cyan-200 hover:shadow-lg"
                )}
                whileHover={isClickable ? { scale: 1.02, y: -2 } : {}}
                whileTap={isClickable ? { scale: 0.98 } : {}}
              >
                {/* Step Number/Icon */}
                <motion.div
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg",
                    isActive
                      ? "bg-white/20 backdrop-blur-sm"
                      : isCompleted
                      ? "bg-green-500"
                      : isLocked
                      ? "bg-gray-300"
                      : "bg-gradient-to-br from-cyan-100 to-teal-100"
                  )}
                  animate={isActive ? {
                    boxShadow: [
                      "0 0 20px rgba(255, 255, 255, 0.3)",
                      "0 0 40px rgba(255, 255, 255, 0.6)",
                      "0 0 20px rgba(255, 255, 255, 0.3)",
                    ],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-8 h-8 text-white" />
                  ) : isLocked ? (
                    <Lock className="w-8 h-8 text-gray-500" />
                  ) : (
                    <step.icon className={cn(
                      "w-8 h-8",
                      isActive ? "text-white" : "text-teal-600"
                    )} />
                  )}
                </motion.div>

                {/* Step Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      "text-xs font-bold px-2 py-1 rounded-full",
                      isActive
                        ? "bg-white/30 text-white"
                        : isCompleted
                        ? "bg-green-100 text-green-700"
                        : "bg-cyan-100 text-cyan-700"
                    )}>
                      Step {step.id}
                    </span>
                  </div>
                  <h3 className={cn(
                    "font-bold text-base mb-1",
                    isActive ? "text-white" : "text-gray-800"
                  )} style={{ lineHeight: "1.6" }}>
                    {step.title}
                  </h3>
                  <p className={cn(
                    "text-sm",
                    isActive ? "text-white/90" : "text-gray-600"
                  )} style={{ lineHeight: "1.6" }}>
                    {step.description}
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center"
                    >
                      <CheckCircle className="w-5 h-5 text-white" />
                    </motion.div>
                  ) : isActive ? (
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                      className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
                    >
                      <Circle className="w-5 h-5 text-white fill-white" />
                    </motion.div>
                  ) : isLocked ? (
                    <Lock className="w-6 h-6 text-gray-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-cyan-400" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Desktop View - Horizontal Stepper */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-10 left-0 right-0 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ 
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` 
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>

          {/* Steps */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="relative flex justify-between"
          >
            {steps.map((step, index) => {
              const isClickable = step.id <= maxAllowedStep;
              const isActive = step.id === currentStep;
              const isCompleted = step.completed;
              const isLocked = step.id > maxAllowedStep;

              return (
                <motion.div
                  key={step.id}
                  variants={item}
                  className="flex flex-col items-center relative"
                  style={{ width: `${100 / steps.length}%` }}
                >
                  {/* Step Circle */}
                  <motion.div
                    onClick={() => isClickable && onStepClick(step.id)}
                    className={cn(
                      "relative z-10 cursor-pointer mb-4",
                      !isClickable && "cursor-not-allowed"
                    )}
                    whileHover={isClickable ? { scale: 1.1 } : {}}
                    whileTap={isClickable ? { scale: 0.95 } : {}}
                  >
                    <motion.div
                      className={cn(
                        "w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl border-4 transition-all",
                        isActive
                          ? "bg-gradient-to-br from-cyan-500 to-teal-500 border-white"
                          : isCompleted
                          ? "bg-green-500 border-green-300"
                          : isLocked
                          ? "bg-gray-300 border-gray-200"
                          : "bg-white border-cyan-200 hover:border-teal-300"
                      )}
                      animate={isActive ? {
                        boxShadow: [
                          "0 0 20px rgba(6, 182, 212, 0.4)",
                          "0 0 40px rgba(6, 182, 212, 0.8)",
                          "0 0 20px rgba(6, 182, 212, 0.4)",
                        ],
                        scale: [1, 1.05, 1],
                      } : {}}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <CheckCircle className="w-10 h-10 text-white" />
                        </motion.div>
                      ) : isLocked ? (
                        <Lock className="w-10 h-10 text-gray-500" />
                      ) : (
                        <step.icon className={cn(
                          "w-10 h-10",
                          isActive ? "text-white" : "text-teal-600"
                        )} />
                      )}
                    </motion.div>

                    {/* Active Pulse Ring */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-3xl bg-cyan-400"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Step Info */}
                  <motion.div
                    className="text-center max-w-[120px]"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <div className={cn(
                      "inline-block px-3 py-1 rounded-full text-xs font-bold mb-2",
                      isActive
                        ? "bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg"
                        : isCompleted
                        ? "bg-green-100 text-green-700"
                        : isLocked
                        ? "bg-gray-200 text-gray-500"
                        : "bg-cyan-100 text-cyan-700"
                    )}>
                      Step {step.id}
                    </div>
                    <h3 className={cn(
                      "font-bold text-sm mb-1",
                      isActive
                        ? "text-cyan-700"
                        : isCompleted
                        ? "text-green-700"
                        : "text-gray-700"
                    )} style={{ lineHeight: "1.6" }}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-600" style={{ lineHeight: "1.6" }}>
                      {step.description}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
