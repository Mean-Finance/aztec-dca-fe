import gql from 'graphql-tag';

const getPool = gql`
  query getAvailablePairs($first: Int, $skip: Int) {
    pairs(first: $first, skip: $skip) {
      id
      token0 {
        id
      }
      token1 {
        id
      }
    }
  }
`;

export default getPool;
