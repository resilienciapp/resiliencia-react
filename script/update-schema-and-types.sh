#!/usr/bin/env bash
set -ex

# Downloads the schema in JSON format.
yarn apollo client:download-schema --endpoint=http://localhost:4000/graphql graphql-schema.json

# Generates static types for GraphQL queries.
yarn apollo client:codegen --config=apollo.config.js --no-addTypename --outputFlat=src/gql/types.ts --target=typescript
