module.exports = {
  purge: {
    enabled: !process.env.ROLLUP_WATCH,
    mode: "all",
    content: ["./**/**/*.html", "./**/**/*.svelte"],

    options: {
      whitelistPatterns: [/svelte-/],
      defaultExtractor: (content) =>
        [...content.matchAll(/(?:class:)*([\w\d-/:%.]+)/gm)].map(
          ([_match, group, ..._rest]) => group
        ),
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        logo: ["Pacifico", "cursive"],
      },
      boxShadow: {
        mellow: "25px 25px 50px 0px rgba(0, 0, 0, 0.05)",
      },
      maxWidth: {
        "120": "120px",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["active", "focus"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
