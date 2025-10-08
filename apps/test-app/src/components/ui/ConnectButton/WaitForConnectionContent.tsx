import { motion } from 'framer-motion';

export function WaitForConnectionContent() {
  return (
    <>
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <motion.path
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2m2-4h.01M17 16h.01" // Your SVG path data
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          variants={{
            hidden: { pathLength: 0, opacity: 0 },
            visible: { pathLength: 1, opacity: 1 },
          }}
          initial="hidden"
          animate="visible"
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
        />
      </svg>

      <span>Connect Wallet</span>
    </>
  );
}
