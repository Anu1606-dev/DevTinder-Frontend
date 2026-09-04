import { useState } from "react";
import { motion } from "framer-motion";

const STACK_STYLES = [
  { scale: 1, y: 0, opacity: 1 },
  { scale: 0.95, y: 14, opacity: 0.85 },
  { scale: 0.9, y: 28, opacity: 0.6 },
];

const cardVariants = {
  animate: ({ stackIndex }) => ({
    x: 0,
    rotate: 0,
    ...(STACK_STYLES[stackIndex] ?? STACK_STYLES[2]),
  }),
  exit: ({ direction }) => ({
    x: direction * 600,
    rotate: direction * 25,
    opacity: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  }),
};

const SwipeCard = ({ user, stackIndex, onSwipe }) => {
  const [dragX, setDragX] = useState(0);
  const [exitDirection, setExitDirection] = useState(0);
  const isFront = stackIndex === 0;

  if (!user) return null;
  const { firstName, lastName, photoUrl, about, age, gender, skills } = user;
  const fullName = `${firstName || ""} ${lastName || ""}`.trim() || "Developer";
  const profileImage =
    photoUrl || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp";
  const skillList = Array.isArray(skills)
    ? skills
    : typeof skills === "string" && skills.length > 0
    ? skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  // Records which way it should fly, then immediately tells Feed.jsx to
  // remove it from Redux. AnimatePresence (in Feed.jsx) takes it from here —
  // it keeps this card mounted just long enough to play the "exit" variant
  // above, then removes it. No manual timing coordination needed.
  const triggerExit = (direction) => {
    setExitDirection(direction);
    onSwipe(direction === 1 ? "interested" : "ignored", user._id);
  };

  const handleDragEnd = (e, info) => {
    const threshold = 120;
    if (info.offset.x > threshold) {
      triggerExit(1);
    } else if (info.offset.x < -threshold) {
      triggerExit(-1);
    } else {
      setDragX(0);
    }
  };

  const likeOpacity = Math.min(Math.max(dragX / 100, 0), 1);
  const nopeOpacity = Math.min(Math.max(-dragX / 100, 0), 1);

  return (
    <motion.div
      className="absolute inset-0"
      style={{ zIndex: 30 - stackIndex }}
      custom={{ stackIndex, direction: exitDirection }}
      variants={cardVariants}
      initial={STACK_STYLES[stackIndex] ?? STACK_STYLES[2]}
      animate="animate"
      exit="exit"
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      drag={isFront ? "x" : false}
      dragElastic={0.9}
      onDrag={(e, info) => isFront && setDragX(info.offset.x)}
      onDragEnd={isFront ? handleDragEnd : undefined}
    >
      <div
        className="card w-full h-full bg-base-100 border border-base-300 rounded-2xl shadow-2xl overflow-hidden select-none"
        style={{ cursor: isFront ? "grab" : "default" }}
      >
        <div className="relative h-2/3 w-full">
          <img
            src={profileImage}
            alt={fullName}
            className="h-full w-full object-cover pointer-events-none"
            draggable={false}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4">
            <h2 className="text-2xl font-bold text-white drop-shadow">
              {fullName}
              {age ? <span className="font-normal text-white/80">, {age}</span> : null}
            </h2>
            {gender && <p className="text-xs text-white/70 capitalize">{gender}</p>}
          </div>

          {isFront && (
            <>
              <div
                className="absolute top-6 left-6 border-4 border-success text-success font-black text-2xl px-3 py-1 rounded-lg -rotate-12"
                style={{ opacity: likeOpacity }}
              >
                LIKE
              </div>
              <div
                className="absolute top-6 right-6 border-4 border-error text-error font-black text-2xl px-3 py-1 rounded-lg rotate-12"
                style={{ opacity: nopeOpacity }}
              >
                NOPE
              </div>
            </>
          )}
        </div>

        <div className="card-body p-4 h-1/3 overflow-y-auto flex flex-col">
          {about && <p className="text-sm text-base-content/70 line-clamp-2">{about}</p>}
          {skillList.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {skillList.map((skill, idx) => (
                <span key={idx} className="badge badge-primary badge-outline text-xs">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {isFront && (
            <div className="flex justify-center gap-6 mt-auto pt-3">
              <button
                onClick={() => triggerExit(-1)}
                className="btn btn-circle btn-outline btn-error"
                aria-label="Ignore"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <button
                onClick={() => triggerExit(1)}
                className="btn btn-circle btn-primary shadow-lg shadow-primary/30 transition-all duration-200 ease-out hover:scale-125 hover:-rotate-6 active:scale-95"
                aria-label="Interested"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21s-6.716-4.35-9.428-7.062C.657 12.023.657 8.977 2.572 7.062a5 5 0 017.071 0L12 9.42l2.357-2.358a5 5 0 017.071 0c1.915 1.915 1.915 4.961 0 6.876C18.716 16.65 12 21 12 21z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;