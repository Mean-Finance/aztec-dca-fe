import gql from 'graphql-tag';

const getPairSwaps = gql`
  query getPairSwaps($id: ID) {
    pair(id: $id) {
      id
      createdAtTimestamp
      swaps(orderBy: executedAtTimestamp, orderDirection: desc) {
        id
        executedAtTimestamp
        executedAtBlock
        ratePerUnitBToAWithFee
        ratePerUnitAToBWithFee
        transaction {
          id
          hash
          index
          gasSent
          gasPrice
          from
          timestamp
        }
        pairSwapsIntervals {
          id
          swapInterval {
            interval
            id
            description
          }
          swapPerformed
        }
      }
    }
  }
`;

export default getPairSwaps;