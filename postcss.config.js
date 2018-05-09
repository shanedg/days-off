module.exports = {
  plugins: [
    /**
     * Would be cool to use tailwinds eventually,
     * definitely overkill for this tho.
     * Leaving this here for now.
     */
    // require('tailwindcss')('./tailwind.js'),
    // require('autoprefixer')
    process.env.NODE_ENV == 'production' && require('autoprefixer')
  ]
}
