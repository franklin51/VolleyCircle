import { render } from '@testing-library/react-native';

import App from '../App';

// Skeleton test: proves the toolchain end-to-end — TypeScript, JSX, the React Native
// renderer, and the jest-expo preset all agree. It asserts mounting rather than the
// placeholder copy, so it survives the first real screen replacing App.tsx.
//
// NOTE: on React Native Testing Library v14 + React 19, `render` returns a Promise and
// must be awaited. Forgetting the await yields a confusing "toJSON is not a function",
// because you are destructuring the Promise rather than the render result.
//
// Feature tests follow the repo convention instead:
//   <feature>/<component>.<behavior>.<state>.spec.ts
// e.g. rating/submitRating.blocksNonMutualPlayers.spec.ts
describe('App', () => {
  it('mounts', async () => {
    const { toJSON } = await render(<App />);

    expect(toJSON()).not.toBeNull();
  });
});
