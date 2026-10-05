/*
  ==================================================
  CALOVISION - REUSABLE MOTION ANIMATIONS
  ==================================================

  These variants are shared between different
  sections of the website.

  Tailwind:
  -> controls styling

  Motion:
  -> controls movement and animation
*/


/*
  Fade upward
*/
export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 50,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};


/*
  Fade from the left
*/
export const fadeLeft = {
  hidden: {
    opacity: 0,
    x: -60,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};


/*
  Fade from the right
*/
export const fadeRight = {
  hidden: {
    opacity: 0,
    x: 60,
  },

  visible: {
    opacity: 1,
    x: 0,

    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};


/*
  Simple fade
*/
export const fadeIn = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,

    transition: {
      duration: 0.8,
    },
  },
};


/*
  Scale animation
*/
export const scaleIn = {
  hidden: {
    opacity: 0,
    scale: 0.92,
  },

  visible: {
    opacity: 1,
    scale: 1,

    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};


/*
  Stagger container

  Children animate one after another.
*/
export const staggerContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};


/*
  Slower stagger for larger cards.
*/
export const slowStaggerContainer = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};
