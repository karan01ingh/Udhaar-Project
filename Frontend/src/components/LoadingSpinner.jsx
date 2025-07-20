import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-gray-200 border-t-[#960018] rounded-full"
      />
    </div>
  );
}