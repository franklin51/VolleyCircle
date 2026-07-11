# Redux Toolkit Documentation

This documentation is loaded from Context7 and provides key examples and patterns for Redux Toolkit and RTK Query.

## RTK Query Basics

### Creating an API Slice

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),
  endpoints: (build) => ({
    getPosts: build.query<Post[], void>({
      query: () => 'posts',
    }),
    getPost: build.query<Post, string>({
      query: (id) => `posts/${id}`,
    }),
  }),
})

export const { useGetPostsQuery, useGetPostQuery } = api
```

### Using RTK Query Hooks

```tsx
import { useGetPostsQuery } from './api'

function App() {
  const { data = [], isLoading, isFetching, isError } = useGetPostsQuery()

  if (isError) return <div>An error has occurred!</div>

  if (isLoading) return <Skeleton />

  return (
    <div className={isFetching ? 'posts--disabled' : ''}>
      {data.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          name={post.name}
          disabled={isFetching}
        />
      ))}
    </div>
  )
}
```

### Handling Current Data

```tsx
import { useGetPostsByUserQuery } from './api'

function PostsList({ userName }: { userName: string }) {
  const { currentData, isFetching, isError } = useGetPostsByUserQuery(userName)

  if (isError) return <div>An error has occurred!</div>

  if (isFetching && !currentData) return <Skeleton />

  return (
    <div className={isFetching ? 'posts--disabled' : ''}>
      {currentData
        ? currentData.map((post) => (
            <Post
              key={post.id}
              id={post.id}
              name={post.name}
              disabled={isFetching}
            />
          ))
        : 'No data available'}
    </div>
  )
}
```

## Store Configuration

### Adding API to Store

```typescript
import { configureStore } from '@reduxjs/toolkit'
import { api } from './services/api'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (gDM) => gDM().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
```

## Advanced Patterns

### Custom Base Query with Dynamic URLs

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: 'www.my-cool-site.com/',
})

const dynamicBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const projectId = selectProjectId(api.getState() as RootState)
  
  if (!projectId) {
    return {
      error: {
        status: 400,
        statusText: 'Bad Request',
        data: 'No project ID received',
      },
    }
  }

  const urlEnd = typeof args === 'string' ? args : args.url
  const adjustedUrl = `project/${projectId}/${urlEnd}`
  const adjustedArgs =
    typeof args === 'string' ? adjustedUrl : { ...args, url: adjustedUrl }
  
  return rawBaseQuery(adjustedArgs, api, extraOptions)
}

export const api = createApi({
  baseQuery: dynamicBaseQuery,
  endpoints: (build) => ({
    getPosts: build.query<Post[], void>({
      query: () => 'posts',
    }),
  }),
})
```

### Infinite Queries

```typescript
type Pokemon = {
  id: string
  name: string
}

const pokemonApi = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://example.com/pokemon' }),
  endpoints: (build) => ({
    getPokemon: build.infiniteQuery<Pokemon[], string, number>({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
          lastPageParam + 1,
      },
      query({ queryArg, pageParam }) {
        return `/type/${queryArg}?page=${pageParam}`
      },
    }),
  }),
})

function PokemonList({ pokemonType }: { pokemonType: string }) {
  const { data, isFetching, fetchNextPage, refetch } =
    pokemonApi.useGetPokemonInfiniteQuery(pokemonType)

  const handleNextPage = async () => {
    await fetchNextPage()
  }

  const allResults = data?.pages.flat() ?? []

  return (
    <div>
      <div>Type: {pokemonType}</div>
      <div>
        {allResults.map((pokemon, i) => (
          <div key={i}>{pokemon.name}</div>
        ))}
      </div>
      <button onClick={() => handleNextPage()}>Fetch More</button>
      <button onClick={() => refetch()}>Refetch</button>
    </div>
  )
}
```

### Error Handling

```tsx
import { usePostsQuery } from './services/api'

function PostDetail() {
  const { data, error, isLoading } = usePostsQuery()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    if ('status' in error) {
      // you can access all properties of `FetchBaseQueryError` here
      const errMsg = 'error' in error ? error.error : JSON.stringify(error.data)

      return (
        <div>
          <div>An error has occurred:</div>
          <div>{errMsg}</div>
        </div>
      )
    }
    // you can access all properties of `SerializedError` here
    return <div>{error.message}</div>
  }

  if (data) {
    return (
      <div>
        {data.map((post) => (
          <div key={post.id}>Name: {post.name}</div>
        ))}
      </div>
    )
  }

  return null
}
```

### selectFromResult for Performance

```tsx
function PostsList() {
  const { data: posts } = api.useGetPostsQuery()

  return (
    <ul>
      {posts?.data?.map((post) => <PostById key={post.id} id={post.id} />)}
    </ul>
  )
}

function PostById({ id }: { id: number }) {
  // Will select the post with the given id, and will only rerender if the given post's data changes
  const { post } = api.useGetPostsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      post: data?.find((post) => post.id === id),
    }),
  })

  return <li>{post?.name}</li>
}
```

### Using with Stable References

```tsx
// An array declared here will maintain a stable reference
const emptyArray: Post[] = []

function PostsList() {
  const { posts } = api.useGetPostsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      posts: data ?? emptyArray,
    }),
  })

  return (
    <ul>
      {posts.map((post) => (
        <PostById key={post.id} id={post.id} />
      ))}
    </ul>
  )
}
```

### Manual Data Fetching (Alternative Pattern)

```javascript
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  status: 'uninitialized',
  todos: [],
  error: null,
}

const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const res = await axios.get('/todos')
  return res.data
})

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.todos = action.payload
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed'
        state.todos = []
        state.error = action.error
      })
  },
})

export default todosSlice.reducer
```

### Usage Without React Hooks

```typescript
// Accessing cached data and status
const result = api.endpoints.getPosts.select()(state)
const { data, isSuccess, isError, error } = result

// Creating memoized selectors
const createGetPostSelector = createSelector(
  (id: string) => id,
  (id) => api.endpoints.getPost.select(id),
)

const selectGetPostError = createSelector(
  (state: RootState) => state,
  (state: RootState, id: string) => createGetPostSelector(id),
  (state, selectGetPost) => selectGetPost(state).error,
)
```

### onQueryStarted Lifecycle

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query'
import { messageCreated } from './notificationsSlice'

const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (build) => ({
    getPost: build.query<Post, number>({
      query: (id) => `post/${id}`,
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // `onStart` side-effect
        dispatch(messageCreated('Fetching post...'))
        try {
          const { data } = await queryFulfilled
          // `onSuccess` side-effect
          dispatch(messageCreated('Post received!'))
        } catch (err) {
          // `onError` side-effect
          dispatch(messageCreated('Error fetching post!'))
        }
      },
    }),
  }),
})
```

## Key Patterns

- Use RTK Query for data fetching instead of manual `createAsyncThunk`
- Configure the store with API reducer and middleware
- Handle loading, error, and success states in components
- Use `currentData` vs `data` for better UX during refetches
- Implement proper error handling with type guards
- Use `selectFromResult` for performance optimization
- Consider infinite queries for pagination
- Use stable references to prevent unnecessary re-renders
- Leverage lifecycle hooks like `onQueryStarted` for side effects