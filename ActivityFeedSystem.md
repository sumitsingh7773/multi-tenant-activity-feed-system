# Multi-Tenant Activity Feed System – Assignment

---

## Part 1 – Backend Summary
- **POST /activities**: Creates a new activity with tenant isolation.  
- **GET /activities?cursor=&limit=20**: Cursor-based pagination, sorted by `createdAt`.  
- **Tenant Isolation**: Each tenant only sees their own activities.  
- **Indexing**: Compound index on `(tenantId + createdAt)` for fast queries.  
- **Cursor Pagination**: Avoids `skip()`, works efficiently with large datasets.  
- **Projection**: Only return required fields (`actorName`, `type`, `createdAt`) to reduce payload.

---

## Part 2 – Frontend Summary
- **ActivityFeed component** built using React hooks (`useState`, `useEffect`, `useCallback`).  
- Features:
  - Infinite scroll with IntersectionObserver.
  - Loading and empty states.
  - Optimistic UI updates when adding a new activity via “Add Test Activity” button.
  - Unique keys for each item to prevent React warnings/errors.
- **Rollback logic**: If `createActivityAPI` fails, the temporary activity is removed from the UI.

---

## Part 3 – React Hook Bug
- **Bug**:
```javascript
useEffect(() => {
  fetchActivities().then(setActivities);
}, [activities]);


## Part 4 – System Design & Scaling (50M Activities per Tenant)

### 1. Indexing
- Use a **compound index** on `(tenantId + createdAt)` to efficiently query each tenant’s activities in descending order of creation time.
- Optional **secondary indexes** can be added for filters, e.g., `actorId` or `type`.

### 2. Sharding
- **Shard by `tenantId`** to distribute tenants across multiple database nodes.
- High-activity (“hot”) tenants can get **dedicated shards** to prevent impacting other tenants.
- Ensures write and read scalability as the system grows to millions of activities.

### 3. Hot Tenant Isolation
- Detect tenants generating high traffic and **isolate them** on separate shards or replica sets.
- Optionally use **caching layers** (Redis, in-memory) for frequently accessed data.

### 4. Data Retention
- Archive older activities to cheaper storage (S3, Glacier, or MongoDB archive cluster).
- Use **TTL indexes** or scheduled batch jobs to automatically delete or move outdated records.

### 5. Real-Time Delivery
- **WebSockets**: Bi-directional, low-latency updates for live feeds.
- **SSE (Server-Sent Events)**: Simpler one-way updates if only server → client streaming is needed.

### 6. Monitoring & Metrics
- Track **query latency**, **shard sizes**, **active connections**, and **hot tenants**.
- Dynamically scale resources when a tenant exceeds thresholds.

