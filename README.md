# Turso Platform API SDK

This SDK provides a convenient way to access the Turso Platform API from your application. Manage organizations, databases, replicas and so on without having to deal with the low-level HTTP requests.

## Installation

```bash
$ bun install turso-platform
```

## Usage

```typescript
import { TursoPlatformClient } from 'turso-platform';

const turso = new TursoPlatformClient({
  baseUrl: process.env.TURSO_API_BASE_URL,
  token: process.env.TURSO_API_TOKEN,
});

const organizationName = 'my-org';
const databaseName = 'tasks';
const groupName = 'default';

const { group } = await turso.groups.get(organizationName, groupName);

if (!group.locations.includes('bog')) {
  // lets add another replica for the group
  await turso.groups.addLocation(organizationName, groupName, 'bog');
}

// create a new database
await turso.databases.create(organizationName, {
  name: databaseName,
  group: groupName,
});
```

## Full Examples

You can find full examples in the [examples](./examples) directory. They are full interactive experiences that you can run and see how the SDK works.
