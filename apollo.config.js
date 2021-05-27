module.exports = {
  client: {
    excludes: ['**/*.test.*'],
    includes: ['./src/**/*'],
    service: {
      localSchemaFile: 'graphql-schema.json',
    },
  },
}
