module.exports = api => {
  let isDev = api.env('development')
  api.cache.invalidate(() => isDev)

  return {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react'
    ],
    plugins: [
      ...(
        isDev
          ? [
              'react-refresh/babel'
            ]
          : []
      )
    ]
  }
}
