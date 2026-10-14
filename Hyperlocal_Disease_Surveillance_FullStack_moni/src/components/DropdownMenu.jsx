import { motion, AnimatePresence } from "framer-motion";

export default function DropdownMenu({ isOpen, onSelectRole, links = [], onNavigate }) {
  const item =
    "w-full px-6 py-4 text-left text-[#0B6D2E] font-medium hover:bg-[#F6F3ED] transition-colors";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className="ks-dropdown"
        >
          {/* Section links — only visible on small screens (see landing.css) */}
          <div className="ks-dropdown__mobile-links">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => onNavigate && onNavigate(l.href)}
                className={`${item} block`}
              >
                {l.label}
              </a>
            ))}
            <div className="border-t border-[#E8E2D8]" />
          </div>

          <button onClick={() => onSelectRole && onSelectRole("admin")} className={item}>
            Admin Portal
          </button>
          <div className="border-t border-[#E8E2D8]" />
          <button onClick={() => onSelectRole && onSelectRole("agent")} className={item}>
            Agent Portal
          </button>
          <div className="border-t border-[#E8E2D8]" />
          <button onClick={() => onSelectRole && onSelectRole("medical_supervisor")} className={item}>
            Medical Supervisor
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
