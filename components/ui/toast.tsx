"use client"
import { useState, useEffect } from 'react'
import { Check, X, ShoppingCart, AlertCircle } from 'lucide-react'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
  duration?: number
}

interface ToastProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const showTimer = setTimeout(() => setIsVisible(true), 10)
    
    // Auto-remove timer
    const removeTimer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => onRemove(toast.id), 300) // Wait for exit animation
    }, toast.duration || 3000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(removeTimer)
    }
  }, [toast.id, toast.duration, onRemove])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => onRemove(toast.id), 300)
  }

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-600" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />
      case 'info':
      default:
        return <ShoppingCart className="w-5 h-5 text-blue-600" />
    }
  }

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800 shadow-green-100'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800 shadow-red-100'
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800 shadow-blue-100'
    }
  }

  return (
    <div 
      className={`flex items-center gap-3 p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 transform ${getStyles()} ${
        isVisible && !isExiting 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
      } shadow-lg hover:shadow-xl hover:scale-105`}
      style={{
        animation: isVisible && !isExiting 
          ? 'slideInRight 0.3s ease-out forwards, bounce 0.6s ease-out 0.3s' 
          : isExiting 
          ? 'slideOutRight 0.3s ease-in forwards' 
          : 'none'
      }}
    >
      {/* Icon with pulse animation */}
      <div className="animate-pulse">
        {getIcon()}
      </div>
      
      {/* Message */}
      <span className="font-medium flex-1 text-sm">{toast.message}</span>
      
      {/* Close button with hover effect */}
      <button
        onClick={handleClose}
        className="text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110 rounded-full p-1 hover:bg-white/50"
      >
        <X className="w-4 h-4" />
      </button>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 rounded-b-xl animate-shrink" 
           style={{ 
             animationDuration: `${toast.duration || 3000}ms`,
             animationTimingFunction: 'linear'
           }} 
      />
    </div>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export default function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <>
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            style={{ 
              animationDelay: `${index * 100}ms`,
              zIndex: 1000 - index 
            }}
          >
            <ToastItem toast={toast} onRemove={onRemove} />
          </div>
        ))}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        @keyframes bounce {
          0%, 20%, 60%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          80% {
            transform: translateY(-5px);
          }
        }

        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-shrink {
          animation: shrink linear;
        }
      `}</style>
    </>
  )
}
