module.exports = {
  locales: ['en', 'de'],
  // An array of the locales in your applications
  namespaceSeparator: ':',
  // Namespace separator used in your translation keys
  // If you want to use plain english keys, separators such as `.` and `:` will conflict. You might want to set `keySeparator: false` and `namespaceSeparator: false`. That way, `t('Status: Loading...')` will not think that there are a namespace and three separator dots for instance.
  useKeysAsDefaultValue: true,
  output: 'public/locales/$LOCALE/$NAMESPACE.json',
};
